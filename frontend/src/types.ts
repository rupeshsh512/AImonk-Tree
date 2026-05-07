// The only type used throughout the app.
// A node has a name and either `data` (leaf) or `children` (branch) — never both.
export interface TagNode {
  name: string;
  data?: string;
  children?: TagNode[];
}

// What gets stored in the DB — the full tree plus metadata
export interface TreeRecord {
  id: number;
  name: string;
  hierarchy: TagNode;
  created_at: string;
  updated_at: string;
}
