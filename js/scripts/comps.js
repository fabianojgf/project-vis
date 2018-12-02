const desenharComps = (seletor, comparacoes) => {

    let facts = crossfilter(comparacoes);
    let nomeDim = facts.dimension(d => {return d.nome});
    let nomeGroup = nomeDim.group().reduceSum(d => {return d.valor});

    var valoresExtent = d3.extent(nomeGroup.all(), d => {return d.value});
    var valoresMin = valoresExtent[0];
    var valoresMax = valoresExtent[1];

    let rowChart = dc.rowChart(seletor);

    rowChart
      .width(600)
      .height(960)
      .x(d3.scaleLinear().domain([0,valoresMax]))
      .elasticX(true)
      .dimension(nomeDim)
      .group(nomeGroup)
      .render();




    
};
