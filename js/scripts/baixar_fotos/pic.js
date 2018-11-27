var request = require("request");
var fs = require('fs');

const datasetDeputados = (pagina=1) => {
    return `https://dadosabertos.camara.leg.br/api/v2/deputados?pagina=${pagina}&itens=100`;
}

// Requer os dados a partir da primeira página e segue
// de página em página até carregar todos.
// Retorna todos os dados disponíveis em JSON.
const carregarDeputados = (pagina, objInicial) => {
    return new Promise((resolve, reject) => {
        request({url: datasetDeputados(pagina),json: true}, (error, response, body) => {
            if (!error && response.statusCode === 200) {        
                //d3.json(datasetDeputados(pagina)).then((data) => {
                    dataset = [...objInicial, ...body.dados];

                    if(body.links[1].rel === 'next') {
                        resolve(carregarDeputados(++pagina, dataset));
                    }else {
                        resolve(dataset);
                    }
                // }).catch(d3_err => {
                //     reject(d3_err);
                // });
            }
        })
    });
};

const download = require('image-downloader')
 
// Download to a directory and save with an another filename
options = {
    url: 'http://someurl.com/image2.jpg',
    dest: '/path/to/dest/photo.jpg'        // Save to /path/to/dest/photo.jpg
  }
   
 
carregarDeputados(1, []).then(dep => {
    
    let batches = Math.round(dep.length/100);

    let current_batch = 6;

    dep = dep.slice(100*(current_batch-1), 100*current_batch);

    console.log('BATCH ' + current_batch);

    dep.forEach(d => {
        download.image({url:d.urlFoto, dest:`img/${current_batch}/${d.id}.jpg`, headers:{'User-agent': 'Mozilla/5.0'}})
        .then(({ filename, image }) => {
            console.log('File saved to', filename)
        })
        .catch((err) => {
            console.error(err)
        })
    });

}).catch(err => {
    console.log(err);
});






