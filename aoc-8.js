const data = require('./data-8')

const parse = (input) => {
    const lines = input.split('\n');
    return lines.map((line) => {
        const parts = line.split('|');
        const digits = parts[0].trim().split(' ');
        const code = parts[1].trim().split(' ');
        return { digits, code }
    });
}

const solve = (arr) => {
    // part 1
    let counter = 0;
    
    const numbers = arr.map(({ digits, code }) => {
        const sortedDigits = digits.sort((a, b) => a.length < b.length ? -1 : 1);
        const one = sortedDigits[0].split('').sort(); // has 2
        const seven = sortedDigits[1].split('').sort(); // has 3
        const four = sortedDigits[2].split('').sort(); // has 4
        const eight = sortedDigits[9].split('').sort(); // has 7
        // two, three and five have  5
        const twoThreeAndFive = [sortedDigits[3].split('').sort(), sortedDigits[4].split('').sort(), sortedDigits[5].split('').sort()];
        
        const a = seven.filter(letter => !one.includes(letter));
        const bAndD = four.filter(letter => !seven.includes(letter));
        const cAndF = one;
        const eAndG = eight.filter(letter => ![...a, ...bAndD, ...cAndF].includes(letter));
    
        // console.log(a, bAndD, cAndF, eAndG);
        const three = twoThreeAndFive.filter(num => cAndF.every(letter => num.includes(letter)))[0];
        const g = three.filter(letter => ![...four, ...a].includes(letter));
        const e = eAndG.filter(letter => letter != g);
        const b = four.filter(letter => !three.includes(letter));
        const d = bAndD.filter(letter => letter != b);
    
        const five = twoThreeAndFive.filter(num => b.every(letter => num.includes(letter)))[0];
        const f = cAndF.filter((letter) => five.includes(letter));
        const c = cAndF.filter((letter) => !five.includes(letter));

        const two =  [...a, ...c, ...d, ...e, ...g].sort();
        const zero = [...a, ...b, ...c, ...e, ...f, ...g].sort();
        const six = [...a, ...b, ...d, ...e, ...f, ...g].sort();
        const nine = [...a, ...b, ...c, ...d, ...f, ...g].sort();

    
        const digitMap = [zero, one, two, three, four, five, six, seven, eight, nine].map((d) => d.join(''));
        // console.log({
        //     zero: digitMap[0],
        //     one: digitMap[1],
        //     two: digitMap[2],
        //     three: digitMap[3],
        //     four: digitMap[4],
        //     five: digitMap[5],
        //     six: digitMap[6],
        //     seven: digitMap[7],
        //     eight: digitMap[8],
        //     nine: digitMap[9]
        // });
    
        const num = code.map((word) => {
            word = word.split('').sort().join('');
            const num = digitMap.indexOf(word);
            // part 1
            if ([1,4,7,8].includes(num)) {
                counter++;
            }
            return num;
        }).map(x => x + '').join('');
        return num;
    }).map(Number);

    // part 2
    return numbers.reduce((a, b) => a + b, 0);
    
    // part 1
    return counter;
}

console.log(solve(parse(data)));