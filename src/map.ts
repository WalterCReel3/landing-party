import * as _ from "lodash";
import Phaser = require('phaser');
import Vector2 = Phaser.Math.Vector2;
import Tilemaps = Phaser.Tilemaps;

export class MapObject {
    typeName: string;
    name: string;
    coords: Vector2;

    constructor(typeName: string, name: string, coords: Vector2) {
        this.typeName = typeName;
        this.name = name;
        this.coords = coords;
    }
}

export class Map  {
    // Map is responsible for bootstrapping the play field into the active game
    // scene with respect to graphical representation and game entity
    // _description_ and valid movement spaces represented by the board.  It is
    // the intent that a map can be swapped out for another in the main
    // GameScene seamlessly given the right screne transitions.

    tilemap: Tilemaps.Tilemap;
    tileset: Tilemaps.Tileset;
    tileLayer: Tilemaps.StaticTilemapLayer;
    objectLayer: Tilemaps.ObjectLayer;
    mapObjects: Object;
    board: Array<Array<number>>;

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
        this.loadMapObjects(this.objectLayer.objects);

        // Load up board representation
        this.loadBoard(this.tilemap);
    }

    loadMapObjects(objects: Array<any>): void {
        this.mapObjects = {};
        objects.forEach((obj) => {
            let mapCoords = Map.screenToTileCoords(new Vector2(obj['x'], obj['y']));
            let mapObject = new MapObject(obj['type'], obj['name'], mapCoords);
            this.mapObjects[obj.name] = mapObject;
        });
    }

    loadBoard(tilemap: Tilemaps.Tilemap): void {
        this.board = [];

        for (let j = 0; j < tilemap.height; j++) {
            let row = [];
            this.board.push(row);
            for (let i = 0; i < tilemap.width; i++) {
                let tile = tilemap.getTileAt(i, j);
                row.push(!tile.collideDown);
            }
        }
    }

    getPlayerObject(): MapObject {
        return this.mapObjects['captain'];
    }

    getObjectiveObject(): MapObject {
        return this.mapObjects['objective'];
    }

    getPursuerObject(): MapObject {
        return this.mapObjects['pursuer'];
    }

    getRedshirtObjects(): Array<MapObject> {
        let res = [];
        Object.keys(this.mapObjects).forEach((k) => {
            let v = this.mapObjects[k];
            if (v.typeName == 'redshirt') {
                res.push(v);
            }
        });
        return res;
    }

    release(): void {
        // unload resources against the scene
    }

    static tileSize = 64;

    static screenToTileCoords(point: Vector2): Vector2 {
        return new Vector2(Math.floor(point.x / Map.tileSize),
                           Math.floor(point.y / Map.tileSize));
    }

    static tileToSpriteCoords(point: Vector2): Vector2 {
        return new Vector2((point.x * 64) + 33, (point.y * 64) + 32);
    }

    static tileToScreenCoords(point: Vector2): Vector2 {
        return new Vector2((point.x * 64), (point.y * 64));
    }
}
