import axios from "axios";
import type { TagNode, TreeRecord } from "./types";

// Read from .env — Vite exposes variables prefixed with VITE_
const BASE = import.meta.env.VITE_API_URL ?? "http://localhost:8000";

// Fetch all saved trees from the backend
export async function fetchTrees(): Promise<TreeRecord[]> {
  const res = await axios.get(`${BASE}/trees`);
  return res.data;
}

// Save a brand-new tree
export async function createTree(name: string, hierarchy: TagNode): Promise<TreeRecord> {
  const res = await axios.post(`${BASE}/trees`, { name, hierarchy });
  return res.data;
}

// Overwrite an existing tree
export async function updateTree(id: number, name: string, hierarchy: TagNode): Promise<TreeRecord> {
  const res = await axios.put(`${BASE}/trees/${id}`, { name, hierarchy });
  return res.data;
}

// Delete a tree
export async function deleteTree(id: number): Promise<void> {
  await axios.delete(`${BASE}/trees/${id}`);
}
