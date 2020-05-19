const generateWords = (count, offset = 0) => {
    let words = [];
    for(let i = offset; i < count + offset; i++) {
        words.push(i.toString(2))
    }
    
    return words;
}

module.exports = generateWords;