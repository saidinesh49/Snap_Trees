import { BaseNode, TreeData, AnimationStep } from '../types';
import { BaseTree } from './BaseTree';

interface BSTNode extends BaseNode {
  left: BSTNode | null;
  right: BSTNode | null;
  parent: BSTNode | null;
  height: number;
}

export class BinarySearchTree extends BaseTree<BSTNode> {
  protected createAnimationStep(
    type: AnimationStep['type'],
    nodes: BaseNode[],
    duration: number = 500
  ): AnimationStep {
    return {
      type,
      nodes,
      duration,
    };
  }

  protected createNode(
    value: number,
    parent: BSTNode | null = null
  ): BSTNode {
    return {
      value,
      left: null,
      right: null,
      parent,
      height: 1,
      x: 0,
      y: 0
    };
  }

  protected addLinks(node: BSTNode, links: TreeData['links']): void {
    if (node.left) {
      links.push({ source: node, target: node.left });
      this.addLinks(node.left, links);
    }
    if (node.right) {
      links.push({ source: node, target: node.right });
      this.addLinks(node.right, links);
    }
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
      return animations;
    }

    const insertHelper = (node: BSTNode, val: number): void => {
      // Highlight current node being compared
      animations.push({
        type: 'HIGHLIGHT',
        nodes: [node],
        duration: 300
      });

      if (val < node.value) {
        if (!node.left) {
          node.left = this.createNode(val, node);
          animations.push({
            type: 'HIGHLIGHT',
            nodes: [node.left],
            duration: 500
          });
        } else {
          insertHelper(node.left, val);
        }
      } else if (val > node.value) {
        if (!node.right) {
          node.right = this.createNode(val, node);
          animations.push({
            type: 'HIGHLIGHT',
            nodes: [node.right],
            duration: 500
          });
        } else {
          insertHelper(node.right, val);
        }
      }
      
      this.updateHeight(node);
    };

