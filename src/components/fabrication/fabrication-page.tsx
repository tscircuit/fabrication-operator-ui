import { ArrowLeft, Check, Circle, Clock3 } from "lucide-react"
import { useState } from "react"
import { fabricationStages } from "../../data/fabrication-stages"
import type { FabricationStageId, Job } from "../../types/fabrication"
import { JobPreviewSvg } from "../dashboard/job-preview-svg"
import { Button } from "../ui/button"
import { StatusBadge } from "../ui/status-badge"

interface FabricationPageProps {
  job: Job
  onBackToDashboard: () => void
}

export function FabricationPage({
  job,
  onBackToDashboard,
}: FabricationPageProps) {
  const [activeStageId, setActiveStageId] = useState<FabricationStageId>(
    job.currentStage,
  )
  const activeStage =
    fabricationStages.find((stage) => stage.id === activeStageId) ??
    fabricationStages[0]
  const currentStageIndex = fabricationStages.findIndex(
    (stage) => stage.id === job.currentStage,
  )
  const activeStageIndex = fabricationStages.findIndex(
    (stage) => stage.id === activeStage.id,
  )

  return (
    <div className="app-shell fabrication-shell">
      <header className="fabrication-header">
        <Button
          className="back-button"
          variant="soft"
          onClick={onBackToDashboard}
        >
          <ArrowLeft size={16} />
          Dashboard
        </Button>

        <div className="fabrication-title">
          <span>Fabrication Stages</span>
          <strong>{job.name}</strong>
          <small>{job.file}</small>
        </div>

        <StatusBadge status={job.status} />
      </header>

      <main className="fabrication-layout">
        <aside className="stage-rail" aria-label="Fabrication stages">
          <div className="stage-rail-header">
            <span>Workflow</span>
            <strong>
              {Math.min(currentStageIndex + 1, fabricationStages.length)} of{" "}
              {fabricationStages.length}
            </strong>
          </div>

          <div className="stage-list">
            {fabricationStages.map((stage, index) => {
              const isCurrent = stage.id === job.currentStage
              const isActive = stage.id === activeStage.id
              const isComplete = index < currentStageIndex
              const isPending = index > currentStageIndex
              const Icon = isComplete ? Check : isCurrent ? Clock3 : Circle

              return (
                <button
                  className={[
                    "stage-item",
                    isActive ? "active" : "",
                    isComplete ? "complete" : "",
                    isPending ? "pending" : "",
                  ]
                    .filter(Boolean)
                    .join(" ")}
                  key={stage.id}
                  type="button"
                  onClick={() => setActiveStageId(stage.id)}
                >
                  <span className="stage-icon">
                    <Icon size={14} />
                  </span>
                  <span>
                    <strong>{stage.label}</strong>
                    <small>{stage.description}</small>
                  </span>
                </button>
              )
            })}
          </div>
        </aside>

        <section className="stage-workspace">
          <div className="stage-panel">
            <div className="stage-panel-kicker">
              Stage {activeStageIndex + 1}
            </div>
            <h1>{activeStage.label}</h1>
            <p>{activeStage.detail}</p>

            <div className="stage-facts">
              <span>
                <small>Output</small>
                <strong>{activeStage.output}</strong>
              </span>
              <span>
                <small>Estimate</small>
                <strong>{activeStage.duration}</strong>
              </span>
              <span>
                <small>Board</small>
                <strong>{job.board}</strong>
              </span>
            </div>
          </div>

          <div className="fabrication-circuit-card">
            <div className="section-header">
              <div>
                <h2>Circuit Preview</h2>
                <p>PCB SVG generated from Circuit JSON</p>
              </div>
              <span className="layer-pill">{job.layers}</span>
            </div>
            <div className="fabrication-circuit-preview">
              <JobPreviewSvg job={job} />
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}
