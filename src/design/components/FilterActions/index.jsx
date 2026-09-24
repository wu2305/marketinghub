import { Button } from "../../components/Button/index.jsx";


/**
 * Filter / Reset button pair for filter toolbars.
 * @param {object} props
 * @param {() => void} [props.onSubmit]
 * @param {() => void} [props.onReset]
 * @param {string} [props.submitLabel="Filter"]
 * @param {string} [props.resetLabel="Reset"]
 */
export function FilterActions({ onSubmit, onReset, submitLabel = "Filter", resetLabel = "Reset" }) {
  return (
    <>
      <Button variant="primary" size="sm" type="submit" onClick={onSubmit}>
        {submitLabel}
      </Button>
      <Button variant="secondary" size="sm" onClick={onReset}>
        {resetLabel}
      </Button>
    </>
  );
}
