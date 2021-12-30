
const parse = (input) => {
    const lines = input.split('\n');
    let scanners = [];
    let scannerIndex = -1;
    lines.forEach(line => {
        if (line.startsWith('---')) {
            scannerIndex++;
            scanners[scannerIndex] = [[0,0,0,'S']];
        }
        else if (line.trim() !== '') {
            let point = line.split(',').map(Number);
            scanners[scannerIndex].push(point);
        }
    })
    return scanners;
}

const importData = (file) => require('fs').readFileSync(file, 'utf8');

const scanners = parse(importData('./data-19.txt'));

console.log(scanners);

const multiplyMatrices = (a, b) => {
    if (!Array.isArray(a) || !Array.isArray(b) || !a.length || !b.length) {
       throw new Error('arguments should be in 2-dimensional array format');
    }
    let x = a.length,
    z = a[0].length,
    y = b[0].length;
    if (b.length !== z) {
       // XxZ & ZxY => XxY
       throw new Error('number of columns in the first matrix should be the same as the number of rows in the second');
    }
    let productRow = Array.apply(null, new Array(y)).map(Number.prototype.valueOf, 0);
    let product = new Array(x);
    for (let p = 0; p < x; p++) {
       product[p] = productRow.slice();
    }
    for (let i = 0; i < x; i++) {
       for (let j = 0; j < y; j++) {
          for (let k = 0; k < z; k++) {
             product[i][j] += a[i][k] * b[k][j];
          }
       }
    }
    return product;
 }
        

const rx = (deg) => {
    return [
        [1, 0, 0],
        [0, Math.cos(deg), -Math.sin(deg)],
        [0, Math.sin(deg), Math.cos(deg)]
    ]
}

const ry = (deg) => {
    return [
        [Math.cos(deg), 0, Math.sin(deg)],
        [0, 1, 0],
        [-Math.sin(deg), 0, Math.cos(deg)]
    ]
}

const rz = (deg) => {
    return [
        [Math.cos(deg), -Math.sin(deg), 0],
        [Math.sin(deg), Math.cos(deg), 0],
        [0, 0, 1]
    ]
}

const degreesToRadians = (degrees) => {
    return degrees * (Math.PI / 180);
}


let resultsCache = {};
const rotate = (points, axis, degree, negate = false) => {
    degree = degreesToRadians(degree);
    return points.map(point => {
        let a, b, c;
        a = point[0];
        b = point[1];
        c = point[2];
        let rot;
        if (axis === 'x') {
            if (negate) {
                c = -point[2];
                a = -point[0];
            }
            rot = rx(degree);
        } else if (axis === 'y') {
            if (negate) {
                c = -point[2];
                b = -point[1];
            }
            rot = ry(degree);
        } else if (axis === 'z') {
            if (negate) {
                b = -point[1];
                c = -point[2];
            }
            rot = rz(degree);
        }
        let pointOut = multiplyMatrices(rot, [[a], [b], [c], ]).flat().map(Math.round);
        if (point[3]) {
            pointOut[3] = point[3];
        }
        return pointOut;
    })
}

let axies = ['x', 'y', 'z'];

let possibliities = [];
axies.forEach(axis => {
    let degrees = [0, 90, 180, 270];
    let neg = [false, true];
    
    degrees.forEach(deg => {
        neg.forEach(neg => {
            possibliities.push([axis, deg, neg]);
        });
    });
});

// possibliities = [['x', 0, false]];

// scanners.forEach((scanner, scannerIndex) => {
//     scanner.forEach(origin => {
//         let remappedPoints = scanner.map(point => [point[0] - origin[0], point[1] - origin[1], point[2] - origin[2]]);

//         scanners.forEach((otherScanner, otherScannerIndex) => {
//             if (otherScannerIndex !== scannerIndex) {
//                 otherScanner.forEach(otherOrigin => {
//                     let remappedOtherPoints = otherScanner.map(point => [point[0] - otherOrigin[0], point[1] - otherOrigin[1], point[2] - otherOrigin[2]]);
//                     console.log('\n')
//                     console.log(JSON.stringify(remappedOtherPoints));
//                     console.log(JSON.stringify(remappedPoints));
//                     let subOverlap = remappedPoints.filter(point => {
//                         return remappedOtherPoints.some(otherPoint => {
//                             return point[0] === otherPoint[0] && point[1] === otherPoint[1] && point[2] === otherPoint[2];
//                         });
//                     });
//                     console.log(subOverlap.length);
//                 });
//             }
//         });
//     });
// });

