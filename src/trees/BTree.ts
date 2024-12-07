import { BTreeNode, BTreeData, BTreeAnimationStep } from '../types/BTreeTypes';
import { BaseTree, AnimationStep, TreeData, BSTNode } from '../types';

export class BTree implements BaseTree {
  private root: BTreeNode | null = null;
  private order: number;
  private halfNumber: number;
  private treeSize: number = 0;
  private nullNode: BTreeNode;

  constructor(order: number = 3) {
    if (order < 3) {
      throw new Error("B-tree's order cannot be lower than 3");
    }
    this.order = order;
    this.halfNumber = Math.floor((order - 1) / 2);
    this.nullNode = this.createNode();
  }

  private createNode(isLeaf: boolean = true): BTreeNode {
    return {
      keys: [],
      children: [],
      isLeaf,
      father: null,
      x: 0,
      y: 0,
      state: 'default'
    };
  }

  private isNodeNull(node: BTreeNode | null | undefined): boolean {
    return !node || node.keys.length === 0;
  }

  private isNodeFull(node: BTreeNode): boolean {
    return node.keys.length === this.order - 1;
  }

  private isLastInternalNode(node: BTreeNode): boolean {
    if (!node || node.keys.length === 0) return false;
    return node.children.every(child => !child || this.isNodeNull(child));
  }

  isEmpty(): boolean {
    return this.root === null;
  }

  getHeight(): number {
    if (this.isEmpty()) return 0;
    return this.getNodeHeight(this.root!);
  }

  private getNodeHeight(node: BTreeNode): number {
    let height = 0;
    let currentNode = node;
    while (!this.isNodeNull(currentNode)) {
      currentNode = currentNode.children[0];
      height++;
    }
    return height;
  }

  insert(value: number): AnimationStep[] {
    const animations: BTreeAnimationStep[] = [];

    // Case 1: Empty tree
    if (this.isEmpty()) {
      this.root = this.createNode();
      this.root.keys = [value];
      this.treeSize++;
      this.root.children = [this.nullNode];

      animations.push({
        type: 'insert',
        nodes: [this.root],
        message: `Creating root with key ${value}`
      });
      return this.convertAnimations(animations);
    }

    // Case 2: Find leaf node to insert
    if (!this.root) return this.convertAnimations(animations);

    let currentNode = this.root;
    
    // Find the leaf node where we should insert
    while (!currentNode.isLeaf) {
      animations.push({
        type: 'highlight',
        nodes: [currentNode],
        message: `Examining node with keys [${currentNode.keys.join(', ')}]`
      });

      let i = 0;
      while (i < currentNode.keys.length && value > currentNode.keys[i]) {
        i++;
      }

      const nextNode = currentNode.children[i];
      if (!nextNode || this.isNodeNull(nextNode)) {
        break;
      }
      currentNode = nextNode;
    }

    // Case 3: Insert into non-full leaf node
    if (!this.isNodeFull(currentNode)) {
      this.insertIntoNonFullNode(currentNode, value, animations);
    } else {
      // Case 4: Split full leaf node
      this.splitAndInsert(currentNode, value, animations);
    }

    return this.convertAnimations(animations);
  }

  private insertIntoNonFullNode(node: BTreeNode, value: number, animations: BTreeAnimationStep[]): void {
    let pos = 0;
    while (pos < node.keys.length && node.keys[pos] < value) {
      pos++;
    }

    node.keys.splice(pos, 0, value);
    
    // If it's a leaf node, ensure it has the correct number of null children
    if (node.isLeaf) {
      node.children = Array(node.keys.length + 1).fill(this.nullNode);
    }
    
    this.treeSize++;

    animations.push({
      type: 'insert',
      nodes: [node],
      message: `Inserted ${value} into node`
    });
  }

