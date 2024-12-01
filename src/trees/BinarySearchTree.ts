import { TreeData, BSTNode, AnimationStep } from '../types';

export class BinarySearchTree {
  private root: BSTNode | null = null;
  private nodeSpacing = { x: 60, y: 80 };

  private createNode(value: number): BSTNode {
    return {
      value,
      left: null,
      right: null,
      x: 0,
      y: 0,
      state: 'default'
    };
  }

  insert(value: number): AnimationStep[] {
    const animations: AnimationStep[] = [];
    
    if (!this.root) {
      this.root = this.createNode(value);
      animations.push({
        type: 'highlight',
        nodes: [this.root],
        message: `Creating root node with value ${value}`
      });
    } else {
      this.insertNodeWithAnimation(this.root, value, animations);
    }
    
    this.updateNodePositions();
    return animations;
  }

  private insertNodeWithAnimation(node: BSTNode, value: number, animations: AnimationStep[]): void {
    // Highlight current node being compared
    animations.push({
      type: 'highlight',
      nodes: [node],
      message: `Comparing with node ${node.value}`
    });

    if (value < node.value) {
      animations.push({
        type: 'compare',
        nodes: [node],
        message: `${value} is less than ${node.value}, moving left`
      });

      if (node.left === null) {
        node.left = this.createNode(value);
        animations.push({
          type: 'insert',
          nodes: [node.left],
          message: `Inserting ${value} as left child of ${node.value}`
        });
      } else {
        this.insertNodeWithAnimation(node.left, value, animations);
      }
    } else if (value > node.value) {
      animations.push({
        type: 'compare',
        nodes: [node],
        message: `${value} is greater than ${node.value}, moving right`
      });

      if (node.right === null) {
        node.right = this.createNode(value);
        animations.push({
          type: 'insert',
          nodes: [node.right],
          message: `Inserting ${value} as right child of ${node.value}`
        });
      } else {
        this.insertNodeWithAnimation(node.right, value, animations);
      }
    }
  }

  search(value: number): AnimationStep[] {
    const animations: AnimationStep[] = [];
    this.searchNodeWithAnimation(this.root, value, animations);
    return animations;
  }

  private searchNodeWithAnimation(node: BSTNode | null, value: number, animations: AnimationStep[]): boolean {
    if (node === null) {
      animations.push({
        type: 'notFound',
        nodes: [],
        message: `Value ${value} not found in the tree`
      });
      return false;
    }

    animations.push({
      type: 'highlight',
      nodes: [node],
      message: `Checking node ${node.value}`
    });

    if (value === node.value) {
      animations.push({
        type: 'found',
        nodes: [node],
        message: `Found value ${value}!`
      });
      return true;
    }

    if (value < node.value) {
      animations.push({
        type: 'compare',
        nodes: [node],
        message: `${value} is less than ${node.value}, moving left`
      });
      return this.searchNodeWithAnimation(node.left, value, animations);
    }

    animations.push({
      type: 'compare',
      nodes: [node],
      message: `${value} is greater than ${node.value}, moving right`
    });
    return this.searchNodeWithAnimation(node.right, value, animations);
  }

  clear(): AnimationStep[] {
    const animations: AnimationStep[] = [];
    
    if (this.root) {
      const nodes = this.getAllNodes();
      animations.push({
        type: 'clear',
        nodes: nodes,
        message: 'Clearing all nodes from the tree'
      });
      
      // Actually clear the tree
      this.root = null;
    }
    
    return animations;
  }

  private getAllNodes(): BSTNode[] {
    const nodes: BSTNode[] = [];
    
    const traverse = (node: BSTNode | null) => {
      if (node) {
        nodes.push(node);
        traverse(node.left);
        traverse(node.right);
      }
    };
    
    traverse(this.root);
    return nodes;
  }

  delete(value: number): AnimationStep[] {
    const animations: AnimationStep[] = [];
    
    // First, animate the search process
    this.searchNodeForDeletion(this.root, value, animations);
    
    // Then perform the actual deletion with animation
    this.root = this.deleteNodeWithAnimation(this.root, value, animations);
    
    this.updateNodePositions();
    return animations;
  }

  private searchNodeForDeletion(node: BSTNode | null, value: number, animations: AnimationStep[]): void {
    if (!node) {
      animations.push({
        type: 'notFound',
        nodes: [],
        message: `Node ${value} not found for deletion`
      });
      return;
    }

    // Highlight current node being examined
    animations.push({
      type: 'highlight',
      nodes: [node],
      message: `Searching for node ${value} - examining node ${node.value}`
    });

    if (value === node.value) {
      animations.push({
        type: 'found',
        nodes: [node],
        message: `Found node ${value} to delete`
      });
      return;
    }

    if (value < node.value) {
      animations.push({
        type: 'compare',
        nodes: [node],
        message: `${value} is less than ${node.value}, moving left`
      });
      this.searchNodeForDeletion(node.left, value, animations);
    } else {
      animations.push({
        type: 'compare',
        nodes: [node],
        message: `${value} is greater than ${node.value}, moving right`
      });
      this.searchNodeForDeletion(node.right, value, animations);
    }
  }

