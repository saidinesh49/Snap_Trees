import { AnimationStep, BaseTree, TreeData } from '../types';
import { Color, RBNode, RBTreeData } from '../types/RedBlackTypes';

export class RedBlackTree implements BaseTree {
  private root: RBNode | null = null;

  private createNode(value: number): RBNode {
    return {
      value,
      left: null,
      right: null,
      parent: null,
      color: 'RED',
      x: 0,
      y: 0,
      state: 'default'
    };
  }

  private isRed(node: RBNode | null): boolean {
    return node !== null && node.color === 'RED';
  }

  private isBlack(node: RBNode | null): boolean {
    return node === null || node.color === 'BLACK';
  }

  private rotateLeft(node: RBNode): RBNode {
    const rightChild = node.right as RBNode;
    node.right = rightChild.left;
    
    if (rightChild.left !== null) {
      (rightChild.left as RBNode).parent = node;
    }
    
    rightChild.parent = node.parent;
    
    if (node.parent === null) {
      this.root = rightChild;
    } else if (node === node.parent.left) {
      node.parent.left = rightChild;
    } else {
      node.parent.right = rightChild;
    }
    
    rightChild.left = node;
    node.parent = rightChild;
    
    return rightChild;
  }

  private rotateRight(node: RBNode): RBNode {
    const leftChild = node.left as RBNode;
    node.left = leftChild.right;
    
    if (leftChild.right !== null) {
      (leftChild.right as RBNode).parent = node;
    }
    
    leftChild.parent = node.parent;
    
    if (node.parent === null) {
      this.root = leftChild;
    } else if (node === node.parent.right) {
      node.parent.right = leftChild;
    } else {
      node.parent.left = leftChild;
    }
    
    leftChild.right = node;
    node.parent = leftChild;
    
    return leftChild;
  }

  insert(value: number): AnimationStep[] {
    const animations: AnimationStep[] = [];
    
    // Create new node
    const newNode = this.createNode(value);
    
    // If tree is empty, make new node the root and color it black
    if (this.root === null) {
      this.root = newNode;
      this.root.color = 'BLACK';
      animations.push({
        type: 'insert',
        nodes: [this.root],
        message: `Inserted ${value} as root`
      });
      return animations;
    }

    // Do standard BST insert
    let current = this.root;
    let parent: RBNode | null = null;

    while (current !== null) {
      animations.push({
        type: 'highlight',
        nodes: [current],
        message: `Comparing with ${current.value}`
      });

      parent = current;
      if (value < current.value) {
        current = current.left as RBNode;
      } else {
        current = current.right as RBNode;
      }
    }

    // Set parent and insert node
    if (parent !== null) {
      newNode.parent = parent;
      if (value < parent.value) {
        parent.left = newNode;
      } else {
        parent.right = newNode;
      }

      animations.push({
        type: 'insert',
        nodes: [newNode],
        message: `Inserted ${value}`
      });

      // Fix Red-Black tree violations
      this.fixInsert(newNode, animations);
    }

    return animations;
  }

  private fixInsert(node: RBNode, animations: AnimationStep[]): void {
    // Continue fixing until we reach root or find a black parent
    while (node !== this.root && this.isRed(node.parent)) {
      const parent = node.parent as RBNode;
      const grandParent = parent.parent as RBNode;
      
      if (parent === grandParent.left) {
        const uncle = grandParent.right as RBNode;
        
        // Case 1: Uncle is red
        if (this.isRed(uncle)) {
          parent.color = 'BLACK';
          uncle.color = 'BLACK';
          grandParent.color = 'RED';
          node = grandParent;
          
          animations.push({
            type: 'highlight',
            nodes: [parent, uncle, grandParent],
            message: 'Recoloring nodes'
          });
        }
        // Case 2 & 3: Uncle is black
        else {
          // Case 2: Node is right child
          if (node === parent.right) {
            node = parent;
            this.rotateLeft(node);
            animations.push({
              type: 'rotate',
              nodes: [node],
              message: 'Left rotation'
            });
          }
          
          // Case 3: Node is left child
          (node.parent as RBNode).color = 'BLACK';
          grandParent.color = 'RED';
          this.rotateRight(grandParent);
          
          animations.push({
            type: 'rotate',
            nodes: [grandParent],
            message: 'Right rotation'
          });
        }
      }
      // Same as above but with 'left' and 'right' exchanged
      else {
        const uncle = grandParent.left as RBNode;
        
        if (this.isRed(uncle)) {
          parent.color = 'BLACK';
          uncle.color = 'BLACK';
          grandParent.color = 'RED';
          node = grandParent;
          
          animations.push({
            type: 'highlight',
            nodes: [parent, uncle, grandParent],
            message: 'Recoloring nodes'
          });
        }
        else {
          if (node === parent.left) {
            node = parent;
            this.rotateRight(node);
            animations.push({
              type: 'rotate',
              nodes: [node],
              message: 'Right rotation'
            });
          }
          
          (node.parent as RBNode).color = 'BLACK';
          grandParent.color = 'RED';
          this.rotateLeft(grandParent);
          
          animations.push({
            type: 'rotate',
            nodes: [grandParent],
            message: 'Left rotation'
          });
        }
      }
    }
    
    // Ensure root is black
    this.root!.color = 'BLACK';
  }

