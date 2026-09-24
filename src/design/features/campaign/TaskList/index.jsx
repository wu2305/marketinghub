import "../../../tokens.css";
import { StatusBadge } from "../../../components/StatusBadge/index.jsx";
import "./TaskList.css";


/**
 * Task queue rows with an outline StatusBadge.
 * @param {object} props
 * @param {Array<{ title: string, detail?: string, status: string }>} [props.items=[]]
 */
export function TaskList({ items = [] }) {
  return (
    <div>
      {items.map((item) => (
        <article className="mh-task" key={item.title}>
          <StatusBadge status={item.status} outline>
            {item.status}
          </StatusBadge>
          <div>
            <strong>{item.title}</strong>
            <p>{item.detail}</p>
          </div>
        </article>
      ))}
    </div>
  );
}
