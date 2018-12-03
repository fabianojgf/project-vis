const collectionPartidos = (container, deputados, partidos, despesas) => {
    partidos.forEach(p => {
        $(container).append(`<a class="collection-item" id="${p}" href="#!"><p>${p}</p></a>`)
        $(`${container} #${p}`).click(() => {
            console.log('!');
            $(`${container} .collection-item`).removeClass('active');
            $(`${container} #${p}`).addClass('active');
            filtrarPorPartido(p, 
                              deputados.filter(d => d.siglaPartido == p), 
                              despesas.filter(d => d.sgPartido == p));
        });
    });   
};

// Ponto de entrada
// Página carregada
$(document).ready(() => {
    carregarComparacao().then(comps => {
        desenharComps("#grafico-comparacoes", comps);
    }).catch(err => {
        console.log(err);
    })

    // Carrega os dados
    //carregadorTodosDeputados().then(deputados
    carregadorTodosDeputados().then(deputados => {
        
        let partidos = extrairPartidos(deputados);

        carregarDespesas(2018).then(despesas => {
            buildProfiles(seletores.quadroDeputados.main, 
                          seletores.quadroDeputados.pagination, 
                          despesas,
                          deputados);

            graficoDespesas(despesas);

            collectionPartidos(seletores.collectionPartidos.main,
                               deputados,
                               partidos, 
                               despesas);

            carregarTopoJson().then(mapa => {
                desenharMapa(seletores.mapaDeputados, deputados, despesas, mapa);
            }).catch(err => {
                console.log(err);
            })

            scatterProporcional(seletores.scatterPartidos.main,
                                deputados,
                                despesas,
                                partidos);

        }).catch(err => {
            console.log(err);
        })
    }).catch(err => {
        console.log(err);
    })
});