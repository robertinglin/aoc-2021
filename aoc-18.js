const data = `[1,2] [[3,4],5]`;
const reductionTest = [[[[[9,8],1],2],3],4];
const reductionTest2 = [7,[6,[5,[4,[3,2]]]]];
const reductionTest3 = [[6,[5,[4,[3,2]]]],1];
const reductionTest4 = [[3,[2,[1,[7,3]]]],[6,[5,[4,[3,2]]]]];

const splitTest = [[[[0,7],4],[15,[0,13]]],[1,1]];

const parse = (input) => {
    const sets = input.split('\n');
    return sets.map(JSON.parse);
}

const importData = () => {
    const fs = require('fs');
    const input = fs.readFileSync('./data-18.txt', 'utf8');
    return parse(input);
}


const generateTree = (input, depth = 0, parent) => {
    let treeNode = {
        parent,
        depth
    }
    treeNode.left = input[0] instanceof Array ? generateTree(input[0], depth+1, treeNode): input[0];
    treeNode.right = input[1] instanceof Array ? generateTree(input[1], depth+1, treeNode) : input[1];
    
    return treeNode;
}

const treeToArray = (tree) => {

    if (tree instanceof Object && !Array.isArray(tree)) {
        return [treeToArray(tree.left), treeToArray(tree.right)];
    } else {
        return tree
    }
}
const nextParent = (tree, dir1, dir2) =>{
    while(tree.parent && tree.parent[dir1] === tree) {
        tree = tree.parent;
    }
    if (!tree.parent) {
        return [null];
    }
    if (!(tree.parent[dir1] instanceof Object)){
        return [tree.parent, false];
    }
    tree = tree.parent[dir1];
    while (tree[dir2] instanceof Object) {
        tree = tree[dir2];
    }
    return [tree,true];
}
const nextRightParent = (tree) => nextParent(tree, 'right', 'left');
const nextLeftParent = (tree) => nextParent(tree, 'left','right');



const print = (tree, prefix = '') => {
    console.log(prefix + JSON.stringify(treeToArray(tree)));
}

const notEqual = (tree, prevTree) => {
    if (prevTree == null) {
        return true;
    }
    return JSON.stringify(treeToArray(tree)) !== JSON.stringify(treeToArray(prevTree));
}

const solve = (input, shouldPrint = true) => {
    // let out = [a, b];
    let tree = generateTree(input);
    let found = false;
    let traverseExplode = (node) => {
        if (found) {
            return;
        }
        found = false;
        if (node.depth >= 4) {
            found = true;
            const [ nextLeft, hasRight ] = nextLeftParent(node);
            // console.log(hasRight)
            // print(nextLeft, 'left: ');
            if (nextLeft && hasRight) {
                nextLeft.right += node.left;
            } else if (nextLeft){
                nextLeft.left += node.left;
            }
            const [ nextRight, hasLeft ] = nextRightParent(node);
            if (nextRight && hasLeft) {
                nextRight.left += node.right;
            } else if (nextRight){
                nextRight.right += node.right;
            }
            if (node.parent.right === node) {
                node.parent.right = 0;
            } else {
                node.parent.left = 0;
            }
            node = node.parent;
            // console.log('explode');
            shouldPrint && print(tree, 'exploded:');

        }
        
        if (found) {
            // print(tree);
            return true;
        }
        if (node.left instanceof Object) {
           if (traverseExplode(node.left)) {
               return true;
           }
        }
        if (found) {
            return true;
        }
        if (node.right instanceof Object) {
            if (traverseExplode(node.right)) {
                return true;
            }
        }
        if (found) {
            return true;
        }
        return false;
    }

    const traverseSplit = (node) => {
        if (!(node.left instanceof Object) && node.left >= 10) {
            node.left = generateTree([Math.floor(node.left/2), Math.ceil(node.left/2)], node.depth+1, node);
            found = true;
            shouldPrint && print(tree, 'splitted:');
            return true;
        } 
        if (node.left instanceof Object) {
            // console.log('left', node.left.depth);
            if (traverseSplit(node.left)) {
                return true;
            }
         }
         if (!(node.right instanceof Object) && node.right >= 10) {
            node.right = generateTree([Math.floor(node.right/2), Math.ceil(node.right/2)], node.depth+1, node);
            found = true;
            shouldPrint && print(tree, 'splitted:');
            return true;
        }
        if (node.right instanceof Object) {
            // console.log('right', node.right.depth);
            if (traverseSplit(node.right)) {
                return true;
            }
        }

    }
    let prevTree = null;
    while (notEqual(tree, prevTree)) {
        found = false;
        prevTree =  treeToArray(tree);
        if (!traverseExplode(tree)) {
            traverseSplit(tree);
        };
    }
    // traverse(tree);
    return treeToArray(tree);
}
// print(solve(reductionTest))
// print(solve(reductionTest2))
// print(solve(reductionTest3))
// print(solve(reductionTest4))
// print(solve(solve(reductionTest4)))


const add = (left, right, print) => {
    return solve([left, right], print);
}

const test = [
    [1,1],
    [2,2],
    [3,3],
    [4,4],
    [5,5],
    [6,6]
]

// solve([[[9,10],20],[8,[9,0]]]);
// print(test.reduce((prev, curr) => {
//     return prev ? add(prev, curr) : curr;   
// }));
// print(solve([[[[0,7],4],[15,[0,13]]],[1,1]]))

// print(add([[[[4,3],4],4],[7,[[8,4],9]]], [1,1]))


