import React, { useEffect, useRef, useState, useCallback } from 'react';
import * as d3 from 'd3';
import styled from 'styled-components';
import { TreeData, BaseNode, AnimationStep } from '../types';

const SVGContainer = styled.div`
  width: 100%;
  height: 100%;
  background: #f8f9fa;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  overflow: hidden;
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  flex: 1;
  min-height: 400px;
`;

interface TreeVisualizationProps {
  treeData: TreeData;
  animations: AnimationStep[];
  animationSpeed: number;
}

export const TreeVisualization: React.FC<TreeVisualizationProps> = ({
  treeData,
  animations,
  animationSpeed,
}) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  useEffect(() => {
    if (!containerRef.current) return;

    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const { width, height } = entry.contentRect;
        setDimensions({ width, height });
      }
    });

    resizeObserver.observe(containerRef.current);
    return () => resizeObserver.disconnect();
  }, []);

  const calculateTreeDimensions = useCallback(() => {
    const nodeCount = treeData.nodes.length;
    if (nodeCount === 0) return { width: 0, height: 0, centerX: 0, centerY: 0 };

    const minX = Math.min(...treeData.nodes.map(node => node.x || 0));
    const maxX = Math.max(...treeData.nodes.map(node => node.x || 0));
    const minY = Math.min(...treeData.nodes.map(node => node.y || 0));
    const maxY = Math.max(...treeData.nodes.map(node => node.y || 0));
    
    const width = maxX - minX;
    const height = maxY - minY;
    const centerX = (maxX + minX) / 2;
    const centerY = (maxY + minY) / 2;

    const padding = Math.max(width, height) * 0.2;
    
    return {
      width: width + padding * 2,
      height: height + padding * 2,
      centerX,
      centerY
    };
  }, [treeData]);

  const centerTree = useCallback(() => {
    if (!svgRef.current || !containerRef.current) return;

    const treeDimensions = calculateTreeDimensions();
    const { width: containerWidth, height: containerHeight } = dimensions;

    const scale = Math.min(
      containerWidth / (treeDimensions.width || 1),
      containerHeight / (treeDimensions.height || 1),
      1
    ) * 0.9;

    const translateX = containerWidth / 2;
    const translateY = containerHeight / 2;

    const g = d3.select(svgRef.current).select('g');
    
    g.transition()
      .duration(750)
      .attr('transform', `translate(${translateX},${translateY}) scale(${scale}) translate(${-treeDimensions.centerX},${-treeDimensions.centerY})`);
  }, [calculateTreeDimensions, dimensions]);

  useEffect(() => {
    if (!svgRef.current || dimensions.width === 0) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    addGradientDef(svg, 'rootGradient', ['#ff6b6b', '#ee5253']);
    addGradientDef(svg, 'nodeGradient', ['#54a0ff', '#2e86de']);
    addGradientDef(svg, 'highlightGradient', ['#ffd32a', '#ffa801']);
    addShadowDef(svg);

    const g = svg.append('g');

    const links = g.selectAll('path.link')
      .data(treeData.links)
      .enter()
      .append('path')
      .attr('class', 'link')
      .attr('d', d3.linkHorizontal<any, any>()
        .x(d => d.x)
        .y(d => d.y))
      .attr('fill', 'none')
      .attr('stroke', '#999')
      .attr('stroke-width', 2)
      .style('opacity', 0)
      .transition()
      .duration(750)
      .style('opacity', 1);

    const nodes = g.selectAll('g.node')
      .data(treeData.nodes)
      .enter()
      .append('g')
      .attr('class', 'node')
      .attr('transform', d => `translate(${d.x},${d.y})`)
      .style('opacity', 0)
      .transition()
      .duration(750)
      .style('opacity', 1);

    nodes.selection().append('circle')
      .attr('r', d => d.parent ? 25 : 35)
      .attr('fill', d => d.parent ? 'url(#nodeGradient)' : 'url(#rootGradient)')
      .attr('stroke', d => d.parent ? '#2e86de' : '#ee5253')
      .attr('stroke-width', d => d.parent ? 2 : 3)
      .style('filter', 'url(#dropShadow)');

    nodes.selection().append('text')
      .attr('dy', '.35em')
      .attr('text-anchor', 'middle')
      .attr('fill', '#fff')
      .style('font-size', d => d.parent ? '14px' : '16px')
      .style('font-weight', 'bold')
      .text(d => d.value);

    if (animations.length > 0) {
      processAnimations(g, animations);
    }

    centerTree();

    const resizeObserver = new ResizeObserver(() => {
      centerTree();
    });

    if (containerRef.current) {
      resizeObserver.observe(containerRef.current);
    }

    return () => {
      resizeObserver.disconnect();
    };
  }, [treeData, animations, centerTree, dimensions, animationSpeed]);

  const processAnimations = (
    g: d3.Selection<SVGGElement, unknown, null, undefined>,
    animations: AnimationStep[]
  ) => {
    let delay = 0;
    animations.forEach((animation) => {
      const duration = animation.duration * (animationSpeed / 500);
      
      animation.nodes.forEach(node => {
        const nodeElement = g.selectAll('.node')
          .filter((d: any) => d.value === node.value);
        
        switch (animation.type) {
          case 'HIGHLIGHT':
            highlightNode(nodeElement, delay, duration);
            break;
          case 'COLOR_CHANGE':
            changeNodeColor(nodeElement, delay, duration, node.value === treeData.nodes[0].value);
            break;
          case 'MOVE':
            moveNode(nodeElement, node, delay, duration);
            updateConnectedLinks(g, node, delay, duration);
            break;
        }
      });
      
      delay += duration;
    });
  };

  const highlightNode = (
    nodeElement: d3.Selection<any, any, any, any>,
    delay: number,
    duration: number
  ) => {
    nodeElement.select('circle')
      .transition()
      .delay(delay)
      .duration(duration * 0.5)
      .attr('fill', 'url(#highlightGradient)')
      .attr('stroke', '#ffa801')
      .attr('stroke-width', 3)
      .transition()
      .duration(duration * 0.5)
      .attr('fill', d => (d as any).parent ? 'url(#nodeGradient)' : 'url(#rootGradient)')
      .attr('stroke', d => (d as any).parent ? '#2e86de' : '#ee5253')
      .attr('stroke-width', d => (d as any).parent ? 2 : 3);
  };

  const changeNodeColor = (
    nodeElement: d3.Selection<any, any, any, any>,
    delay: number,
    duration: number,
    isRoot: boolean
  ) => {
    const successGradient: [string, string] = ['#2ecc71', '#27ae60'];
    const failureGradient: [string, string] = ['#e74c3c', '#c0392b'];

    addGradientDef(d3.select(svgRef.current!), 'successGradient', successGradient);
    addGradientDef(d3.select(svgRef.current!), 'failureGradient', failureGradient);

    nodeElement.select('circle')
      .transition()
      .delay(delay)
      .duration(duration)
      .attr('fill', 'url(#successGradient)')
      .attr('stroke', '#27ae60')
      .attr('stroke-width', 3)
      .transition()
      .duration(duration)
      .attr('fill', d => (d as any).parent ? 'url(#nodeGradient)' : 'url(#rootGradient)')
      .attr('stroke', d => (d as any).parent ? '#2e86de' : '#ee5253')
      .attr('stroke-width', d => (d as any).parent ? 2 : 3);

    nodeElement.select('circle')
      .transition()
      .delay(delay)
      .duration(duration / 4)
      .attr('r', d => ((d as any).parent ? 30 : 40))
      .transition()
      .duration(duration / 4)
      .attr('r', d => ((d as any).parent ? 25 : 35));
  };

  const moveNode = (
    nodeElement: d3.Selection<any, any, any, any>,
    node: BaseNode,
    delay: number,
    duration: number
  ) => {
    nodeElement
      .transition()
      .delay(delay)
      .duration(duration)
      .attr('transform', `translate(${node.x},${node.y})`);
  };

  const updateConnectedLinks = (
    g: d3.Selection<SVGGElement, unknown, null, undefined>,
    node: BaseNode,
    delay: number,
    duration: number
  ) => {
    g.selectAll('path.link')
      .filter(function(d: any) {
        return d.source.value === node.value || d.target.value === node.value;
      })
      .transition()
      .delay(delay)
      .duration(duration)
      .attr('d', d3.linkHorizontal<any, any>()
        .x(d => d.x)
        .y(d => d.y));
  };

  return (
    <SVGContainer ref={containerRef}>
      <svg 
        ref={svgRef} 
        width="100%" 
        height="100%"
        style={{ overflow: 'visible' }}
      />
    </SVGContainer>
  );
};

