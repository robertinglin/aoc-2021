
const data = `LA-sn
LA-mo
LA-zs
end-RD
sn-mo
end-zs
vx-start
mh-mo
mh-start
zs-JI
JQ-mo
zs-mo
start-JQ
rk-zs
mh-sn
mh-JQ
RD-mo
zs-JQ
vx-sn
RD-sn
vx-mh
JQ-vx
LA-end
JQ-sn`;

const parse = (input) => {
    const lines = input.split('\n');
    const graph = {};
    lines.forEach(line => {
        let [from, to] = line.split('-');
        // if (to === 'start') {
        //     to = from;
        //     from = 'start';
        // }
        graph[to] = graph[to] || [];
        graph[to].push(from);
        graph[from] = graph[from] || [];
        graph[from].push(to);
    });
    return graph;
};

const occurances = (node, path) =>
    path.reduce((acc, curr) => {
        if (curr === node) return acc + 1;
        return acc;
    }, 0); 

const isLower = (c) => c.toLowerCase() === c;

const canVisit = (node, path) => {
    if (!path.includes(node)) return true;
    
    if (!isLower(node)) return true;

    if (node === 'start') return false;
    
    const lowerFreq = path.reduce((lowerFreq, pathNode) => {
        if (isLower(pathNode)) {
            lowerFreq[pathNode] = (lowerFreq[pathNode] || 0) + 1;
        }
        return lowerFreq;
    }, {});

    // const maxSingleFrequency = 1; // part 1
    const maxSingleFrequency = 3;

    return !Object.values(lowerFreq).includes(maxSingleFrequency);
}

const clonePath = (path) => ([...path]);
 
const solve = (graph) => {

    console.log(graph);

    const visit = (node, path) => {
        let newPaths = [];
        path.push(node);

        if (node === 'end') {
            return [path];
        }
        graph[node].forEach(next => {
            if (canVisit(next, path)) {
                newPaths = [...newPaths, ...visit(next, clonePath(path))];
            }
        });
        
        return newPaths;
    }

    const paths =  graph['start'].reduce((paths, node) => {
        const path = ['start'];
        return [...paths, ...visit(node, path)];
    }, [])
    
    return paths.length;


};

console.log(solve(parse(data)));