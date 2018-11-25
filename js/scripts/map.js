let width = 960, height = 600;

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
      .attr("fill", function(d) { return getColor(d.properties.region);})
      .attr("d", path)
    .on("mouseover", function(d){
        d3.select(this)
        .style("cursor", "pointer")
        .attr("stroke-width", 5)
        .attr("stroke","#FFF5B1");
      })
      .on("mouseout", function(d){
        d3.select(this)
        .style("cursor", "default")
        .attr("stroke-width", 1)
        .attr("stroke","#eee");
      });
}



function getColor(stateName){
  var scheme = d3.schemeCategory10;

  console.log(stateName);

  switch(stateName){
    case 'CENTRO-OESTE':
      return scheme[1];
    case 'SUL':
      return scheme[9];
    case 'SUDESTE':
      return scheme[0];
    case 'NORTE':
      return scheme[2];
    case 'NORDESTE':
      return scheme[3];
    default:
      return scheme[7];

  }
}