  private deleteNodeWithAnimation(
    node: BSTNode | null, 
    value: number, 
    animations: AnimationStep[]
  ): BSTNode | null {
    if (!node) return null;

    if (value < node.value) {
      node.left = this.deleteNodeWithAnimation(node.left, value, animations);
    } else if (value > node.value) {
      node.right = this.deleteNodeWithAnimation(node.right, value, animations);
    } else {
      // Node to delete found - handle different cases
      
      // Case 1: Leaf node
      if (!node.left && !node.right) {
        animations.push({
          type: 'clear',
          nodes: [node],
          message: `Removing leaf node ${node.value}`
        });
        return null;
      }
      
      // Case 2: Node with one child
      if (!node.left) {
        const successor = node.right!;
        animations.push({
          type: 'highlight',
          nodes: [successor],
          message: `Node ${node.value} has only right child. Replacing with ${successor.value}`
        });
        animations.push({
          type: 'clear',
          nodes: [node],
          message: `Removing node ${node.value}`
        });
        return successor;
      }
      if (!node.right) {
        const successor = node.left!;
        animations.push({
          type: 'highlight',
          nodes: [successor],
          message: `Node ${node.value} has only left child. Replacing with ${successor.value}`
        });
        animations.push({
          type: 'clear',
          nodes: [node],
          message: `Removing node ${node.value}`
        });
        return successor;
      }
      
      // Case 3: Node with two children
      animations.push({
        type: 'highlight',
        nodes: [node],
        message: `Node ${node.value} has two children. Finding successor...`
      });
      
      // Find inorder successor (smallest node in right subtree)
      let successor = node.right;
      let parent = node;
      
      while (successor.left) {
        animations.push({
          type: 'highlight',
          nodes: [successor],
          message: `Looking for smallest value in right subtree - checking ${successor.value}`
        });
        parent = successor;
        successor = successor.left;
      }
      
      animations.push({
        type: 'highlight',
        nodes: [successor],
        message: `Found successor: ${successor.value}`
      });
      
      // Copy successor data
      const oldValue = node.value;
      node.value = successor.value;
      
      animations.push({
        type: 'compare',
        nodes: [node],
        message: `Replaced ${oldValue} with successor ${successor.value}`
      });
      
      // Delete the successor
      if (parent === node) {
        node.right = successor.right;
      } else {
        parent.left = successor.right;
      }
      
      animations.push({
        type: 'clear',
        nodes: [successor],
        message: `Removing successor node from its original position`
      });
    }
    
    return node;
  }

  private findMin(node: BSTNode): BSTNode {
    let current = node;
    while (current.left !== null) {
      current = current.left;
    }
    return current;
  }

  private getHeight(node: BSTNode | null): number {
    if (node === null) return 0;
    return Math.max(this.getHeight(node.left), this.getHeight(node.right)) + 1;
  }

  private updateNodePositions(): void {
    if (!this.root) return;

    const levelHeight = 80;  // Vertical spacing between levels
    const minSeparation = 50;  // Minimum horizontal separation between nodes

    // First pass: compute initial x positions and subtree widths
    const computeInitialPosition = (
      node: BSTNode,
      level: number,
      leftmostX: number = 0
    ): { width: number; leftX: number; rightX: number } => {
      if (!node) return { width: 0, leftX: leftmostX, rightX: leftmostX };

      node.y = level * levelHeight;  // Set vertical position

      // Recursively position children
      const leftResult = node.left 
        ? computeInitialPosition(node.left, level + 1, leftmostX)
        : { width: 0, leftX: leftmostX, rightX: leftmostX };

      const rightResult = node.right
        ? computeInitialPosition(node.right, level + 1, leftResult.rightX + minSeparation)
        : { width: 0, leftX: leftResult.rightX + minSeparation, rightX: leftResult.rightX + minSeparation };

      // Center the node above its children
      node.x = (leftResult.rightX + rightResult.leftX) / 2;

      return {
        width: rightResult.rightX - leftResult.leftX,
        leftX: leftResult.leftX,
        rightX: rightResult.rightX
      };
    };

    // Second pass: adjust positions to center the tree
    const treeMetrics = computeInitialPosition(this.root, 0);
    const centerOffset = -treeMetrics.width / 2;

    // Center the entire tree
    const centerTree = (node: BSTNode | null) => {
      if (!node) return;
      
      node.x += centerOffset;
      centerTree(node.left);
      centerTree(node.right);
    };

    centerTree(this.root);
  }

  getTreeData(): TreeData {
    const nodes: BSTNode[] = [];
    const links: { source: BSTNode; target: BSTNode }[] = [];

    const traverse = (node: BSTNode) => {
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

    if (this.root) {
      traverse(this.root);
    }

    return { nodes, links };
  }

  clone(): BinarySearchTree {
    const newTree = new BinarySearchTree();
    
    const cloneNode = (node: BSTNode | null): BSTNode | null => {
      if (node === null) return null;
      
      const newNode = this.createNode(node.value);
      newNode.x = node.x;
      newNode.y = node.y;
      newNode.left = cloneNode(node.left);
      newNode.right = cloneNode(node.right);
      
      return newNode;
    };

    newTree.root = cloneNode(this.root);
    return newTree;
  }
} 