  search(value: number): AnimationStep[] {
    const animations: AnimationStep[] = [];
    let current = this.root;
    let searchPath: RBNode[] = [];

    if (!current) {
      animations.push({
        type: 'notFound',
        nodes: [],
        message: 'Tree is empty'
      });
      return animations;
    }

    while (current !== null) {
      // Add current node to path
      searchPath.push(current);

      // First highlight the current node we're examining
      animations.push({
        type: 'highlight',
        nodes: [current],
        message: `Examining node ${current.value}`
      });

      // Wait a bit to show the highlight
      animations.push({
        type: 'compare',
        nodes: [current],
        message: `Is ${value} equal to ${current.value}?`
      });

      if (value === current.value) {
        // Show we found the value
        animations.push({
          type: 'found',
          nodes: [current],
          message: `Found ${value}!`
        });

        // Show the complete path we took
        animations.push({
          type: 'success-path',
          nodes: searchPath,
          message: `Path taken: ${searchPath.map(n => n.value).join(' → ')}`
        });
        return animations;
      }

      // Show the comparison and which way we're going
      if (value < current.value) {
        animations.push({
          type: 'compare',
          nodes: [current],
          message: `${value} < ${current.value}, going left`
        });

        // Show the path we're taking
        animations.push({
          type: 'path',
          nodes: searchPath,
          message: `Current path: ${searchPath.map(n => n.value).join(' → ')}`
        });

        current = current.left as RBNode;
      } else {
        animations.push({
          type: 'compare',
          nodes: [current],
          message: `${value} > ${current.value}, going right`
        });

        // Show the path we're taking
        animations.push({
          type: 'path',
          nodes: searchPath,
          message: `Current path: ${searchPath.map(n => n.value).join(' → ')}`
        });

        current = current.right as RBNode;
      }
    }

    // If we get here, we didn't find the value
    animations.push({
      type: 'notFound',
      nodes: searchPath,
      message: `${value} not found. Path searched: ${searchPath.map(n => n.value).join(' → ')}`
    });

    return animations;
  }

  clear(): AnimationStep[] {
    const animations: AnimationStep[] = [];
    
    if (this.root) {
      // Get all nodes in the tree
      const nodes = this.getAllNodes();
      
      // First show all nodes being cleared
      animations.push({
        type: 'highlight',
        nodes: nodes,
        message: 'Preparing to clear all nodes'
      });

      // Then show them being removed
      animations.push({
        type: 'clear',
        nodes: nodes,
        message: 'Clearing Red-Black tree'
      });

      // Clear the tree
      this.root = null;
    }
    
    return animations;
  }

  private getAllNodes(): RBNode[] {
    const nodes: RBNode[] = [];
    
    const traverse = (node: RBNode | null) => {
      if (node !== null) {
        nodes.push(node);
        traverse(node.left as RBNode);
        traverse(node.right as RBNode);
      }
    };
    
    traverse(this.root);
    return nodes;
  }

  getTreeData(): TreeData {
    const rbData = this.getRBTreeData();
    return {
      nodes: rbData.nodes.map(node => ({
        value: node.value,
        left: node.left,
        right: node.right,
        x: node.x,
        y: node.y,
        state: node.state
      })),
      links: rbData.links.map(link => ({
        source: {
          value: link.source.value,
          left: link.source.left,
          right: link.source.right,
          x: link.source.x,
          y: link.source.y,
          state: link.source.state
        },
        target: {
          value: link.target.value,
          left: link.target.left,
          right: link.target.right,
          x: link.target.x,
          y: link.target.y,
          state: link.target.state
        }
      }))
    };
  }

