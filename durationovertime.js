let 
  width = 600,
  height = 400;

let margin = {
  top:50,
  bottom:50,
  left:50,
  right:50
}

let svg = d3.select("#chart-container")
            .append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform", `translate(${margin.left},${margin.top})`);

d3.csv("15000_tracks_cleaned.csv").then(function(data) {

    data.forEach(d => {
        d.year = +d.year;
        d.duration = +d.duration_ms / 1000;
    });

    data = data.filter(d => d.year >= 1950 && d.year <= 2025);

    data = data.filter(d => d.duration > 30 && d.duration < 600);

let yScale = d3.scaleLinear()
    .domain([0, d3.max(data, d => d.duration)])  
    .range([height, 0]);                         

let xScale = d3.scaleLinear()
    .domain(d3.extent(data, d => d.year))
    .range([0, width]);

let xAxis = svg.append('g')
    .call(d3.axisBottom(xScale).tickFormat(d3.format("d")))
    .attr('transform', `translate(0, ${height})`);

let yAxis = svg.append('g')
    .call(d3.axisLeft(yScale));

    svg.append('text')
        .attr('x', width / 2)
        .attr('y', height + 35)
        .text('Year')
        .style('text-anchor', 'middle')
        .style('font-size', '16px');

    svg.append('text')
        .attr('x', -height / 2)
        .attr('y', -50)
        .attr('transform', 'rotate(-90)')
        .text('Duration (seconds)')
        .style('text-anchor', 'middle')
        .style('font-size', '16px');

    let line = d3.line()
                 .x(d => xScale(d.year))
                 .y(d => yScale(d.duration))
                 .curve(d3.curveLinear);

    svg.append("path")
       .datum(data)
       .attr("d", line)
       .attr("stroke", "black")
       .attr("stroke-width", 2)
       .attr("fill", "none");
});
