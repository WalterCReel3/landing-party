const boardExample = [
    [1, 1, 1, 1],
    [1, 0, 0, 1],
    [1, 1, 1, 1]
];

const startExample = [0, 1];

const goalExample = [0, 3];

const infinity = 999999;
const djikstra = ({ board, start, goal }) => {
    const unconnectedBoard = board.map((row, y) => {
        return row.map((binary, x) => {
            return {
                movable: !!binary,
                seen: false,
                distance: infinity,
                connections: [],
                x,
                y
            };
        });
    });
    const [sx, sy] = start;
    const [gx, gy] = goal;
    console.log(sx, sy)

    const resolve = (x, y) => {
        return unconnectedBoard[y] && unconnectedBoard[y][x];
    };

    const startNode = resolve(sx, sy);
    const goalNode = resolve(gx, gy);

    unconnectedBoard.forEach((row, y) => {
        row.forEach((node, x) => {
            const neighbors = [
                resolve(x, y - 1),
                resolve(x, y + 1),
                resolve(x - 1, y),
                resolve(x + 1, y)
            ];
            neighbors.forEach(neighbor => {
                neighbor && neighbor.movable && node.connections.push(neighbor);
            })
        });
    });

    const movableTiles = [];

    (() => {
        startNode.seen = true;
        startNode.distance = 0;
        startNode.path = [startNode];
        movableTiles.push(startNode);
    })();


    const categorizeUnknownNeighbors = ({ current }) => {
        if (!current.movable) {
            throw new Error("wtf, did you call on a non movable tile?");
        }
        current.connections.forEach(node => {
            const newDist = current.distance + 1;
            if (node.distance > newDist) {
                node.distance = newDist;
                const old = current.path.slice(0);
                node.path = old;
                node.path.push(node);

                if (!node.seen) {
                    movableTiles.push(node);
                    node.seen = true;
                }

                categorizeUnknownNeighbors({ current: node });
            }
        });
    }

    categorizeUnknownNeighbors({ current: startNode });

    const mapNodesToCoords = (nodeList) =>
        nodeList.map(node => ([node.x, node.y]));
    return {
        path: goalNode && mapNodesToCoords(goalNode.path),
        valid: mapNodesToCoords(movableTiles),
    }
}

const getValid = ({ board, position }) => {
    const { valid } = djikstra({ board, start: position, goal: [-1000000, -1000000] });
    return valid;
}

const getPath = ({ board, start, goal }) => {
    const { path } = djikstra({ board, start, goal });
    return path;
}

export {
    getPath,
    getValid
}