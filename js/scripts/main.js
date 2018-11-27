// Ponto de entrada
// Página carregada
$(document).ready(() => {
    // Carrega os dados
    carregarDeputados(1, []).then(deputados => {
        console.log(deputados);
        carregarDespesas(2018).then(despesas => {
            graficoDespesas('#grafico-despesas', despesas);
            desenharMapa('#mapa', deputados);
        }).catch(err => {
            console.log(err);
        })
    }).catch(err => {
        console.log(err);
    })
});