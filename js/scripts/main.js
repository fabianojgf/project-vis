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
        dropdownPartidos('.dropdown-trigger', '#partidos-dropdown', partidos);
        
        carregarDespesas(2018).then(despesas => {
            buildProfiles('#quadro-deputados', '#section-perfis .pagination', deputados);
            //graficoDespesas('#grafico-despesas', despesas);
            //desenharMapa('#mapa', deputados);
        }).catch(err => {
            console.log(err);
        })
    }).catch(err => {
        console.log(err);
    })
});