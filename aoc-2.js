var data = require('./data.json')
// const data = [
// "forward 5",
// "down 5",
// "forward 8",
// "up 3",
// "down 8",
// "forward 2"
//     ]

var x = (data) => {
    const position = data.reduce((pos, next) => { 
        const [direction, distance] = next.split(' ');
        switch (direction) {
            case 'up':
                pos[0] -= parseInt(distance);
                break;
            case 'down':
                pos[0] += parseInt(distance);
                break;
            case 'forward':
                pos[1] += parseInt(distance);
                // part 2
                pos[2] += pos[0] * parseInt(distance);

        }
        return pos;
    }, [0,0, 0]);
    // part 1
    // return position[0] * position[1];

    // part 2
    return position[1] * position[2];
} 

console.log(x(data));