import * as d3 from "d3";
import React, { useMemo, useState, useEffect, useRef } from 'react';

export default function Chart({
  date,
  value,
  data,
  columns,
  trends,
  trendChanges,
  containerWidth,
  onResize,
  intervals
}) {
  const [min, setMin] = useState(0)
  const [max, setMax] = useState(0)

  const dates = useMemo(() => {
    var indexOfDate = columns.indexOf(date);
    const arr = []
    data.forEach(elem => {
      if (indexOfDate !== -1)
        arr.push(elem[indexOfDate])
    })
    return arr.map(dateString => new Date(dateString).getTime());
  }, [date])

  const values = useMemo(() => {
    var indexOfValue = columns.indexOf(value);
    const arr = []
    data.forEach(elem => {
      if (indexOfValue !== -1)
        arr.push(elem[indexOfValue])
    })
    setMin(Math.min(...arr))
    setMax(Math.max(...arr))
    return arr
  }, [value])

  const showedTrends = useMemo(() => {
    const TrendCharts = [];
    if (trends && trends.length > 0) {
      trends.forEach((trendArray, trendIndex) => {
        const row = Array(values.length).fill(null);

        trendArray.forEach((point, pointIndex) => {
          dates.forEach((date, index) => {
            if (date === point.x) {
              row[index] = {
                date: date,
                value: point.y,
              };
              if (intervals && intervals.length > 0) {
                row[index] = {
                  ...row[index],
                  confidenseLower: intervals[0] && intervals[0][trendIndex] && intervals[0][trendIndex][pointIndex] ? intervals[0][trendIndex][pointIndex].y : [],
                  confidenseUpper: intervals[1] && intervals[1][trendIndex] && intervals[1][trendIndex][pointIndex] ? intervals[1][trendIndex][pointIndex].y : [],
                };
              }
              setMin(Math.min(...values, point.y,
                intervals[0] && intervals[0][trendIndex] && intervals[0][trendIndex][pointIndex] ? intervals[0][trendIndex][pointIndex].y : point.y,
                intervals[1] && intervals[1][trendIndex] && intervals[1][trendIndex][pointIndex] ? intervals[1][trendIndex][pointIndex].y : point.y,
              ));
              setMax(Math.max(...values, point.y,
                intervals[0] && intervals[0][trendIndex] && intervals[0][trendIndex][pointIndex] ? intervals[0][trendIndex][pointIndex].y : point.y,
                intervals[1] && intervals[1][trendIndex] && intervals[1][trendIndex][pointIndex] ? intervals[1][trendIndex][pointIndex].y : point.y,
              ));
            }
          });
        });

        TrendCharts.push({
          data: row.filter(d => d !== null),
          trendColor: "red",
          confidenseIntervalColor: "rgba(198, 45, 205, 0.8)"
        })
      });
    }
    return TrendCharts;
  }, [trends, dates, values, intervals]);

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
        .attr("width", width + margin.left * 5 + margin.right * 2)
        .attr("height", height + margin.top + margin.bottom * 2)
        .append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);

      // Define the x and y domains

      x.domain(d3.extent(dates, d => d));
      y.domain([min, max]);

      // Add the x-axis

      var xAxis = svg.append("g")
        .attr("transform", `translate(0,${height})`)
        .attr("class", "x-axis")
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
        .append("text")
        .attr("class", "axis-label")
        .attr("x", width / 2)
        .attr("y", margin.bottom + 15) // Расположение текста под осью
        .attr("fill", "black")
        .text(date);

      // Add the y-axis
      var yAxis = svg.append("g").call(d3.axisLeft(y))
        .append("text")
        .attr("class", "axis-label")
        .attr("transform", "rotate(-90)")
        .attr("x", 0)
        .attr("y", margin.left) // Расположение текста слева от оси
        .attr("fill", "black")
        .text(value);


      var clip = svg.append("defs").append("svg:clipPath")
        .attr("id", "clip")
        .append("svg:rect")
        .attr("width", width)
        .attr("height", height)
        .attr("x", 0)
        .attr("y", 0);

      // Create brush for zooming
      var brush = d3.brushX()
        .extent([[0, 0], [width, height]])
        .on("end", updateChart)

      // Create the line generator
      const lineContainer = svg.append("g")
        .attr("clip-path", "url(#clip)");

      const line = d3.line()
        .x(d => x(d.date))
        .y(d => y(d.value));

      if (intervals && intervals.length > 0) {
        var confidenseArea = d3.area()
          .x(d => x(d.date))
          .y0(d => y(d.confidenseLower))
          .y1(d => y(d.confidenseUpper));
      }


      // Add the line path to the lineContainer element
      lineContainer.append("path")
        .datum(dates.map((date, index) => ({ date, value: values[index] })))
        .attr("fill", "none")
        .attr("class", "line")
        .attr("stroke", "teal")
        .attr("stroke-width", 1)
        .attr("d", line);

      lineContainer.selectAll(".dot")
        .data(dates.map((date, index) => ({ date, value: values[index] })))
        .enter().append("circle")
        .attr("class", "dot")
        .attr("cx", d => x(d.date))
        .attr("cy", d => y(d.value))
        .attr("r", 4)
        .attr("fill", "teal");

      lineContainer.append("g")
        .attr("class", "brush")
        .call(brush);


      if (showedTrends && showedTrends.length > 0) {
        showedTrends.forEach(trend => {
          const trendLine = d3.line()
            .x(d => x(d.date))
            .y(d => y(d.value));

          lineContainer.append("path")
            .datum(trend.data)
            .attr("class", "trend-line")
            .attr("fill", "none")
            .attr("stroke", trend.trendColor)
            .attr("stroke-width", 1.5)
            .attr("d", trendLine);

          if (intervals && intervals.length > 0) {
            svg.append("path")
              .datum(trend.data)
              .attr("class", "confidense-area")
              .attr("fill", trend.confidenseIntervalColor)
              .attr("fill-opacity", 0.5)
              .attr("d", confidenseArea);
          }
        })

        if (trendChanges && trendChanges.length > 0) {
          trendChanges.forEach(change => {
            const changeY = y(y.domain()[0]);

            lineContainer.append("line")
              .attr("class", "trend-change-line")
              .attr("x1", x(change))
              .attr("y1", changeY)
              .attr("x2", x(change))
              .attr("y2", y(y.domain()[1]))
              .attr("stroke", "blue")
              .attr("stroke-width", 3)
              .attr("stroke-dasharray", "5,5");
          });
        }
      }

      svg.on("dblclick", function () {
        // Возвращение графика к исходным данным
        x.domain(d3.extent(dates, d => d));
        xAxis.transition().call(d3.axisBottom(x));
        lineContainer
          .select('.line')
          .datum(dates.map((date, index) => ({ date, value: values[index] })))
          .transition()
          .attr("d", line);
      });

      var idleTimeout
      function idled() { idleTimeout = null; }

      function updateChart() {
        const extent = d3.event.selection;

        if (!extent) {
          if (!idleTimeout) return idleTimeout = setTimeout(idled, 350);
          x.domain(d3.extent(dates, d => d));
        } else {
          x.domain([x.invert(extent[0]), x.invert(extent[1])]);
          lineContainer
            .select(".brush")
            .call(brush.move, null);
        }
        svg.select(".x-axis").remove();

        // Создаем новую ось с обновленным масштабом
        xAxis = svg.append("g")
          .attr("transform", `translate(0,${height})`)
          .attr("class", "x-axis")
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
            .attr("fill", "currentColor"));

        xAxis
          .transition()
          .duration(1000)
          .call(d3.axisBottom(x))

        lineContainer
          .select('.line')
          .transition()
          .duration(1000)
          .attr("d", line)

        lineContainer.selectAll('.dot')
          .transition()
          .duration(1000)
          .attr("cx", d => x(d.date));

        svg.selectAll('.trend-line')
          .transition()
          .duration(1000)
          .attr("d", line);

        svg.selectAll('.confidense-area')
          .transition()
          .duration(1000)
          .attr("d", confidenseArea);

        if (trendChanges && trendChanges.length > 0) {
          const trendChangeLines = svg.selectAll(".trend-change-line")
            .data(trendChanges);

          trendChangeLines.exit().remove();

          trendChangeLines.enter()
            .append("line")
            .attr("class", "trend-change-line")
            .merge(trendChangeLines)
            .attr("x1", d => x(d))
            .attr("y1", y(y.domain()[0]))
            .attr("x2", d => x(d))
            .attr("y2", y(y.domain()[1]))
            .attr("stroke", "blue")
            .attr("stroke-width", 3)
            .attr("stroke-dasharray", "5,5");
        }
      }
    }
  }, [containerWidth, dates, max, min, trends, showedTrends, values, trendChanges]);

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

  return <svg ref={svgRef} />
}