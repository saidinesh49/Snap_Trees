import React, { FC, useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { RBNode, RBTreeData } from '../types/RedBlackTypes';
import { AnimationStep } from '../types';

interface Props {
  data: RBTreeData;
  animations: AnimationStep[];
  animationSpeed: number;
  onReset?: () => void;
}

export const RedBlackVisualization: FC<Props> = ({ 
  data, 
  animations, 
  animationSpeed,
  onReset 
}) => {
  const svgRef = useRef<SVGSVGElement>(null);

  const handleClick = () => {
    if (onReset) onReset();
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
    const nodeGroups = g.selectAll<SVGGElement, RBNode>('g.node')
      .data(data.nodes)
      .enter()
      .append('g')
      .attr('class', 'node')
      .attr('transform', d => `translate(${d.x},${d.y})`);

    // Draw node circles with colors based on red-black property
    nodeGroups.append('circle')
      .attr('r', 25)
      .attr('fill', d => {
        switch (d.state) {
          case 'highlight': return '#fff3bf';  // Soft yellow for current node
          case 'compare': return '#d3f9d8';    // Soft green for comparison
          case 'path': return '#e7f5ff';       // Soft blue for path
          case 'success-path': return '#d3f9d8'; // Soft green for success path
          case 'found': return '#51cf66';      // Bright green for found node
          case 'notFound': return '#ffc9c9';   // Soft red for not found
          default: return d.color === 'RED' ? '#ff8787' : '#495057';  // Default RB colors
        }
      })
      .attr('stroke', d => {
        switch (d.state) {
          case 'highlight': return '#ffd43b';   // Yellow border
          case 'compare': return '#40c057';     // Green border
          case 'path': return '#339af0';        // Blue border
          case 'success-path': return '#37b24d'; // Dark green border
          case 'found': return '#2f9e44';       // Darker green border
          case 'notFound': return '#f03e3e';    // Red border
          default: return d.color === 'RED' ? '#fa5252' : '#212529';  // Default borders
        }
      })
      .attr('stroke-width', d => {
        switch (d.state) {
          case 'highlight':
          case 'found':
          case 'compare': return 3;
          default: return 2;
        }
      })
      .style('filter', d => {
        switch (d.state) {
          case 'highlight': return 'url(#glow-yellow)';
          case 'found': return 'url(#glow-green)';
          case 'compare': return 'url(#glow-blue)';
          default: return 'none';
        }
      });

    // Add node values
    nodeGroups.append('text')
      .attr('dy', '0.35em')
      .attr('text-anchor', 'middle')
      .attr('fill', 'white')
      .attr('font-size', '14px')
      .attr('font-weight', 'bold')
      .text(d => d.value);

    // Add hover effects
    nodeGroups
      .on('mouseover', function(event, d) {
        d3.select(this)
          .transition()
          .duration(200)
          .attr('transform', `translate(${d.x},${d.y}) scale(1.1)`);
      })
      .on('mouseout', function(event, d) {
        d3.select(this)
          .transition()
          .duration(200)
          .attr('transform', `translate(${d.x},${d.y}) scale(1)`);
      });

    // Add multiple glow effects
    const defs = svg.append('defs');

    const addGlow = (id: string, color: string) => {
      const filter = defs.append('filter')
        .attr('id', id)
        .attr('height', '130%');

      filter.append('feGaussianBlur')
        .attr('in', 'SourceAlpha')
        .attr('stdDeviation', '3')
        .attr('result', 'blur');

      filter.append('feOffset')
        .attr('in', 'blur')
        .attr('dx', '0')
        .attr('dy', '0')
        .attr('result', 'offsetBlur');

      filter.append('feFlood')
        .attr('flood-color', color)
        .attr('flood-opacity', '0.5')
        .attr('result', 'coloredBlur');

      filter.append('feComposite')
        .attr('in', 'coloredBlur')
        .attr('in2', 'offsetBlur')
        .attr('operator', 'in')
        .attr('result', 'coloredBlur');

      const feMerge = filter.append('feMerge');
      feMerge.append('feMergeNode')
        .attr('in', 'coloredBlur');
      feMerge.append('feMergeNode')
        .attr('in', 'SourceGraphic');
    };

    addGlow('glow-yellow', '#ffd43b');
    addGlow('glow-green', '#40c057');
    addGlow('glow-blue', '#339af0');

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