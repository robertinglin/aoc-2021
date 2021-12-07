
var dataText = require('./data.js');
console.log(dataText);
var solve = (data) => {
    const position = data.reduce((pos, bits) => { 
        bits.split('').forEach((bit, i) => {
            pos[i] += bit*1;
        });

        return pos;
    }, new Array(data[0].length).fill(0));

    const common = (arr, pos, most) => {
        if (arr.length === 1) return arr;
        const one = [];
        const zero = [];
        arr.forEach((bit, i) => {
            if (bit[pos] == 1) {
                one.push(bit);
            } else {
                zero.push(bit);
            }
        });
        if (most) {
            return one.length >= zero.length ? one : zero;
        }
        return zero.length <= one.length ?  zero: one;
    }
    let mostDataSet = data;
    let leastDataSet = data;
    new Array(data[0].length).fill(0).forEach((_, i) => {
        mostDataSet = common(mostDataSet, i, true);
        leastDataSet = common(leastDataSet, i, false);
    });

    return parseInt(mostDataSet[0], 2) *parseInt(leastDataSet[0], 2);
} 

console.log(solve(dataText));