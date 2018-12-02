const graficoDespesas = (despesas) => {
    let barchart = dc.barChart(seletores.graficoDespesas.main);

    let facts = crossfilter(despesas);
    
    let descDim = facts.dimension(d => {
        return d.txtDescricao;
    });

    let descGroup = descDim.group().reduceSum(d => {
        return parseFloat(d.vlrLiquido);
    });

    let top = descGroup.top(10);
    let domain_x = top.map(d => d.key);
    let despesasX = d3.scaleOrdinal().domain(domain_x);
    let topTen = getTops(descGroup, 10);
    let greens = d3.schemeGreens[9];
    let colorScale = color = d3.scaleLinear().domain([1,10])
    .interpolate(d3.interpolateHcl)
    .range([d3.rgb("#ff8a65 "), d3.rgb('#fbe9e7')]);
    
    barchart.width(null)
            .margins({top: 50, right: 10, bottom: 25, left: 80})
            .height(null)
            .gap(65)	
            .group(topTen)
            .dimension(descDim)
            .x(despesasX)
            .xUnits(dc.units.ordinal)
            .transitionDuration(100)
            .colors(colorScale)
            .colorAccessor(d => {
                console.log(d);
                console.log(domain_x);
                return domain_x.indexOf(d.key);
            })
            .brushOn(false)
            .elasticY(true)

    barchart.xAxis().tickFormat(d => { return DespesasDict[d.toUpperCase()].u; });
    barchart.yAxisLabel('Despesa Total (R$)', 40)

    let legendContent = topTen.all().reduce((acc, v) => {
        let text = v.key.toUpperCase();
        let entry = DespesasDict[text];
        let icon = `<i class="fa">${entry.i}</i>` 
        acc += `<div>${icon}<p>${capitalizePhrase(text.toLowerCase())}</p></div>`
        return acc
    }, '');

    // Fixando a legenda no local correto dependendo do tamanho da tela
    $(seletores.graficoDespesas.legenda).append(legendContent)
                                        .css('right', $(document).width()*0.15)
                                        .css('display', 'block');
    barchart.render();
};