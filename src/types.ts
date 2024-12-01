export interface BSTNode {
  value: number;
  left: BSTNode | null;
  right: BSTNode | null;
  x: number;
  y: number;
  state?: 'default' | 'highlight' | 'compare' | 'found' | 'notFound';
}

export interface TreeData {
  nodes: BSTNode[];
  links: {
    source: BSTNode;
    target: BSTNode;
  }[];
}

export interface AnimationStep {
  type: 'highlight' | 'compare' | 'insert' | 'found' | 'notFound' | 'clear';
  nodes: BSTNode[];
  message: string;
} 