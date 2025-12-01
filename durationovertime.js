let width = 600,
    height = 400;

let margin = {
  top: 50,
  bottom: 50,
  left: 80,
  right: 50
};

let svg = d3.select("#chart-container")
            .append("svg")
            .attr("width", width)
            .attr("height", height)
            .style("background", "lightyellow");

d3.csv("15000_tracks_cleaned.csv").then(function(data) {

    data.forEach(d => {
        d.year = +d.year;
        d.duration = +d.duration / 1000;  
    });

    // Filter valid values
    data = data.filter(d => d.year >= 1950 && d.year <= 2025);
    data = data.filter(d => d.duration > 30 && d.duration < 600);

    let yScale = d3.scaleLinear()
                   .domain(d3.extent(data, d => d.year))
                   .range([height - margin.bottom, margin.top]);

    let xScale = d3.scaleLinear()
                   .domain([0, d3.max(data, d => d.duration)])
                   .range([margin.left, width - margin.right]);

    let xAxis = svg.append("g")
        .call(d3.axisBottom(xScale))
        .attr("transform", `translate(0, ${height - margin.bottom})`);

    let yAxis = svg.append("g")
        .call(d3.axisLeft(yScale).tickFormat(d3.format("d")))
        .attr("transform", `translate(${margin.left}, 0)`);

    svg.selectAll("circle")
        .data(data)
        .enter()
        .append("circle")
        .attr("r", 3)
        .attr("cx", d => xScale(d.duration))
        .attr("cy", d => yScale(d.year))
        .attr("fill", "black")
        .attr("opacity", 0.4);

    svg.append("text")
        .attr("x", width / 2)
        .attr("y", height - 10)
        .style("text-anchor", "middle")
        .style("font-size", "16px")
        .text("Duration (seconds)");

    svg.append("text")
        .attr("x", -height / 2)
        .attr("y", 25)
        .attr("transform", "rotate(-90)")
        .style("text-anchor", "middle")
        .style("font-size", "16px")
        .text("Year");
});