    insertHelper(this.root, value);
    this.updateNodePositions();
    return animations;
  }

  delete(value: number): AnimationStep[] {
    const animations: AnimationStep[] = [];

    const findInorderSuccessor = (node: BSTNode): BSTNode => {
      // Find the leftmost node in the right subtree (inorder successor)
      let current = node.right!;
      
      animations.push({
        type: 'HIGHLIGHT',
        nodes: [current],
        duration: 500
      });

      while (current.left) {
        current = current.left;
        animations.push({
          type: 'HIGHLIGHT',
          nodes: [current],
          duration: 500
        });
      }
      return current;
    };

    const deleteHelper = (node: BSTNode | null, val: number): BSTNode | null => {
      if (!node) return null;

      // Highlight current node being examined
      animations.push({
        type: 'HIGHLIGHT',
        nodes: [node],
        duration: 500
      });

      if (val < node.value) {
        node.left = deleteHelper(node.left, val);
        if (node.left) node.left.parent = node;
      } else if (val > node.value) {
        node.right = deleteHelper(node.right, val);
        if (node.right) node.right.parent = node;
      } else {
        // Node to delete found
        animations.push({
          type: 'COLOR_CHANGE',
          nodes: [node],
          duration: 800
        });

        // Case 1: Leaf node
        if (!node.left && !node.right) {
          return null;
        }

        // Case 2: Node with one child
        if (!node.left) {
          const rightChild = node.right;
          if (rightChild) rightChild.parent = node.parent;
          return rightChild;
        }
        if (!node.right) {
          const leftChild = node.left;
          if (leftChild) leftChild.parent = node.parent;
          return leftChild;
        }

        // Case 3: Node with two children
        // Find inorder successor (smallest node in right subtree)
        const successor = findInorderSuccessor(node);
        
        // Show the replacement process
        animations.push({
          type: 'HIGHLIGHT',
          nodes: [node, successor],
          duration: 800
        });

        // Copy successor data to current node
        const oldValue = node.value;
        node.value = successor.value;
        
        // Show the value replacement
        animations.push({
          type: 'COLOR_CHANGE',
          nodes: [node],
          duration: 800
        });

        // Delete the successor (which will be either a leaf or have one right child)
        node.right = deleteHelper(node.right, successor.value);
        if (node.right) node.right.parent = node;
      }

      // Update height and return
      this.updateHeight(node);
      return node;
    };

    if (this.root) {
      this.root = deleteHelper(this.root, value);
      this.updateNodePositions();
    }

    return animations;
  }

  search(value: number): AnimationStep[] {
    const animations: AnimationStep[] = [];
    let found = false;
    
    const searchHelper = (node: BSTNode | null, val: number): boolean => {
      if (!node) {
        return false;
      }

      // Highlight current node being visited
      animations.push({
        type: 'HIGHLIGHT',
        nodes: [node],
        duration: 800
      });

      if (val === node.value) {
        // Node found - highlight it with success color
        animations.push({
          type: 'COLOR_CHANGE',
          nodes: [node],
          duration: 1500
        });
        found = true;
        return true;
      }

      if (val < node.value && node.left) {
        // Show path taken to left
        animations.push({
          type: 'HIGHLIGHT',
          nodes: [node, node.left],
          duration: 800
        });
        return searchHelper(node.left, val);
      } 
      
      if (val > node.value && node.right) {
        // Show path taken to right
        animations.push({
          type: 'HIGHLIGHT',
          nodes: [node, node.right],
          duration: 800
        });
        return searchHelper(node.right, val);
      }

      // Value not found - show failure color
      animations.push({
        type: 'COLOR_CHANGE',
        nodes: [node],
        duration: 1500
      });
      return false;
    };

    searchHelper(this.root, value);
    return animations;
  }

  private updateHeight(node: BSTNode): void {
    const leftHeight = node.left ? node.left.height : 0;
    const rightHeight = node.right ? node.right.height : 0;
    node.height = Math.max(leftHeight, rightHeight) + 1;
  }

  private updateNodePositions(): void {
    if (!this.root) return;

    const spacing = {
      x: 80,  // Horizontal spacing between nodes
      y: 60   // Vertical spacing between levels
    };

    const updatePosition = (
      node: BSTNode,
      level: number,
      leftBound: number,
      rightBound: number
    ): void => {
      if (!node) return;

      const x = (leftBound + rightBound) / 2;
      const y = level * spacing.y;

      node.x = x;
      node.y = y;

      const nextWidth = (rightBound - leftBound) / 2;
      if (node.left) {
        updatePosition(node.left, level + 1, leftBound, x);
      }
      if (node.right) {
        updatePosition(node.right, level + 1, x, rightBound);
      }
    };

    // Calculate initial bounds based on tree size
    const treeWidth = Math.pow(2, this.root.height) * spacing.x;
    updatePosition(this.root, 0, 0, treeWidth);
  }

  getTreeData(): TreeData {
    const nodes: BaseNode[] = [];
    const links: { source: BaseNode; target: BaseNode }[] = [];

    const traverse = (node: BSTNode | null) => {
      if (!node) return;
      
      nodes.push(node);
      if (node.left) {
        links.push({ source: node, target: node.left });
        traverse(node.left);
      }
      if (node.right) {
        links.push({ source: node, target: node.right });
        traverse(node.right);
      }
    };

    traverse(this.root);
    return { nodes, links };
  }

  clone(): BinarySearchTree {
    const newTree = new BinarySearchTree();
    
    const cloneNode = (node: BSTNode | null): BSTNode | null => {
      if (!node) return null;
      
      const newNode = this.createNode(node.value);
      newNode.height = node.height;
      newNode.x = node.x;
      newNode.y = node.y;
      
      newNode.left = cloneNode(node.left);
      if (newNode.left) newNode.left.parent = newNode;
      
      newNode.right = cloneNode(node.right);
      if (newNode.right) newNode.right.parent = newNode;
      
      return newNode;
    };

    newTree.root = cloneNode(this.root);
    return newTree;
  }
} 