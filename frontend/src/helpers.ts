import type { TagNode } from "./types";

export function updateNode(
  node: TagNode,
  path: number[],
  updater: (n: TagNode) => TagNode
): TagNode {
  if (path.length === 0) return updater(node);

  const [head, ...rest] = path;
  const newChildren = (node.children ?? []).map((child, i) =>
    i === head ? updateNode(child, rest, updater) : child
  );
  return { ...node, children: newChildren };
}

export function addChild(tree: TagNode, path: number[]): TagNode {
  return updateNode(tree, path, (node) => {
    const newChild: TagNode = { name: "New Child", data: "" };
    if (node.children) {
      return { ...node, children: [...node.children, newChild] };
    }
    return { name: node.name, children: [newChild] };
  });
}

export function updateData(tree: TagNode, path: number[], value: string): TagNode {
  return updateNode(tree, path, (node) => ({ ...node, data: value }));
}

export function renameName(tree: TagNode, path: number[], value: string): TagNode {
  return updateNode(tree, path, (node) => ({ ...node, name: value }));
}

export function sanitizeTree(node: TagNode): TagNode {
  if (node.children) {
    return { 
      name: node.name, 
      children: node.children.map(sanitizeTree) 
    };
  }
  return { 
    name: node.name, 
    data: node.data ?? "" 
  };
}
