const buildProfiles = (seletor, paginacao, deputados) => {
    console.log(deputados);
    let linhas = 5;
    let deputados_por_linha = 10;
    let qtd_pagina = linhas * deputados_por_linha;
    let quadros = Math.ceil(deputados.length / qtd_pagina);
    let caixa = $(seletor);

    for(let i=0; i < quadros; i++) {
        caixa.append(`<div class="quadro ${i}"></div>`);

        for(let j=0; j < linhas; j++) {
            $(`${seletor} .quadro.${i}`).append(`<div class="linha${j}"></div>`);
    
            for(let k=0; k < deputados_por_linha; k++) {
                let index = i*qtd_pagina + j*deputados_por_linha + k;
                if(deputados[index]) { 
                    let id = deputados[index].id;
                    let div = `<div class="foto-deputado" id="${id}"><img src="../../images/fotos_deputados/${id}.jpg"/></div>`
                    $(`${seletor} .quadro.${i} .linha${j}`).append(div);     
                    $(`#${id}`).hover(() => {
                        showcaseDeputado(deputados[index]);
                    });

                    $(`#${id}`).click(() => {
                        $(`.foto-deputado`).removeClass('active');
                        $(`#${id}`).addClass('active');
                        //chooseDeputy(deputados[index]);
                    });
                }
            }
        }

        $(paginacao).append(`<li id="pagination-${i+1}" class="pagination-btn waves-effect"><a href="#!">${i+1}</a></li>`);

        $(`#pagination-${i+1}`).click(() => {
            console.log(i);
            $(`${seletor} .quadro`).css('display', 'none');
            $(`${seletor} .quadro.${i}`).css('display', 'block');
            $(`${paginacao} .pagination-btn`).removeClass('active');
            $(`#pagination-${i+1}`).addClass('active');
        });
    }

    $(`${seletor} .quadro.0`).css('display', 'block');
    $(`${paginacao} #pagination-1`).addClass('active');
};

const showcaseDeputado = (deputado) => {
    let showcase = '#quadro-deputados-showcase';
    $(`${showcase}`).css('display', 'block');
    $(`${showcase} .titulo`).text(capitalizePhrase(deputado.nome.toLowerCase()));
    $(`${showcase} .subtitulo`).text(`${deputado.siglaPartido} - ${deputado.siglaUf}`);
    $(`${showcase} .foto`).attr('src', `../../images/fotos_deputados/${deputado.id}.jpg`);
};

