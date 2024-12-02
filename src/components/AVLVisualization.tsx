import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import styled from 'styled-components';
import { TreeData, BSTNode, AnimationStep } from '../types';
import { Selection, BaseType } from 'd3';

// Reuse the same styled components from TreeVisualization
const Container = styled.div`
  width: 100%;
  height: 100%;
  background: #f8f9fa;
  border-radius: 12px;
  overflow: hidden;
  position: relative;
`;

const SVGContainer = styled.svg`
  width: 100%;
  height: 100%;
`;

interface MessageOverlayProps {
  visible: boolean;
}

const MessageOverlay = styled.div<MessageOverlayProps>`
  position: absolute;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  background: rgba(0, 0, 0, 0.8);
  color: white;
  padding: 12px 24px;
  border-radius: 8px;
  font-size: 16px;
  pointer-events: none;
  transition: opacity 0.3s;
  display: ${({ visible }: MessageOverlayProps) => visible ? 'block' : 'none'};
  opacity: ${({ visible }: MessageOverlayProps) => visible ? 1 : 0};
`;

interface Props {
  data: TreeData;
  animations: AnimationStep[];
  animationSpeed?: number;
}

interface NodeDatum extends BSTNode {
  x: number;
  y: number;
}

interface LinkDatum {
  source: NodeDatum;
  target: NodeDatum;
}

