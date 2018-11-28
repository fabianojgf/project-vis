//===================================================
//AUX FUNCS
const getMapColor = (minValue, maxValue, currentValue) => {
  var redLinear = d3.scaleSequential(d3.interpolateReds).domain([minValue, maxValue]);
  return redLinear(currentValue);
};

const estadoCalc = (group, sigla) => { 
    return group.all().filter(function(item) { 
      return item.key === sigla; 
    })[0].value
};

const switchName = (textValue) => {
  switch(textValue){
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
    case "AC" : return "Acre";
    case "AL" : return "Alagoas";   
    case "AM" : return "Amazonas";     
    case "AP" : return "Amapá";    
    case "BA" : return "Bahia";     
    case "CE" : return "Ceará";   
    case "DF" : return "Distrito Federal"; 
    case "ES" : return "Espírito Santo"; 
    case "GO" : return "Goiás";     
    case "MA" : return "Maranhão";  
    case "MG" : return "Minas Gerais";   
    case "MS" : return "Mato Grosso do Sul";  
    case "MT" : return "Mato Grosso"; 
    case "PA" : return "Pará";      
    case "PB" : return "Paraíba";   
    case "PE" : return "Pernambuco";
    case "PI" : return "Piauí";   
    case "PR" : return "Paraná";       
    case "RJ" : return "Rio de Janeiro";   
    case "RN" : return "Rio Grande do Norte";
    case "RO" : return "Rondônia";    
    case "RR" : return "Roraima"; 
    case "RS" : return "Rio Grande do Sul"; 
    case "SC" : return "Santa Catarina";  
    case "SE" : return "Sergipe"; 
    case "SP" : return "São Paulo";
    case "TO" : return "Tocantíns";  
  }

  return "?";
}

//===================================================
//DRAW STUFF 

const desenharMapa = (seletor, deputados, despesas) => {
  //número de deputados =================
  let facts = crossfilter(deputados);
  let estadoDim = facts.dimension(d => {
        return d.siglaUf;
  });
  let estadoGroup = estadoDim.group().reduceCount();

  //despesas por Estado =================
  let facts2 = crossfilter(despesas);
  let despesasDim = facts2.dimension(d => {
        var sgUF = d.sgUF;
        var vlrDocumento = d.vlrDocumento;
        var numeroValor = parseFloat(vlrDocumento.replace(",", "."));

        return JSON.stringify ({sigla: sgUF, valor: numeroValor});
  });
  let despesasGroup = despesasDim.group();

  despesasGroup.all().forEach(d => {
    var sigla = JSON.parse(d.key).sigla;
    var valor = JSON.parse(d.key).valor;

    d.key = sigla;
    d.value = valor;
  });

  facts2 = crossfilter(despesasGroup.all());
  despesasDim = facts2.dimension(d => {
        return d.key;
  });
  despesasGroup = despesasDim.group();

  var despesasExtent = d3.extent(despesasGroup.all(), d => {return d.value});
  var despesasMin = despesasExtent[0];
  var despesasMax = despesasExtent[1];

  //geografia do mapa ====================
  let width = 960, height = 600;

  let svg = d3.select(seletor).append("svg")
    .attr("width", width)
    .attr("height", height);

  let promises = [d3.json("data/br-states.json")];
  Promise.all(promises).then(ready).then(legenda);

  function ready([br]) {
      var states = topojson.feature(br, br.objects.states);

      var projection = d3.geoIdentity()
          .reflectY(true)
          .fitSize([width,height],states);

      let path = d3.geoPath().projection(projection);

      //desenho do mapa
      svg.append("g")
        .attr("class", "states")
      .selectAll("path")
        .data(states.features)
      .enter().append("path")
        .attr("fill", function(d) { 
          var regionName = d.properties.name;
          var regionAbbrv = switchName(regionName);
          var regionValue = estadoCalc(despesasGroup, regionAbbrv);
          var finalColor = getMapColor(despesasMin, despesasMax, regionValue);
          return finalColor;
        })
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
            var abbrv = switchName(d.properties.name);
            return fullName + ":\n" +
            estadoCalc(estadoGroup, abbrv) + " deputados gastaram cerca de \n" + 
            "R$ " + estadoCalc(despesasGroup, abbrv) + " no exercício da função"; 
          });

      
  }

  function legenda(){
    console.log("entrou");
  }
};
