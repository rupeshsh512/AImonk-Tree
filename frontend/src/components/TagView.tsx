import React, { useState, useEffect } from "react";
import type { TagNode } from "../types";

interface Props {
  node: TagNode;
  path: number[];
  onUpdate: (path: number[], updater: (n: TagNode) => TagNode) => void;
}

export default function TagView({ node, path, onUpdate }: Props) {
  const [collapsed, setCollapsed] = useState(false);
  const [editingName, setEditingName] = useState(false);
  const [nameInput, setNameInput] = useState(node.name);

  useEffect(() => {
    if (!editingName) setNameInput(node.name);
  }, [node.name, editingName]);

  const handleAddChild = () => {
    onUpdate(path, (n) => {
      const newChild: TagNode = { name: "New Tag", data: "" };
      if (n.children) {
        return { ...n, children: [...n.children, newChild] };
      }
      return { name: n.name, children: [newChild] };
    });
  };

  const handleDataChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onUpdate(path, (n) => ({ ...n, data: e.target.value }));
  };

  const handleNameCommit = () => {
    setEditingName(false);
    if (nameInput.trim()) {
      onUpdate(path, (n) => ({ ...n, name: nameInput }));
    } else {
      setNameInput(node.name);
    }
  };

  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden my-1">
      <div className={`flex items-center gap-3 px-4 py-2.5 transition-colors ${collapsed ? 'bg-gray-50/50' : 'bg-white'}`}>
        <button
          onClick={() => setCollapsed(!collapsed)}
          className={`w-6 h-6 flex items-center justify-center rounded-lg hover:bg-gray-100 transition-all text-gray-400 hover:text-indigo-600 ${!collapsed ? 'rotate-90' : ''}`}
        >
          <svg className="w-3 h-3 fill-current" viewBox="0 0 20 20"><path d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"/></svg>
        </button>

        <div className="flex-1 min-w-0">
          {editingName ? (
            <input
              autoFocus
              className="w-full text-sm font-bold text-gray-800 bg-indigo-50 border-none rounded px-2 py-0.5 focus:ring-1 focus:ring-indigo-400 outline-none"
              value={nameInput}
              onChange={(e) => setNameInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleNameCommit()}
              onBlur={handleNameCommit}
            />
          ) : (
            <span
              className="text-sm font-bold text-gray-700 cursor-pointer hover:text-indigo-600 transition-colors truncate block"
              onClick={() => setEditingName(true)}
            >
              {node.name}
            </span>
          )}
        </div>

        <button
          onClick={handleAddChild}
          className="text-[10px] font-bold uppercase tracking-wider text-indigo-600 bg-indigo-50 hover:bg-indigo-100 px-3 py-1.5 rounded-lg transition-all"
        >
          Add
        </button>
      </div>

      {!collapsed && (
        <div className="px-4 pb-4 pt-1">
          {node.children ? (
            <div className="pl-4 border-l border-indigo-100 space-y-1">
              {node.children.map((child, i) => (
                <TagView
                  key={i}
                  node={child}
                  path={[...path, i]}
                  onUpdate={onUpdate}
                />
              ))}
            </div>
          ) : (
            <input
              className="w-full bg-gray-50 border-none rounded-lg px-4 py-2.5 text-sm text-gray-600 focus:ring-1 focus:ring-indigo-200 transition-all placeholder:text-gray-300"
              value={node.data ?? ""}
              onChange={handleDataChange}
              placeholder="Tag data..."
            />
          )}
        </div>
      )}
    </div>
  );
}
