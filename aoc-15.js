const chalk = require("chalk");

// const data = `1163751742
// 1381373672
// 2136511328
// 3694931569
// 7463417111
// 1319128137
// 1359912421
// 3125421639
// 1293138521
// 2311944581`;
const data = require('./data-15');

const parse = (input) => {
    // part 1
    // return input.split('\n').map(line => line.split('').map(Number));
    // part 2
    let map = input.split('\n').map(line => line.split('').map(Number));
    let mapWidth = map[0].length;
    let mapHeight = map.length;
    map.forEach((row, rowInd) => {
        row.forEach((col, colInd) => {
            for(let i = 0; i < 5; ++i) {
                for (let j = 0; j < 5; ++j) {
                    if (i + j === 0) {
                        continue;
                    }
                    map[rowInd + i* mapHeight ] = map[rowInd + i*mapHeight ] || [];
                    map[rowInd + i* mapHeight ][colInd + j*mapWidth] =  (i + j + map[rowInd][colInd]) % 9 || 9;
                }
            }
        });
    });
    return map;
}

const drawMap = (map, checkedList) => {
    map.forEach((row, rowInd) => {
        console.log(row.map((col, colInd) => {
            if (checkedList.includes(`${colInd},${rowInd}`)) {
                return chalk.red(map[rowInd][colInd].toString(32));
            } else {
                return chalk.white(map[rowInd][colInd].toString(32));
            }
        }).reduce((acc, x) => acc + x, ''));
    });
}

const solve = (map) => {
    drawMap(map, []);
    for (let y = 0; y < map.length; y++) {
        for (let x = 0; x < map[0].length; x++) {
            // map[y][x] += x + y;
        }
    }
    const heuristic = (a, b, map) => {
        const [aX, aY] = a.split(',').map(Number);
        const [bX, bY] = b.split(',').map(Number);
        return Math.abs(aX - bX) + Math.abs(aY - bY) + map[aY][aX] + map[bY][bX];
    }
    const reconstructPath = (cameFrom, current) => {
        const totalPath = [current];
        while (cameFrom[current]) {
            current = cameFrom[current];
            totalPath.push(current);
        }
        return totalPath.reverse();
    }
    const getNeighbors = (current, map) => {
        const [x, y] = current.split(',').map(Number);
        const neighbors = [];
        if (x > 0) {
            neighbors.push(`${x-1},${y}`);
        }
        if (x < map[0].length - 1) {
            neighbors.push(`${x+1},${y}`);
        }
        if (y > 0) {
            neighbors.push(`${x},${y-1}`);
        }
        if (y < map.length - 1) {
            neighbors.push(`${x},${y+1}`);
        }
        return neighbors;
    }


    // use a* to figure out the shortest path
    const aStar = (map, start, end) => {
        const openSet = [start];
        const closedSet = [];
        const cameFrom = {};
        const gScore = {};
        const fScore = {};

        gScore[start] = 0;
        fScore[start] = gScore[start] + heuristic(start, end, map);
        
        while (openSet.length > 0) {
            const current = openSet.reduce((acc, x) => fScore[x] < fScore[acc] ? x : acc);
            console.log(openSet.length, cameFrom[current]);
            if (current === end) {
                return reconstructPath(cameFrom, current);
            }
            openSet.splice(openSet.indexOf(current), 1);
            closedSet.push(current);
            const neighbors = getNeighbors(current, map);
            neighbors.forEach(neighbor => {
                if (closedSet.includes(neighbor)) {
                    return;
                }
                const tentativeGScore = gScore[current] + heuristic(current, neighbor, map);
                if (!openSet.includes(neighbor) || tentativeGScore < gScore[neighbor]) {
                    cameFrom[neighbor] = current;
                    gScore[neighbor] = tentativeGScore;
                    fScore[neighbor] = gScore[neighbor] + heuristic(neighbor, end, map);
                    if (!openSet.includes(neighbor)) {
                        openSet.push(neighbor);
                    }
                }
            });
            // drawMap(map, cameFrom);
        }
        return [];
    }
    const results = aStar(map, [0,0].join(','), [map[0].length-1, map.length-1].join(','));

    drawMap(map, results);

    return results.reduce((acc, x) => acc + map[x.split(',')[1]][x.split(',')[0]], 0) - map[0][0];



    return map.map(line => line.map(x => x.toString(32)).join('')).join('\n');
}
console.log(solve(parse(data)));