const manhattanDistance = (a, b) => {
    return Math.abs(a[0] - b[0]) + Math.abs(a[1] - b[1]) + Math.abs(a[2] - b[2]);
}

let count = 0;
while (scanners.length > 1) {
    let firstScanner = scanners.shift();
    let bestMatch = -1;
    let bestReplacement = [];
    let overlap = 0;
    console.log('possible points:', firstScanner.length * 24);

    possibliities.forEach((possibility, possibilityIndex) => {
        let rotated = rotate(firstScanner, possibility[0], possibility[1], possibility[2]);
        rotated.forEach(origin => {
            let remappedPoints = rotated.map((point) => [point[0] - origin[0], point[1] - origin[1], point[2] - origin[2], point[3]]);
            scanners.forEach((otherScanner, otherScannerIndex) => {
                // console.log('scanner size', otherScanner.length);
                otherScanner.forEach(otherOrigin => {
                    let remappedOtherPoints = otherScanner.map(point => [point[0] - otherOrigin[0], point[1] - otherOrigin[1], point[2] - otherOrigin[2], point[3]]);

                    let res = remappedPoints.reduce((acc, point) => {
                        if (remappedOtherPoints.some(otherPoint => {
                            return point[0] === otherPoint[0] && point[1] === otherPoint[1] && point[2] === otherPoint[2];
                        })) {
                            acc.overlap.push(point);
                        } else {
                            acc.diff.push(point);
                        }
                        return acc;
                    }, { diff: [], overlap: []});
                    // console.log(res);

                    if (res.overlap.length > overlap) {
                        // console.log(res.diff.length);
                        overlap = res.overlap.length;
                        
                        bestReplacement = remappedOtherPoints.concat(res.diff);
                        // bestReplacement.push([-otherOrigin[0],-otherOrigin[1],-otherOrigin[2],'S']);
                        // bestReplacement.push([-origin[0],-origin[1],-origin[2],'S']);

                        bestMatch = otherScannerIndex;
                    }
                });
            });
        });
    });
    console.log('overlap', overlap);
    // if (overlap < 12) {
    //     scanners.push(firstScanner);
    //     continue;
    // }
    if (bestMatch > -1) {
        console.log(bestMatch, overlap);
        // scanners[bestMatch] = bestReplacement;
        scanners.splice(bestMatch, 1);
        scanners.unshift(bestReplacement);
    }
    // console.log(count, scanners.length);
    count++;
}
let scannerPoints = [];
scanners[0].forEach(point => {
    if (point[3] === 'S') {
        console.log(point);
        scannerPoints.push(point);
    }   
})

let bestDistance = 0;
scannerPoints.forEach(point => {
    scannerPoints.forEach(otherPoint => {
        if (point !== otherPoint) {
            bestDistance = Math.max(bestDistance, manhattanDistance(point, otherPoint));
        }
    });
});
console.log(bestDistance);

// console.log(scanners[0].length);


// scanners.forEach((scanner, scannerIndex) => {
//     let overlap = 0;
//     let overlapIndex = 0;
//     let bestScannerIndex = -1;
//     possibliities.forEach((possibility, possibilityIndex) => {

//         let rotated = rotate(scannerIndex, scanner, possibility[0], possibility[1], possibility[2]);

//         rotated.forEach(origin => {
//             let remappedPoints = rotated.map((point) => [point[0] - origin[0], point[1] - origin[1], point[2] - origin[2]]);
//             [remapped, ...scanners].forEach((otherScanner, otherScannerIndex) => {
//                 if ([otherScannerIndex - 1] !== scannerIndex) {
//                     // possibliities.forEach(otherPossibility => {
//                     //     let otherRotated = rotate(otherScannerIndex, otherScanner, otherPossibility[0], otherPossibility[1], otherPossibility[2]);
//                     let remappedOtherPoints = otherScanner.map(point => [point[0] - otherOrigin[0], point[1] - otherOrigin[1], point[2] - otherOrigin[2]]);

//                     let subOverlap = remappedPoints.filter(point => {
//                         return remappedOtherPoints.some(otherPoint => {
//                             return point[0] === otherPoint[0] && point[1] === otherPoint[1] && point[2] === otherPoint[2];
//                         });
//                     });

//                     if (subOverlap.length > overlap) {
//                         overlap = subOverlap.length;
//                         overlapIndex = possibilityIndex;
//                     }
//                 }
//             });
//         });

//     });
//     console.log(`${scannerIndex} ${overlapIndex}: ${overlap}`);

// });


// console.log(j)