  private splitAndInsert(node: BTreeNode, value: number, animations: BTreeAnimationStep[]): void {
    // First insert the new value into the node
    let pos = 0;
    while (pos < node.keys.length && node.keys[pos] < value) {
      pos++;
    }
    node.keys.splice(pos, 0, value);

    // Now handle the overflow by splitting
    while (node.keys.length >= this.order) {  // Node is overfull
      // Find middle element - Fix for even order
      const midIndex = Math.ceil(node.keys.length / 2) - 1;  // Changed this line
      const midKey = node.keys[midIndex];

      // Create new left and right nodes
      const leftNode = this.createNode(node.isLeaf);
      const rightNode = this.createNode(node.isLeaf);

      // Distribute keys
      leftNode.keys = node.keys.slice(0, midIndex);
      rightNode.keys = node.keys.slice(midIndex + 1);

      // Handle children if internal node
      if (!node.isLeaf) {
        leftNode.children = node.children.slice(0, midIndex + 1);
        rightNode.children = node.children.slice(midIndex + 1);
        
        // Update father references
        leftNode.children.forEach(child => child.father = leftNode);
        rightNode.children.forEach(child => child.father = rightNode);
      }

      animations.push({
        type: 'split',
        nodes: [node, leftNode, rightNode],
        message: `Split node: ${midKey} moves up, [${leftNode.keys}] left, [${rightNode.keys}] right`
      });

      if (node === this.root) {
        // Create new root with middle element
        const newRoot = this.createNode(false);
        newRoot.keys = [midKey];
        newRoot.children = [leftNode, rightNode];
        leftNode.father = newRoot;
        rightNode.father = newRoot;
        this.root = newRoot;
        break;  // Root split complete
      } else {
        // Move middle element up to father
        const father = node.father!;
        let insertPos = 0;
        while (insertPos < father.keys.length && father.keys[insertPos] < midKey) {
          insertPos++;
        }

        father.keys.splice(insertPos, 0, midKey);
        father.children[insertPos] = leftNode;
        father.children.splice(insertPos + 1, 0, rightNode);
        leftNode.father = father;
        rightNode.father = father;

        // Continue with father if it's overfull
        node = father;
      }
    }
  }

  private convertAnimations(btreeAnimations: BTreeAnimationStep[]): AnimationStep[] {
    return btreeAnimations.map(anim => {
      let type: AnimationStep['type'];
      
      switch (anim.type) {
        case 'split':
        case 'highlight':
          type = 'highlight';
          break;
        case 'compare':
          type = 'compare';
          break;
        case 'found':
          type = 'found';
          break;
        case 'notFound':
          type = 'notFound';
          break;
        case 'insert':
          type = 'insert';
          break;
        case 'clear':
          type = 'clear';
          break;
        default:
          type = 'highlight';
      }

      return {
        type,
        nodes: anim.nodes.map(node => ({
          value: node.keys[0],
          left: null,
          right: null,
          x: node.x,
          y: node.y,
          state: node.state as BSTNode['state']
        })),
        message: anim.message
      };
    });
  }

  search(value: number): AnimationStep[] {
    const animations: BTreeAnimationStep[] = [];
    const searchPath: BTreeNode[] = [];  // Track search path

    if (this.isEmpty()) {
      animations.push({
        type: 'notFound',
        nodes: [],
        message: `Tree is empty, cannot search for ${value}`
      });
      return this.convertAnimations(animations);
    }

    let currentNode = this.root!;
    let found = false;
    const allNodes = this.getAllNodes(currentNode);

    while (!this.isNodeNull(currentNode)) {
      searchPath.push(currentNode);
      currentNode.state = 'highlight';  // Mark path in green

      animations.push({
        type: 'highlight',
        nodes: searchPath,
        message: `Examining node with keys [${currentNode.keys.join(', ')}]`
      });

      let i = 0;
      while (i < currentNode.keys.length) {
        if (value === currentNode.keys[i]) {
          // Found the key - mark only this key as found
          currentNode.state = 'path';  // Keep path green
          currentNode.foundKey = value;  // Mark specific key as found
          animations.push({
            type: 'found',
            nodes: searchPath,  // Show entire path
            message: `Found ${value} at position ${i} in node`
          });
          found = true;
          break;
        } else if (value < currentNode.keys[i]) {
          break;
        }
        i++;
      }

      if (found) break;

      if (currentNode.isLeaf) {
        // Not found - mark entire tree red
        allNodes.forEach(node => {
          node.state = 'notFound';
          node.foundKey = undefined;
        });
        
        animations.push({
          type: 'notFound',
          nodes: allNodes,
          message: `${value} not found in tree`
        });
        break;
      }

      const nextNode = currentNode.children[i];
      if (!nextNode || this.isNodeNull(nextNode)) {
        // Not found - mark entire tree red
        allNodes.forEach(node => {
          node.state = 'notFound';
          node.foundKey = undefined;
        });
        
        animations.push({
          type: 'notFound',
          nodes: allNodes,
          message: `${value} not found in tree`
        });
        break;
      }

      currentNode = nextNode;
    }

    return this.convertAnimations(animations);
  }

