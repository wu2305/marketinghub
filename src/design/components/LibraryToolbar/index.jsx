import "../../tokens.css";
import { Button } from "../Button/index.jsx";
import { CheckboxFilter } from "../CheckboxFilter/index.jsx";
import { SearchField } from "../SearchField/index.jsx";
import { Tabs } from "../Tabs/index.jsx";
import "./LibraryToolbar.css";

/** @type {readonly ["multi", "single"]} */
export const libraryFacetKinds = ["multi", "single"];

/**
 * Find controls of a governed library (patterns/library.md §2, B1–B4): search,
 * facets, the always-visible result count, the optional create action and
 * optional tabs. Every control reports through one `onChange`.
 * @param {object} props
 * @param {{ label: string, placeholder?: string, value?: string }} props.search
 * @param {React.Ref<HTMLInputElement>} [props.searchRef] forwarded to the search input (keyboard shortcuts)
 * @param {Array<{ id: string, label: string, kind?: "multi"|"single", options: Array<{ id: string, label: string }>, selected?: string[]|string, allLabel?: string, selectedLabel?: string }>} [props.facets=[]]
 * @param {string} props.count result count text, e.g. "Showing 8 of 24 terms"
 * @param {{ label: string, href?: string }} [props.create] creation that navigates has an `href` and renders as a link; without one it is an in-page action (a button)
 * @param {{ label: string, value: string, items: Array<{ id: string, label: string }> }} [props.tabs]
 * @param {(event: { field: string, value: string, checked?: boolean }) => void} [props.onChange] `field` is "search", "tab" or a facet id; multi facets add `checked`
 * @param {(event: { href?: string }) => void} [props.onCreate]
 */
export function LibraryToolbar({ search, searchRef, facets = [], count, create, tabs, onChange, onCreate }) {
  return (
    <div className="mh-library-toolbar">
      {tabs ? (
        <Tabs label={tabs.label} items={tabs.items} value={tabs.value} onChange={({ id }) => onChange?.({ field: "tab", value: id })} />
      ) : null}
      <div className="mh-library-toolbar__row">
        <div className="mh-library-toolbar__search">
          <SearchField
            label={search.label}
            placeholder={search.placeholder ?? search.label}
            value={search.value ?? ""}
            variant="plain"
            inputRef={searchRef}
            onChange={({ value }) => onChange?.({ field: "search", value })}
          />
        </div>
        {facets.map((facet) =>
          facet.kind === "single" ? (
            <div key={facet.id} className="mh-library-toolbar__facet">
              <CheckboxFilter
                single
                label={facet.label}
                allLabel={facet.allLabel ?? "All"}
                selectedLabel="{labels}"
                selected={[facet.selected ?? ""]}
                options={[{ id: "", label: facet.allLabel ?? "All" }, ...facet.options]}
                onToggle={({ id }) => onChange?.({ field: facet.id, value: id })}
              />
            </div>
          ) : (
            <div key={facet.id} className="mh-library-toolbar__facet">
              <CheckboxFilter
                label={facet.label}
                allLabel={facet.allLabel}
                selectedLabel={facet.selectedLabel}
                options={facet.options}
                selected={facet.selected ?? []}
                onToggle={({ id, checked }) => onChange?.({ field: facet.id, value: id, checked })}
              />
            </div>
          ),
        )}
        {create ? (
          <span className="mh-library-toolbar__create">
            <Button variant="gold" icon="plus" href={create.href} onClick={() => onCreate?.({ href: create.href })}>{create.label}</Button>
          </span>
        ) : null}
      </div>
      <p className="mh-library-toolbar__count" aria-live="polite">{count}</p>
    </div>
  );
}
