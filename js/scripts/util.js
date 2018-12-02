const capitalizePhrase = (text) => {
    let words = text.split(' ');

    return words.reduce((acc, v) => {
        if(v == 'zé') {
            acc += 'Zé';
        } else {
            acc += v.length > 2 ? v.slice(0,1).toUpperCase() + v.slice(1,v.length) : v;
        }
        
        acc += ' ';
        return acc;
    }, '').trim();
}

const capitalizeDeputado = (text) => {
    let nome = capitalizePhrase(text);
    let nome_arr = nome.split(' ');
    if(nome_arr.length > 2) {
        return `${nome_arr.slice(0,1)} ${nome_arr.pop()}`;
    } else {
        return nome;
    }
}