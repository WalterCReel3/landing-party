import Phaser = require('phaser');
import Vector2 = Phaser.Math.Vector2;
import Tilemaps = Phaser.Tilemaps;

class MapObject {

}

export class Map  {
    tilemap: Tilemaps.Tilemap;
    tileset: Tilemaps.Tileset;
    tileLayer: Tilemaps.StaticTilemapLayer;
    objectLayer: Tilemaps.ObjectLayer;
    mapObjects: Object;
    initialCoords: Object;

    constructor(phaser: any, name: string) {
        // Create the empty tilemap
        this.tilemap = phaser.make.tilemap({key: name});

        // Link the tileset reference with the loaded image
        this.tileset = this.tilemap.addTilesetImage("2dtop-tileset-64", "tiles");

        // Pull the tile layer and merge it with the tileset assets
        this.tileLayer = this.tilemap.createStaticLayer("Tile Layer 1", this.tileset, 0, 0);

        // Define some tile attributes
        this.tileLayer.setCollisionBetween(0, 7);

        // Get the map objects layer
        this.objectLayer = this.tilemap.getObjectLayer('Object Layer 1');

        // Load up the map objects
        this.initialCoords = {};
        this.loadMapObjects(this.objectLayer.objects);
    }

    loadMapObjects(objects: Array<any>) {
        objects.forEach((obj) => {
            let mapCoords = new Vector2(obj['x'], obj['y']);
            this.initialCoords[obj.name] = Map.screenToTileCoords(mapCoords);
        });
    }

    release(): void {
        // unload resources against the scene
    }


    static tileSize = 64;

    static screenToTileCoords(point: Vector2): Vector2 {
        return new Vector2(Math.floor(point.x / Map.tileSize),
                           Math.floor(point.y / Map.tileSize));
    }

    static tileToScreenCoords(point: Vector2): Vector2 {
        return new Vector2(point.x * 64, point.y * 64);
    }
}
