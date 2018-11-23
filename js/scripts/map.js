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

    console.log(states);

    svg.append("g")
      .attr("class", "states")
    .selectAll("path")
      .data(states.features)
    .enter().append("path")
      .attr("fill", function() { console.log(1234);})
      .attr("d", path);
}

function getColor(stateName){
  var scheme = d3.schemeCategory10;

  console.log(d);

  switch(stateName){
    case 'CENTRO-OESTE':
      return scheme[1];
    case 'SUL':
      return scheme[2];
    case 'SUDESTE':
      return scheme[3];
    case 'NORTE':
      return scheme[4];
    case 'NORDESTE':
      return scheme[5];
    default:
      return scheme[0];

  }
}

