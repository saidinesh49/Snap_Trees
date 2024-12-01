// Node Types
export interface BaseNode {
  value: number;
  x?: number;
  y?: number;
  parent?: BaseNode | null;
}

export interface BSTNode extends BaseNode {
  left: BSTNode | null;
  right: BSTNode | null;
}

export interface AVLNode extends BSTNode {
  height: number;
  balanceFactor: number;
}

export interface RedBlackNode extends BSTNode {
  color: 'RED' | 'BLACK';
  parent: RedBlackNode | null;
}

export interface BTreeNode extends BaseNode {
  keys: number[];
  children: BTreeNode[];
  isLeaf: boolean;
  parent: BTreeNode | null;
}

// Tree Types
export interface TreeData {
  nodes: BaseNode[];
  links: { source: BaseNode; target: BaseNode }[];
}

// Operation Types
export type Operation = 'INSERT' | 'DELETE' | 'SEARCH' | 'CLEAR';
export type TreeType = 'BST' | 'AVL' | 'RED_BLACK' | 'B_TREE' | 'B_PLUS_TREE';

// Animation Types
export interface AnimationStep {
  type: 'HIGHLIGHT' | 'MOVE' | 'COLOR_CHANGE' | 'ROTATE';
  nodes: BaseNode[];
  duration: number;
}

// Tree Interface
export interface Tree<T extends BaseNode> {
  insert(value: number): AnimationStep[];
  delete(value: number): AnimationStep[];
  search(value: number): AnimationStep[];
  getTreeData(): TreeData;
} 