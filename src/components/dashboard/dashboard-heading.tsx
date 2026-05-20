export function DashboardHeading() {
  return (
    <section className="flex items-start justify-between gap-6">
      <div>
        <h1 className="m-0 text-[clamp(34px,5vw,56px)] font-[830] leading-none text-ink max-[620px]:text-4xl">
          Job Dashboard
        </h1>
        <p className="mt-3 max-w-[660px] text-[17px] leading-normal text-[#4d5765] max-[620px]:text-[15px]">
          A simple workspace for importing PCB files, tracking conversion jobs,
          and exporting laser-ready LBRN output.
        </p>
      </div>
    </section>
  )
}
