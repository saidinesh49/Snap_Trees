import { TreeData, AVLNode, AnimationStep, BSTNode, BaseTree } from '../types';

export class AVLTree implements BaseTree {
  private root: AVLNode | null = null;

  private createNode(value: number): AVLNode {
    return {
      value,
      left: null,
      right: null,
      height: 1,
      balanceFactor: 0,
      x: 0,
      y: 0,
      state: 'default'
    };
  }

  private getHeight(node: AVLNode | null): number {
    if (!node) return 0;
    return node.height;
  }

  private updateHeight(node: AVLNode): void {
    if (!node) return;
    
    // Get the height of left and right subtrees
    const leftHeight = this.getHeight(node.left as AVLNode);
    const rightHeight = this.getHeight(node.right as AVLNode);
    
    // Update height
    node.height = Math.max(leftHeight, rightHeight) + 1;
    
    // Update balance factor (left height - right height)
    node.balanceFactor = leftHeight - rightHeight;
  }

  private rotateRight(node: AVLNode, animations: AnimationStep[]): AVLNode {
    const leftChild = node.left as AVLNode;
    const tempRight = leftChild.right;

    animations.push({
      type: 'highlight',
      nodes: [node, leftChild],
      message: `Starting right rotation at node ${node.value}`
    });

    leftChild.right = node;
    node.left = tempRight;

    this.updateHeight(node);
    this.updateHeight(leftChild);

    return leftChild;
  }

  private rotateLeft(node: AVLNode, animations: AnimationStep[]): AVLNode {
    const rightChild = node.right as AVLNode;
    const tempLeft = rightChild.left;

    animations.push({
      type: 'highlight',
      nodes: [node, rightChild],
      message: `Starting left rotation at node ${node.value}`
    });

    rightChild.left = node;
    node.right = tempLeft;

    this.updateHeight(node);
    this.updateHeight(rightChild);

    return rightChild;
  }

  insert(value: number): AnimationStep[] {
    const animations: AnimationStep[] = [];
    this.root = this.insertNode(this.root, value, animations);
    this.updateNodePositions();
    this.updateAllBalanceFactors(this.root);
    return animations;
  }

  private insertNode(node: AVLNode | null, value: number, animations: AnimationStep[]): AVLNode {
    if (!node) {
      const newNode = this.createNode(value);
      animations.push({
        type: 'insert',
        nodes: [newNode],
        message: `Creating new node with value ${value}`
      });
      return newNode;
    }

    animations.push({
      type: 'compare',
      nodes: [node],
      message: `Comparing ${value} with ${node.value}`
    });

    if (value < node.value) {
      node.left = this.insertNode(node.left as AVLNode, value, animations);
    } else if (value > node.value) {
      node.right = this.insertNode(node.right as AVLNode, value, animations);
    } else {
      return node;
    }

    this.updateHeight(node);
    const balance = node.balanceFactor;

    if (Math.abs(balance) > 1) {
      animations.push({
        type: 'highlight',
        nodes: [node],
        message: `Rebalancing required at node ${node.value} (balance factor: ${balance})`
      });

      if (balance > 1) {
        if (value < (node.left as AVLNode).value) {
          return this.rotateRight(node, animations);
        } else {
          node.left = this.rotateLeft(node.left as AVLNode, animations);
          return this.rotateRight(node, animations);
        }
      } else {
        if (value > (node.right as AVLNode).value) {
          return this.rotateLeft(node, animations);
        } else {
          node.right = this.rotateRight(node.right as AVLNode, animations);
          return this.rotateLeft(node, animations);
        }
      }
    }

    return node;
  }

  search(value: number): AnimationStep[] {
    const animations: AnimationStep[] = [];
    this.searchNode(this.root, value, animations);
    return animations;
  }

  private searchNode(node: AVLNode | null, value: number, animations: AnimationStep[]): boolean {
    if (!node) {
      animations.push({
        type: 'notFound',
        nodes: [],
        message: `Value ${value} not found`
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
        message: `Found ${value}!`
      });
      return true;
    }

    if (value < node.value) {
      return this.searchNode(node.left as AVLNode, value, animations);
    }
    return this.searchNode(node.right as AVLNode, value, animations);
  }

  delete(value: number): AnimationStep[] {
    const animations: AnimationStep[] = [];
    this.root = this.deleteNode(this.root, value, animations);
    this.updateNodePositions();
    this.updateAllBalanceFactors(this.root);
    return animations;
  }

