import { convertCircuitJsonToPcbSvg } from "circuit-to-svg"
import { useEffect, useState } from "react"
import type { Job } from "../../types/fabrication"

interface JobPreviewSvgProps {
  job: Job
}

export function JobPreviewSvg({ job }: JobPreviewSvgProps) {
  const [previewUrl, setPreviewUrl] = useState("")
  const [hasError, setHasError] = useState(false)

  useEffect(() => {
    let active = true
    let url = ""

    async function renderPreview() {
      try {
        setHasError(false)
        const circuitJson = await job.loadCircuitJson()
        const svg = convertCircuitJsonToPcbSvg(circuitJson as never[], {
          height: 360,
          width: 640,
        })

        if (!active) return

        url = URL.createObjectURL(new Blob([svg], { type: "image/svg+xml" }))
        setPreviewUrl(url)
      } catch {
        if (active) setHasError(true)
      }
    }

    setPreviewUrl("")
    renderPreview()

    return () => {
      active = false
      if (url) URL.revokeObjectURL(url)
    }
  }, [job])

  if (hasError) {
    return (
      <span className="text-xs font-bold text-muted">Preview unavailable</span>
    )
  }

  if (!previewUrl) {
    return <span className="text-xs font-bold text-muted">Rendering PCB</span>
  }

  return <img alt={`${job.name} PCB preview`} src={previewUrl} />
}
