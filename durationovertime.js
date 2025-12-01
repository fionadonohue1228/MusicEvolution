let width = 600,
    height = 400;

let margin = {
  top: 50,
  bottom: 50,
  left: 50,
  right: 50
};

let svg = d3.select("#chart-container")
            .append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform", `translate(${margin.left},${margin.top})`);

d3.csv("15000_tracks_cleaned.csv").then(function(data) {

    // Convert values
    data.forEach(d => {
        d.year = +d.year;
        d.duration = +d.duration_ms;   // <-- KEEPING MILLISECONDS
    });

    // Keep reasonable years
    data = data.filter(d => d.year >= 1950 && d.year <= 2025);

    // Remove insane outliers (30 sec to 10 min)
    data = data.filter(d => d.duration > 30000 && d.duration < 600000);

    // Sort by year
    data.sort((a, b) => a.year - b.year);

    // ----- SCALES -----
    let yScale = d3.scaleLinear()
        .domain([0, d3.max(data, d => d.duration)])   // ms
        .range([height, 0]);

    let xScale = d3.scaleLinear()
        .domain(d3.extent(data, d => d.year))         // years
        .range([0, width]);

    // ----- AXES -----
    let xAxis = svg.append("g")
        .call(d3.axisBottom(xScale).tickFormat(d3.format("d")))
        .attr("transform", `translate(0, ${height})`);

    let yAxis = svg.append("g")
        .call(d3.axisLeft(yScale));

    // ----- AXIS LABELS -----
    svg.append("text")
        .attr("x", width / 2)
        .attr("y", height + 40)
        .style("text-anchor", "middle")
        .style("font-size", "16px")
        .text("Year");

    svg.append("text")
        .attr("x", -height / 2)
        .attr("y", -40)
        .attr("transform", "rotate(-90)")
        .style("text-anchor", "middle")
        .style("font-size", "16px")
        .text("Duration (ms)");

    // ----- LINE -----
    let line = d3.line()
        .x(d => xScale(d.year))
        .y(d => yScale(d.duration));

    svg.append("path")
        .datum(data)
        .attr("d", line)
        .attr("stroke", "black")
        .attr("stroke-width", 2)
        .attr("fill", "none");

});
