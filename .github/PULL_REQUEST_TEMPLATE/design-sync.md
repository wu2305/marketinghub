<!-- Design sync PR. Open with ?template=design-sync.md. Procedure: handover/design-sync/README.md -->

## Design sync: <title>

Designer: <name> · Change note: `handover/design-sync/changes/<yyyy-mm-dd>-<slug>.md`

### What the designer changed
<copy of change note §A>

### Pages and components touched
| page | components / features | stories added · changed · removed |
|---|---|---|

### Design questions answered
<count, and a link to change note §C>

### Open items
- For the designer:
- For the maintainer:

### Gate (phase2-guide §3)
- [ ] bundle provenance clean: no local paths in `docs/cleanup-manifest.json`, `docs/demo/README.md` title = new version (`handover/design-sync/README.md` §5)
- [ ] lint · test · build-storybook
- [ ] build:host + host-check
- [ ] visual-check (full) — output path:
- [ ] visual-check --negative
- [ ] build:lib · font probe
- [ ] Designer visual verdicts recorded (`visual-check --review`)
- [ ] handover/README.md and dispositions.md updated
