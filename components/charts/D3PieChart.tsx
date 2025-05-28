'use client';

import { useEffect, useRef } from 'react';
import * as d3 from 'd3';

interface DataPoint {
  name: string;
  value: number;
}

interface D3PieChartProps {
  data: DataPoint[];
  width?: number;
  height?: number;
  className?: string;
}

export default function D3PieChart({
  data,
  width = 400,
  height = 400,
  className = ''
}: D3PieChartProps) {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!svgRef.current || !data.length) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove(); // Clear previous render

    const margin = 40;
    const radius = Math.min(width, height) / 2 - margin;

    const g = svg
      .append('g')
      .attr('transform', `translate(${width / 2},${height / 2})`);

    // Color scale
    const color = d3.scaleOrdinal()
      .domain(data.map(d => d.name))
      .range(['hsl(var(--chart-1))', 'hsl(var(--chart-2))', 'hsl(var(--chart-3))', 'hsl(var(--chart-4))']);

    // Pie generator
    const pie = d3.pie<DataPoint>()
      .value(d => d.value)
      .sort(null);

    // Arc generator
    const arc = d3.arc<d3.PieArcDatum<DataPoint>>()
      .innerRadius(0)
      .outerRadius(radius);

    const arcHover = d3.arc<d3.PieArcDatum<DataPoint>>()
      .innerRadius(0)
      .outerRadius(radius + 10);

    // Create pie slices
    const arcs = g.selectAll('.arc')
      .data(pie(data))
      .enter().append('g')
      .attr('class', 'arc');

    // Add paths
    arcs.append('path')
      .attr('d', arc)
      .attr('fill', d => color(d.data.name) as string)
      .style('cursor', 'pointer')
      .style('stroke', 'hsl(var(--background))')
      .style('stroke-width', '2px')
      .on('mouseover', function(event, d) {
        d3.select(this)
          .transition()
          .duration(200)
          .attr('d', arcHover(d) || '');

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

        const percentage = ((d.data.value / d3.sum(data, d => d.value)) * 100).toFixed(1);

        tooltip.html(`
          <div style="color: hsl(var(--foreground))">
            <strong>${d.data.name}</strong><br/>
            Value: ${d.data.value}<br/>
            Percentage: ${percentage}%
          </div>
        `)
        .style('left', (event.pageX + 10) + 'px')
        .style('top', (event.pageY - 10) + 'px')
        .transition()
        .duration(200)
        .style('opacity', 1);
      })
      .on('mouseout', function(event, d) {
        d3.select(this)
          .transition()
          .duration(200)
          .attr('d', arc(d) || '');
        d3.selectAll('.tooltip').remove();
      })
      .each(function(d) {
        (this as any)._current = d;
      });

    // Animate pie slices
    arcs.select('path')
      .transition()
      .duration(1000)
      .delay((d, i) => i * 100)
      .attrTween('d', function(d) {
        const interpolate = d3.interpolate({ startAngle: 0, endAngle: 0 }, d);
        return function(t) {
          return arc(interpolate(t)) || '';
        };
      });

    // Add labels
    const labelArc = d3.arc<d3.PieArcDatum<DataPoint>>()
      .innerRadius(radius * 0.6)
      .outerRadius(radius * 0.6);

    arcs.append('text')
      .attr('transform', d => `translate(${labelArc.centroid(d)})`)
      .attr('dy', '0.35em')
      .style('text-anchor', 'middle')
      .style('font-size', '12px')
      .style('font-weight', 'bold')
      .style('fill', 'hsl(var(--background))')
      .style('opacity', 0)
      .text(d => {
        const percentage = ((d.data.value / d3.sum(data, d => d.value)) * 100);
        return percentage > 5 ? `${percentage.toFixed(0)}%` : '';
      })
      .transition()
      .duration(1000)
      .delay((d, i) => i * 100 + 500)
      .style('opacity', 1);

    // Add legend
    const legend = svg.append('g')
      .attr('class', 'legend')
      .attr('transform', `translate(${width - 120}, 20)`);

    const legendItems = legend.selectAll('.legend-item')
      .data(data)
      .enter().append('g')
      .attr('class', 'legend-item')
      .attr('transform', (d, i) => `translate(0, ${i * 25})`);

    legendItems.append('rect')
      .attr('width', 15)
      .attr('height', 15)
      .attr('fill', d => color(d.name) as string)
      .attr('rx', 2);

    legendItems.append('text')
      .attr('x', 20)
      .attr('y', 7.5)
      .attr('dy', '0.35em')
      .style('font-size', '12px')
      .style('fill', 'hsl(var(--foreground))')
      .text(d => d.name);

    legendItems.append('text')
      .attr('x', 20)
      .attr('y', 7.5)
      .attr('dy', '1.2em')
      .style('font-size', '10px')
      .style('fill', 'hsl(var(--muted-foreground))')
      .text(d => `${d.value} units`);

  }, [data, width, height]);

  return (
    <div className={`w-full flex justify-center ${className}`}>
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
