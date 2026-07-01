import type { CircuitJson } from "circuit-json"
import type { ConvertCircuitJsonToLbrnOptions } from "circuit-json-to-lbrn"
import type { SplitLightBurnProjectFile } from "lbrnts"
import type { ApiJson } from "./fake-fabrication-server-client"

export const burnStageToLbrnFileKey = {
  TOP_DEOXIDATION: "top_deoxidation",
  TOP_COPPER_FILL: "top_copper_fill",
  BOTTOM_DEOXIDATION: "bottom_deoxidation",
  BOTTOM_COPPER_FILL: "bottom_copper_fill",
} as const

type RequiredLbrnFileKey =
  | "bottom_alignment"
  | "bottom_copper_fill"
  | "bottom_deoxidation"
  | "top_alignment"
  | "top_copper_fill"
  | "top_deoxidation"

type LbrnFilePayload = Record<
  RequiredLbrnFileKey,
  {
    content: string
    filename: string
  }
>

const requiredLbrnFileKeys: RequiredLbrnFileKey[] = [
  "top_alignment",
  "bottom_alignment",
  "top_deoxidation",
  "top_copper_fill",
  "bottom_deoxidation",
  "bottom_copper_fill",
]

function assertCircuitJson(value: unknown): CircuitJson {
  if (!Array.isArray(value)) {
    throw new Error("Circuit JSON must be an array before LBRN conversion")
  }

  return value as CircuitJson
}

function getBaseName(fileName: string) {
  return fileName.split(/[\\/]/).pop() ?? fileName
}

function findSplitFile(files: SplitLightBurnProjectFile[], baseName: string) {
  return files.find((file) => getBaseName(file.fileName) === baseName)
}

function mapSplitFile(files: SplitLightBurnProjectFile[], baseName: string) {
  const file = findSplitFile(files, baseName)

  if (!file) {
    return undefined
  }

  return {
    content: file.content,
    filename: file.fileName,
  }
}

export async function createLbrnFilesForFabricationJob(
  circuitJsonValue: unknown,
) {
  const circuitJson = assertCircuitJson(circuitJsonValue)
  const [{ convertCircuitJsonToLbrn }, { splitLightBurnProjectByCutSetting }] =
    await Promise.all([import("circuit-json-to-lbrn"), import("lbrnts")])
  const options = {
    includeHolePunch: true,
    includeCopper: true,
    includeOxidationCleaningLayer: true,
    mirrorBottomLayer: true,
  } satisfies ConvertCircuitJsonToLbrnOptions
  const project = await convertCircuitJsonToLbrn(circuitJson, options)
  const files = splitLightBurnProjectByCutSetting(
    project,
    "fabrication-job.lbrn2",
  )
  const lbrnFiles = {
    top_alignment: mapSplitFile(files, "cut-through-board.lbrn2"),
    bottom_alignment:
      mapSplitFile(files, "reflected-bottom-board-cut.lbrn2") ??
      mapSplitFile(files, "cut-through-board.lbrn2"),
    top_deoxidation: mapSplitFile(files, "top-oxidation-cleaning.lbrn2"),
    top_copper_fill: mapSplitFile(files, "cut-top-copper.lbrn2"),
    bottom_deoxidation: mapSplitFile(files, "bottom-oxidation-cleaning.lbrn2"),
    bottom_copper_fill: mapSplitFile(files, "cut-bottom-copper.lbrn2"),
  }

  const missingKeys = requiredLbrnFileKeys.filter((key) => !lbrnFiles[key])
  if (missingKeys.length > 0) {
    throw new Error(`Missing generated LBRN files: ${missingKeys.join(", ")}`)
  }

  return lbrnFiles as unknown as ApiJson
}
