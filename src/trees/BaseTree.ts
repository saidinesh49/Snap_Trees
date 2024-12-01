import { BaseNode, TreeData, AnimationStep } from '../types';

export abstract class BaseTree<T extends BaseNode> {
  protected root: T | null = null;

  abstract insert(value: number): AnimationStep[];
  abstract delete(value: number): AnimationStep[];
  abstract search(value: number): AnimationStep[];
  abstract clone(): BaseTree<T>;

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

  public getTreeData(): TreeData {
    const nodes: BaseNode[] = [];
    const links: { source: BaseNode; target: BaseNode }[] = [];
    
    const traverse = (node: T | null, level: number = 0, position: number = 0) => {
      if (!node) return;

      // Calculate x and y coordinates for visualization
      node.x = position * 100;
      node.y = level * 100;
      nodes.push(node);

      // Add links based on tree type
      this.addLinks(node, links);
    };

    traverse(this.root);
    return { nodes, links };
  }

  protected abstract addLinks(node: T, links: TreeData['links']): void;
} 