  delete(value: number): AnimationStep[] {
    const animations: BTreeAnimationStep[] = [];

    if (this.isEmpty()) {
      animations.push({
        type: 'notFound',
        nodes: [],
        message: `Tree is empty, cannot delete ${value}`
      });
      return this.convertAnimations(animations);
    }

    // First find the node containing the key
    let node = this.findNodeForDeletion(this.root!, value, animations);
    if (!node) {
      animations.push({
        type: 'notFound',
        nodes: [],
        message: `${value} not found in tree`
      });
      return this.convertAnimations(animations);
    }

    const keyIndex = node.keys.indexOf(value);

    // Handle root deletion specially
    if (node === this.root) {
      if (this.handleRootDeletion(keyIndex, animations)) {
        return this.convertAnimations(animations);
      }
    }

    // Handle regular cases
    if (node.isLeaf) {
      this.deleteFromLeaf(node, keyIndex, animations);
    } else {
      this.deleteFromInternalNode(node, keyIndex, animations);
    }

    return this.convertAnimations(animations);
  }

  private findNodeForDeletion(
    node: BTreeNode,
    value: number,
    animations: BTreeAnimationStep[]
  ): BTreeNode | null {
    animations.push({
      type: 'highlight',
      nodes: [node],
      message: `Searching for ${value} in node with keys [${node.keys.join(', ')}]`
    });

    // Check if value is in current node
    const keyIndex = node.keys.indexOf(value);
    if (keyIndex !== -1) return node;

    // If leaf node and key not found, return null
    if (node.isLeaf) return null;

    // Find appropriate child to search
    let childIndex = 0;
    while (childIndex < node.keys.length && value > node.keys[childIndex]) {
      childIndex++;
    }

    return this.findNodeForDeletion(node.children[childIndex], value, animations);
  }

  private deleteFromLeaf(
    node: BTreeNode,
    keyIndex: number,
    animations: BTreeAnimationStep[]
  ): void {
    const value = node.keys[keyIndex];
    
    // Case 1: Node has more than minimum keys or is root
    if (node.keys.length > this.halfNumber || node === this.root) {
      node.keys.splice(keyIndex, 1);
      this.treeSize--;
      animations.push({
        type: 'highlight',
        nodes: [node],
        message: `Deleted ${value} from leaf node`
      });
      return;
    }

    // Case 2: Need to borrow or merge
    const parent = node.father!;
    const nodeIndex = parent.children.indexOf(node);
    
    // Try borrowing from siblings first
    let borrowed = false;

    // Try left sibling
    if (nodeIndex > 0) {
      const leftSibling = parent.children[nodeIndex - 1];
      if (leftSibling.keys.length > this.halfNumber) {
        this.borrowFromLeftSibling(node, leftSibling, parent, nodeIndex, animations);
        node.keys.splice(keyIndex, 1);
        this.treeSize--;
        borrowed = true;
      }
    }

    // Try right sibling if left didn't work
    if (!borrowed && nodeIndex < parent.children.length - 1) {
      const rightSibling = parent.children[nodeIndex + 1];
      if (rightSibling.keys.length > this.halfNumber) {
        this.borrowFromRightSibling(node, rightSibling, parent, nodeIndex, animations);
        node.keys.splice(keyIndex, 1);
        this.treeSize--;
        borrowed = true;
      }
    }

    // If borrowing wasn't possible, merge and handle cascading effects
    if (!borrowed) {
      // First delete the key
      node.keys.splice(keyIndex, 1);
      this.treeSize--;

      // Then merge with a sibling
      let mergedNode: BTreeNode;
      if (nodeIndex > 0) {
        mergedNode = this.mergeWithLeftSibling(node, animations);
      } else {
        mergedNode = this.mergeWithRightSibling(node, animations);
      }

      // Now check if parent needs rebalancing
      let currentNode = parent;
      while (currentNode !== this.root && currentNode.keys.length < this.halfNumber) {
        const grandParent = currentNode.father!;
        const currentIndex = grandParent.children.indexOf(currentNode);
        
        // Try borrowing for parent
        borrowed = false;

        // Try left sibling for parent
        if (currentIndex > 0) {
          const leftUncle = grandParent.children[currentIndex - 1];
          if (leftUncle.keys.length > this.halfNumber) {
            this.borrowFromLeftSibling(currentNode, leftUncle, grandParent, currentIndex, animations);
            borrowed = true;
          }
        }

        // Try right sibling for parent
        if (!borrowed && currentIndex < grandParent.children.length - 1) {
          const rightUncle = grandParent.children[currentIndex + 1];
          if (rightUncle.keys.length > this.halfNumber) {
            this.borrowFromRightSibling(currentNode, rightUncle, grandParent, currentIndex, animations);
            borrowed = true;
          }
        }

        // If borrowing wasn't possible for parent, merge and continue up
        if (!borrowed) {
          if (currentIndex > 0) {
            currentNode = this.mergeWithLeftSibling(currentNode, animations);
          } else {
            currentNode = this.mergeWithRightSibling(currentNode, animations);
          }
          currentNode = grandParent;
        } else {
          break;  // If borrowed successfully, we can stop
        }
      }

      // Handle root becoming empty
      if (this.root && this.root.keys.length === 0) {
        if (this.root.children.length > 0) {
          this.root = this.root.children[0];
          this.root.father = null;
          animations.push({
            type: 'highlight',
            nodes: [this.root],
            message: 'Adjusted root after cascading merges'
          });
        } else {
          this.root = null;
          animations.push({
            type: 'clear',
            nodes: [],
            message: 'Tree is now empty'
          });
        }
      }
    }
  }

