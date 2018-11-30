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

const carregarTopoJson = () => {
    return new Promise((resolve, reject) => {
        
        d3.json("data/br-states.json").then(br => {
            resolve(topojson.feature(br, br.objects.states));
        }).catch(err => {
            reject(err);
        })
    });
}

const carregarComparacao = () => {
    return new Promise((resolve, reject) => {
        
        d3.tsv("data/comparacoes.tsv").then(comps => {
            resolve(comps);
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

// Get top n from group
// https://stackoverflow.com/questions/30977987/plotting-top-values-of-a-group-on-dc-js-bar-chart
const getTops = (source_group, n) => {
    return {
        all: function () {
            return source_group.top(n);
        }
    };
}

const extrairPartidos = (deputados) => {
    let facts = crossfilter(deputados);
    let partidoDim = facts.dimension(d => {
        return d.siglaPartido;
    });

    let partidoGroup = partidoDim.group();

    return partidoGroup.all().map(p => p.key);
}