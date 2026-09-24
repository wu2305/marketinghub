import "../../../tokens.css";
import { WorkspaceCard } from "../../../features/home/WorkspaceCard/index.jsx";
import "./WorkspaceGrid.css";


/**
 * Grid of WorkspaceCard.
 * @param {object} props
 * @param {Array<object>} [props.cards=[]] WorkspaceCard props per card
 * @param {(target: { title: string, href?: string }) => void} [props.onOpen]
 * @param {(target: { id: string, href: string, label: string }) => void} [props.onNavigate]
 */
export function WorkspaceGrid({ cards = [], onOpen, onNavigate }) {
  return (
    <div className="mh-workspace-grid">
      {cards.map((card) => (
        <WorkspaceCard key={card.title} {...card} onOpen={onOpen} onNavigate={onNavigate} />
      ))}
    </div>
  );
}
