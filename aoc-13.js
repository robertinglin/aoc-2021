// const data = `6,10
// 0,14
// 9,10
// 0,3
// 10,4
// 4,11
// 6,0
// 6,12
// 4,1
// 0,13
// 10,12
// 3,4
// 3,0
// 8,4
// 1,10
// 2,14
// 8,10
// 9,0

// fold along y=7
// fold along x=5`;

const data = require('./data-13');

const parse = (input) => {
    const lines = input.split('\n');
    const points = [];
    let maxX = 0;
    let maxY = 0;
    let fold = false;
    let instructions = [];
    for (let i = 0; i < lines.length; i++) {
        if (lines[i].trim() === '') {
            fold = true;
            continue;
        }
        if (!fold) {
            const [x, y] = lines[i].split(',').map(Number);
            maxX = Math.max(maxX, x);
            maxY = Math.max(maxY, y);
            points.push({ x, y });
        } else {
            let [axis, pos] = lines[i].substr('fold along '.length).split('=');
            pos = Number(pos);
            instructions.push({ axis, pos });
        }
    }
    const map = new Array(maxY + 1).fill(0).map(() => new Array(maxX + 1).fill('.'));
    for (let i = 0; i < points.length; i++) {
        const { x, y } = points[i];
        map[y][x] = '#';
    }
    
    return {
        map,
        points,
        instructions
    };

};

const drawMap = (map) => {
    for (let i = 0; i < map.length; i++) {
        console.log(map[i].join(''));
    }
}

const solve = (input) => {
    drawMap(input.map);

    const fold = (map, { axis, pos }) => {
        const newWidth = axis === 'x' ? pos - 1 : map[0].length - 1;
        const newHeight = axis === 'y' ? pos - 1 : map.length - 1;
        const newMap = new Array(newHeight + 1).fill(0).map(() => new Array(newWidth + 1).fill('.'));
        const translate = (point) => {
            if (axis === 'x') {
                return {
                    x: point.x > pos ? pos - (point.x % (pos + 1)) - 1 : point.x,
                    y: point.y
                };
            }
            return {
                x: point.x,
                y: point.y > pos ? pos - (point.y % (pos + 1)) - 1 : point.y,
            };
        }

        // const testPoint = { x: 0, y: 8 };
        // console.log(testPoint, translate(testPoint));

        // return;
        
        for (let i = 0; i < map.length; i++) {
            for (let j = 0; j < map[i].length; j++) {
                if (map[i][j] === '#') {
                    const newPoint = translate({ x: j, y: i });
                    console.log(newPoint, { x: j, y: i });
                    newMap[newPoint.y][newPoint.x] = map[i][j];
                }
            }
        }
        return newMap;
    }

    for (let i = 0; i < input.instructions.length; i++) {
        const { axis, pos } = input.instructions[i];
        input.map = fold(input.map, { axis, pos });
    }
    // input.map = fold(input.map, input.instructions[0]);


    // const nextMap = fold(input.map, { axis: 'y', pos: 7 });
    // const nextMap2 = fold(nextMap, { axis: 'x', pos: 5 });
    drawMap(input.map);
    return input.map.reduce((sum, row) => sum + row.filter(c => c === '#').length, 0);
}

console.log(solve(parse(data)));