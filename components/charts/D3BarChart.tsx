'use client';

import { useEffect, useRef } from 'react';
import * as d3 from 'd3';

interface DataPoint {
  name: string;
  sales: number;
  rentals: number;
}

interface D3BarChartProps {
  data: DataPoint[];
  width?: number;
  height?: number;
  className?: string;
}

export default function D3BarChart({ 
  data, 
  width = 800, 
  height = 400, 
  className = '' 
}: D3BarChartProps) {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!svgRef.current || !data.length) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove(); // Clear previous render

    const margin = { top: 20, right: 80, bottom: 40, left: 60 };
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    const g = svg
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    // Scales
    const x0 = d3.scaleBand()
      .domain(data.map(d => d.name))
      .range([0, innerWidth])
      .paddingInner(0.1);

    const x1 = d3.scaleBand()
      .domain(['sales', 'rentals'])
      .range([0, x0.bandwidth()])
      .padding(0.05);

    const y = d3.scaleLinear()
      .domain([0, d3.max(data, d => Math.max(d.sales, d.rentals)) || 0])
      .nice()
      .range([innerHeight, 0]);

    const color = d3.scaleOrdinal()
      .domain(['sales', 'rentals'])
      .range(['hsl(var(--chart-1))', 'hsl(var(--chart-2))']);

    // Add X axis
    g.append('g')
      .attr('transform', `translate(0,${innerHeight})`)
      .call(d3.axisBottom(x0))
      .selectAll('text')
      .style('font-size', '12px')
      .style('fill', 'hsl(var(--foreground))');

    // Add Y axis
    g.append('g')
      .call(d3.axisLeft(y))
      .selectAll('text')
      .style('font-size', '12px')
      .style('fill', 'hsl(var(--foreground))');

    // Add grid lines
    g.append('g')
      .attr('class', 'grid')
      .attr('transform', `translate(0,${innerHeight})`)
      .call(d3.axisBottom(x0)
        .tickSize(-innerHeight)
        .tickFormat(() => '')
      )
      .style('stroke-dasharray', '3,3')
      .style('opacity', 0.3);

    g.append('g')
      .attr('class', 'grid')
      .call(d3.axisLeft(y)
        .tickSize(-innerWidth)
        .tickFormat(() => '')
      )
      .style('stroke-dasharray', '3,3')
      .style('opacity', 0.3);

    // Add bars
    const groups = g.selectAll('.group')
      .data(data)
      .enter().append('g')
      .attr('class', 'group')
      .attr('transform', d => `translate(${x0(d.name)},0)`);

    groups.selectAll('.bar')
      .data(d => [
        { key: 'sales', value: d.sales, name: d.name },
        { key: 'rentals', value: d.rentals, name: d.name }
      ])
      .enter().append('rect')
      .attr('class', 'bar')
      .attr('x', d => x1(d.key) || 0)
      .attr('y', innerHeight)
      .attr('width', x1.bandwidth())
      .attr('height', 0)
      .attr('fill', d => color(d.key) as string)
      .style('cursor', 'pointer')
      .on('mouseover', function(event, d) {
        d3.select(this).style('opacity', 0.8);
        
        // Tooltip
        const tooltip = d3.select('body').append('div')
          .attr('class', 'tooltip')
          .style('position', 'absolute')
          .style('background', 'hsl(var(--background))')
          .style('border', '1px solid hsl(var(--border))')
          .style('border-radius', '6px')
          .style('padding', '8px')
          .style('font-size', '12px')
          .style('box-shadow', '0 4px 6px -1px rgb(0 0 0 / 0.1)')
          .style('z-index', '1000')
          .style('opacity', 0);

        tooltip.html(`
          <div style="color: hsl(var(--foreground))">
            <strong>${d.name}</strong><br/>
            ${d.key.charAt(0).toUpperCase() + d.key.slice(1)}: ${d.value}
          </div>
        `)
        .style('left', (event.pageX + 10) + 'px')
        .style('top', (event.pageY - 10) + 'px')
        .transition()
        .duration(200)
        .style('opacity', 1);
      })
      .on('mouseout', function() {
        d3.select(this).style('opacity', 1);
        d3.selectAll('.tooltip').remove();
      })
      .transition()
      .duration(800)
      .delay((d, i) => i * 100)
      .attr('y', d => y(d.value))
      .attr('height', d => innerHeight - y(d.value));

    // Add legend
    const legend = g.append('g')
      .attr('class', 'legend')
      .attr('transform', `translate(${innerWidth + 20}, 20)`);

    const legendItems = legend.selectAll('.legend-item')
      .data(['sales', 'rentals'])
      .enter().append('g')
      .attr('class', 'legend-item')
      .attr('transform', (d, i) => `translate(0, ${i * 20})`);

    legendItems.append('rect')
      .attr('width', 12)
      .attr('height', 12)
      .attr('fill', d => color(d) as string);

    legendItems.append('text')
      .attr('x', 18)
      .attr('y', 6)
      .attr('dy', '0.35em')
      .style('font-size', '12px')
      .style('fill', 'hsl(var(--foreground))')
      .text(d => d.charAt(0).toUpperCase() + d.slice(1));

  }, [data, width, height]);

  return (
    <div className={`w-full ${className}`}>
      <svg
        ref={svgRef}
        width={width}
        height={height}
        className="w-full h-auto"
        style={{ maxWidth: '100%', height: 'auto' }}
      />
    </div>
  );
}