function addGradientDef(
  svg: d3.Selection<SVGSVGElement, unknown, null, undefined>,
  id: string,
  colors: [string, string]
) {
  const gradient = svg.append('defs')
    .append('linearGradient')
    .attr('id', id)
    .attr('x1', '0%')
    .attr('y1', '0%')
    .attr('x2', '0%')
    .attr('y2', '100%');

  gradient.append('stop')
    .attr('offset', '0%')
    .attr('stop-color', colors[0]);

  gradient.append('stop')
    .attr('offset', '100%')
    .attr('stop-color', colors[1]);
}

function addShadowDef(svg: d3.Selection<SVGSVGElement, unknown, null, undefined>) {
  const defs = svg.append('defs');
  const filter = defs.append('filter')
    .attr('id', 'dropShadow')
    .attr('height', '130%');

  filter.append('feGaussianBlur')
    .attr('in', 'SourceAlpha')
    .attr('stdDeviation', 3)
    .attr('result', 'blur');

  filter.append('feOffset')
    .attr('in', 'blur')
    .attr('dx', 2)
    .attr('dy', 2)
    .attr('result', 'offsetBlur');

  const feMerge = filter.append('feMerge');
  feMerge.append('feMergeNode')
    .attr('in', 'offsetBlur');
  feMerge.append('feMergeNode')
    .attr('in', 'SourceGraphic');
} 