  private deleteNode(node: AVLNode | null, value: number, animations: AnimationStep[]): AVLNode | null {
    if (!node) return null;

    animations.push({
      type: 'highlight',
      nodes: [node],
      message: `Checking node ${node.value}`
    });

    if (value < node.value) {
      node.left = this.deleteNode(node.left as AVLNode, value, animations);
    } else if (value > node.value) {
      node.right = this.deleteNode(node.right as AVLNode, value, animations);
    } else {
      // Node to delete found
      animations.push({
        type: 'highlight',
        nodes: [node],
        message: `Found node ${node.value} to delete`
      });

      // Case 1: Leaf node
      if (!node.left && !node.right) {
        animations.push({
          type: 'clear',
          nodes: [node],
          message: `Removing leaf node ${node.value}`
        });
        return null;
      }

      // Case 2: One child
      if (!node.left) {
        const rightChild = node.right as AVLNode;
        animations.push({
          type: 'clear',
          nodes: [node],
          message: `Replacing node ${node.value} with right child ${rightChild.value}`
        });
        return rightChild;
      }
      
      if (!node.right) {
        const leftChild = node.left as AVLNode;
        animations.push({
          type: 'clear',
          nodes: [node],
          message: `Replacing node ${node.value} with left child ${leftChild.value}`
        });
        return leftChild;
      }

      // Case 3: Two children
      let successorParent = node;
      let successor = node.right as AVLNode;
      
      // Find the inorder successor (smallest in right subtree)
      while (successor.left) {
        successorParent = successor;
        successor = successor.left as AVLNode;
      }

      animations.push({
        type: 'highlight',
        nodes: [successor],
        message: `Found successor ${successor.value} to replace ${node.value}`
      });

      // Store the successor's value
      const successorValue = successor.value;

      // First handle the successor's removal
      if (successorParent === node) {
        // If successor is direct right child
        animations.push({
          type: 'clear',
          nodes: [successor],
          message: `Removing successor from its original position`
        });
        node.right = successor.right;
      } else {
        // If successor is deeper in the tree
        animations.push({
          type: 'clear',
          nodes: [successor],
          message: `Removing successor from its original position`
        });
        successorParent.left = successor.right;
      }

      // Then replace the node's value
      animations.push({
        type: 'highlight',
        nodes: [node],
        message: `Replacing ${node.value} with ${successorValue}`
      });
      node.value = successorValue;
    }

    if (!node) return null;

    // Update height and rebalance
    this.updateHeight(node);
    const balance = node.balanceFactor;

    // Handle balancing...
    if (balance > 1) {
      const leftChild = node.left as AVLNode;
      if (this.getHeight(leftChild.left as AVLNode) >= this.getHeight(leftChild.right as AVLNode)) {
        return this.rotateRight(node, animations);
      } else {
        node.left = this.rotateLeft(leftChild, animations);
        return this.rotateRight(node, animations);
      }
    }

    if (balance < -1) {
      const rightChild = node.right as AVLNode;
      if (this.getHeight(rightChild.right as AVLNode) >= this.getHeight(rightChild.left as AVLNode)) {
        return this.rotateLeft(node, animations);
      } else {
        node.right = this.rotateRight(rightChild, animations);
        return this.rotateLeft(node, animations);
      }
    }

    return node;
  }

  clear(): AnimationStep[] {
    const animations: AnimationStep[] = [];
    
    if (this.root) {
      // Get all nodes for clear animation
      const nodes = this.getAllNodes();
      animations.push({
        type: 'clear',
        nodes: nodes,
        message: 'Clearing all nodes from the tree'
      });
    }
    
    // Actually clear the tree
    this.root = null;
    
    return animations;
  }

  private getAllNodes(): AVLNode[] {
    const nodes: AVLNode[] = [];
    const traverse = (node: AVLNode | null) => {
      if (node) {
        nodes.push(node);
        traverse(node.left as AVLNode);
        traverse(node.right as AVLNode);
      }
    };
    traverse(this.root);
    return nodes;
  }

  getTreeData(): TreeData {
    const nodes: AVLNode[] = [];
    const links: { source: AVLNode; target: AVLNode }[] = [];

    const traverse = (node: AVLNode | null) => {
      if (node) {
        nodes.push(node);
        if (node.left) {
          links.push({ source: node, target: node.left as AVLNode });
          traverse(node.left as AVLNode);
        }
        if (node.right) {
          links.push({ source: node, target: node.right as AVLNode });
          traverse(node.right as AVLNode);
        }
      }
    };

    traverse(this.root);
    return { nodes, links };
  }

  clone(): BaseTree {
    const newTree = new AVLTree();
    newTree.root = this.cloneNode(this.root);
    return newTree;
  }

  private cloneNode(node: AVLNode | null): AVLNode | null {
    if (!node) return null;
    const newNode = this.createNode(node.value);
    newNode.height = node.height;
    newNode.balanceFactor = node.balanceFactor;
    newNode.left = this.cloneNode(node.left as AVLNode);
    newNode.right = this.cloneNode(node.right as AVLNode);
    return newNode;
  }

  private updateNodePositions(): void {
    if (!this.root) return;

    const levelHeight = 80;  // Vertical spacing between levels
    const nodeSpacing = 60;  // Horizontal spacing between nodes

    // First pass: calculate width needed for each subtree
    const getSubtreeWidth = (node: AVLNode | null): number => {
      if (!node) return 0;
      return getSubtreeWidth(node.left as AVLNode) + 
             getSubtreeWidth(node.right as AVLNode) + 
             nodeSpacing;
    };

    // Second pass: assign positions
    const assignPositions = (
      node: AVLNode | null,
      level: number,
      leftX: number
    ): number => {
      if (!node) return leftX;

      // Position left subtree
      const leftWidth = assignPositions(node.left as AVLNode, level + 1, leftX);

      // Position current node
      node.y = level * levelHeight;  // Vertical position based on level
      node.x = leftWidth;            // Horizontal position after left subtree

      // Position right subtree
      return assignPositions(
        node.right as AVLNode, 
        level + 1, 
        node.x + nodeSpacing
      );
    };

    // Calculate total width and center the tree
    const totalWidth = getSubtreeWidth(this.root);
    const startX = -totalWidth / 2;

    // Position all nodes
    assignPositions(this.root, 0, startX);
  }

  private findMin(node: AVLNode): AVLNode {
    let current = node;
    while (current.left) {
      current = current.left as AVLNode;
    }
    return current;
  }

  private updateAllBalanceFactors(node: AVLNode | null): void {
    if (!node) return;
    
    // Update balance factors of children first
    this.updateAllBalanceFactors(node.left as AVLNode);
    this.updateAllBalanceFactors(node.right as AVLNode);
    
    // Then update this node's balance factor
    this.updateHeight(node);
  }
} 