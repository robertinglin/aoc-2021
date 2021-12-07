
var dataText = require('./data.js');
// console.log(dataText);
var parse = (text) => {
    return text.trim().split(',').map(Number);
} 

var solve = (data) => {
    // Part 1
    // var median = data.sort((a, b) => a - b)[Math.floor(data.length / 2)];
    // var fuel = data.reduce((fuel, distance) => fuel + Math.abs(median - distance), 0);

    // Part 2
    var average = data.reduce((a, b) => a + b) / data.length;
    var fuel = data.reduce((fuel, distance) => {
        // fuel + 
        let num = Math.abs(Math.floor(average) - distance);
        num = (num*num+num)/2;
        return fuel + num;
    }, 0);

    return fuel;
}

console.log(solve(parse(dataText)));