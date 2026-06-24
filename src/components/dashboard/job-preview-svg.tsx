import { createSvgUrl } from "@tscircuit/create-snippet-url"
import { convertCircuitJsonToTscircuit } from "circuit-json-to-tscircuit"
import { useEffect, useState } from "react"
import type { AnyCircuitElement, CircuitJson } from "circuit-json"
import type { Job } from "../../types/fabrication"

const getComponentName = (jobName: string) => {
  const name = jobName.replace(/[^a-zA-Z0-9_$]/g, "")
  const validIdentifier = /^[a-zA-Z_$]/.test(name) ? name : `Circuit${name}`
  return `${validIdentifier.charAt(0).toUpperCase()}${validIdentifier.slice(1)}`
}

const getBoardSize = (circuitJson: AnyCircuitElement[]) => {
  const board = circuitJson.find((element) => element.type === "pcb_board") as
    | { width?: number; height?: number }
    | undefined

  return {
    width: board?.width ?? 100,
    height: board?.height ?? 100,
  }
}

const get3dPngUrl = (job: Job, circuitJson: AnyCircuitElement[]) => {
  const componentName = getComponentName(job.name)
  const { width, height } = getBoardSize(circuitJson)
  const componentCode = convertCircuitJsonToTscircuit(
    circuitJson as CircuitJson,
    { componentName },
  )
  const tscircuitCode = `${componentCode}

export default () => (
  <board width="${width}mm" height="${height}mm">
    <${componentName} name="${componentName}" />
  </board>
)
`

  return createSvgUrl(tscircuitCode, "3d", {
    format: "png",
    pngWidth: 800,
    pngHeight: 600,
  })
}

interface JobPreviewSvgProps {
  job: Job
}

export function JobPreviewSvg({ job }: JobPreviewSvgProps) {
  const [previewPngUrl, setPreviewPngUrl] = useState("")
  const [hasError, setHasError] = useState(false)

  useEffect(() => {
    let active = true

    async function buildPreviewUrl() {
      try {
        setHasError(false)
        const circuitJson = (await job.loadCircuitJson()) as AnyCircuitElement[]
        const url = get3dPngUrl(job, circuitJson)

        if (active) setPreviewPngUrl(url)
      } catch {
        if (active) setHasError(true)
      }
    }

    setPreviewPngUrl("")
    buildPreviewUrl()

    return () => {
      active = false
    }
  }, [job])

  if (hasError) {
    return (
      <span className="text-xs font-bold text-muted">Preview unavailable</span>
    )
  }

  if (!previewPngUrl) {
    return (
      <span className="text-xs font-bold text-muted">Rendering 3D PCB</span>
    )
  }

  return <img alt={`${job.name} 3D PCB preview`} src={previewPngUrl} />
}
