const dropdownPartidos = (trigger, container, partidos) => {
    let partido_dropdown = $(container)
    
    partido_dropdown.append(`<li><a href="#!"><b>SELECIONAR TODOS</b></a></li>`)

    partidos.forEach(p => {
        partido_dropdown.append(`<li><a href="#!"><img src="./../../images/partidos/${p}.png" alt="${p}"/><p>${p}</p></a></li>`)
    });
    
    $(trigger).dropdown();   
};

// Ponto de entrada
// Página carregada
$(document).ready(() => {
    // Carrega os dados
    carregarDeputados(1, []).then(deputados => {
        let partidos = extrairPartidos(deputados);
        dropdownPartidos(seletores.dropdownPartidos.trigger, 
                         seletores.dropdownPartidos.main,
                         partidos);
       
        carregarDespesas(2018).then(despesas => {
            console.log(despesas);
            buildProfiles(seletores.quadroDeputados.main, 
                seletores.quadroDeputados.pagination, 
                despesas,
                deputados);
            graficoDespesas(despesas);
            desenharMapa(seletores.mapaDeputados, deputados, despesas);
        }).catch(err => {
            console.log(err);
        })
    }).catch(err => {
        console.log(err);
    })
});