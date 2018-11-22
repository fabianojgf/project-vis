let width = 960;
let height = 600;

let brazilMap = d3.map();
let greens = d3.schemeGreens[9];
let color = d3.scaleQuantize().domain([2, 10]).range(greens);

let path = d3.geoPath();

let svg = d3.select("body")
    .append("svg")
    .attr("width", width)
    .attr("height", height);

let promises = [
  d3.json("data/br-states.json")
]

Promise.all(promises).then(ready);

function ready([br]) { 
    console.log("entrou");

    svg.append("g")
        .attr("class", "states")
        .selectAll("path")
        .data(topojson.feature(br, br.objects.states).features)
        .enter()
        .append("path")
        .attr("fill", function(d) { return color(5); })
        .attr("d", path);
}