  private deleteFromInternalNode(
    node: BTreeNode,
    keyIndex: number,
    animations: BTreeAnimationStep[]
  ): void {
    const value = node.keys[keyIndex];
    const leftChild = node.children[keyIndex];
    const rightChild = node.children[keyIndex + 1];

    // First try to get replacement from left child's rightmost key
    if (leftChild.keys.length > this.halfNumber) {
      // Find rightmost key in left subtree
      let replacementNode = leftChild;
      let replacementParent = node;
      
      while (!replacementNode.isLeaf) {
        replacementParent = replacementNode;
        replacementNode = replacementNode.children[replacementNode.children.length - 1];
      }

      const replacementKey = replacementNode.keys[replacementNode.keys.length - 1];
      
      // Replace the key in internal node
      node.keys[keyIndex] = replacementKey;
      animations.push({
        type: 'highlight',
        nodes: [node, replacementNode],
        message: `Replaced ${value} with ${replacementKey} from left subtree`
      });

      // Remove the replacement key
      replacementNode.keys.pop();
      this.treeSize--;

      // Handle any violation in the replacement node
      if (replacementNode.keys.length < this.halfNumber) {
        const nodeIndex = replacementParent.children.indexOf(replacementNode);
        let balanced = false;

        // Try borrowing from siblings
        if (nodeIndex > 0) {
          const leftSibling = replacementParent.children[nodeIndex - 1];
          if (leftSibling.keys.length > this.halfNumber) {
            this.borrowFromLeftSibling(replacementNode, leftSibling, replacementParent, nodeIndex, animations);
            balanced = true;
          }
        }

        if (!balanced && nodeIndex < replacementParent.children.length - 1) {
          const rightSibling = replacementParent.children[nodeIndex + 1];
          if (rightSibling.keys.length > this.halfNumber) {
            this.borrowFromRightSibling(replacementNode, rightSibling, replacementParent, nodeIndex, animations);
            balanced = true;
          }
        }

        // If borrowing not possible, merge and handle cascading effects
        if (!balanced) {
          let currentNode = replacementNode;
          if (nodeIndex > 0) {
            currentNode = this.mergeWithLeftSibling(currentNode, animations);
          } else {
            currentNode = this.mergeWithRightSibling(currentNode, animations);
          }

          // Handle cascading effects up to root
          this.handleCascadingMerges(currentNode, animations);
        }
      }
      return;
    }

    // Try right child's leftmost key if left child can't provide replacement
    if (rightChild.keys.length > this.halfNumber) {
      // Find leftmost key in right subtree
      let replacementNode = rightChild;
      let replacementParent = node;
      
      while (!replacementNode.isLeaf) {
        replacementParent = replacementNode;
        replacementNode = replacementNode.children[0];
      }

      const replacementKey = replacementNode.keys[0];
      
      // Replace the key in internal node
      node.keys[keyIndex] = replacementKey;
      animations.push({
        type: 'highlight',
        nodes: [node, replacementNode],
        message: `Replaced ${value} with ${replacementKey} from right subtree`
      });

      // Remove the replacement key
      replacementNode.keys.shift();
      this.treeSize--;

      // Handle any violation in the replacement node
      if (replacementNode.keys.length < this.halfNumber) {
        const nodeIndex = replacementParent.children.indexOf(replacementNode);
        let balanced = false;

        // Try borrowing from siblings
        if (nodeIndex > 0) {
          const leftSibling = replacementParent.children[nodeIndex - 1];
          if (leftSibling.keys.length > this.halfNumber) {
            this.borrowFromLeftSibling(replacementNode, leftSibling, replacementParent, nodeIndex, animations);
            balanced = true;
          }
        }

        if (!balanced && nodeIndex < replacementParent.children.length - 1) {
          const rightSibling = replacementParent.children[nodeIndex + 1];
          if (rightSibling.keys.length > this.halfNumber) {
            this.borrowFromRightSibling(replacementNode, rightSibling, replacementParent, nodeIndex, animations);
            balanced = true;
          }
        }

        // If borrowing not possible, merge and handle cascading effects
        if (!balanced) {
          let currentNode = replacementNode;
          if (nodeIndex > 0) {
            currentNode = this.mergeWithLeftSibling(currentNode, animations);
          } else {
            currentNode = this.mergeWithRightSibling(currentNode, animations);
          }

          // Handle cascading effects up to root
          this.handleCascadingMerges(currentNode, animations);
        }
      }
      return;
    }

    // If neither child can provide a replacement, merge children
    this.mergeChildren(node, keyIndex, animations);
    
    // After merging, find and delete the value from merged node
    const mergedNode = node.children[keyIndex];
    const newKeyIndex = mergedNode.keys.indexOf(value);
    if (newKeyIndex !== -1) {
      if (mergedNode.isLeaf) {
        this.deleteFromLeaf(mergedNode, newKeyIndex, animations);
      } else {
        this.deleteFromInternalNode(mergedNode, newKeyIndex, animations);
      }
    }

    // Check if parent needs rebalancing after merge
    if (node !== this.root && node.keys.length < this.halfNumber) {
      this.handleCascadingMerges(node, animations);
    }
  }