  public getRBTreeData(): RBTreeData {
    const nodes: RBNode[] = [];
    const links: { source: RBNode; target: RBNode }[] = [];

    const traverse = (node: RBNode) => {
      nodes.push(node);
      
      if (node.left !== null) {
        links.push({ source: node, target: node.left as RBNode });
        traverse(node.left as RBNode);
      }
      
      if (node.right !== null) {
        links.push({ source: node, target: node.right as RBNode });
        traverse(node.right as RBNode);
      }
    };

    if (this.root) {
      this.updateNodePositions();
      traverse(this.root);
    }

    return { nodes, links };
  }

  private updateNodePositions(): void {
    if (!this.root) return;

    const levelHeight = 80;
    const minSeparation = 50;

    const computeInitialPosition = (
      node: RBNode,
      level: number,
      leftmostX: number = 0
    ): { width: number; leftX: number; rightX: number } => {
      if (!node) return { width: 0, leftX: leftmostX, rightX: leftmostX };

      node.y = level * levelHeight;

      const leftResult = node.left 
        ? computeInitialPosition(node.left as RBNode, level + 1, leftmostX)
        : { width: 0, leftX: leftmostX, rightX: leftmostX };

      const rightResult = node.right
        ? computeInitialPosition(node.right as RBNode, level + 1, leftResult.rightX + minSeparation)
        : { width: 0, leftX: leftResult.rightX + minSeparation, rightX: leftResult.rightX + minSeparation };

      node.x = (leftResult.rightX + rightResult.leftX) / 2;

      return {
        width: rightResult.rightX - leftResult.leftX,
        leftX: leftResult.leftX,
        rightX: rightResult.rightX
      };
    };

    const treeMetrics = computeInitialPosition(this.root, 0);
    const centerOffset = -treeMetrics.width / 2;

    const centerTree = (node: RBNode | null) => {
      if (!node) return;
      node.x += centerOffset;
      centerTree(node.left as RBNode);
      centerTree(node.right as RBNode);
    };

    centerTree(this.root);
  }

  clone(): BaseTree {
    const newTree = new RedBlackTree();
    
    const cloneNode = (node: RBNode | null, parent: RBNode | null): RBNode | null => {
      if (node === null) return null;
      
      const newNode = this.createNode(node.value);
      newNode.color = node.color;
      newNode.x = node.x;
      newNode.y = node.y;
      newNode.parent = parent;
      newNode.left = this.cloneNode(node.left as RBNode, newNode);
      newNode.right = this.cloneNode(node.right as RBNode, newNode);
      
      return newNode;
    };

    newTree.root = cloneNode(this.root, null);
    return newTree;
  }

  delete(value: number): AnimationStep[] {
    const animations: AnimationStep[] = [];
    
    // Find node to delete
    let nodeToDelete = this.findNode(value);
    if (!nodeToDelete) {
      animations.push({
        type: 'notFound',
        nodes: [],
        message: `Node ${value} not found for deletion`
      });
      return animations;
    }

    animations.push({
      type: 'highlight',
      nodes: [nodeToDelete],
      message: `Found node ${value} to delete`
    });

    // Store original color and find replacement node
    let originalColor = nodeToDelete.color;
    let replacementNode: RBNode | null = null;
    let movedUpNode: RBNode | null = null;

    // Case 1: No children or one child
    if (!nodeToDelete.left || !nodeToDelete.right) {
      movedUpNode = !nodeToDelete.left ? nodeToDelete.right : nodeToDelete.left;
      this.transplant(nodeToDelete, movedUpNode, animations);
      replacementNode = movedUpNode;
    }
    // Case 2: Two children
    else {
      let successor = this.findMinimum(nodeToDelete.right as RBNode);
      originalColor = successor.color;
      movedUpNode = successor.right;

      // If successor is not direct child of node to delete
      if (successor.parent !== nodeToDelete) {
        this.transplant(successor, successor.right, animations);
        successor.right = nodeToDelete.right;
        if (successor.right) successor.right.parent = successor;
      } else {
        // Keep track of moved up node's parent for fixing violations
        if (movedUpNode) movedUpNode.parent = successor;
      }

      this.transplant(nodeToDelete, successor, animations);
      successor.left = nodeToDelete.left;
      successor.left.parent = successor;
      successor.color = nodeToDelete.color;
      replacementNode = movedUpNode;
    }

    // If we removed a black node, we need to fix violations
    if (originalColor === 'BLACK') {
      this.fixDeleteViolations(replacementNode, animations);
    }

    return animations;
  }

  private findNode(value: number): RBNode | null {
    let current = this.root;
    while (current !== null) {
      if (value === current.value) {
        return current;
      }
      current = value < current.value ? 
        current.left as RBNode : 
        current.right as RBNode;
    }
    return null;
  }

