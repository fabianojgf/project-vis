const createScale = (dataset, field, minmax, inverted) => {
    let range = inverted ? [minmax[1], minmax[0]] : [minmax[0], minmax[1]];

    return d3.scaleLinear()
            .domain([minmax[0], d3.max(dataset, (d) => { 
                                                return d[field];
                                            })
            ])
            .range(range);
}

const scatterProporcional = (seletor, deputados, despesas, partidos) => {
    let facts_deputados = crossfilter(deputados);
    
    let partidosDim = facts_deputados.dimension(d => {
        return d.siglaPartido;
    });
    
    let group_partidos = partidosDim.group();

    despesas.forEach(d => {
        let res = group_partidos.all().filter(p => p.key == d.sgPartido);
        if(res.length == 1){
            d.deputados = res[0].value;
            d.vlrProporcional = parseFloat(d.vlrLiquido)/res[0].value;
        } else {
            d.deputados = 0;
            d.vlrProporcional = 0;
        }
    });

    let facts_despesas = crossfilter(despesas);

    let despesasDim = facts_despesas.dimension(d => {        
        return d.sgPartido
    });

    let despesas_group = despesasDim.group().reduceSum(d => {
        return d.vlrProporcional;
    });
    
    let despesasProporcional = despesas_group.all().filter(d => d.key != null);

    despesasProporcional.forEach(dp => {
        dp.n_deputados = group_partidos.all().filter(p => p.key == dp.key)[0].value;
    });    

    // Essa re-soma é feita para prevenir-se contra erros nos dados
    // Às vezes as atualizações dos dados da câmara geram uns erros inesperados...
    despesasProporcional = despesasProporcional.reduce((acc,v) => {
        let index = acc.findIndex(d => d.key == v.key);

        if(index >= 0) {
            acc[index] = {key:v.key, value:acc[index].value + v.value, n_deputados: v.n_deputados};
        } else {
            acc.push({key:v.key, value:v.value, n_deputados: v.n_deputados});
        }

        return acc;
    }, []);

    let margin = {top: 50, right: 100, bottom: 50, left: 50};
    let width = 1000 - margin.left - margin.right;
    let height = 640 - margin.top - margin.bottom;

    let svg = d3.select(seletor)
                .append('svg')
                    .attr('width', width + margin.left + margin.right)
                    .attr('height', height + margin.top + margin.bottom)
                .append('g')
                    .attr('transform', `translate(${margin.left},${margin.top})`);

    let xScale = createScale(despesasProporcional, 'value', [0, width], false);
    let yScale = createScale(despesasProporcional, 'n_deputados', [0, height], true);

    let xAxis = d3.axisBottom()
                  .scale(xScale)
                  .ticks(10);

    let yAxis = d3.axisLeft()
                  .scale(yScale)
                  .ticks(10);

    svg.selectAll('circle')
            .data(despesasProporcional)
            .enter()
            .append('circle')
                .attr('cx', (d) => {
                    return xScale(d['value']);
                })
                .attr('cy', (d) => {
                    return yScale(d['n_deputados']);
                })
                .attr('r', 6)
                .attr('fill','#ff8a65')
                .attr('cursor', 'pointer');

    svg.selectAll('circle')
       .on('click', (d) => {
            let p = d.key;
            filtrarPorPartido(p, 
                deputados.filter(d => d.siglaPartido == p), 
                despesas.filter(d => d.sgPartido == p));
       });

    svg.selectAll('circle')
       .on('mouseover', function(d) {
            d3.select(this).attr('fill', '#ffccbc')
                           .attr('r', 12);
       })
       .on("mouseout", function(d) {
            d3.select(this).attr('fill', '#ff8a65')
                           .attr('r', 6);
        });

        
    const addLabels = (x_f, y_f, l_f) => {
        svg.selectAll('text')
            .data(despesasProporcional)
            .enter()
            .append('text')
            .attr('x', (d) => {
                return xScale(d[x_f])+10;
            })    
            .attr('y', (d) => {
                return yScale(d[y_f]);
            })
            .text((d) => {
                return d[l_f];
            })
    }

    addLabels('value', 'n_deputados', 'key');

    // Eixo X
    svg.append('g')
        .attr('transform', `translate(0,${height})`)
        .call(xAxis);

    svg.append('text')
        .attr('transform', `translate(${width/2},${height + margin.bottom - 20})`)
        .style('text-anchor', 'middle')
        .attr('font-size', '12px')
        .text('Despesa Proporcional');
    
    // Eixo Y
    svg.append('g')
        .attr('transform', `translate(0,0)`)
        .call(yAxis);

    svg.append('text')
        .attr('transform', 'rotate(-90)')
        .attr('y', 0 - margin.left)
        .attr('x', 0 - (height / 2))
        .attr('dy', '1em')
        .style('text-anchor', 'middle')
        .attr('font-size', '12px')
        .text('Número de Deputados');
};