import "../../../tokens.css";
import { ProjectCard } from "../../../features/cockpit/ProjectCard/index.jsx";
import "./ProjectCatalog.css";

/* Mid-page category heading (h2) — private to the catalog. */
function CategoryHeading({ title, id }) {
  return (
    <header className="mh-category">
      <h2 id={id}>{title}</h2>
    </header>
  );
}

/**
 * Cockpit catalog: category groups of ProjectCard.
 * @param {object} props
 * @param {Array<{ id: string, title: string, projects: Array<object> }>} [props.groups=[]]
 * @param {(target: { title: string, id?: string }) => void} [props.onOpen]
 */
export function ProjectCatalog({ groups = [], onOpen }) {
  return (
    <div className="mh-catalog">
      {groups.map((group) => (
        <section key={group.id} className="mh-catalog__group" aria-labelledby={`mh-category-${group.id}`}>
          <CategoryHeading title={group.title} id={`mh-category-${group.id}`} />
          <div className="mh-project-grid">
            {group.projects.map((project) => (
              <ProjectCard key={project.id} {...project} onOpen={(event) => onOpen?.({ ...event, id: project.id })} />
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
