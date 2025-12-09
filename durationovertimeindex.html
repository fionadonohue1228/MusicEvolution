let width = 800,
    height = 500;

let margin = {
  top: 50,
  bottom: 50,
  left: 80,
  right: 50
};

let svg = d3.select('body')
    .append("svg")
    .attr("width", width)
    .attr("height", height)
    .append("g")
    .attr("transform",
        "translate(" + margin.left + "," + margin.top + ")");



d3.csv("15000_tracks_cleaned.csv").then(function(data) {

    data.forEach(d => {
        d.year = +d.year;
        d.duration = +d.duration_ms / 1000;
    });

    data.sort((a, b) => a.year - b.year);


    let year = data.map(d => d.year);

    let x = d3.scaleLinear()
        .range([0, width])
        .domain([0, 600]);

    svg.append("g")
        .attr("transform", "translate(0," + (height - 80) + ")")   
        .call(
            d3.axisBottom(x)
                .ticks(10)
                .tickFormat(d => Math.round(d) + "s")
        );

  
    let y = d3.scaleBand()
        .range([height - 80, 0])  
        .domain(year)
        .padding(0.01);

    svg.append("g")
        .call(
            d3.axisLeft(y)
                .tickValues(year.filter(d => d % 10 === 0))  
        );


svg.selectAll("rect")
    .data(data)
    .enter()
    .append("rect")
    .attr("x", d => x(d.duration))    
    .attr("y", d => y(d.year))        
    .attr("width", 8)                 
    .attr("height", 8)
    .attr("fill", "#ED9E01")
    .attr("opacity", 0.07);  



d3.select("#decade").on("change", function() {

  let decade = this.value;

  if (decade === "all") {
    svg.selectAll("rect")
      .attr("opacity", 0.07);  
    return;
  }

  let start = +decade;
  let end = start + 9;

  svg.selectAll("rect")
    .attr("opacity", d =>
      d.year >= start && d.year <= end ? 0.9 : 0.05
    );
});


svg.append("text")
    .attr("x", width / 2)
    .attr("y", height - 55)   
    .style("text-anchor", "middle")
    .style("font-size", "16px")
    .text("Duration in Seconds");


svg.append("text")
    .attr("x", -height / 2)
    .attr("y", -40)   
    .attr("transform", "rotate(-90)")
    .style("text-anchor", "middle")
    .style("font-size", "16px")
    .text("Decade");


});
