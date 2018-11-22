const datasetDeputados = (pagina=1) => {
    return `https://dadosabertos.camara.leg.br/api/v2/deputados?pagina=${pagina}&itens=100`;
}

const despesasDeputado = (pagina=1,idDeputado) => {
    return `https://dadosabertos.camara.leg.br/api/v2/deputados/${idDeputado}/despesas?pagina=${pagina}&itens=100`;
}


const carregarDespesas = (ano) => {
    return new Promise((resolve, reject) => {
        d3.json(`data/CamaraFederal/Despesas/${ano}.json`).then(despesas => {
            resolve(despesas.DESPESA);
        }).catch(err => {
            reject(err);
        })
    });
}

// Requer os dados a partir da primeira página e segue
// de página em página até carregar todos.
// Retorna todos os dados disponíveis em JSON.
const carregarDeputados = (pagina, objInicial) => {
    return new Promise((resolve, reject) => {
        d3.json(datasetDeputados(pagina)).then((data) => {
            dataset = [...objInicial, ...data.dados];

            if(data.links[1].rel === 'next') {
                resolve(carregarDeputados(++pagina, dataset));
            }else {
                resolve(dataset);
            }
        }).catch(d3_err => {
            reject(d3_err);
        });
    });
};