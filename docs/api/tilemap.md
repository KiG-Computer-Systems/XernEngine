# Tilemap API

The `Tilemap` class provides tile-based level creation with support for multiple layers and collision detection.

## Import

```javascript
import { Tilemap } from './xernengine.js';
```

## Constructor

```javascript
const tilemap = new Tilemap(tileWidth, tileHeight, cols, rows);
```

**Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| `tileWidth` | `number` | Width of each tile in pixels |
| `tileHeight` | `number` | Height of each tile in pixels |
| `cols` | `number` | Number of columns |
| `rows` | `number` | Number of rows |

## Properties

| Property | Type | Description |
|----------|------|-------------|
| `tileWidth` | `number` | Tile width |
| `tileHeight` | `number` | Tile height |
| `cols` | `number` | Column count |
| `rows` | `number` | Row count |
| `layers` | `Map` | Map of layer data |
| `tileset` | `HTMLImageElement` | Tileset image |
| `tilesetCols` | `number` | Columns in tileset |
| `collisionTiles` | `Set` | Tile IDs that have collision |

## Methods

### setTileset(image, cols)

Sets the tileset image.

```javascript
const tilesetImage = await loadImage('assets/tileset.png');
tilemap.setTileset(tilesetImage, 10); // 10 tiles per row
```

**Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| `image` | `HTMLImageElement` | Tileset image |
| `cols` | `number` | Number of tile columns in image |

---

### createLayer(name, zIndex)

Creates a new empty layer.

```javascript
tilemap.createLayer('ground', 0);
tilemap.createLayer('walls', 1);
tilemap.createLayer('decorations', 2);
```

**Parameters:**

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `name` | `string` | - | Layer identifier |
| `zIndex` | `number` | 0 | Render order (higher = on top) |

**Returns:** `Array` - The layer data array

---

### loadLayer(name, data, zIndex)

Loads a layer from existing data.

```javascript
const levelData = [
    0, 0, 0, 1, 1, 1, 0, 0,
    0, 0, 1, 2, 2, 2, 1, 0,
    // ...
];
tilemap.loadLayer('ground', levelData, 0);
```

**Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| `name` | `string` | Layer identifier |
| `data` | `Array` | Array of tile IDs |
| `zIndex` | `number` | Render order |

---

### setTile(layer, col, row, tileId)

Sets a tile at a specific position.

```javascript
tilemap.setTile('ground', 5, 3, 15); // Set tile ID 15 at column 5, row 3
```

**Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| `layer` | `string` | Layer name |
| `col` | `number` | Column index |
| `row` | `number` | Row index |
| `tileId` | `number` | Tile ID (-1 for empty) |

---

### getTile(layer, col, row)

Gets the tile ID at a position.

```javascript
const tileId = tilemap.getTile('ground', 5, 3);
```

**Returns:** `number` - Tile ID or -1 if empty/out of bounds

---

### getTileAt(layer, x, y)

Gets tile ID at world coordinates.

```javascript
const tileId = tilemap.getTileAt('ground', player.x, player.y);
```

---

### setCollisionTiles(tileIds)

Sets which tile IDs should have collision.

```javascript
// Tiles 1, 2, 3, and 10 are solid
tilemap.setCollisionTiles([1, 2, 3, 10]);
```

---

### checkCollision(x, y, layer)

Checks if a point collides with solid tiles.

```javascript
if (tilemap.checkCollision(player.x, player.y)) {
    // Player is inside a wall!
}
```

**Parameters:**

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `x` | `number` | - | World X coordinate |
| `y` | `number` | - | World Y coordinate |
| `layer` | `string` | null | Specific layer (null = all) |

**Returns:** `boolean`

---

### checkRectCollision(x, y, width, height)

Checks collision for a rectangle.

```javascript
if (tilemap.checkRectCollision(player.x, player.y, player.width, player.height)) {
    // Player collides with tiles
}
```

---

### draw(ctx, camera)

Renders the tilemap.

```javascript
tilemap.draw(ctx, camera);
```

**Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| `ctx` | `CanvasRenderingContext2D` | Rendering context |
| `camera` | `Object` | Camera with x, y, width, height |

---

### getSize()

Gets the total map size in pixels.

```javascript
const size = tilemap.getSize();
// { width: 1600, height: 1200 }
```

---

### toJSON()

Exports the tilemap to JSON.

```javascript
const json = tilemap.toJSON();
localStorage.setItem('level1', JSON.stringify(json));
```

---

### Tilemap.fromJSON(json)

Creates a tilemap from JSON data.

```javascript
const json = JSON.parse(localStorage.getItem('level1'));
const tilemap = Tilemap.fromJSON(json);
```

## Examples

### Basic Level Setup