  private borrowFromLeftSibling(
    node: BTreeNode,
    leftSibling: BTreeNode,
    parent: BTreeNode,
    nodeIndex: number,
    animations: BTreeAnimationStep[]
  ): void {
    // Get key from parent and rightmost key from left sibling
    const parentKey = parent.keys[nodeIndex - 1];
    const siblingKey = leftSibling.keys.pop()!;
    
    // Move parent key down to current node
    node.keys.push(parentKey);
    // Move sibling key up to parent
    parent.keys[nodeIndex - 1] = siblingKey;

    // If not leaf nodes, handle children
    if (!node.isLeaf) {
      const childToMove = leftSibling.children.pop()!;
      node.children.unshift(childToMove);
      childToMove.father = node;
    }

    animations.push({
      type: 'highlight',
      nodes: [node, leftSibling, parent],
      message: `Borrowed ${siblingKey} from left sibling`
    });
  }

  private borrowFromRightSibling(
    node: BTreeNode,
    rightSibling: BTreeNode,
    parent: BTreeNode,
    nodeIndex: number,
    animations: BTreeAnimationStep[]
  ): void {
    // Get key from parent and leftmost key from right sibling
    const parentKey = parent.keys[nodeIndex];
    const siblingKey = rightSibling.keys.shift()!;
    
    // Move parent key down to current node
    node.keys.push(parentKey);
    // Move sibling key up to parent
    parent.keys[nodeIndex] = siblingKey;

    // If not leaf nodes, handle children
    if (!node.isLeaf) {
      const childToMove = rightSibling.children.shift()!;
      node.children.push(childToMove);
      childToMove.father = node;
    }

    animations.push({
      type: 'highlight',
      nodes: [node, rightSibling, parent],
      message: `Borrowed ${siblingKey} from right sibling`
    });
  }

  private mergeWithLeftSibling(
    node: BTreeNode,
    animations: BTreeAnimationStep[]
  ): BTreeNode {
    if (!node.father) return node;

    const parent = node.father;
    const nodeIndex = parent.children.indexOf(node);
    if (nodeIndex <= 0) return node;

    const leftSibling = parent.children[nodeIndex - 1];
    const parentKey = parent.keys[nodeIndex - 1];

    // Move parent key down to left sibling
    leftSibling.keys.push(parentKey);
    // Add all keys from current node
    leftSibling.keys.push(...node.keys);

    // Handle children if not leaf nodes
    if (!node.isLeaf) {
      leftSibling.children.push(...node.children);
      node.children.forEach(child => child.father = leftSibling);
    }

    // Remove parent key and current node from parent
    parent.keys.splice(nodeIndex - 1, 1);
    parent.children.splice(nodeIndex, 1);

    animations.push({
      type: 'highlight',
      nodes: [leftSibling, parent],
      message: `Merged with left sibling`
    });

    return leftSibling;
  }

