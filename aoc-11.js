const chalk = require('chalk');
const ansiEscapes = require('./vendor/ansi-escapes');
const data = `4658137637
3277874355
4525611183
3128125888
8734832838
4175463257
8321423552
4832145253
8286834851
4885323138`;

const parse = (data) => {
    return data.split('\n').map(line => {
        return line.split('').map(Number);
    });
};

const sleep = (ms) => {
    return new Promise(resolve => setTimeout(resolve, ms));
}

const renderOcotopuses = (data) => {
    console.log(ansiEscapes.eraseLines(data.length + 1));
    data.forEach(line => {
        const lineStr = line.reduce((line, octopus) => {
            if (octopus === 0) {
                return line + chalk.redBright('0');
            }
            return line + chalk.white(octopus);
        }, '');
        console.log(lineStr);
    });
}

const solve = async (data) => {

    
    let flashed = [];
    const incrementOctopus = async (x, y) => {
        if (x < 0 || x >= data.length || y < 0 || y >= data[0].length) {
            return false;
        }
        if (!flashed.includes(`${x},${y}`)) {
            data[y][x] = (data[y][x] + 1) % 10;
            if (data[y][x] === 0) {
                flashed.push(`${x},${y}`);
                for (let i = -1; i <= 1; i++) {
                    for (let j = -1; j <= 1; j++) {
                        await incrementOctopus(x + i, y + j);
                    }
                }
            }
        }
    }
    let flashes = 0;
    // for (let i = 0; i < steps; i++) {
        let steps = 0;
    while (true) {
        steps++;
        flashed = [];
        for (let y = 0; y < data.length; y++) {
            for (let x = 0; x < data[0].length; x++) {
                    await incrementOctopus(x, y);
            }
        }
        if (flashed.length === data[0].length * data.length) {
            renderOcotopuses(data);
            return steps;
        }
        flashes += flashed.length;

        renderOcotopuses(data);
        await sleep(250);
    }

    return flashes;

};

// console.log(solve(data));
(async () =>{
    console.log(await solve(parse(data)));
})();

// setInterval(() => {
//     // erase 1 line before we write the time string
//     process.stdout.write(ansiEscapes.eraseLines(1) + Math.random());
//   }, 1000);