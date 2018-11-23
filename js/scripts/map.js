let width = 960, height = 600;

let quantize = d3.scaleQuantize()
    .range(d3.schemeGreens[9])
    .domain([2,10]);

let svg = d3.select("body").append("svg")
    .attr("width", width)
    .attr("height", height);

let promises = [d3.json("data/br-states.json")];
Promise.all(promises).then(ready);

function ready([br]) {
    var states = topojson.feature(br, br.objects.states);

    var projection = d3.geoIdentity()
        .reflectY(true)
        .fitSize([width,height],states);

    let path = d3.geoPath().projection(projection);

    svg.append("g")
      .attr("class", "states")
    .selectAll("path")
      .data(states.features)
    .enter().append("path")
      .attr("fill", function(d) { return quantize(5); })
      .attr("d", path);
}