  private transplant(u: RBNode, v: RBNode | null, animations: AnimationStep[]): void {
    if (u.parent === null) {
      this.root = v;
    }
    else if (u === u.parent.left) {
      u.parent.left = v;
    }
    else {
      u.parent.right = v;
    }
    if (v !== null) {
      v.parent = u.parent;
    }
  }

  private findMinimum(node: RBNode): RBNode {
    while (node.left !== null) {
      node = node.left as RBNode;
    }
    return node;
  }

  private fixDeleteViolations(node: RBNode | null, animations: AnimationStep[]): void {
    while (node !== this.root && this.isBlackNode(node)) {
      if (!node?.parent) break;

      const isLeftChild = node === node.parent.left;
      let sibling = this.getSibling(node);
      if (!sibling) break;

      // Case 1: Red Sibling
      if (sibling.color === 'RED') {
        animations.push({
          type: 'highlight',
          nodes: sibling ? [sibling] : [],
          message: 'Case 1: Red sibling found, performing rotation and recoloring'
        });

        sibling.color = 'BLACK';
        node.parent.color = 'RED';
        if (isLeftChild) {
          this.rotateLeft(node.parent);
          sibling = node.parent.right;
        } else {
          this.rotateRight(node.parent);
          sibling = node.parent.left;
        }
        if (!sibling) break;
      }

      // Case 2: Black Sibling with Black Children
      if (this.isBlackNode(sibling.left) && this.isBlackNode(sibling.right)) {
        animations.push({
          type: 'highlight',
          nodes: sibling ? [sibling] : [],
          message: 'Case 2: Black sibling with black children, recoloring'
        });

        sibling.color = 'RED';
        node = node.parent;
        continue;
      }

      // Case 3: Black Sibling with at least one Red Child
      if (isLeftChild) {
        if (this.isBlackNode(sibling.right)) {
          // Case 3a: Red child is on the left
          if (sibling.left) sibling.left.color = 'BLACK';
          sibling.color = 'RED';
          this.rotateRight(sibling);
          sibling = node.parent.right;
          
          animations.push({
            type: 'highlight',
            nodes: sibling ? [sibling] : [],
            message: 'Case 3a: Restructuring for left child case'
          });
        }

        // Case 3b: Red child is on the right
        if (!sibling) break;
        sibling.color = node.parent.color;
        node.parent.color = 'BLACK';
        if (sibling.right) sibling.right.color = 'BLACK';
        this.rotateLeft(node.parent);
        
        animations.push({
          type: 'highlight',
          nodes: sibling ? [sibling] : [],
          message: 'Case 3b: Final rotation and recoloring'
        });

        node = this.root;
      } else {
        // Mirror cases for right child
        if (this.isBlackNode(sibling.left)) {
          if (sibling.right) sibling.right.color = 'BLACK';
          sibling.color = 'RED';
          this.rotateLeft(sibling);
          sibling = node.parent.left;
          
          animations.push({
            type: 'highlight',
            nodes: sibling ? [sibling] : [],
            message: 'Case 3a (mirrored): Restructuring for right child case'
          });
        }

        if (!sibling) break;
        sibling.color = node.parent.color;
        node.parent.color = 'BLACK';
        if (sibling.left) sibling.left.color = 'BLACK';
        this.rotateRight(node.parent);
        
        animations.push({
          type: 'highlight',
          nodes: sibling ? [sibling] : [],
          message: 'Case 3b (mirrored): Final rotation and recoloring'
        });

        node = this.root;
      }
    }

    // Ensure root is black and fix any remaining red node
    if (node) node.color = 'BLACK';
  }

  private cloneNode(node: RBNode | null, parent: RBNode | null): RBNode | null {
    if (node === null) return null;
    
    const newNode = this.createNode(node.value);
    newNode.color = node.color;
    newNode.x = node.x;
    newNode.y = node.y;
    newNode.parent = parent;
    newNode.left = this.cloneNode(node.left as RBNode, newNode);
    newNode.right = this.cloneNode(node.right as RBNode, newNode);
    
    return newNode;
  }

  private createAnimationStep(type: string, nodes: RBNode[], message: string): AnimationStep {
    return {
      type: type as AnimationStep['type'],
      nodes: nodes.map(node => ({
        value: node.value,
        left: node.left,
        right: node.right,
        x: node.x,
        y: node.y,
        state: node.state
      })),
      message
    };
  }

  private isBlackNode(node: RBNode | null): boolean {
    return node === null || node.color === 'BLACK';
  }

  private getSibling(node: RBNode): RBNode | null {
    if (!node.parent) return null;
    return node === node.parent.left ? node.parent.right : node.parent.left;
  }
} 