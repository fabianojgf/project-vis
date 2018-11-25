const graficoDespesas = (seletor, despesas) => {
    console.log(despesas);
    let barchart = dc.barChart(seletor);

    let facts = crossfilter(despesas);
    
    let descDim = facts.dimension(d => {
        return d.txtDescricao;
    });

    let descGroup = descDim.group();

    let top = descGroup.top(10);
    let domain_x = top.map(d => d.key);

    let despesasX = d3.scaleOrdinal().domain(domain_x);

    var topTen = getTops(descGroup, 10);

    barchart.width(null)
            .margins({top: 50, right: 50, bottom: 25, left: 60})
            .height(null)
            .gap(65)	
            .group(topTen)
            .dimension(descDim)
            .x(despesasX)
            .xUnits(dc.units.ordinal)
            .transitionDuration(100)
            .brushOn(false)
            .elasticY(true)

    barchart.xAxis().tickFormat(d => { return DespesasDict[d.toUpperCase()].u; });
    barchart.yAxisLabel('Despesa Total (R$)')

    let legendContent = topTen.all().reduce((acc, v) => {
        let text = v.key.toUpperCase();
        let entry = DespesasDict[text];
        let icon = `<i class="fa">${entry.i}</i>` 
        acc += `<div>${icon}<p>${capitalizePhrase(text.toLowerCase())}</p></div>`
        return acc
    }, '');

    $(`#grafico-despesas-legenda`).append(legendContent).css('right', $(document).width()*0.2);
    
    dc.renderAll();
};