const collectionPartidos = (container, partidos, despesas) => {
    console.log(partidos);
    console.log(despesas);

    partidos.forEach(p => {
        // partido_dropdown.append(`<a class="collection-item" href="#!"><img src="./../../images/partidos/${p}.png" alt="${p}"/><p>${p}</p></a>`)
        $(container).append(`<a class="collection-item" id="${p}" href="#!"><p>${p}</p></a>`)
        $(`${container} #${p}`).click(() => {
            console.log('!');
            $(`${container} .collection-item`).removeClass('active');
            $(`${container} #${p}`).addClass('active');
            filtrarPorPartido(p, despesas.filter(d => d.sgPartido == p));
        });
    });   
};

// Ponto de entrada
// Página carregada
$(document).ready(() => {
    // $('.tabs').tabs();

    // Carrega os dados
    carregarDeputados(1, []).then(deputados => {
        let partidos = extrairPartidos(deputados);

        carregarDespesas(2018).then(despesas => {
            buildProfiles(seletores.quadroDeputados.main, 
                          seletores.quadroDeputados.pagination, 
                          despesas,
                          deputados);

            graficoDespesas(despesas);

            collectionPartidos(seletores.collectionPartidos.main,
                                partidos, despesas);

            carregarTopoJson().then(mapa => {
                desenharMapa(seletores.mapaDeputados, deputados, despesas, mapa);
            }).catch(err => {
                console.log(err);
            })
        }).catch(err => {
            console.log(err);
        })

        carregarComparacao().then(comps => {
           desenharComps("#grafico-comparacoes", comps);
        }).catch(err => {
            console.log(err);
        })
    }).catch(err => {
        console.log(err);
    })
});