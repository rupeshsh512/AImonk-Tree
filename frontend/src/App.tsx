import { useState, useEffect } from "react";
import TagView from "./components/TagView";
import { updateNode, sanitizeTree } from "./helpers";
import { fetchTrees, createTree, updateTree, deleteTree } from "./api";
import type { TagNode, TreeRecord } from "./types";

const DEFAULT_ROOT: TagNode = {
  name: "Root",
  children: [
    { name: "Child 1", data: "Hello" },
    { name: "Child 2", data: "World" },
  ],
};

export default function App() {
  const [savedTrees, setSavedTrees] = useState<TreeRecord[]>([]);
  const [tree, setTree] = useState<TagNode>(DEFAULT_ROOT);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [treeName, setTreeName] = useState("My Tree");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [exportJson, setExportJson] = useState<string | null>(null);
  const [saveMsg, setSaveMsg] = useState<string | null>(null);

  useEffect(() => {
    loadTrees();
  }, []);

  async function loadTrees() {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchTrees();
      setSavedTrees(data);
    } catch {
      setError("Failed to load trees from the server.");
    } finally {
      setLoading(false);
    }
  }

  function handleUpdate(path: number[], updater: (n: TagNode) => TagNode) {
    setTree((prev) => updateNode(prev, path, updater));
  }

  async function handleSave() {
    setLoading(true);
    setError(null);
    setSaveMsg(null);
    try {
      const clean = sanitizeTree(tree);
      let saved: TreeRecord;

      if (editingId !== null) {
        saved = await updateTree(editingId, treeName, clean);
        setSavedTrees((prev) =>
          prev.map((t) => (t.id === editingId ? saved : t))
        );
      } else {
        saved = await createTree(treeName, clean);
        setSavedTrees((prev) => [saved, ...prev]);
        setEditingId(saved.id);
      }

      setSaveMsg("Tree saved ✓");
      setTimeout(() => setSaveMsg(null), 3000);
    } catch {
      setError("Failed to save tree. Is the backend running?");
    } finally {
      setLoading(false);
    }
  }

  function handleExport() {
    const clean = sanitizeTree(tree);
    setExportJson(JSON.stringify(clean, null, 2));
  }

  function handleLoadTree(record: TreeRecord) {
    setTree(record.hierarchy);
    setTreeName(record.name);
    setEditingId(record.id);
    setExportJson(null);
    setSaveMsg(null);
  }

  async function handleDelete(id: number) {
    if (!confirm("Delete this tree?")) return;
    try {
      await deleteTree(id);
      setSavedTrees((prev) => prev.filter((t) => t.id !== id));
      if (editingId === id) {
        setEditingId(null);
        setTree(DEFAULT_ROOT);
        setTreeName("My Tree");
      }
    } catch {
      setError("Failed to delete tree.");
    }
  }

  function handleNewTree() {
    setTree(DEFAULT_ROOT);
    setTreeName("My Tree");
    setEditingId(null);
    setExportJson(null);
    setSaveMsg(null);
  }

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <header className="bg-indigo-600 text-white px-8 py-6 shadow-lg flex items-center justify-between">
        <div className="flex items-center gap-4">
          <img src="/logo.png" alt="AImonk Logo" className="w-12 h-12 object-contain" />
          <div>
            <h1 className="text-2xl font-extrabold tracking-tight">AImonk</h1>
            <p className="text-indigo-200 text-sm opacity-80">Nested Tag Tree Management</p>
          </div>
        </div>
        <button
          onClick={handleNewTree}
          className="bg-white text-indigo-600 font-bold px-6 py-2 rounded-full shadow-sm hover:shadow-md hover:bg-indigo-50 transition-all active:scale-95"
        >
          + New Tree
        </button>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-8 grid grid-cols-1 lg:grid-cols-4 gap-8">
        <aside className="lg:col-span-1 space-y-6">
          <h2 className="text-xs font-bold text-gray-400 uppercase tracking-widest px-2">
            Recent Collections
          </h2>

          <div className="space-y-3">
            {loading && savedTrees.length === 0 && <p className="text-sm text-gray-400 animate-pulse">Loading...</p>}
            {error && <div className="bg-red-50 border border-red-200 text-red-600 text-xs rounded-xl p-3">{error}</div>}
            
            {savedTrees.length === 0 && !loading && (
              <p className="text-sm text-gray-400 italic px-2">No collections yet.</p>
            )}

            {savedTrees.map((t) => (
              <div
                key={t.id}
                onClick={() => handleLoadTree(t)}
                className={`group relative border rounded-xl p-4 cursor-pointer transition-all duration-200 
                  ${editingId === t.id
                    ? "border-indigo-500 bg-indigo-50 shadow-sm"
                    : "border-gray-200 bg-white hover:border-indigo-300 hover:shadow-sm"
                  }`}
              >
                <div className="pr-6">
                  <p className="text-sm font-bold text-gray-800 truncate">{t.name}</p>
                  <p className="text-[10px] text-gray-400 mt-1 font-medium">
                    Modified {new Date(t.updated_at).toLocaleDateString()}
                  </p>
                </div>
                <button
                  onClick={(e) => { e.stopPropagation(); handleDelete(t.id); }}
                  className="absolute top-4 right-4 text-gray-300 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                </button>
              </div>
            ))}
          </div>
        </aside>

        <main className="lg:col-span-3 space-y-6">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex flex-col sm:flex-row items-center gap-4">
            <input
              className="w-full bg-gray-50 border-none rounded-xl px-4 py-3 text-sm font-bold text-gray-800 focus:ring-2 focus:ring-indigo-500 transition-all"
              value={treeName}
              onChange={(e) => setTreeName(e.target.value)}
              placeholder="Collection name..."
            />
            <div className="flex gap-2 w-full sm:w-auto">
              <button
                onClick={handleSave}
                disabled={loading}
                className="flex-1 sm:flex-none text-sm bg-indigo-600 text-white font-bold px-8 py-3 rounded-xl hover:bg-indigo-700 shadow-lg shadow-indigo-100 transition-all active:scale-95 disabled:opacity-50"
              >
                {loading ? "Saving..." : editingId ? "Update" : "Save"}
              </button>
              <button
                onClick={handleExport}
                className="flex-1 sm:flex-none text-sm bg-gray-800 text-white font-bold px-6 py-3 rounded-xl hover:bg-gray-900 transition-all active:scale-95"
              >
                Export
              </button>
            </div>
          </div>

          {saveMsg && (
            <div className="bg-emerald-50 border border-emerald-100 text-emerald-700 text-sm font-medium rounded-xl px-4 py-3 animate-fade-in">
              {saveMsg}
            </div>
          )}

          <div className="bg-white rounded-2xl border border-gray-100 p-2 min-h-[400px]">
            <TagView node={tree} path={[]} onUpdate={handleUpdate} />
          </div>

          {exportJson && (
            <div className="animate-slide-up">
              <div className="flex items-center justify-between px-2 mb-3">
                <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest">JSON Output</h3>
                <button
                  onClick={() => setExportJson(null)}
                  className="text-xs font-bold text-gray-400 hover:text-gray-600 transition-colors"
                >
                  Close
                </button>
              </div>
              <div className="relative group">
                <pre className="bg-gray-900 text-indigo-300 text-[13px] rounded-2xl p-6 overflow-auto max-h-96 leading-relaxed shadow-xl scrollbar-hide">
                  {exportJson}
                </pre>
                <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                   <button 
                    onClick={() => { navigator.clipboard.writeText(exportJson); }}
                    className="bg-white/10 hover:bg-white/20 text-white text-[10px] font-bold px-3 py-1.5 rounded-lg backdrop-blur-sm transition-all"
                   >
                     Copy
                   </button>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
