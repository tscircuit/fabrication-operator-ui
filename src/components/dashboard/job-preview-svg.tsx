export function JobPreviewSvg() {
  return (
    <svg aria-hidden="true" className="job-preview-svg" viewBox="0 0 120 72">
      <rect
        className="preview-board"
        height="46"
        rx="4"
        width="88"
        x="16"
        y="13"
      />
      <path className="preview-trace" d="M30 28 H46 V42 H64 V23 H84" />
      <path className="preview-trace" d="M30 47 H52 V36 H72 V47 H94" />
      <path className="preview-trace thin" d="M44 22 V34 H58 V51" />
      <rect
        className="preview-chip"
        height="16"
        rx="2"
        width="22"
        x="72"
        y="28"
      />
      <circle className="preview-pad" cx="30" cy="28" r="4" />
      <circle className="preview-pad" cx="30" cy="47" r="4" />
      <circle className="preview-pad" cx="52" cy="36" r="4" />
      <circle className="preview-pad" cx="84" cy="23" r="4" />
      <circle className="preview-pad" cx="94" cy="47" r="4" />
      <circle className="preview-via" cx="64" cy="36" r="5" />
      <circle className="preview-via small" cx="72" cy="47" r="4" />
    </svg>
  )
}
