const data = `Player 1 starting position: 2
Player 2 starting position: 5`

const parse = (data) => {
    let players = data.split('\n').map(line => {
        let [, player, position] = line.match(/Player (\d) starting position: (\d+)/)
        return { player, position: Number(position), score: 0 }
    });
    return players;
}

const players = parse(data);

let dictionary = {};
const solve = (p1Pos, p2Pos, p1Score, p2Score) => {
    
    if (p1Score >= 21) {
        return [1, 0];
    }
    
    if (p2Score >= 21) {
        return [0, 1];
    }
    let key = `${p1Pos}-${p2Pos}-${p1Score}-${p2Score}}`;
    if (dictionary[key] !== undefined) {
        return dictionary[key];
    }
    let totalP1Win = 0;
    let totalP2Win = 0;
    for (let i = 0; i < 3; ++i) {
        for (let j = 0; j < 3; ++j) {
            for (let k = 0; k < 3; ++k) {
                let p1PosAfter = (p1Pos + (i + 1) + (j + 1) + (k + 1)) % 10 || 10;
                let p1ScoreAfter = p1Score + p1PosAfter;
                let [p2Wins, p1Wins] = solve(p2Pos, p1PosAfter, p2Score, p1ScoreAfter);
                totalP1Win += p1Wins;
                totalP2Win += p2Wins;
            }
        }
    }
    dictionary[key] = [totalP1Win, totalP2Win];
    return [totalP1Win, totalP2Win];
}

console.log(solve(players[0].position, players[1].position, players[0].score, players[1].score));

131888061854776
70086475100793