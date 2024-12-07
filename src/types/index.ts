export interface BSTNode {
  value: number;
  left: BSTNode | null;
  right: BSTNode | null;
  x: number;
  y: number;
  state: 'default' | 'highlight' | 'found' | 'notFound' | 'compare' | 'path' | undefined;
}

export interface TreeData {
  nodes: BSTNode[];
  links: { source: BSTNode; target: BSTNode }[];
}

export interface AnimationStep {
  type: 'highlight' | 'compare' | 'found' | 'notFound' | 'insert' | 'clear' | 'rotate' | 'rotate-prep' | 'rotate-complete';
  nodes: BSTNode[];
  message: string;
}

export interface BaseTree {
  insert(value: number): AnimationStep[];
  delete(value: number): AnimationStep[];
  search(value: number): AnimationStep[];
  clear(): AnimationStep[];
  getTreeData(): TreeData;
  clone(): BaseTree;
} 