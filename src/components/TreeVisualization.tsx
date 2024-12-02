import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import styled from 'styled-components';
import { TreeData, BSTNode, AnimationStep } from '../types';

type D3Selection = d3.Selection<SVGGElement, BSTNode, null, undefined>;

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

// Add interface for MessageOverlay props
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

export const TreeVisualization: React.FC<Props> = ({ 
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

  // Update animation processing
  useEffect(() => {
    if (!animations.length) return;
    let timeoutId: NodeJS.Timeout;
    setIsAnimating(true);

    const processAnimation = async (index: number) => {
      if (index >= animations.length) {
        setIsAnimating(false);
        setTimeout(() => {
          resetNodeStates();
        }, 1000);
        return;
      }

      const animation = animations[index];
      setCurrentMessage(animation.message);

      const nodes = d3.select(svgRef.current)
        .selectAll('g.node');

      // Reset all nodes to default state
      nodes.select('circle')
        .transition()
        .duration(animationSpeed / 2)
        .attr('fill', 'url(#nodeGradient)')
        .attr('stroke', '#1c7ed6')
        .attr('stroke-width', 2);

      // Add delay between animations
      await new Promise(resolve => setTimeout(resolve, 300));

      switch (animation.type) {
        case 'highlight':
        case 'compare':
        case 'found':
          animation.nodes.forEach(node => {
            const color = animation.type === 'highlight' ? '#ffd43b' : 
                         animation.type === 'compare' ? '#40c057' : '#37b24d';
            const gradient = animation.type === 'highlight' ? 'highlightGradient' :
                           animation.type === 'compare' ? 'compareGradient' : 'successGradient';
            
            nodes.filter(d => (d as any).value === node.value)
              .select('circle')
              .transition()
              .duration(animationSpeed)
              .attr('fill', `url(#${gradient})`)
              .attr('stroke', color)
              .attr('stroke-width', 3);
          });
          await new Promise(resolve => setTimeout(resolve, animationSpeed));
          break;

        case 'clear':
          if (animation.nodes.length === 0) break;
          
          // Highlight node before removal
          animation.nodes.forEach(node => {
            const nodeSelection = nodes.filter(d => (d as any).value === node.value);
            
            // First highlight the node to be removed
            nodeSelection
              .select('circle')
              .transition()
              .duration(animationSpeed / 2)
              .attr('fill', 'url(#errorGradient)')
              .attr('stroke', '#fa5252')
              .attr('stroke-width', 3);
          });

          await new Promise(resolve => setTimeout(resolve, animationSpeed));

          // Then fade out and remove
          animation.nodes.forEach(node => {
            const nodeSelection = nodes.filter(d => (d as any).value === node.value);
            
            // Fade out and shrink the node
            nodeSelection
              .transition()
              .duration(animationSpeed)
              .style('opacity', 0)
              .attr('transform', function(d) {
                const data = d as BSTNode;
                return `translate(${data.x},${data.y}) scale(0.1)`;
              });

            // Fade out associated links
            d3.select(svgRef.current)
              .selectAll('path.link')
              .filter(d => {
                const link = d as { source: BSTNode; target: BSTNode };
                return link.source.value === node.value || link.target.value === node.value;
              })
              .transition()
              .duration(animationSpeed)
              .style('opacity', 0);
          });

          await new Promise(resolve => setTimeout(resolve, animationSpeed));
          break;
      }

      timeoutId = setTimeout(() => {
        processAnimation(index + 1);
      }, 500); // Add delay between steps
    };

    processAnimation(0);

    return () => {
      if (timeoutId) clearTimeout(timeoutId);
      setIsAnimating(false);
    };
  }, [animations, animationSpeed]);

  // Main visualization effect
  useEffect(() => {
    if (!svgRef.current || !data.nodes.length) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    // Create main group for transformations
    const g = svg.append('g');

    // Add zoom behavior
    const zoom = d3.zoom()
      .scaleExtent([0.5, 2])
      .on('zoom', (event) => {
        g.attr('transform', event.transform);
      });

    svg.call(zoom as any);

    // Calculate tree bounds with padding
    const padding = 80;
    const minX = Math.min(...data.nodes.map(n => n.x)) - padding;
    const maxX = Math.max(...data.nodes.map(n => n.x)) + padding;
    const minY = Math.min(...data.nodes.map(n => n.y)) - padding;
    const maxY = Math.max(...data.nodes.map(n => n.y)) + padding;

    // Calculate scale to fit the tree
    const width = dimensions.width;
    const height = dimensions.height;
    const scale = Math.min(
      width / (maxX - minX || 1),
      height / (maxY - minY || 1)
    ) * 0.9;

    // Center the tree
    const centerX = (minX + maxX) / 2;
    const centerY = (minY + maxY) / 2;

    // Create gradient definitions
    const defs = svg.append('defs');

    // Node gradient
    const nodeGradient = defs.append('linearGradient')
      .attr('id', 'nodeGradient')
      .attr('gradientTransform', 'rotate(45)');

    nodeGradient.append('stop')
      .attr('offset', '0%')
      .attr('stop-color', '#4dabf7');

    nodeGradient.append('stop')
      .attr('offset', '100%')
      .attr('stop-color', '#228be6');

    // Add drop shadow filter
    const filter = defs.append('filter')
      .attr('id', 'drop-shadow')
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

    // Initial transform
    g.attr('transform', `translate(${width/2},${height/2}) scale(${scale}) translate(${-centerX},${-centerY})`);

    // Draw links with curved paths
    g.selectAll('path.link')
      .data(data.links)
      .enter()
      .append('path')
      .attr('class', 'link')
      .attr('d', d => {
        const sourceX = d.source.x;
        const sourceY = d.source.y;
        const targetX = d.target.x;
        const targetY = d.target.y;
        
        // Calculate control points for a smoother curve
        const midY = (sourceY + targetY) / 2;
        
        return `M ${sourceX} ${sourceY}
                C ${sourceX} ${sourceY + 20}
                  ${targetX} ${targetY - 20}
                  ${targetX} ${targetY}`;
      })
      .attr('stroke', '#dee2e6')
      .attr('stroke-width', 2)
      .attr('fill', 'none')
      .attr('opacity', 0)
      .transition()
      .duration(500)
      .attr('opacity', 1);

    // Create node groups with transitions
    const nodeGroups = g.selectAll('g.node')
      .data(data.nodes)
      .enter()
      .append('g')
      .attr('class', 'node')
      .attr('transform', d => `translate(${d.x},${d.y})`)
      .style('opacity', 0)
      .transition()
      .duration(500)
      .style('opacity', 1);

    // Add node circles with gradients and shadows
    nodeGroups.selection()
      .append('circle')
      .attr('r', 25)
      .attr('fill', (d: BSTNode) => {
        if (d.state === 'highlight') return 'url(#highlightGradient)';
        if (d.state === 'compare') return 'url(#compareGradient)';
        if (d.state === 'found') return 'url(#successGradient)';
        if (d.state === 'notFound') return 'url(#errorGradient)';
        return 'url(#nodeGradient)';
      })
      .attr('stroke', (d: BSTNode) => {
        if (d.state === 'highlight') return '#ffd43b';
        if (d.state === 'compare') return '#40c057';
        if (d.state === 'found') return '#37b24d';
        if (d.state === 'notFound') return '#fa5252';
        return '#1c7ed6';
      })
      .attr('stroke-width', (d: BSTNode) => {
        return d.state !== 'default' ? 3 : 2;
      })
      .style('filter', 'url(#drop-shadow)')
      .style('cursor', 'pointer');

    // Add highlight gradient
    const highlightGradient = defs.append('linearGradient')
      .attr('id', 'highlightGradient')
      .attr('gradientTransform', 'rotate(45)');

    highlightGradient.append('stop')
      .attr('offset', '0%')
      .attr('stop-color', '#ffd43b');

    highlightGradient.append('stop')
      .attr('offset', '100%')
      .attr('stop-color', '#fab005');

    // Add node values with better typography
    nodeGroups.selection()
      .append('text')
      .attr('dy', '0.35em')
      .attr('text-anchor', 'middle')
      .attr('fill', 'white')
      .attr('font-size', '14px')
      .attr('font-weight', 'bold')
      .text(d => d.value);

    // Add hover effects
    g.selectAll<SVGGElement, BSTNode>('g.node')
      .on('mouseover', function(event: MouseEvent, d: BSTNode) {
        d3.select(this)
          .transition()
          .duration(200)
          .attr('transform', `translate(${d.x},${d.y}) scale(1.1)`);
      })
      .on('mouseout', function(event: MouseEvent, d: BSTNode) {
        d3.select(this)
          .transition()
          .duration(200)
          .attr('transform', `translate(${d.x},${d.y}) scale(1)`);
      });

    // Add additional gradients for different states
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

    addGradient('compareGradient', ['#69db7c', '#40c057']);
    addGradient('successGradient', ['#51cf66', '#37b24d']);
    addGradient('errorGradient', ['#ff6b6b', '#fa5252']);

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