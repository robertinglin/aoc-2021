
const parse = (input) => {
    const lines = input.split('\n');
    let algo = lines.shift().split('').map(x => x === '.' ? 0 : 1);
    let imageData = [];
    lines.forEach(line => {
        if (line.trim().length)
            imageData.push(line.split('').map(x => x === '.' ? 0 : 1));
    })
    return { algo, imageData };
}

const importData = (file) => require('fs').readFileSync(file, 'utf8');

const renderImage = (imageData) => {
    imageData.forEach(line => {
        console.log(line.map(x => x ? '#' : '.').join(''));
    })
}


const solve = (algo, imageData, depth = 0) => {
    const getPoint = (x, y) => {
        return imageData[y] ? (imageData[y][x] === undefined ? depth : imageData[y][x]) : depth;
    }
    const solvePoint = (x, y) => {
        const firstTriple = [getPoint(x-1, y-1), getPoint(x, y-1), getPoint(x+1, y-1)];
        const secondTriple = [getPoint(x-1, y), getPoint(x, y), getPoint(x+1, y)];
        const thirdTriple = [getPoint(x-1, y+1), getPoint(x, y+1), getPoint(x+1, y+1)];
        const bin = [...firstTriple, ...secondTriple, ...thirdTriple].join('');
        return algo[parseInt(bin, 2)];
    }

    let newImage = [];
    for (let y = -1; y <= imageData.length; y++) {
        let row = [];
        for (let x = -1; x <= imageData[0].length; x++) {
            row.push(solvePoint(x, y));
        }
        newImage.push(row);
    }
    return newImage;
}

let { algo, imageData } = parse(importData('./data-20.txt'));

// renderImage(info.imageData);
for (let i = 0; i < 50; i++) {
    imageData = solve(algo, imageData, i%2);
}
// //    let image = solve(algo, solve(algo, imageData, 0), 1);
renderImage(imageData);
console.log(imageData.reduce((a, b) => a + b.filter(x => x).length, 0));