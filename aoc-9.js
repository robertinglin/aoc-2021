// const data = `2199943210
// 3987894921
// 9856789892
// 8767896789
// 9899965678`

const data = require('./data-9')

const parse = (input) => {
    const lines = input.split('\n');
    return lines.map((line) => {
        return line.split('');
    });
}

const printMap = (map) => {
    console.clear();
    map.forEach((row) => {
        console.log(row.map((num) => (typeof num === 'number' ) ? (num*1%36).toString(36) : num).join(''));
    })
};
const sleep = (ms) => {
    return new Promise(resolve => setTimeout(resolve, ms));
}

const solvePart1 = (map) => {
    const lowPoints = [];
    map.map((row, rowIndex) => {
        row.forEach((cell, cellIndex) => {
            let lowPoint = cell;
            if (rowIndex > 0) {
                if (lowPoint === map[rowIndex - 1][cellIndex]) {
                    return;
                }
                lowPoint = Math.min(lowPoint, map[rowIndex - 1][cellIndex]);
            }
            if (rowIndex < map.length - 1) {
                if (lowPoint === map[rowIndex + 1][cellIndex]) {
                    return;
                }
                lowPoint = Math.min(lowPoint, map[rowIndex + 1][cellIndex]);
            }
            if (cellIndex > 0) {
                if (lowPoint === map[rowIndex][cellIndex - 1]) {
                    return;
                }

                lowPoint = Math.min(lowPoint, map[rowIndex][cellIndex - 1]);
            }
            if (cellIndex < row.length - 1) {
                if (lowPoint === map[rowIndex][cellIndex + 1]) {
                    return;
                }

                lowPoint = Math.min(lowPoint, map[rowIndex][cellIndex + 1]);
            }

            if (lowPoint == cell) {
                lowPoints.push({
                    row: rowIndex,
                    col: cellIndex,
                    value: cell * 1
                });
            }
        });
    });
    
    // Part 1
    return lowPoints.reduce((acc, point) => {
        return acc + point.value + 1;
    }, 0);
}

const solvePart2 = async (map) => {
    let basinMap = map.map((row) => row.map((cell) => cell == 9 ? '^' : '.'));
    let basinNumber = 0;
    let seeds = [];
    let currentRow = 0;
    printMap(basinMap);
    let counter = 0;
    while (currentRow < basinMap.length) {
        if (basinMap[currentRow][0] === '.') {
            seeds.push({
                row: currentRow,
                col: 0,
                seedNumber: basinNumber
            });
            basinMap[currentRow][0] = basinNumber;
            basinNumber++;
        }

        for (let i = 1; i < basinMap[currentRow].length; i++) {
            if (basinMap[currentRow][i] === '.' && basinMap[currentRow][i - 1] === '^') {
                seeds.push({
                    row: currentRow,
                    col: i,
                    seedNumber: basinNumber
                });
                basinMap[currentRow][i] = basinNumber;
                basinNumber++;
            }
        }
        const applySeed = (seed, x, y, nextSeeds) => {
            if (basinMap[y][x] !== '^') {
                if (basinMap[y][x] === '.' || basinMap[y][x] > seed.seedNumber) {
                    basinMap[y][x] = seed.seedNumber;
                    
                    nextSeeds.push({
                        row: y,
                        col: x,
                        seedNumber: seed.seedNumber
                    });
                }
            }
        }

        while (seeds.length) {
            const nextSeeds = [];
            seeds.forEach((seed) => {
                if (seed.col > 0) {
                    applySeed(seed, seed.col - 1, seed.row, nextSeeds);
                }
                if (seed.row > 0) {
                    applySeed(seed, seed.col, seed.row - 1, nextSeeds);
                }
                if (seed.col < basinMap[0].length - 1) {
                    applySeed(seed, seed.col + 1, seed.row, nextSeeds);
                }
                if (seed.row < basinMap.length - 1) {
                    applySeed(seed, seed.col, seed.row + 1, nextSeeds);
                }
            });
            seeds = nextSeeds;
            if (counter++%10 === 0) {

                // await sleep(500);
                printMap(basinMap);
            }

        }
        currentRow++;
    }
    let basins = [];
    basinMap.forEach((row) => {
        row.forEach((cell) => {
            if (cell !== '^') {
                basins[cell] = basins[cell] ? basins[cell] + 1 : 1;
            }
        });
    });
    const sortedBasins = basins.sort((a, b) => b - a);
    return sortedBasins[0] * sortedBasins[1] * sortedBasins[2];
}
(async () => {
    const result = await solvePart2(parse(data));
    console.log("part 1");
    console.log(solvePart1(parse(data)));     

    console.log("part 2");
    console.log(result);     

})()
