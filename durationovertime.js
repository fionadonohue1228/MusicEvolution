let width = 800,
    height = 500;

let margin = {
  top: 50,
  bottom: 80,   
  left: 80,
  right: 80
};

let svg = d3.select("body")
  .append("svg")
  .attr("width", width + margin.right + 40)
  .attr("height", height + margin.bottom)
  .append("g")
  .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

d3.csv("15000_tracks_cleaned.csv").then(function(data) {

  data.forEach(d => {
    d.year = +d.year;
    d.duration = +d.duration_ms / 1000;
  });

  let genres = [
    "acoustic", 
    "afrobeat", 
    "ambient", 
    "bluegrass", 
    "chicago-house",
    "children",
    "club",
    "comedy"
  ];

  data = data.filter(d => genres.includes(d.track_genre));

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

  let colorScale = d3.scaleOrdinal()
    .domain(genres)
    .range([
      "#FFCA8E",
      "#40EDC8",
      "#F77B87",
      "#F7941D",
      "#662D91",
      "#FF9DF4",
      "#FDFF94",
      "#9BDEFF"
    ]);

  svg.selectAll(".dot")
    .data(data)
    .enter()
    .append("rect")
    .attr("class", "dot")
    .attr("x", d => x(d.duration))
    .attr("y", d => y(d.year))
    .attr("width", 8)
    .attr("height", 8)
    .attr("fill", "#ED9E01")
    .attr("opacity", 0.07);


let legendSvg = d3.select("#legend");

legendSvg.append("text")
  .attr("x", 0)
  .attr("y", 12)
  .style("font-size", "14px")
  .style("font-weight", "bold")
  .text("Features");

let legendItems = legendSvg.selectAll(".legend-item")
  .data(genres)
  .enter()
  .append("g")
  .attr("class", "legend-item")
  .attr("transform", (d, i) => {
    let row = Math.floor(i / 4);
    let col = i % 4;

    let y;
    if (row === 0) {
        y = 0;      
    } else {
        y = 18;    
    }

    return `translate(${60 + col * 120}, ${y})`;
});

legendItems.append("rect")
  .attr("width", 12)
  .attr("height", 12)
  .attr("fill", d => colorScale(d));

legendItems.append("text")
  .attr("x", 16)
  .attr("y", 10)
  .style("font-size", "10px")
  .text(d => d);



  d3.select("#decade").on("change", function () {

    let decade = this.value;

    if (decade === "all") {
      svg.selectAll(".dot")
        .attr("opacity", 0.07)
        .attr("fill", "#ED9E01");

      return;
    }

    let start = decade * 1;
    let end = start + 9;

    svg.selectAll(".dot")
      .attr("opacity", function(d) {
        if (d.year >= start && d.year <= end) {
          return 0.9;
        } else {
          return 0.05;
        }
      })
      .attr("fill", function(d) {
        if (d.year >= start && d.year <= end) {
          return colorScale(d.track_genre);
        } else {
          return "#ED9E01";
        }
      });

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
