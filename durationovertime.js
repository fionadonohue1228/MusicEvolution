let width = 1000,
    height = 600;

let margin = {
  top: 50,
  bottom: 50,
  left: 80,
  right: 50
};

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

    data = data.filter(d => !isNaN(d.year) && d.year > 0);

    data = data.filter(d => d.year >= 1960 && d.year <= 2020);

    let yScale = d3.scaleLinear()
                   .domain(d3.extent(data, d => d.year))
                   .range([height, 0]);

    let xScale = d3.scaleLinear()
                   .domain([0, d3.max(data, d => d.duration)])
                   .range([0, width]);

    svg.append("g")
        .attr("transform", `translate(0, ${height})`)
        .call(d3.axisBottom(xScale));

    svg.append("g")
        .call(d3.axisLeft(yScale).tickFormat(d3.format("d")));

    svg.selectAll("circle")
        .data(data)
        .enter()
        .append("circle")
        .attr("r", 5)
        .attr("cx", d => xScale(d.duration))
        .attr("cy", d => yScale(d.year))
        .attr("fill", "red")
        .attr("opacity", 1);

    svg.append("text")
        .attr("x", width / 2)
        .attr("y", height + 40)
        .style("text-anchor", "middle")
        .style("font-size", "16px")
        .text("Duration (seconds)");

    svg.append("text")
        .attr("x", -height / 2)
        .attr("y", -50)
        .attr("transform", "rotate(-90)")
        .style("text-anchor", "middle")
        .style("font-size", "16px")
        .text("Year");
});
