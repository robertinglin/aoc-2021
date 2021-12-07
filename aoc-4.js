const solve = (data) => {
    const { drawings, boards } = data;

    let winningNumber = 0;
    let zeroFound = false;
    let prevWinningBoards = [];

    drawings.some((drawing, drawingTurn) => {
        if (drawing === 0) {
            drawing = 'ZERO'; // special case, if value is 0 it's replaced with 'ZERO' in the board to be able to sum easily
            zeroFound = true;
        }

        return boards.some((board, boardIndex) => {
            board.forEach((line, lineIndex) => {
                line.forEach((number, numberIndex) => {
                    if (number === drawing) {
                        line[numberIndex] = 0;
                    }
                });
            })
            // no sense checking for boards before turn 5
            if (drawingTurn >= 5 && !prevWinningBoards.includes(boardIndex)) {

                // add all the values in the rows to see if there's a vertical win and to easily sum the winning number
                const rows = [0, 0, 0, 0, 0]; 
                board.forEach((line, lineIndex) => {
                    line.forEach((number, numberIndex) => {
                        if (number === 'ZERO' && !zeroFound) {
                            rows[numberIndex] += Infinity;
                        } else if (number === 'ZERO' && zeroFound) {
                            rows[numberIndex] += 0;
                        } else
                            rows[numberIndex] += number;
                    })
                });

                if (rows.includes(0) || board.some((line) => (line.every(number => number === 0)))) {
                    
                    winningNumber = rows.reduce((num, next) => num + next) * drawing;
                    // part 1
                    // return true;
                    prevWinningBoards.push(boardIndex);
                }
            }
            return false;
        });
    });
    return  winningNumber;
}