const infinity = 999999;
const djikstra = ({ board, start, goal, limitDistance }) => {
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
        current.connections.forEach(node => {
            const newDist = current.distance + 1;
            if(limitDistance && limitDistance < newDist){
                return; //stop the search
            }

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
        path: goalNode && goalNode.path && mapNodesToCoords(goalNode.path),
        valid: mapNodesToCoords(movableTiles),
    }
}

const getValid = ({ board, position, limitDistance }) => {
    const { valid } = djikstra({ board, start: position, goal: [-1000000, -1000000], limitDistance });
    return valid;
}

const getPath = ({ board, start, goal, limitDistance }) => {
    const { path } = djikstra({ board, start, goal, limitDistance });
    return path;
}

const boardExample = [
    [1, 1, 1, 1],
    [1, 0, 0, 1],
    [1, 1, 0, 1]
];

const startExample = [1, 2];

const goalExample = [2, 0];

export {
    getPath,
    getValid
}
