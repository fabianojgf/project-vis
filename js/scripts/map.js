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

const desenharMapa = (seletor, deputados, despesas, states) => {
  //número de deputados =================
  let facts = crossfilter(deputados);
  let estadoDim = facts.dimension(d => {
        return d.siglaUf;
  });
  let estadoGroup = estadoDim.group().reduceCount();

  //despesas por Estado =================
  let facts2 = crossfilter(despesas);
  let despesasDim = facts2.dimension(d => {return d.sgUF;});
  let despesasGroup = despesasDim.group().reduceSum(d => {return parseFloat(d.vlrDocumento)});

  var despesasExtent = d3.extent(despesasGroup.all(), d => {return d.value});
  var despesasMin = despesasExtent[0];
  var despesasMax = despesasExtent[1];

  //geografia do mapa ====================
  let width = 960, height = 600, heightLegenda = height/10;

  let svg = d3.select(seletor).append("svg")
    .attr("width", width)
    .attr("height", height);

  var projection = d3.geoIdentity()
      .reflectY(true)
      .fitSize([width,height],states);

  let path = d3.geoPath().projection(projection);

  //desenho do mapa ====================
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
    .on("click", (d) => {
      filtrarPorEstado(switchName(d.properties.name), 
                       deputados, 
                       despesas);
    })
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
        "R$ " + estadoCalc(despesasGroup, abbrv) + " no exercício da função. \n" +
        "Proporcionalmente, temos que: \n" + 
        "Um deputado gastou R$ " + (Math.round(estadoCalc(despesasGroup, abbrv)/estadoCalc(estadoGroup, abbrv))) + "."; 
      });

    //desenho da legenda ====================
    var key = d3.select("#mapa-legenda")
                .append("svg")
                .attr("width", width)
                .attr("height", heightLegenda);

    var legend = key.append("defs")
                    .append("svg:linearGradient")
                    .attr("id", "gradient")
                    .attr("x1", "0%")
                    .attr("y1", "100%")
                    .attr("x2", "100%")
                    .attr("y2", "100%")
                    .attr("spreadMethod", "pad");

      for(i = 0; i <= 10; i++) {
        var value = despesasMin + (despesasMax - despesasMin) * i/10;
        legend.append("stop")
        .attr("offset", i*10  + "%")
        .attr("stop-color", getMapColor(despesasMin, despesasMax, value))
        .attr("stop-opacity", 1);
      }

    key.append("rect")
       .attr("width", width)
       .attr("height", heightLegenda - 30)
       .style("fill", "url(#gradient)");

    var y = d3.scaleLinear().range([0, width-1]).domain([despesasMin, despesasMax]);
    var yAxis = d3.axisBottom().scale(y).ticks(10);

    key.append("g")
       .attr("class", "y axis")
       .attr("transform", "translate(0,30)")
       .call(yAxis)
       .append("text")
       .attr("transform", "rotate(-90)")
       .attr("y", 0)
       .attr("dy", ".71em")
       .style("text-anchor", "end")
       .text("axis title");
};
