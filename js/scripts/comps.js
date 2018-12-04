const desenharComps = (seletor, comparacoes) => {
    let facts = crossfilter(comparacoes);
    let nomeDim = facts.dimension(d => {return d.nome});
    let nomeGroup = nomeDim.group().reduceSum(d => {return d.valor});

    var valoresExtent = d3.extent(nomeGroup.all(), d => {return d.value});
    var valoresMin = valoresExtent[0];
    var valoresMax = valoresExtent[1];

    let colorScale = d3.scaleLinear().domain([1, comparacoes.length])
    .interpolate(d3.interpolateHcl)
    .range([d3.rgb('#eeeeee'), d3.rgb('#eeeeee')]);
    let sorted_comp = comparacoes.sort((a,b) => {return b.valor - a.valor});

    let rowChart = dc.rowChart(seletor);

    rowChart.width(null)
            .height(520)
            .x(d3.scaleLinear().domain([0,valoresMax]))
            .margins({top: 0, right: 25, bottom: 25, left: 0})
            .colors(colorScale)
            .colorAccessor(d => {
              return 0;
            })
            .elasticX(true)
            .dimension(nomeDim)
            .group(nomeGroup)
            .render();
    
    rowChart.filter = function() {};

    d3.select(seletor).selectAll('.row._1 rect').attr('fill', '#ff8a65');
    d3.select(seletor).selectAll('.row._2 rect').attr('fill', '#ff8a65');
};