// print(add([[[0,[4,5]],[0,0]],[[[4,5],[2,6]],[9,5]]]
//     ,[7,[[[3,7],[4,3]],[[6,3],[8,8]]]]))

// const expectedSteps = [
//     [[[[[4,3],4],4],[7,[[8,4],9]]],[1,1]],
//     [[[[0,7],4],[7,[[8,4],9]]],[1,1]],
//     [[[[0,7],4],[15,[0,13]]],[1,1]],
//     [[[[0,7],4],[[7,8],[0,13]]],[1,1]],
//     [[[[0,7],4],[[7,8],[0,[6,7]]]],[1,1]],
//     [[[[0,7],4],[[7,8],[6,0]]],[8,1]]
// ]

// // print(add([[[[4,3],4],4],[7,[[8,4],9]]], [1,1], expectedSteps))
// const numbers = [
//     // [[[0,[4,5]],[0,0]],[[[4,5],[2,6]],[9,5]]],
//     // [7,[[[3,7],[4,3]],[[6,3],[8,8]]]],
//     // [[2,[[0,8],[3,4]]],[[[6,7],1],[7,[1,6]]]],
//     // [[[[2,4],7],[6,[0,5]]],[[[6,8],[2,8]],[[2,1],[4,5]]]],
//     // [7,[5,[[3,8],[1,4]]]],
//     // [[2,[2,2]],[8,[8,1]]],
//     // [2,9],
//     // [1,[[[9,3],9],[[9,0],[0,7]]]],
//     // [[[5,[7,4]],7],1],
//     // [[[[4,2],2],6],[8,7]]
//     [[[0,[5,8]],[[1,7],[9,6]]],[[4,[1,2]],[[1,4],2]]],
//     [[[5,[2,8]],4],[5,[[9,9],0]]],
//     [6,[[[6,2],[5,6]],[[7,6],[4,7]]]],
//     [[[6,[0,7]],[0,9]],[4,[9,[9,0]]]],
//     [[[7,[6,4]],[3,[1,3]]],[[[5,5],1],9]],
//     [[6,[[7,3],[3,2]]],[[[3,8],[5,7]],4]],
//     [[[[5,4],[7,7]],8],[[8,3],8]],
//     [[9,3],[[9,9],[6,[4,9]]]],
//     [[2,[[7,7],7]],[[5,8],[[9,3],[0,2]]]],
//     [[[[5,2],5],[8,[3,7]]],[[5,[7,5]],[4,4]]]
// ]
const numbers = importData();
// console.log(numbers)

// const fail = [[[[9,0],[8,5]],[[0,8],[6,0]]],[[[7,7],7],[[0,[[5,6],3]],[[6,3],[8,8]]]]];
// print(solve(fail))

// print(solve([[[[[7,0],[7,7]],[[7,7],[7,8]]],[[[7,7],[8,8]],[[7,7],[8,7]]]],[7,[5,[[3,8],[1,4]]]]]))

// exit();
const mag = (input) => {
    let tree = generateTree(input);

    recMag = (node) => {
        let left = node.left;
        if (node.left instanceof Object) {
            left = recMag(node.left);
        }
        let right = node.right;
        if (node.right instanceof Object) {
            right = recMag(node.right);
        }
        return left*3 + right * 2;
    }
    return recMag(tree);
}

// let first = numbers.shift();
// const res = numbers.reduce((acc, curr) => {
//     const inx = [acc, curr];
//     // print(inx, '<');
//     const res = solve(inx, false);
//     // const res =  add(acc, curr, false);
//     // print (res, '>');
//     return res;
// }, first)
// // print(res);

// console.log(mag(solve([[[2,[[7,7],7]],[[5,8],[[9,3],[0,2]]]], [[[0,[5,8]],[[1,7],[9,6]]],[[4,[1,2]],[[1,4],2]]]], false)))

// console.log(mag(res))
let currentMag = 0;
for (let i = 0; i < numbers.length; ++i) {
    for (let j = 0; j < numbers.length; ++j) {
        if (i === j) {
            continue;
        }
        const inx = JSON.parse(JSON.stringify([numbers[i], numbers[j]]));
        const iny = JSON.parse(JSON.stringify([numbers[j], numbers[i]]));
        // if (i === 8 && j == 0) {
        //     print(numbers[j]);
        //     print(numbers[i]);
        //     console.log(mag(solve(inx, false)))
        //     console.log(mag(solve(iny, false)))
        // }
        const res = mag(solve(inx, false));
        currentMag = Math.max(currentMag, res);
        const res2 = mag(solve(iny, false));
        currentMag = Math.max(currentMag, res2);
        if (res > currentMag) {
            currentMag = res;
        }
        // console.log(mag(res))
    }
}
console.log(currentMag);

// add([[[0,[4,5]],[0,0]],[[[4,5],[2,6]],[9,5]]]
//     , [7,[[[3,7],[4,3]],[[6,3],[8,8]]]]);
// print(solve([[[0,[4,5]],[0,0]],[[[4,5],[2,6]],[9,5]]]));
// const res = solve([[0,[4,5]],[0,0]],[[[4,5],[2,6]],[9,5]]]
//     , [7,[[[3,7],[4,3]],[[6,3],[8,8]]]]])
// print(res);
// print(solve(solve(splitTest)))
// console.log(reduce(reductionTest), JSON.stringify(reductionTest))
// console.log(reduce(reductionTest2), JSON.stringify(reductionTest2))
// console.log(reduce(reductionTest3), JSON.stringify(reductionTest3))
// console.log(reduce(reductionTest4), JSON.stringify(reductionTest4))
// console.log(parse(data));