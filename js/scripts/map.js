const getColor = (regionName) => {
  var scheme = d3.schemeCategory10;

  //console.log(regionName);

  switch(regionName){
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
};

const nameToAbbrv = (stateName) => {
  switch(stateName){
    case "ACRE" : return "AC"; 
    case "ALAGOAS" : return "AL";  
    case "AMAZONAS" : return "AM";  
    case "AMAPÁ" : return "AP";  
    case "BAHIA" : return "BA"; 
    case "CEARÁ" : return "CE"; 
    case "DISTRITO FEDERAL" : return "DF"; 
    case "ESPIRITO SANTO" : return "ES"; 
    case "GOIÁS" : return "GO";  
    case "MARANHÃO" : return "MA";
    case "MINAS GERAIS" : return "MG"; 
    case "MATO GROSSO DO SUL" : return "MS"; 
    case "MATO GROSSO" : return "MT";  
    case "PARÁ" : return "PA"; 
    case "PARAÍBA" : return "PB";  
    case "PERNAMBUCO" : return "PE"; 
    case "PIAUÍ" : return "PI";
    case "PARANÁ" : return "PR"; 
    case "RIO DE JANEIRO" : return "RJ";  
    case "RIO GRANDE DO NORTE" : return "RN";  
    case "RONDÔNIA" : return "RO";  
    case "RORAIMA" : return "RR"; 
    case "RIO GRANDE DO SUL" : return "RS"; 
    case "SANTA CATARINA" : return "SC"; 
    case "SERGIPE" : return "SE"; 
    case "SÃO PAULO" : return "SP"; 
    case "TOCANTINS" : return "TO"; 
  }

  return "desconhecido";
}

const abbrvToName = (stateAbbrv) => {
var data = "desconhecido";

  switch(stateAbbrv){
    case "AC" : data = "Acre";          break;
    case "AL" : data = "Alagoas";       break;
    case "AM" : data = "Amazonas";        break;
    case "AP" : data = "Amapá";         break;
    case "BA" : data = "Bahia";         break;
    case "CE" : data = "Ceará";         break;
    case "DF" : data = "Distrito Federal";    break;
    case "ES" : data = "Espírito Santo";    break;
    case "GO" : data = "Goiás";         break;
    case "MA" : data = "Maranhão";        break;
    case "MG" : data = "Minas Gerais";      break;
    case "MS" : data = "Mato Grosso do Sul";  break;
    case "MT" : data = "Mato Grosso";     break;
    case "PA" : data = "Pará";          break;
    case "PB" : data = "Paraíba";       break;
    case "PE" : data = "Pernambuco";      break;
    case "PI" : data = "Piauí";         break;
    case "PR" : data = "Paraná";        break;
    case "RJ" : data = "Rio de Janeiro";    break;
    case "RN" : data = "Rio Grande do Norte"; break;
    case "RO" : data = "Rondônia";        break;
    case "RR" : data = "Roraima";       break;
    case "RS" : data = "Rio Grande do Sul";   break;
    case "SC" : data = "Santa Catarina";    break;
    case "SE" : data = "Sergipe";       break;
    case "SP" : data = "São Paulo";       break;
    case "TO" : data = "Tocantíns";       break;
  }

  return data.toUpperCase();
}

const estadoCalc = (group, sigla) => { 
    return group.all().filter(function(item) { 
      return item.key === sigla; 
    })[0].value
};

const desenharMapa = (seletor, deputados) => {
  let facts = crossfilter(deputados);

  let estadoDim = facts.dimension(d => {
        return d.siglaUf;
  });

  let estadoGroup = estadoDim.group().reduceCount();

  console.log(estadoCalc(estadoGroup, "CE"));

  let width = 960, height = 600;

  let svg = d3.select(seletor).append("svg")
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
        })
        .append("svg:title")
          .text(function(d) { 
            var fullName = d.properties.name;
            var abbrv = nameToAbbrv(d.properties.name);
            return fullName + "\n" + 
            estadoCalc(estadoGroup, abbrv) + " deputados."; 
          });
  }
};
