const data = require('./data-10');

// const data = `[({(<(())[]>[[{[]{<()<>>
// [(()[<>])]({[<{<<[]>>(
// {([(<{}[<>[]}>{[]{[(<()>
// (((({<>}<{<{<>}{[]{[]{}
// [[<[([]))<([[{}[[()]]]
// [{[{({}]{}}([{[{{{}}([]
// {<[[]]>}<{[{[{[]{()[[[]
// [<(<(<(<{}))><([]([]()
// <{([([[(<>()){}]>(<<{{
// <{([{{}}[<[[[<>{}]]]>[]]`;

const parse = (data) => {
    return data.split('\n').map(line => {
        return line.split('');
    });
}

const solve = (data) => {

    const charPoints = {
        ')': 3,
        ']': 57,
        '}': 1197,
        '>': 25137,
        true: 0
    }

    const validPoints = {
        ')': 1,
        ']': 2,
        '}': 3,
        '>': 4,
    }

    let validatedLines = data.map(line => {
        const charStack = [];

        let openChars = ['{', '[', '<', '('];
        let closeChars = ['}', ']', '>', ')'];
    
        let pointer = 0;
        
        while (pointer < line.length) {
            let currentChar = line[pointer];
            if (openChars.includes(currentChar)) {
                charStack.push(currentChar);
            } else if (closeChars.includes(currentChar)) {
                let lastChar = charStack.pop();
                if (closeChars.indexOf(currentChar) !== openChars.indexOf(lastChar)) {
                    return false;
                    // part 1
                    return currentChar;
                }
            }
            pointer++;
        }
        // part 2
        return charStack.map((char) => {
            return closeChars[openChars.indexOf(char)];
        }).reverse();
        
        // part 1
        return true;
    });

    validatedLines = validatedLines.filter(x => !!x);


    const points = validatedLines.map((line) => {
        return line.reduce((acc, char) => {
            acc *= 5;
            acc += validPoints[char];
            return acc;
        }, 0);
    }).sort((a, b) => a - b);
    return points[Math.floor(points.length/2)];

    // part 1
    return validatedLines.reduce((acc, line) => {
        return acc + (charPoints[line] || 0);
    }, 0);

}

console.log(solve(parse(data)));