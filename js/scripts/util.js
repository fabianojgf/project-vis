const capitalizePhrase = (text) => {
    let words = text.split(' ');

    return words.reduce((acc, v) => {
        acc += v.length > 2 ? v.slice(0,1).toUpperCase() + v.slice(1,v.length) : v;
        acc += ' ';
        return acc;
    }, '').trim();
}