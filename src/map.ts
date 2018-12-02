import * as _ from "lodash";
import Phaser = require('phaser');
import Vector2 = Phaser.Math.Vector2;
import Tilemaps = Phaser.Tilemaps;

class MapObject {
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
    tilemap: Tilemaps.Tilemap;
    tileset: Tilemaps.Tileset;
    tileLayer: Tilemaps.StaticTilemapLayer;
    objectLayer: Tilemaps.ObjectLayer;
    mapObjects: Object;

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
    }

    loadMapObjects(objects: Array<any>) {
        this.mapObjects = {};
        objects.forEach((obj) => {
            let mapCoords = Map.screenToTileCoords(new Vector2(obj['x'], obj['y']));
            let mapObject = new MapObject(obj['type'], obj['name'], mapCoords);
            this.mapObjects[obj.name] = mapObject;
        });
    }

    getPlayerObject(): MapObject {
        return this.mapObjects['captain'];
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
        console.log(point);
        return new Vector2(Math.floor(point.x / Map.tileSize),
                           Math.floor(point.y / Map.tileSize));
    }

    static tileToScreenCoords(point: Vector2): Vector2 {
        return new Vector2(point.x * 64, point.y * 64);
    }
}
