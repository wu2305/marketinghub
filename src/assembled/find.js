export function findComponent(node, name, found = []) {
  if (!node) return found;
  if (Array.isArray(node)) {
    node.forEach((item) => findComponent(item, name, found));
    return found;
  }
  if (node.kind === "comp") {
    if (node.name === name) found.push(node.props);
    Object.values(node.props || {}).forEach((value) => {
      if (Array.isArray(value) || value?.kind) findComponent(value, name, found);
    });
    return found;
  }
  if (node.kind === "el" && node.children) node.children.forEach((child) => findComponent(child, name, found));
  return found;
}