  private mergeWithRightSibling(
    node: BTreeNode,
    animations: BTreeAnimationStep[]
  ): BTreeNode {
    if (!node.father) return node;

    const parent = node.father;
    const nodeIndex = parent.children.indexOf(node);
    if (nodeIndex >= parent.children.length - 1) return node;

    const rightSibling = parent.children[nodeIndex + 1];
    const parentKey = parent.keys[nodeIndex];

    // Move parent key down to current node
    node.keys.push(parentKey);
    // Add all keys from right sibling
    node.keys.push(...rightSibling.keys);

    // Handle children if not leaf nodes
    if (!node.isLeaf) {
      node.children.push(...rightSibling.children);
      rightSibling.children.forEach(child => child.father = node);
    }

    // Remove parent key and right sibling from parent
    parent.keys.splice(nodeIndex, 1);
    parent.children.splice(nodeIndex + 1, 1);

    animations.push({
      type: 'highlight',
      nodes: [node, parent],
      message: `Merged with right sibling`
    });

    return node;
  }

  private getAllNodes(node: BTreeNode): BTreeNode[] {
    const nodes: BTreeNode[] = [node];
    if (!node.isLeaf) {
      node.children.forEach((child: BTreeNode) => {
        if (!this.isNodeNull(child)) {
          nodes.push(...this.getAllNodes(child));
        }
      });
    }
    return nodes;
  }

  clear(): AnimationStep[] {
    const animations: BTreeAnimationStep[] = [];
    
    if (this.root) {
      animations.push({
        type: 'clear',
        nodes: this.getAllNodes(this.root),
        message: 'Clearing entire tree'
      });
      this.root = null;
      this.treeSize = 0;
    }
    
    return this.convertAnimations(animations);
  }

  getTreeData(): TreeData {
    const btreeData = this.getBTreeData();
    
    const convertedNodes = btreeData.nodes.map((node: BTreeNode) => ({
      value: node.keys[0],
      left: null,
      right: null,
      x: node.x,
      y: node.y,
      state: node.state as BSTNode['state']
    }));

    const convertedLinks = btreeData.links.map((link: { source: BTreeNode; target: BTreeNode }) => {
      const sourceIndex = btreeData.nodes.indexOf(link.source);
      const targetIndex = btreeData.nodes.indexOf(link.target);
      return {
        source: convertedNodes[sourceIndex],
        target: convertedNodes[targetIndex]
      };
    });

    return {
      nodes: convertedNodes,
      links: convertedLinks
    };
  }

  clone(): BaseTree {
    const newTree = new BTree(this.order);
    if (this.root) {
      newTree.root = this.cloneNode(this.root);
      newTree.treeSize = this.treeSize;
    }
    return newTree;
  }

  private mergeChildren(
    node: BTreeNode,
    keyIndex: number,
    animations: BTreeAnimationStep[]
  ): void {
    const leftChild = node.children[keyIndex];
    const rightChild = node.children[keyIndex + 1];
    const parentKey = node.keys[keyIndex];

    // First, move all keys from left child to a new array
    const mergedKeys = [...leftChild.keys];
    // Then add the parent key that's coming down
    mergedKeys.push(parentKey);
    // Finally add all keys from right child
    mergedKeys.push(...rightChild.keys);
    
    // Update left child with all merged keys
    leftChild.keys = mergedKeys;

    // Handle children if not leaf nodes
    if (!leftChild.isLeaf) {
      leftChild.children = [
        ...leftChild.children,
        ...rightChild.children
      ];
      rightChild.children.forEach(child => child.father = leftChild);
    }

    // Remove the parent key and right child from parent node
    node.keys.splice(keyIndex, 1);
    node.children.splice(keyIndex + 1, 1);

    animations.push({
      type: 'highlight',
      nodes: [leftChild, rightChild, node],
      message: `Moving parent key ${parentKey} down and merging children`
    });

    // If parent is root and becomes empty, make left child the new root
    if (node === this.root && node.keys.length === 0) {
      this.root = leftChild;
      leftChild.father = null;
      animations.push({
        type: 'highlight',
        nodes: [leftChild],
        message: 'New root after merge'
      });
    }
  }

