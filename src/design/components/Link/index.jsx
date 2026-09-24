import "../../tokens.css";
import "./Link.css";


/**
 * Navigation link. Renders `<a href>`; host decides routing via onNavigate.
 * @param {object} props
 * @param {string} [props.href="#"]
 * @param {React.ReactNode} props.children
 * @param {(target: { href: string, label: string }) => void} [props.onNavigate]
 */
export function Link({ href = "#", children, onNavigate }) {
  return (
    <a
      className="mh-link"
      href={href}
      onClick={(event) => onNavigate?.({ href, label: event.currentTarget.textContent.trim() })}
    >
      {children}
    </a>
  );
}
