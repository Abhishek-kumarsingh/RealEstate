'use client';

import { useEffect, useRef } from 'react';
import * as d3 from 'd3';

interface DataPoint {
  name: string;
  sales: number;
  rentals: number;
}

interface D3LineChartProps {
  data: DataPoint[];
  width?: number;
  height?: number;
  className?: string;
}

export default function D3LineChart({ 
  data, 
  width = 800, 
  height = 400, 
  className = '' 
}: D3LineChartProps) {
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
    const x = d3.scalePoint()
      .domain(data.map(d => d.name))
      .range([0, innerWidth])
      .padding(0.1);

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
      .call(d3.axisBottom(x))
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
      .call(d3.axisBottom(x)
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

    // Line generator
    const line = d3.line<DataPoint>()
      .x(d => x(d.name) || 0)
      .y(d => y(d.sales))
      .curve(d3.curveMonotoneX);

    const lineRentals = d3.line<DataPoint>()
      .x(d => x(d.name) || 0)
      .y(d => y(d.rentals))
      .curve(d3.curveMonotoneX);

    // Add lines with animation
    const salesPath = g.append('path')
      .datum(data)
      .attr('fill', 'none')
      .attr('stroke', color('sales') as string)
      .attr('stroke-width', 3)
      .attr('d', line);

    const rentalsPath = g.append('path')
      .datum(data)
      .attr('fill', 'none')
      .attr('stroke', color('rentals') as string)
      .attr('stroke-width', 3)
      .attr('d', lineRentals);

    // Animate lines
    const totalLength1 = salesPath.node()?.getTotalLength() || 0;
    const totalLength2 = rentalsPath.node()?.getTotalLength() || 0;

    salesPath
      .attr('stroke-dasharray', totalLength1 + ' ' + totalLength1)
      .attr('stroke-dashoffset', totalLength1)
      .transition()
      .duration(2000)
      .ease(d3.easeLinear)
      .attr('stroke-dashoffset', 0);

    rentalsPath
      .attr('stroke-dasharray', totalLength2 + ' ' + totalLength2)
      .attr('stroke-dashoffset', totalLength2)
      .transition()
      .duration(2000)
      .delay(500)
      .ease(d3.easeLinear)
      .attr('stroke-dashoffset', 0);

    // Add dots for sales
    g.selectAll('.dot-sales')
      .data(data)
      .enter().append('circle')
      .attr('class', 'dot-sales')
      .attr('cx', d => x(d.name) || 0)
      .attr('cy', d => y(d.sales))
      .attr('r', 0)
      .attr('fill', color('sales') as string)
      .style('cursor', 'pointer')
      .on('mouseover', function(event, d) {
        d3.select(this).attr('r', 8);
        
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
            Sales: ${d.sales}
          </div>
        `)
        .style('left', (event.pageX + 10) + 'px')
        .style('top', (event.pageY - 10) + 'px')
        .transition()
        .duration(200)
        .style('opacity', 1);
      })
      .on('mouseout', function() {
        d3.select(this).attr('r', 5);
        d3.selectAll('.tooltip').remove();
      })
      .transition()
      .duration(800)
      .delay((d, i) => i * 100 + 2000)
      .attr('r', 5);

    // Add dots for rentals
    g.selectAll('.dot-rentals')
      .data(data)
      .enter().append('circle')
      .attr('class', 'dot-rentals')
      .attr('cx', d => x(d.name) || 0)
      .attr('cy', d => y(d.rentals))
      .attr('r', 0)
      .attr('fill', color('rentals') as string)
      .style('cursor', 'pointer')
      .on('mouseover', function(event, d) {
        d3.select(this).attr('r', 8);
        
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
            Rentals: ${d.rentals}
          </div>
        `)
        .style('left', (event.pageX + 10) + 'px')
        .style('top', (event.pageY - 10) + 'px')
        .transition()
        .duration(200)
        .style('opacity', 1);
      })
      .on('mouseout', function() {
        d3.select(this).attr('r', 5);
        d3.selectAll('.tooltip').remove();
      })
      .transition()
      .duration(800)
      .delay((d, i) => i * 100 + 2500)
      .attr('r', 5);

    // Add legend
    const legend = g.append('g')
      .attr('class', 'legend')
      .attr('transform', `translate(${innerWidth + 20}, 20)`);

    const legendItems = legend.selectAll('.legend-item')
      .data(['sales', 'rentals'])
      .enter().append('g')
      .attr('class', 'legend-item')
      .attr('transform', (d, i) => `translate(0, ${i * 20})`);

    legendItems.append('circle')
      .attr('cx', 6)
      .attr('cy', 6)
      .attr('r', 6)
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
