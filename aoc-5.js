
var dataText = require('./data.js');
var parse = (text) => {
    return text.trim().split(',').map(Number);
} 

var solve = (data) => {
    const map = {};
    data.forEach(([[x1, y1], [x2, y2]]) => {
        console.log([[x1, y1], [x2, y2]])
        // part 1
        // if (x1 === x2 || y1 === y2) {
            let xVelocity = 1;
            if (x1 > x2) {
                xVelocity = -1
            } else if (x1 === x2) {
                xVelocity = 0
            }
            let yVelocity = 1
            if (y1 > y2) {
                yVelocity = -1;
            } else if (y1 === y2) {
                yVelocity = 0;
            }
            let x = x1;
            let y = y1;

            do  {
                let key = `${x},${y}`;
                map[key] = map[key] || 0;
                map[key]++;
                x += xVelocity;
                y += yVelocity;
            } while (`${x},${y}` !== `${x2},${y2}`)
            map[`${x},${y}`] = map[`${x},${y}`] || 0;
            map[`${x},${y}`]++;
        // }
    });
    return Object.values(map).reduce(((acc, val) => {
        return acc + (val > 1 ? 1 : 0);
    }), 0);
}

console.log(solve(parse(dataText)));