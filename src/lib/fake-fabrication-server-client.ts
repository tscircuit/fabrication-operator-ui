import type { FabricationStageId } from "../types/fabrication"

type QueryValue = boolean | number | string
type QueryParams = Record<string, QueryValue | QueryValue[] | null | undefined>

export type ApiJson =
  | null
  | boolean
  | number
  | string
  | ApiJson[]
  | { [key: string]: ApiJson | undefined }

export interface HealthResponse {
  ok?: boolean
  status?: string
  [key: string]: ApiJson | undefined
}

export interface FakeFabricationJob {
  fabrication_job_id?: string
  job_id?: string
  id?: string
  current_stage?: FabricationStageId | string
  status?: string
  name?: string
  file?: string
  [key: string]: ApiJson | undefined
}

export interface CreateFabricationJobInput {
  name?: string
  file?: string
  circuit_json?: ApiJson
  [key: string]: ApiJson | undefined
}

export interface FabricationJobLookup {
  fabrication_job_id?: string
  job_id?: string
  id?: string
}

interface ApiRequestInit extends Omit<RequestInit, "body"> {
  body?: unknown
  query?: QueryParams
}

interface ApiClientOptions {
  baseUrl?: string
  fetch?: typeof fetch
  headers?: HeadersInit
}

const DEFAULT_BASE_URL =
  import.meta.env.VITE_FAKE_FABRICATION_SERVER_URL ?? "http://localhost:3000"

function normalizeBaseUrl(baseUrl: string) {
  return baseUrl.replace(/\/+$/, "")
}

function normalizePath(path: string) {
  return path.replace(/^\/+/, "")
}

function getUrl(baseUrl: string, path: string) {
  const normalizedBaseUrl = normalizeBaseUrl(baseUrl)
  const urlPath = `${normalizedBaseUrl}/${normalizePath(path)}`
  const fallbackOrigin =
    typeof window === "undefined" ? "http://localhost" : window.location.origin

  return new URL(urlPath, fallbackOrigin)
}

function appendQueryParams(url: URL, query?: QueryParams) {
  if (!query) {
    return
  }

  for (const [key, value] of Object.entries(query)) {
    if (value == null) {
      continue
    }

    const values = Array.isArray(value) ? value : [value]
    for (const item of values) {
      url.searchParams.append(key, String(item))
    }
  }
}

function isFormBody(body: unknown): body is BodyInit {
  return (
    typeof body === "string" ||
    body instanceof Blob ||
    body instanceof FormData ||
    body instanceof URLSearchParams
  )
}

function getLookupQuery(lookup: FabricationJobLookup): QueryParams {
  const fabricationJobId =
    lookup.fabrication_job_id ?? lookup.job_id ?? lookup.id

  return fabricationJobId ? { fabrication_job_id: fabricationJobId } : {}
}

export class FakeFabricationServerApiError extends Error {
  readonly body: unknown
  readonly status: number
  readonly statusText: string

  constructor(response: Response, body: unknown) {
    super(
      `Fake fabrication server request failed: ${response.status} ${response.statusText}`,
    )
    this.name = "FakeFabricationServerApiError"
    this.body = body
    this.status = response.status
    this.statusText = response.statusText
  }
}

export class FakeFabricationServerClient {
  private readonly baseUrl: string
  private readonly fetchImpl: typeof fetch
  private readonly headers: HeadersInit

  constructor(options: ApiClientOptions = {}) {
    this.baseUrl = normalizeBaseUrl(options.baseUrl ?? DEFAULT_BASE_URL)
    this.fetchImpl = options.fetch ?? fetch
    this.headers = options.headers ?? {}
  }

  async request<TResponse = ApiJson>(
    path: string,
    init: ApiRequestInit = {},
  ): Promise<TResponse> {
    const { body, headers, query, ...requestInit } = init
    const url = getUrl(this.baseUrl, path)
    const requestHeaders = new Headers(this.headers)

    appendQueryParams(url, query)

    if (headers) {
      new Headers(headers).forEach((value, key) =>
        requestHeaders.set(key, value),
      )
    }

    let requestBody: BodyInit | undefined
    if (body != null) {
      if (isFormBody(body)) {
        requestBody = body
      } else {
        requestHeaders.set("Content-Type", "application/json")
        requestBody = JSON.stringify(body)
      }
    }

    const response = await this.fetchImpl(url, {
      ...requestInit,
      body: requestBody,
      headers: requestHeaders,
    })
    const responseBody = await this.parseResponseBody(response)

    if (!response.ok) {
      throw new FakeFabricationServerApiError(response, responseBody)
    }

    return responseBody as TResponse
  }

  health() {
    return this.request<HealthResponse>("health")
  }

  createFabricationJob(input: CreateFabricationJobInput) {
    return this.request<FakeFabricationJob>("fabrication_jobs/create", {
      body: input,
      method: "POST",
    })
  }

  getFabricationJob(lookup: FabricationJobLookup) {
    return this.request<FakeFabricationJob>("fabrication_jobs/get", {
      query: getLookupQuery(lookup),
    })
  }

  listFabricationJobs() {
    return this.request<FakeFabricationJob[]>("fabrication_jobs/list")
  }

  moveFabricationJobToNextStage(lookup: FabricationJobLookup) {
    return this.request<FakeFabricationJob>("fabrication_jobs/next_stage", {
      body: getLookupQuery(lookup),
      method: "POST",
    })
  }

  carrier<TResponse = ApiJson>(path: string, init?: ApiRequestInit) {
    return this.request<TResponse>(`carrier/${normalizePath(path)}`, init)
  }

  laser<TResponse = ApiJson>(path: string, init?: ApiRequestInit) {
    return this.request<TResponse>(`laser/${normalizePath(path)}`, init)
  }

  laserBurnRuns<TResponse = ApiJson>(path: string, init?: ApiRequestInit) {
    return this.request<TResponse>(
      `laser_burn_runs/${normalizePath(path)}`,
      init,
    )
  }

  private async parseResponseBody(response: Response) {
    if (response.status === 204) {
      return null
    }

    const text = await response.text()
    if (!text) {
      return null
    }

    const contentType = response.headers.get("Content-Type") ?? ""
    if (!contentType.includes("application/json")) {
      return text
    }

    return JSON.parse(text) as unknown
  }
}

export const fakeFabricationServerClient = new FakeFabricationServerClient()
