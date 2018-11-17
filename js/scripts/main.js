const datasetDeputados = (pagina=1) => {
    return `https://dadosabertos.camara.leg.br/api/v2/deputados?pagina=${pagina}&itens=100`;
}

const despesasDeputado = (pagina=1,idDeputado) => {
    return `https://dadosabertos.camara.leg.br/api/v2/deputados/${idDeputado}/despesas?pagina=${pagina}&itens=100`;
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

// Retorna todas as despesas de um determinado deputado
const carregarDespesas = (pagina, objInicial, idDeputado) => {
    console.log(idDeputado);
    return new Promise((resolve, reject) => {
        d3.json(despesasDeputado(pagina, idDeputado)).then((data) => {
            dataset = [...objInicial, ...data.dados];
            
            if(data.links && data.links.length > 1 && data.links[1].rel === 'next') {
                resolve(carregarDespesas(++pagina, dataset, idDeputado));
            }else {
                resolve(dataset);
            }
        }).catch(d3_err => {
            reject(d3_err);
        });
    });
};

// WORK IN PROGRESS
// TODO: Tentar acelearar esse processo!
const despesasDosDeputados = (deputados) => {
    let promises = [];
        let results = [];

        console.log(deputados.length);
        for(var i = 0; i < deputados.length; i++) {
            console.log(i);
            let promise = carregarDespesas(1, [], deputados[i].id);

            promises.push(promise);
        }

        Promise.all(promises).then(r => {
            console.log(r);
            console.log(promises);
        })
}

// Ponto de entrada
// Página carregada
$(document).ready(() => {
    // Carrega os dados
    carregarDeputados(1, []).then(deputados => {
        carregarDespesas(1, [], deputados[0].id).then(despesas => {
            console.log(despesas)
        }).catch(err => {
            console.log(err);
        });
    }).catch(err => {
        console.log(err);
    })
});