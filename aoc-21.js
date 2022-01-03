const data = `Player 1 starting position: 4
Player 2 starting position: 8`

const parse = (data) => {
    let players = data.split('\n').map(line => {
        let [, player, position] = line.match(/Player (\d) starting position: (\d+)/)
        return { player, position: Number(position), score: 0 }
    });
    return players;
}

let count = 1;
const roll = () => {
    return count++;
}

const board = {
    1: {
        scores: [],
    },
    2: {
        scores: [],
    }
}

const turn = (player) => {
    let rolls = roll() + roll() + roll();
    player.position = (player.position + rolls) % 10;
    if (player.position === 0) {
        player.score += 10;
    } else {
        player.score += (player.position);
    }
}


const players = parse(data);

let play = () => {
    while(true) {
        if (players.some(player => {
            turn(player);
            
            if (player.score >= 1000) {
                return true;
            }
            return false;
        })) {
            return (players[0].score > players[1].score ? players[1] : players[0]).score * (count - 1);
        }
    }
    

}

console.log(play());