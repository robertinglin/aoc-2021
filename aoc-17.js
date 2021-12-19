const data = 'target area: x=20..30, y=-10..-5';

const parse = (data) => {
    const rect = data.match(/target area: x=((-|\d)+)\.\.((-|\d)+), y=((-|\d)+)\.\.((-|\d)+)/);
    return {
        x: Math.min(rect[1], rect[3]),
        y: Math.max(rect[5], rect[7]),
        width: Math.abs(rect[1] - rect[3]) + 1,
        height: Math.abs(rect[5] - rect[7]) + 1
    }
}

const sumSeries = (num) => {
    let sum = 0;
    for (let i = 0; i < num; i++) {
        sum += num - i;
    }
    return sum;
}

const solve = (rect) => {

    let position = {
        x: 0,
        y: 0
    };
    let velocity = {
        x: 6,
        y: 9
    }
    let peakY = sumSeries(velocity.y);
    let peakX = sumSeries(velocity.x > velocity.y ? velocity.x - velocity.y : velocity.x);
    console.log(peakX, peakY);
}
console.log(solve(parse(data)));