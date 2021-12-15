const data = require('./data-14');
// const data = `NNCB

// CH -> B
// HH -> N
// CB -> H
// NH -> C
// HB -> C
// HC -> B
// HN -> C
// NN -> C
// BH -> H
// NC -> B
// NB -> B
// BN -> B
// BB -> N
// BC -> B
// CC -> N
// CN -> C`;

const parse = (input) => {
    const lines = input.split('\n');
    const start = lines.shift();
    lines.shift();
    const rules = {};
    lines.forEach((line) => {
        const [from, to] = line.split(' -> ');
        rules[from] = to;
    });
    return {start, rules};
}
const solve = ({ start, rules }) => {
    const steps = 40;
    let current = start;
    let pairs = {};
    for (let i = 0; i < start.length - 1; i++) {
        const pair = start[i] + start[i + 1];
        pairs[pair] = pairs[pair] || 0//push(pair);
        pairs[pair]++;
    }
    let pairFreq;

    const pairFrequency = (pairs) => pairs.reduce((acc, pair) => {
        if (acc[pair]) {
            acc[pair]++;
        } else {
            acc[pair] = 1;
        }
        return acc;
    }, {});
    let nextPairs = {};

    for (let j = 0; j < steps; j++) {
        nextPairs = {};

        // const freq = pairFrequency(pairs);
        const pairKeys = Object.keys(pairs);
        for (let i = 0; i < pairKeys.length; i++) {
            const pair = pairKeys[i];
            if (rules[pair]) {
                nextPairs[pair[0] + rules[pair]] = nextPairs[pair[0] + rules[pair]] || 0;
                nextPairs[pair[0] + rules[pair]]+= pairs[pair];
                nextPairs[rules[pair] + pair[1]] = nextPairs[rules[pair] + pair[1]] || 0;
                nextPairs[rules[pair] + pair[1]]+= pairs[pair];
                
                // nextPairs.splice(i, 1, pair[0] + rules[pair], rules[pair] + pair[1]);
                // nextPairs.push( );
                // nextPairs.push( rules[pair] + pair[1]);
    
            }
        }
        pairs = nextPairs;
        // pairFreq = pairFrequency(pairs);
    }
    // // return pairs;
    // for (let i = 0; i < steps; i++) {
    //     for (let j = 0; j < current.length; j++) {

    //         const pair = current[j] + current[j + 1];
    //         if (rules[pair]) {
    //             current = current.substring(0, j + 1) + rules[pair] + current.substring(j + 1);
    //             j++;
    //         }

    //     }
    // }
    // const letterFrequency = current.split('').reduce((acc, letter) => {
    //     acc[letter] = (acc[letter] || 0) + 1;
    //     return acc;
    // }, {});
    // console.log(pairFreq);
    const pairLetterFreq = Object.entries(pairs).reduce((acc, [pair, freq]) => {
        const [letter1, letter2] = pair;
        acc[letter1] = (acc[letter1] || 0) + freq/2;
        acc[letter2] = (acc[letter2] || 0) + freq/2;
        return acc;
    }, {});
    Object.entries(pairLetterFreq).forEach(([letter, freq]) => {
        pairLetterFreq[letter] = Math.ceil(freq);
    });
    console.log(pairLetterFreq);
    // console.log(letterFrequency);

    const maxLetterFreq = Object.keys(pairLetterFreq).reduce((acc, letter) => {
        if (pairLetterFreq[letter] > acc.freq) {
            acc.letter = letter;
            acc.freq = pairLetterFreq[letter];
        }  
        return acc;
    }, {letter: '', freq: 0});
    const minLetterFreq = Object.keys(pairLetterFreq).reduce((acc, letter) => {
        if (pairLetterFreq[letter] < acc.freq) {
            acc.letter = letter;
            acc.freq = pairLetterFreq[letter];
        }
        return acc;
    }, {letter: '', freq: Infinity});

    return maxLetterFreq.freq - minLetterFreq.freq;
}

console.log(solve(parse(data)));