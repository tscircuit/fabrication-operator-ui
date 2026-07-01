# Fabrication Operator UI

React/Vite operator workspace for creating PCB fabrication jobs, generating
LightBurn files from Circuit JSON, and stepping jobs through the fabrication
server workflow.

## What It Does

- Lists fabrication jobs from `fabrication_jobs/list`.
- Creates jobs from bundled sample boards or an opened Circuit JSON file.
- Generates the required split `lbrn_files` payload with
  `circuit-json-to-lbrn` and `lbrnts`.
- Opens each job card into a dedicated `#/jobs/:jobId` stages page.
- Shows `fabrication_jobs/get` details, current stage, stage list, carrier
  state, laser state, and saved alignment origins.
- Sends stage, carrier, laser origin/burn, and burn-history API requests.

## Local Setup

```bash
bun install
bun run dev
```

The app expects the fabrication server at `http://localhost:3000` by default.
Override it with:

```bash
VITE_FAKE_FABRICATION_SERVER_URL=http://localhost:3000 bun run dev
```

## Scripts

```bash
bun run dev        # Vite app
bun run build      # TypeScript build plus Vite production bundle
bun run typecheck  # TypeScript only
bun run lint       # Biome lint
bun run cosmos     # React Cosmos fixtures
```

## Operator Workflow

1. Open the dashboard.
2. Create a job from the sample dropdown or click `Open JSON` and choose a
   Circuit JSON file.
3. The app generates split LBRN files and posts them to
   `fabrication_jobs/create`.
4. Click a job card to open `#/jobs/:jobId`.
5. Use the stages page to inspect `fabrication_jobs/get`, complete the current
   stage with `fabrication_jobs/next_stage`, run carrier commands, set laser
   origin, start burn stages, and inspect burn history.

## API Surface

The UI currently uses these server endpoints:

- `health`
- `fabrication_jobs/create`
- `fabrication_jobs/list`
- `fabrication_jobs/get`
- `fabrication_jobs/next_stage`
- `carrier/clamp_pcb`
- `carrier/release_pcb`
- `carrier/move`
- `carrier/rotate`
- `carrier/rotate_to`
- `laser/set_origin`
- `laser/burn`
- `laser_burn_runs/list`
- `laser_burn_runs/get`

## LBRN File Keys

Created jobs send the current required `lbrn_files` keys:

- `top_alignment`
- `bottom_alignment`
- `top_deoxidation`
- `top_copper_fill`
- `bottom_deoxidation`
- `bottom_copper_fill`

Burn controls are enabled only for these burn stages:

- `TOP_DEOXIDATION`
- `TOP_COPPER_FILL`
- `BOTTOM_DEOXIDATION`
- `BOTTOM_COPPER_FILL`

## Cosmos Workflow Fixtures

Run:

```bash
bun run cosmos
```

Useful pages:

- `dashboard / Job Intake Dashboard` shows the dashboard-only intake and job
  card view.
- `dashboard / Fabrication Job Stages` shows the server-backed job stages page
  in an active burn-stage state.
- `dashboard / Completed Job Stages` shows the same page after completion.
- `fabrication-page` keeps the older standalone fabrication-stage view for
  comparison.

The dashboard Cosmos forks use static sample state, so they can render without
the fake fabrication server running.
