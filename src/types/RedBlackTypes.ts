import { BSTNode, TreeData } from '../types';

export type Color = 'RED' | 'BLACK';

export interface RBNode {
  value: number;
  left: RBNode | null;
  right: RBNode | null;
  x: number;
  y: number;
  color: Color;
  parent: RBNode | null;
  state?: 'default' | 'highlight' | 'compare' | 'found' | 'notFound' | 
          'searching' | 'path' | 'success-path';
}

export interface RBTreeData {
  nodes: RBNode[];
  links: { source: RBNode; target: RBNode }[];
} 