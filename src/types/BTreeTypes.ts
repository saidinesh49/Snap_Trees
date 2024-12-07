export interface BTreeNode {
  keys: number[];
  children: BTreeNode[];
  isLeaf: boolean;
  father: BTreeNode | null;
  x: number;
  y: number;
  state: 'default' | 'highlight' | 'found' | 'notFound' | 'compare' | 'path';
  foundKey?: number;
  size?: number;
}

export interface BTreeData {
  nodes: BTreeNode[];
  links: { source: BTreeNode; target: BTreeNode }[];
}

export interface BTreeAnimationStep {
  type: 'insert' | 'split' | 'highlight' | 'found' | 'notFound' | 'clear' | 'compare';
  nodes: BTreeNode[];
  message: string;
} 