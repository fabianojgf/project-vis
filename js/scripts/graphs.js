const graficoDespesas = (seletor, despesas) => {
    console.log(despesas);
    let barchart = dc.barChart(seletor);

    let facts = crossfilter(despesas);
    
    let descDim = facts.dimension(d => {
        return d.txtDescricao;
    });

    let descGroup = descDim.group();

    console.log(descGroup.all());

    let domain_x = descGroup.all().map(d => d.key).slice(0,9);

    let despesasX = d3.scaleOrdinal().domain(domain_x);

    barchart.width(840)
                    .height(480)
                    .gap(65)	
                    .group(descGroup)
                    .dimension(descDim)
                    .x(despesasX)
                    .xUnits(dc.units.ordinal)
                    .brushOn(false)
                    .elasticY(true);

    barchart.xAxis().tickFormat(d => { return d.toUpperCase() });

    dc.renderAll();

};