let width = 1000,
    height = 600;

let margin = {
  top: 50,
  bottom: 50,
  left: 80,
  right: 50
};

let svg = d3.select("body")
    .append("svg")
    .attr("width", width)
    .attr("height", height)


d3.csv("15000_tracks_cleaned.csv").then(function(data) {

    data.forEach(d => {
        d.year = +d.year;
        d.duration = +d.duration_ms / 1000;
    });

    data.sort((a, b) => a.year - b.year);

  let yScale = d3.scaleLinear()
    .domain([2020, 1950])  
    .range([margin.top, height - margin.bottom]);

    let xScale = d3.scaleLinear()
        .domain([0, d3.max(data, d => d.duration)])
        .range([margin.left, width - margin.right]); 

    
   let xAxis = svg.append("g")
    .attr("transform", `translate(0, ${height - margin.bottom})`)
    .call(d3.axisBottom(xScale));

   let yAxis = svg.append("g")
    .attr("transform", `translate(${margin.left}, 0)`)
    .call(
        d3.axisLeft(yScale)
          .tickFormat(d3.format("d"))
          .tickValues(d3.range(1950, 2025, 5))  
    );


    let circle = svg.selectAll("circle")
        .data(data)
        .enter()
        .append("circle")
        .attr("r", 3)               
        .attr("cx", d => xScale(d.duration))
        .attr("cy", d => yScale(d.year))
        .attr("fill", "red")
        .attr("opacity", 0.3);   

   svg.append("text")
    .attr("x", width / 2)
    .attr("y", height - 5)          
    .style("text-anchor", "middle")
    .style("font-size", "16px")
    .text("Duration (seconds)");

svg.append("text")
    .attr("x", -height / 2)
    .attr("y", 20)                 
    .attr("transform", "rotate(-90)")
    .style("text-anchor", "middle")
    .style("font-size", "16px")
    .text("Year");
});