```javascript
import { Tilemap } from './xernengine.js';

// Create 50x40 tile map with 32x32 tiles
const tilemap = new Tilemap(32, 32, 50, 40);

// Load tileset
const tileset = new Image();
tileset.onload = () => {
    tilemap.setTileset(tileset, 10);
    initLevel();
};
tileset.src = 'assets/tileset.png';

function initLevel() {
    // Create layers
    tilemap.createLayer('background', 0);
    tilemap.createLayer('ground', 1);
    tilemap.createLayer('foreground', 10);
    
    // Fill background with grass (tile 0)
    for (let y = 0; y < 40; y++) {
        for (let x = 0; x < 50; x++) {
            tilemap.setTile('background', x, y, 0);
        }
    }
    
    // Add ground platform
    for (let x = 0; x < 50; x++) {
        tilemap.setTile('ground', x, 38, 5); // Top of platform
        tilemap.setTile('ground', x, 39, 15); // Bottom of platform
    }
    
    // Set collision tiles
    tilemap.setCollisionTiles([5, 6, 7, 15, 16, 17]);
}
```

### Loading From Level Data

```javascript
// Level data exported from editor
const level1 = {
    width: 20,
    height: 15,
    layers: {
        background: [
            0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
            // ... more rows
        ],
        collision: [
            -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
            1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, 1,
            // ... more rows
        ]
    },
    collisionTiles: [1, 2, 3, 4]
};

function loadLevel(levelData) {
    const tilemap = new Tilemap(32, 32, levelData.width, levelData.height);
    
    for (const [name, data] of Object.entries(levelData.layers)) {
        tilemap.loadLayer(name, data, name === 'foreground' ? 10 : 0);
    }
    
    tilemap.setCollisionTiles(levelData.collisionTiles);
    
    return tilemap;
}
```

### Platformer Collision

```javascript
class Player {
    constructor(tilemap) {
        this.tilemap = tilemap;
        this.x = 100;
        this.y = 100;
        this.width = 24;
        this.height = 32;
        this.vx = 0;
        this.vy = 0;
        this.isGrounded = false;
    }
    
    update(dt) {
        // Apply gravity
        this.vy += 1500 * dt;
        
        // Horizontal movement
        this.x += this.vx * dt;
        this.resolveHorizontalCollision();
        
        // Vertical movement
        this.y += this.vy * dt;
        this.resolveVerticalCollision();
    }
    
    resolveHorizontalCollision() {
        // Check corners
        const left = this.x;
        const right = this.x + this.width;
        const top = this.y;
        const bottom = this.y + this.height - 1;
        
        // Moving right
        if (this.vx > 0) {
            if (this.tilemap.checkCollision(right, top) ||
                this.tilemap.checkCollision(right, bottom)) {
                this.x = Math.floor(right / this.tilemap.tileWidth) * this.tilemap.tileWidth - this.width;
                this.vx = 0;
            }
        }
        // Moving left
        else if (this.vx < 0) {
            if (this.tilemap.checkCollision(left, top) ||
                this.tilemap.checkCollision(left, bottom)) {
                this.x = Math.floor(left / this.tilemap.tileWidth + 1) * this.tilemap.tileWidth;
                this.vx = 0;
            }
        }
    }
    
    resolveVerticalCollision() {
        const left = this.x + 2;
        const right = this.x + this.width - 2;
        const top = this.y;
        const bottom = this.y + this.height;
        
        this.isGrounded = false;
        
        // Falling
        if (this.vy > 0) {
            if (this.tilemap.checkCollision(left, bottom) ||
                this.tilemap.checkCollision(right, bottom)) {
                this.y = Math.floor(bottom / this.tilemap.tileHeight) * this.tilemap.tileHeight - this.height;
                this.vy = 0;
                this.isGrounded = true;
            }
        }
        // Jumping
        else if (this.vy < 0) {
            if (this.tilemap.checkCollision(left, top) ||
                this.tilemap.checkCollision(right, top)) {
                this.y = Math.floor(top / this.tilemap.tileHeight + 1) * this.tilemap.tileHeight;
                this.vy = 0;
            }
        }
    }
}
```

### Tilemap Editor Integration

```javascript
// Simple tile placement with mouse
class TileEditor {
    constructor(tilemap) {
        this.tilemap = tilemap;
        this.currentTile = 0;
        this.currentLayer = 'ground';
    }
    
    handleClick(mouseX, mouseY) {
        const col = Math.floor(mouseX / this.tilemap.tileWidth);
        const row = Math.floor(mouseY / this.tilemap.tileHeight);
        
        this.tilemap.setTile(this.currentLayer, col, row, this.currentTile);
    }
    
    handleRightClick(mouseX, mouseY) {
        const col = Math.floor(mouseX / this.tilemap.tileWidth);
        const row = Math.floor(mouseY / this.tilemap.tileHeight);
        
        // Erase tile
        this.tilemap.setTile(this.currentLayer, col, row, -1);
    }
    
    exportLevel() {
        return JSON.stringify(this.tilemap.toJSON());
    }
}
```

## Tileset Layout

Typical tileset organization:

```
[0 ][1 ][2 ][3 ][4 ][5 ][6 ][7 ][8 ][9 ]  <- Row 0: Terrain
[10][11][12][13][14][15][16][17][18][19]  <- Row 1: Walls
[20][21][22][23][24][25][26][27][28][29]  <- Row 2: Decorations
[30][31][32][33][34][35][36][37][38][39]  <- Row 3: Interactive
```

Tile ID formula: `tileId = row * columns + col`

## Related

- [Physics API](physics.md)
- [Camera API](camera.md)
- [Rendering Guide](../guides/rendering.md)