  private cloneNode(node: BTreeNode): BTreeNode {
    const newNode = this.createNode(node.isLeaf);
    newNode.keys = [...node.keys];
    newNode.x = node.x;
    newNode.y = node.y;
    newNode.state = node.state;

    if (!node.isLeaf) {
      newNode.children = node.children.map(child => 
        this.isNodeNull(child) ? this.nullNode : this.cloneNode(child)
      );
      newNode.children.forEach(child => {
        if (!this.isNodeNull(child)) {
          child.father = newNode;
        }
      });
    }

    return newNode;
  }

  private rebalanceNode(
    node: BTreeNode,
    parent: BTreeNode,
    animations: BTreeAnimationStep[]
  ): void {
    const nodeIndex = parent.children.indexOf(node);
    let balanced = false;

    // Try borrowing from left sibling
    if (nodeIndex > 0) {
      const leftSibling = parent.children[nodeIndex - 1];
      if (leftSibling.keys.length > this.halfNumber) {
        this.borrowFromLeftSibling(node, leftSibling, parent, nodeIndex, animations);
        balanced = true;
      }
    }

    // Try borrowing from right sibling
    if (!balanced && nodeIndex < parent.children.length - 1) {
      const rightSibling = parent.children[nodeIndex + 1];
      if (rightSibling.keys.length > this.halfNumber) {
        this.borrowFromRightSibling(node, rightSibling, parent, nodeIndex, animations);
        balanced = true;
      }
    }

    // If borrowing not possible, merge with a sibling
    if (!balanced) {
      if (nodeIndex > 0) {
        this.mergeWithLeftSibling(node, animations);
      } else {
        this.mergeWithRightSibling(node, animations);
      }
    }
  }

  private handleCascadingMerges(
    node: BTreeNode,
    animations: BTreeAnimationStep[]
  ): void {
    let current = node;
    
    while (current !== this.root && current.keys.length < this.halfNumber) {
      const parent = current.father;
      if (!parent) break;

      const nodeIndex = parent.children.indexOf(current);
      let handled = false;

      // Try borrowing from siblings first
      if (nodeIndex > 0) {
        const leftSibling = parent.children[nodeIndex - 1];
        if (leftSibling.keys.length > this.halfNumber) {
          this.borrowFromLeftSibling(current, leftSibling, parent, nodeIndex, animations);
          handled = true;
          break;
        }
      }

      if (!handled && nodeIndex < parent.children.length - 1) {
        const rightSibling = parent.children[nodeIndex + 1];
        if (rightSibling.keys.length > this.halfNumber) {
          this.borrowFromRightSibling(current, rightSibling, parent, nodeIndex, animations);
          handled = true;
          break;
        }
      }

      // If borrowing not possible, merge and continue upward
      if (!handled) {
        if (nodeIndex > 0) {
          current = this.mergeWithLeftSibling(current, animations);
        } else {
          current = this.mergeWithRightSibling(current, animations);
        }
        current = parent;
      }
    }

    // Handle root becoming empty
    if (this.root && this.root.keys.length === 0) {
      if (this.root.children.length > 0) {
        this.root = this.root.children[0];
        this.root.father = null;
        animations.push({
          type: 'highlight',
          nodes: [this.root],
          message: 'Adjusted root after cascading merges'
        });
      } else {
        this.root = null;
        animations.push({
          type: 'clear',
          nodes: [],
          message: 'Tree is now empty'
        });
      }
    }
  }

  public getBTreeData(): BTreeData {
    const nodes: BTreeNode[] = [];
    const links: { source: BTreeNode; target: BTreeNode }[] = [];

    if (this.root) {
      this.calculateNodePositions(this.root, 0, -500, 500);
      this.collectNodesAndLinks(this.root, nodes, links);
    }

    return { nodes, links };
  }

  private calculateNodePositions(
    node: BTreeNode,
    level: number,
    leftBound: number,
    rightBound: number
  ): void {
    node.x = (leftBound + rightBound) / 2;
    node.y = level * 100;

    if (!node.isLeaf) {
      const width = rightBound - leftBound;
      const childWidth = width / node.children.length;
      node.children.forEach((child, i) => {
        if (!this.isNodeNull(child)) {
          const childLeft = leftBound + i * childWidth;
          this.calculateNodePositions(
            child,
            level + 1,
            childLeft,
            childLeft + childWidth
          );
        }
      });
    }
  }