export const AVLVisualization: React.FC<Props> = ({ 
  data, 
  animations, 
  animationSpeed = 1000 
}) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const [currentMessage, setCurrentMessage] = useState<string>('');
  const [isAnimating, setIsAnimating] = useState(false);

  // Handle container resizing
  useEffect(() => {
    if (!containerRef.current) return;

    const resizeObserver = new ResizeObserver(entries => {
      const { width, height } = entries[0].contentRect;
      setDimensions({ width, height });
    });

    resizeObserver.observe(containerRef.current);
    return () => resizeObserver.disconnect();
  }, []);

  // Add reset handler
  const resetNodeStates = () => {
    if (!svgRef.current || isAnimating) return;

    const nodes = d3.select(svgRef.current)
      .selectAll('g.node');

    nodes.select('circle')
      .transition()
      .duration(300)
      .attr('fill', 'url(#nodeGradient)')
      .attr('stroke', '#1c7ed6')
      .attr('stroke-width', 2);

    setCurrentMessage('');
  };

  // Add click handler to container
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleClick = () => resetNodeStates();
    container.addEventListener('click', handleClick);

    return () => {
      container.removeEventListener('click', handleClick);
    };
  }, [isAnimating]);

  // Add drag behavior
  const drag = d3.drag<SVGGElement, BSTNode>()
    .on('start', (event, d) => {
      if (isAnimating) return;
      d3.select(event.sourceEvent.target.parentNode)
        .raise()
        .attr('cursor', 'grabbing');
    })
    .on('drag', (event, d) => {
      if (isAnimating) return;

      const node = d3.select(event.sourceEvent.target.parentNode);
      node.attr('transform', `translate(${event.x},${event.y})`);
      d.x = event.x;
      d.y = event.y;

      // Update links in real-time
      d3.select(svgRef.current)
        .selectAll('path.link')
        .attr('d', (l: any) => {
          return `M ${l.source.x} ${l.source.y}
                  C ${l.source.x} ${(l.source.y + l.target.y) / 2},
                    ${l.target.x} ${(l.source.y + l.target.y) / 2},
                    ${l.target.x} ${l.target.y}`;
        });
    })
    .on('end', (event, d) => {
      if (isAnimating) return;
      d3.select(event.sourceEvent.target.parentNode)
        .attr('cursor', 'grab');
    });

  // Animation processing
  useEffect(() => {
    if (!animations.length) return;
    let timeoutId: NodeJS.Timeout;
    setIsAnimating(true);

    const processAnimation = async (index: number) => {
      if (index >= animations.length) {
        setIsAnimating(false);
        return;
      }

      const animation = animations[index];
      const nodes = d3.select(svgRef.current).selectAll('g.node');

      setCurrentMessage(animation.message);

      switch (animation.type) {
        case 'highlight':
          animation.nodes.forEach(node => {
            nodes.filter(d => (d as any).value === node.value)
              .select('circle')
              .transition()
              .duration(animationSpeed)
              .attr('fill', 'url(#highlightGradient)')
              .attr('stroke', '#ffd43b')
              .attr('stroke-width', 3);
          });
          break;

        case 'clear':
          // First highlight the node being removed
          animation.nodes.forEach(node => {
            const nodeElement = nodes.filter(d => (d as any).value === node.value);
            
            // Highlight in red first
            nodeElement.select('circle')
              .transition()
              .duration(animationSpeed / 2)
              .attr('fill', 'url(#errorGradient)')
              .attr('stroke', '#fa5252')
              .attr('stroke-width', 3);

            // Then fade out
            nodeElement
              .transition()
              .delay(animationSpeed / 2)
              .duration(animationSpeed / 2)
              .style('opacity', 0)
              .remove();

            // Handle links
            const links = d3.select(svgRef.current)
              .selectAll('path.link')
              .filter(d => {
                const link = d as any;
                return link.source.value === node.value || link.target.value === node.value;
              });

            // Highlight links before removing
            links
              .transition()
              .duration(animationSpeed / 2)
              .attr('stroke', '#fa5252')
              .attr('stroke-width', 2)
              .transition()
              .delay(animationSpeed / 2)
              .duration(animationSpeed / 2)
              .style('opacity', 0)
              .remove();
          });
          break;

        case 'rotate':
          animation.nodes.forEach(node => {
            // Highlight nodes involved in rotation
            nodes.filter(d => (d as NodeDatum).value === node.value)
              .select('circle')
              .transition()
              .duration(animationSpeed / 2)
              .attr('fill', 'url(#rotateGradient)')
              .attr('stroke', '#ff922b')
              .attr('stroke-width', 3);
          });

          // Update positions smoothly with proper typing
          nodes.transition()
            .duration(animationSpeed)
            .attr('transform', function(this: BaseType, d: unknown) {
              const node = d as NodeDatum;
              return `translate(${node.x},${node.y})`;
            });

          // Update links smoothly with proper typing
          d3.select(svgRef.current)
            .selectAll<SVGPathElement, LinkDatum>('path.link')
            .transition()
            .duration(animationSpeed)
            .attr('d', function(this: BaseType, d: LinkDatum) {
              return `M ${d.source.x} ${d.source.y}
                      C ${d.source.x} ${(d.source.y + d.target.y) / 2},
                        ${d.target.x} ${(d.source.y + d.target.y) / 2},
                        ${d.target.x} ${d.target.y}`;
            });
          break;

        case 'found':
          animation.nodes.forEach(node => {
            nodes.filter(d => (d as any).value === node.value)
              .select('circle')
              .transition()
              .duration(animationSpeed)
              .attr('fill', 'url(#successGradient)')
              .attr('stroke', '#37b24d')
              .attr('stroke-width', 3);
          });
          break;

        case 'notFound':
          // Simply turn all nodes red
          nodes.select('circle')
            .transition()
            .duration(animationSpeed)
            .attr('fill', 'url(#errorGradient)')
            .attr('stroke', '#fa5252')
            .attr('stroke-width', 3);
          break;

        // ... other animation cases ...
      }

      await new Promise(resolve => setTimeout(resolve, animationSpeed));
      timeoutId = setTimeout(() => processAnimation(index + 1), 500);
    };

    processAnimation(0);

    return () => {
      if (timeoutId) clearTimeout(timeoutId);
      setIsAnimating(false);
    };
  }, [animations, animationSpeed]);

  // Main visualization
  useEffect(() => {
    if (!svgRef.current || !data.nodes.length) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    // Add gradients
    const defs = svg.append('defs');
    const addGradient = (id: string, colors: [string, string]) => {
      const gradient = defs.append('linearGradient')
        .attr('id', id)
        .attr('gradientTransform', 'rotate(45)');

      gradient.append('stop')
        .attr('offset', '0%')
        .attr('stop-color', colors[0]);

      gradient.append('stop')
        .attr('offset', '100%')
        .attr('stop-color', colors[1]);
    };

    addGradient('nodeGradient', ['#4dabf7', '#339af0']);
    addGradient('highlightGradient', ['#ffd43b', '#fab005']);
    addGradient('successGradient', ['#51cf66', '#37b24d']);
    addGradient('errorGradient', ['#ff6b6b', '#fa5252']);

    const g = svg.append('g')
      .attr('transform', `translate(${dimensions.width / 2},50)`);

    // Draw links
    g.selectAll('path.link')
      .data(data.links)
      .enter()
      .append('path')
      .attr('class', 'link')
      .attr('fill', 'none')
      .attr('stroke', '#dee2e6')
      .attr('d', d => `
        M ${d.source.x} ${d.source.y}
        C ${d.source.x} ${(d.source.y + d.target.y) / 2},
          ${d.target.x} ${(d.source.y + d.target.y) / 2},
          ${d.target.x} ${d.target.y}
      `);

    // Draw nodes with drag behavior
    const nodeGroups = g.selectAll('g.node')
      .data(data.nodes)
      .enter()
      .append('g')
      .attr('class', 'node')
      .attr('transform', d => `translate(${d.x},${d.y})`)
      .attr('cursor', 'grab')
      .call(drag as any);

    nodeGroups.append('circle')
      .attr('r', 25)
      .attr('fill', 'url(#nodeGradient)')
      .attr('stroke', '#1c7ed6')
      .attr('stroke-width', 2);

    nodeGroups.append('text')
      .attr('dy', '0.35em')
      .attr('text-anchor', 'middle')
      .attr('fill', 'white')
      .attr('font-size', '14px')
      .attr('font-weight', 'bold')
      .text(d => d.value);

    // Add balance factor display
    nodeGroups.append('text')
      .attr('dy', '-1.5em')
      .attr('text-anchor', 'middle')
      .attr('fill', '#666')
      .attr('font-size', '12px')
      .text((d: BSTNode) => 'balanceFactor' in d ? `BF: ${(d as any).balanceFactor}` : '');

  }, [data, dimensions]);

  return (
    <Container ref={containerRef}>
      <SVGContainer
        ref={svgRef}
        width={dimensions.width}
        height={dimensions.height}
      />
      <MessageOverlay visible={!!currentMessage}>
        {currentMessage}
      </MessageOverlay>
    </Container>
  );
}; 