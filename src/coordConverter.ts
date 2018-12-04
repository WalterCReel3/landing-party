const tileHeight = 64;
const tileWidth = 64;

const convertPixelToTile = (x: number, y: number) => {
    let newX: number = Math.floor(x/tileWidth);
    let newY: number = Math.floor(x/tileHeight);
    return {x: newX, y: newY};
};

const convertTileToPixel = (x: number, y: number) => {
    let newX: number = x * tileWidth + tileWidth / 2;
    let newY: number = y * tileHeight + tileHeight / 2;
    return {x: newX, y: newY};
};