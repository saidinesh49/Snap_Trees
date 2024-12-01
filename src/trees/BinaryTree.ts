import { BaseNode, TreeData, AnimationStep } from '../types';

interface BinaryTreeNode extends BaseNode {
  left: BinaryTreeNode | null;
  right: BinaryTreeNode | null;
  parent: BinaryTreeNode | null;
  level: number;
}

export class BinaryTree {
  private root: BinaryTreeNode | null = null;
  private nodeCount: number = 0;

  protected createNode(value: number, parent: BinaryTreeNode | null = null, level: number = 0): BinaryTreeNode {
    return {
      value,
      left: null,
      right: null,
      parent,
      level,
      x: 0,
      y: level * 80 // Vertical spacing between levels
    };
  }

  insert(value: number): AnimationStep[] {
    const animations: AnimationStep[] = [];
    
    if (!this.root) {
      this.root = this.createNode(value);
      animations.push({
        type: 'HIGHLIGHT',
        nodes: [this.root],
        duration: 500
      });
      this.nodeCount++;
      return animations;
    }

    // For binary tree, we insert in level-order (breadth-first)
    const queue: BinaryTreeNode[] = [this.root];
    while (queue.length > 0) {
      const current = queue[0];
      animations.push({
        type: 'HIGHLIGHT',
        nodes: [current],
        duration: 300
      });

      if (!current.left) {
        current.left = this.createNode(value, current, current.level + 1);
        animations.push({
          type: 'HIGHLIGHT',
          nodes: [current.left],
          duration: 500
        });
        this.nodeCount++;
        break;
      } else if (!current.right) {
        current.right = this.createNode(value, current, current.level + 1);
        animations.push({
          type: 'HIGHLIGHT',
          nodes: [current.right],
          duration: 500
        });
        this.nodeCount++;
        break;
      }

      queue.push(current.left);
      queue.push(current.right);
      queue.shift();
    }

    this.updateNodePositions();
    return animations;
  }

  delete(value: number): AnimationStep[] {
    const animations: AnimationStep[] = [];
    if (!this.root) return animations;

    // Find the node to delete and the last node
    const nodeToDelete = this.findNode(value);
    if (!nodeToDelete) return animations;

    animations.push({
      type: 'HIGHLIGHT',
      nodes: [nodeToDelete],
      duration: 500
    });

    // Find the last node in level order
    const lastNode = this.findLastNode();
    if (!lastNode) return animations;

    // If the node to delete is not the last node
    if (nodeToDelete !== lastNode) {
      // Copy value from last node to node to delete
      nodeToDelete.value = lastNode.value;
      animations.push({
        type: 'MOVE',
        nodes: [lastNode, nodeToDelete],
        duration: 500
      });
    }

    // Remove the last node
    if (lastNode.parent) {
      if (lastNode.parent.left === lastNode) {
        lastNode.parent.left = null;
      } else {
        lastNode.parent.right = null;
      }
    } else {
      this.root = null;
    }

    this.nodeCount--;
    this.updateNodePositions();
    return animations;
  }

  search(value: number): AnimationStep[] {
    const animations: AnimationStep[] = [];
    if (!this.root) return animations;

    const queue: BinaryTreeNode[] = [this.root];
    while (queue.length > 0) {
      const current = queue.shift()!;
      animations.push({
        type: 'HIGHLIGHT',
        nodes: [current],
        duration: 300
      });

      if (current.value === value) {
        animations.push({
          type: 'COLOR_CHANGE',
          nodes: [current],
          duration: 500
        });
        return animations;
      }

      if (current.left) queue.push(current.left);
      if (current.right) queue.push(current.right);
    }

    return animations;
  }

  private findNode(value: number): BinaryTreeNode | null {
    if (!this.root) return null;

    const queue: BinaryTreeNode[] = [this.root];
    while (queue.length > 0) {
      const current = queue.shift()!;
      if (current.value === value) return current;
      if (current.left) queue.push(current.left);
      if (current.right) queue.push(current.right);
    }

    return null;
  }

  private findLastNode(): BinaryTreeNode | null {
    if (!this.root) return null;

    const queue: BinaryTreeNode[] = [this.root];
    let lastNode: BinaryTreeNode | null = null;

    while (queue.length > 0) {
      lastNode = queue.shift()!;
      if (lastNode.left) queue.push(lastNode.left);
      if (lastNode.right) queue.push(lastNode.right);
    }

    return lastNode;
  }

  private updateNodePositions() {
    if (!this.root) return;

    const width = 1000; // Total width of the visualization
    const levelWidths: number[] = new Array(this.getHeight()).fill(0);
    
    // Count nodes at each level
    this.traverseLevelOrder((node: BinaryTreeNode) => {
      levelWidths[node.level]++;
    });

    // Update x-coordinates for each node
    const levelCurrentPos: number[] = new Array(this.getHeight()).fill(0);
    this.traverseLevelOrder((node: BinaryTreeNode) => {
      const levelWidth = levelWidths[node.level];
      const spacing = width / (levelWidth + 1);
      levelCurrentPos[node.level]++;
      node.x = levelCurrentPos[node.level] * spacing;
    });
  }

  private getHeight(): number {
    if (!this.root) return 0;
    let height = 0;
    this.traverseLevelOrder((node: BinaryTreeNode) => {
      height = Math.max(height, node.level + 1);
    });
    return height;
  }

  private traverseLevelOrder(callback: (node: BinaryTreeNode) => void) {
    if (!this.root) return;

    const queue: BinaryTreeNode[] = [this.root];
    while (queue.length > 0) {
      const current = queue.shift()!;
      callback(current);
      if (current.left) queue.push(current.left);
      if (current.right) queue.push(current.right);
    }
  }

  getTreeData(): TreeData {
    const nodes: BaseNode[] = [];
    const links: { source: BaseNode; target: BaseNode }[] = [];

    this.traverseLevelOrder((node: BinaryTreeNode) => {
      nodes.push(node);
      if (node.left) links.push({ source: node, target: node.left });
      if (node.right) links.push({ source: node, target: node.right });
    });

    return { nodes, links };
  }
} 