  private collectNodesAndLinks(
    node: BTreeNode,
    nodes: BTreeNode[],
    links: { source: BTreeNode; target: BTreeNode }[]
  ): void {
    nodes.push(node);
    if (!node.isLeaf) {
      node.children.forEach(child => {
        if (!this.isNodeNull(child)) {
          links.push({ source: node, target: child });
          this.collectNodesAndLinks(child, nodes, links);
        }
      });
    }
  }

  private handleRootDeletion(
    keyIndex: number,
    animations: BTreeAnimationStep[]
  ): boolean {
    if (!this.root) return false;

    const value = this.root.keys[keyIndex];
    
    // If root is a leaf, simple deletion
    if (this.root.isLeaf) {
      this.root.keys.splice(keyIndex, 1);
      this.treeSize--;
      
      if (this.root.keys.length === 0) {
        animations.push({
          type: 'clear',
          nodes: [this.root],
          message: 'Tree is now empty'
        });
        this.root = null;
      }
      return true;
    }

    // First try left subtree's rightmost element
    let predecessor = this.root.children[keyIndex];
    let predecessorParent = this.root;
    
    // Find rightmost element in left subtree
    while (!predecessor.isLeaf) {
      predecessorParent = predecessor;
      predecessor = predecessor.children[predecessor.children.length - 1];
    }

    // Get the rightmost key
    const predKey = predecessor.keys[predecessor.keys.length - 1];
    
    // Replace root's key with predecessor
    const originalValue = this.root.keys[keyIndex];
    this.root.keys[keyIndex] = predKey;
    
    animations.push({
      type: 'highlight',
      nodes: [this.root, predecessor],
      message: `Replaced root key ${originalValue} with predecessor ${predKey}`
    });

    // Remove predecessor key
    predecessor.keys.pop();
    this.treeSize--;

    // If predecessor now violates minimum keys, handle it
    if (predecessor.keys.length < this.halfNumber) {
      // Try borrowing from immediate siblings first
      const predIndex = predecessorParent.children.indexOf(predecessor);
      let borrowed = false;

      // Try left sibling
      if (predIndex > 0) {
        const leftSibling = predecessorParent.children[predIndex - 1];
        if (leftSibling.keys.length > this.halfNumber) {
          this.borrowFromLeftSibling(predecessor, leftSibling, predecessorParent, predIndex, animations);
          borrowed = true;
        }
      }

      // Try right sibling
      if (!borrowed && predIndex < predecessorParent.children.length - 1) {
        const rightSibling = predecessorParent.children[predIndex + 1];
        if (rightSibling.keys.length > this.halfNumber) {
          this.borrowFromRightSibling(predecessor, rightSibling, predecessorParent, predIndex, animations);
          borrowed = true;
        }
      }

      // If borrowing not possible, merge
      if (!borrowed) {
        let currentNode = predecessor;
        if (predIndex > 0) {
          currentNode = this.mergeWithLeftSibling(currentNode, animations);
        } else {
          currentNode = this.mergeWithRightSibling(currentNode, animations);
        }

        // Handle cascading effects
        while (currentNode !== this.root && currentNode.keys.length < this.halfNumber) {
          const parent = currentNode.father!;
          const nodeIndex = parent.children.indexOf(currentNode);
          borrowed = false;

          // Try borrowing at each level
          if (nodeIndex > 0) {
            const leftSibling = parent.children[nodeIndex - 1];
            if (leftSibling.keys.length > this.halfNumber) {
              this.borrowFromLeftSibling(currentNode, leftSibling, parent, nodeIndex, animations);
              borrowed = true;
            }
          }

          if (!borrowed && nodeIndex < parent.children.length - 1) {
            const rightSibling = parent.children[nodeIndex + 1];
            if (rightSibling.keys.length > this.halfNumber) {
              this.borrowFromRightSibling(currentNode, rightSibling, parent, nodeIndex, animations);
              borrowed = true;
            }
          }

          if (!borrowed) {
            if (nodeIndex > 0) {
              currentNode = this.mergeWithLeftSibling(currentNode, animations);
            } else {
              currentNode = this.mergeWithRightSibling(currentNode, animations);
            }
            currentNode = parent;
          } else {
            break;
          }
        }
      }
    }

    return true;
  }
} 