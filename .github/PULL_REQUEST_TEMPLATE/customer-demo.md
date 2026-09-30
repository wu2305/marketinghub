<!-- Customer demo PR. Open with ?template=customer-demo.md. Procedure: handover/customer-demos/README.md -->

## Customer demo: <customer / name>

Designer: <name> · Demo folder: `examples/demos/<name>/`

### Story of the demo
<which pages, in what order, what the customer sees>

### Pages
| page | what is customer-specific | checked at 1440 / 390 |
|---|---|---|

### Gaps
<contents of GAPS.md, or "none": things the customer would expect that the components cannot do>

### Open items
- For the designer:
- For the maintainer:

### Gate
- [ ] `npm run lint` · `npm test`
- [ ] `npm run demo build <name>`, opened from disk and clicked through
- [ ] Only files under `examples/demos/<name>/` changed
- [ ] Designer's verdict recorded (pass / fixes asked)
