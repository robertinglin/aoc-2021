
var dataText = require('./data.js');
var parse = (text) => {
    return text.trim().split(',').map(Number);
} 

var solve = (data, days) => {

    let buckets = [
        { count: 0, suspended: 0 },
        { count: 0, suspended: 0 },
        { count: 0, suspended: 0 },
        { count: 0, suspended: 0 },
        { count: 0, suspended: 0 },
        { count: 0, suspended: 0 },
        { count: 0, suspended: 0 },
    ]
    data.forEach((fish) => {
        buckets[fish].count++;
    });

    for (let day = 0; day < days; day++) {
        const bucketDay = day%7;
        const bucket = buckets[bucketDay];
        const newFishBucket = buckets[(bucketDay+2)%7];
        newFishBucket.suspended += bucket.count;
        if (bucket.suspended > 0) {
            bucket.count += bucket.suspended;
            bucket.suspended = 0;
        }
    }
    return buckets.reduce((total, bucket) => { return total + bucket.count + bucket.suspended }, 0);
}

console.log(solve(parse(dataText), 256));