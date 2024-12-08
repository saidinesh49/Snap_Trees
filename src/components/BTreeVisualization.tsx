import React, { FC, useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { BTreeData, BTreeNode } from '../types/BTreeTypes';
import { AnimationStep } from '../types';

interface Props {
  data: BTreeData;
  animations: AnimationStep[];
  animationSpeed: number;
  onReset?: () => void;
}

export const BTreeVisualization: FC<Props> = ({ data, animations, animationSpeed, onReset }) => {
  const svgRef = useRef<SVGSVGElement>(null);

  // Add click handler to reset states
  const handleClick = () => {
    if (!svgRef.current) return;
    
    // Call the reset callback to update tree state
    if (onReset) {
      onReset();
    }
  };

  useEffect(() => {
    if (!svgRef.current) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    const g = svg.append('g')
      .attr('transform', 'translate(50,50)');

    // Draw links
    g.selectAll('line')
      .data(data.links)
      .enter()
      .append('line')
      .attr('x1', d => d.source.x)
      .attr('y1', d => d.source.y)
      .attr('x2', d => d.target.x)
      .attr('y2', d => d.target.y)
      .attr('stroke', '#666')
      .attr('stroke-width', 2);

    // Draw nodes
    const nodeGroups = g.selectAll<SVGGElement, BTreeNode>('g.node')
      .data(data.nodes)
      .enter()
      .append('g')
      .attr('class', 'node')
      .attr('transform', d => `translate(${d.x},${d.y})`);

    // Draw node rectangles
    nodeGroups.append('rect')
      .attr('width', d => Math.max(d.keys.length * 40 + 20, 60))
      .attr('height', 30)
      .attr('x', d => -(d.keys.length * 40 + 20) / 2)
      .attr('y', -15)
      .attr('rx', 5)
      .attr('ry', 5)
      .attr('fill', d => {
        switch (d.state) {
          case 'notFound': return '#ffebee';
          case 'path': return '#e8f5e9';
          case 'highlight': return '#e8f5e9';
          default: return '#fff';
        }
      })
      .attr('stroke', d => {
        switch (d.state) {
          case 'notFound': return '#f44336';
          case 'path': return '#4caf50';
          case 'highlight': return '#4caf50';
          default: return '#000';
        }
      })
      .attr('stroke-width', 1);

    // Draw keys with state-based colors
    nodeGroups.each(function(d) {
      const node = d3.select(this);
      const keyWidth = 40;
      const startX = -(d.keys.length * keyWidth) / 2 + keyWidth / 2;
      
      d.keys.forEach((key, i) => {
        node.append('text')
          .attr('x', startX + i * keyWidth)
          .attr('y', 5)
          .attr('text-anchor', 'middle')
          .attr('fill', () => {
            if (d.state === 'notFound') return '#f44336';
            if (d.state === 'found' && d.foundKey === key) return '#4caf50';
            return '#000';
          })
          .attr('font-weight', (d.state === 'found' && d.foundKey === key) ? 'bold' : 'normal')
          .text(key);
      });
    });

  }, [data, animations]);

  return (
    <svg 
      ref={svgRef} 
      width="100%" 
      height="500" 
      viewBox="-500 -50 1000 600"
      style={{ overflow: 'visible', cursor: 'pointer' }}
      onClick={handleClick}
    >
      <defs>
        <marker
          id="arrowhead"
          viewBox="-10 -5 10 10"
          refX="0"
          refY="0"
          markerWidth="6"
          markerHeight="6"
          orient="auto"
        >
          <path d="M-10,-5 L0,0 L-10,5" fill="#666"/>
        </marker>
      </defs>
    </svg>
  );
};
