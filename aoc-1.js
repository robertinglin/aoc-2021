var data = require('./data.json')
// const data = [199,
//     200,
//     208,
//     210,
//     200,
//     207,
//     240,
//     269,
//     260,
//     263
//     ]

var x = (data) => {
    // Part 1
    // return data.reduce(({ count, prev }, next) => { 
    //     return {
    //         count: count + (prev < next ? 1 : 0),
    //         prev: next
    //     }
    // }, { count: -1, prev: 0 }).count;

    // Part 2
    let count = 0;
    for (let i = 3; i < data.length; i++) {
        if (data[i] > data[i-3]) {
            count++;
        }
    }
    return count;
} 

console.log(x(data));