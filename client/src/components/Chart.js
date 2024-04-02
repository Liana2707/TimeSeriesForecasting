import * as d3 from "d3";
import React, { useMemo, useState } from 'react';
import { useEffect, useRef } from 'react';


export default function Chart({ date, value, data, columns, trends, containerWidth, onResize }) {
  const [min, setMin] = useState(0)
  const [max, setMax] = useState(0)
  
  const dates = useMemo(() => {
    var indexOfDate = columns.indexOf(date);
    const arr = []
    data.map(elem => {
      if (indexOfDate != -1)
          arr.push(elem[indexOfDate])
    })
    return arr.map(dateString => new Date(dateString).getTime());
  }, [date])

  const values = useMemo(() => {
    var indexOfValue = columns.indexOf(value);
    const arr = []
    data.map(elem => {
      if (indexOfValue!= -1)
          arr.push(elem[indexOfValue])
    })
    setMin(Math.min(...arr))
    setMax(Math.max(...arr))
    return arr
  }, [value])

  const showedTrends = useMemo(() => {
    const TrendCharts = [];
    if (trends && trends.length > 0) {
      trends.forEach(trendArray => {
        const row = Array(values.length).fill(null);

        trendArray.forEach(point => {
          dates.forEach((date, index) => {
            if (date === point.x) {
              row[index] = { date: date, value: point.y };
              setMin(Math.min(...values, point.y));
              setMax(Math.max(...values, point.y));
            }
          });
        });

        TrendCharts.push({
          data: row.filter(d => d !== null),
          color: "red"
        });
      });
    }

    console.log('TrendsCh', TrendCharts);
    return TrendCharts;
  }, [trends, dates, values]);

  const margin = { top: 20, right: 10, bottom: 20, left: 20 }

  const svgRef = useRef(null);

  useEffect(() => {
    if (containerWidth && svgRef.current) {
      const svgNode = d3.select(svgRef.current);
      const allElements = svgNode.selectAll('*');
      allElements.remove();

      const aspectRatio = 0.6;
      const width = containerWidth - 125;
      const height = width * aspectRatio;

      // Set up the x and y scales
      const x = d3.scaleTime().range([0, width]);
      const y = d3.scaleLinear().range([height, 0]);

      // Create the SVG element and append it to the chart container
      const svg = d3.select(svgRef.current)
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);

      // Define the x and y domains

      x.domain(d3.extent(dates, d => d));
      y.domain([min, max]);

      // Add the x-axis

      svg.append("g")
        .attr("transform", `translate(0,${height})`)
        .call(d3.axisBottom(x).ticks(width / 80))
        .call(g => g.select(".domain").remove())
        .call(g => g.selectAll(".tick line").clone()
          .attr("y2", -height)
          .attr("stroke-opacity", 0.1))
        .call(g => g.append("text")
          .attr("x", width - 4)
          .attr("y", -4)
          .attr("font-weight", "bold")
          .attr("text-anchor", "end")
          .attr("fill", "currentColor"))
        .call(d3.axisBottom(x))

      svg.append("g")
        .attr("transform", `translate(${margin.left},0)`)
        .call(d3.axisLeft(y).ticks(null, "$.2f"))
        .call(g => g.select(".domain").remove())
        .call(g => g.selectAll(".tick line").clone()
          .attr("x2", width)
          .attr("stroke-opacity", 0.1))
        .call(g => g.select(".tick:last-of-type text").clone()
          .attr("x", 4)
          .attr("text-anchor", "start")
          .attr("font-weight", "bold"));

      // Add the y-axis
      svg.append("g").call(d3.axisLeft(y))

      // Create the line generator
      const line = d3.line()
        .x(d => x(d.date))
        .y(d => y(d.value));

      // Add the line path to the SVG element
      svg.append("path")
        .datum(dates.map((date, index) => ({ date, value: values[index] })))
        .attr("fill", "none")
        .attr("stroke", "teal")
        .attr("stroke-width", 1)
        .attr("d", line);

      svg.selectAll(".dot")
        .data(dates.map((date, index) => ({ date, value: values[index] })))
        .enter().append("circle")
        .attr("class", "dot")
        .attr("cx", d => x(d.date))
        .attr("cy", d => y(d.value))
        .attr("r", 4)
        .attr("fill", "teal");


      if (showedTrends && showedTrends.length > 0) {
        showedTrends.forEach(trend => {
          const trendLine = d3.line()
            .x(d => x(d.date))
            .y(d => y(d.value));

          svg.append("path")
            .datum(trend.data)
            .attr("fill", "none")
            .attr("stroke", trend.color)
            .attr("stroke-width", 1.5)
            .attr("d", trendLine);
        })
      }
    }
  }, [containerWidth, dates, max, min, trends, showedTrends, values]);

  const handleResize = () => {
    const width = document.querySelector('.chart-container').offsetWidth;
    onResize(width);
  };

  useEffect(() => {
    window.addEventListener('resize', handleResize);
    handleResize();
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return <svg ref={svgRef}/>
}