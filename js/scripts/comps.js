const desenharComps = (seletor, comparacoes) => {

    let facts = crossfilter(comparacoes);
    let nomeDim = facts.dimension(d => {return d.nome});
    let nomeGroup = nomeDim.group().reduceSum(d => {return d.valor});
    console.log(nomeGroup.all());

    var valoresExtent = d3.extent(nomeGroup.all(), d => {return d.value});
    var valoresMin = valoresExtent[0];
    var valoresMax = valoresExtent[1];

    console.log(nomeGroup.all().sort(function(a, b) {return d3.ascending(a.value, b.value);}));
    console.log(valoresMin + " " + valoresMax);

    let barchart = dc.barChart(seletor);
    barchart.ordering(function (d) { return -d.value ;})
            .width(null)
            .height(null)
            .margins({top: 50, right: 50, bottom: 25, left: 60})
            .y(d3.scaleLinear().domain([0,valoresMax]))
            .x(d3.scaleBand())
            .xUnits(dc.units.ordinal)
            .brushOn(false)
            .outerPadding(1)
            .dimension(nomeDim)
            .group(nomeGroup)
            .colors(d3.scaleOrdinal().domain(["isLessThanSalario", "isSalario", "isBiggerThanSalario"]).range(["#00FF00", "#0000FF", "#FF0000"]))
            .colorAccessor(function(d) {
              console.log(d.value);
              if (d.value === 33763) {
                return "isSalario";
              }
              
              if(d > 33764){
                console.log("maior" + d);
                return "isBiggerThanSalario";
              }
              else{
                console.log("menor" + d);
                return "isLessThanSalario";
              }
            });
    barchart.render();
    
};
