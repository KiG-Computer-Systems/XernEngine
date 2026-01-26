# Camera API

The `Camera` class manages the game viewport, providing follow mechanics, shake effects, zoom, and coordinate transformations.

## Import

```javascript
import { Camera } from './xernengine.js';
```

## Constructor

```javascript
const camera = new Camera(width, height);
```

### Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| `width` | `number` | Viewport width in pixels |
| `height` | `number` | Viewport height in pixels |

## Properties

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `x` | `number` | 0 | Camera X position (top-left) |
| `y` | `number` | 0 | Camera Y position (top-left) |
| `width` | `number` | - | Viewport width |
| `height` | `number` | - | Viewport height |
| `zoom` | `number` | 1 | Zoom level (1 = normal) |
| `rotation` | `number` | 0 | Camera rotation in radians |
| `bounds` | `Object\|null` | null | World boundaries |
| `target` | `Object\|null` | null | Object to follow |
| `followSpeed` | `number` | 0.1 | Follow smoothing (0-1) |
| `deadzone` | `Object` | {x: 50, y: 50} | Deadzone for following |

## Methods

### setBounds(minX, minY, maxX, maxY)

Sets the world boundaries that the camera cannot move past.

```javascript
// Limit camera to a 2000x1500 world
camera.setBounds(0, 0, 2000, 1500);
```

**Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| `minX` | `number` | Minimum X boundary |
| `minY` | `number` | Minimum Y boundary |
| `maxX` | `number` | Maximum X boundary |
| `maxY` | `number` | Maximum Y boundary |

---

### follow(target, speed)

Makes the camera follow a target object.

```javascript
camera.follow(player, 0.1);
```

**Parameters:**

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `target` | `Object` | - | Object with x, y properties |
| `speed` | `number` | 0.1 | Follow speed (0-1, lower = smoother) |

---

### stopFollow()

Stops following the current target.

```javascript
camera.stopFollow();
```

---

### startShake(intensity, duration)

Starts a camera shake effect.

```javascript
// Shake on explosion
camera.startShake(15, 300);
```

**Parameters:**

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `intensity` | `number` | 10 | Shake intensity in pixels |
| `duration` | `number` | 500 | Duration in milliseconds |

---

### update(deltaTime)

Updates the camera position and effects.

```javascript
// In game loop
camera.update(deltaTime);
```

**Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| `deltaTime` | `number` | Time since last frame (ms) |

---

### getOffset()

Gets the current camera offset for rendering.

```javascript
const offset = camera.getOffset();
ctx.translate(offset.x, offset.y);
```

**Returns:** `{x: number, y: number}` - Offset to apply to rendering

---

### worldToScreen(worldX, worldY)

Converts world coordinates to screen coordinates.

```javascript
const screenPos = camera.worldToScreen(enemy.x, enemy.y);
// Use screenPos.x, screenPos.y for UI positioning
```

**Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| `worldX` | `number` | World X coordinate |
| `worldY` | `number` | World Y coordinate |

**Returns:** `{x: number, y: number}`

---

### screenToWorld(screenX, screenY)

Converts screen coordinates to world coordinates.

```javascript
// Convert mouse click to world position
const worldPos = camera.screenToWorld(mouse.x, mouse.y);
```

**Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| `screenX` | `number` | Screen X coordinate |
| `screenY` | `number` | Screen Y coordinate |

**Returns:** `{x: number, y: number}`

---

### isVisible(x, y, width, height)

Checks if a rectangle is visible in the camera viewport.

```javascript
// Only render visible enemies
enemies.forEach(enemy => {
    if (camera.isVisible(enemy.x, enemy.y, enemy.width, enemy.height)) {
        enemy.draw(ctx);
    }
});
```

**Parameters:**

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `x` | `number` | - | Object X position |
| `y` | `number` | - | Object Y position |
| `width` | `number` | 0 | Object width |
| `height` | `number` | 0 | Object height |

**Returns:** `boolean`

---

### centerOn(x, y)

Instantly centers the camera on a point.

```javascript
// Center on player spawn
camera.centerOn(player.x, player.y);
```

**Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| `x` | `number` | X coordinate to center on |
| `y` | `number` | Y coordinate to center on |

## Examples

### Basic Camera Setup

```javascript
import { Camera } from './xernengine.js';

const camera = new Camera(800, 600);

// Set world boundaries
camera.setBounds(0, 0, 2400, 1800);

// Follow player
camera.follow(player, 0.08);

// Game loop
function update(deltaTime) {
    camera.update(deltaTime);
}

function render(ctx) {
    ctx.save();
    
    // Apply camera transform
    const offset = camera.getOffset();
    ctx.translate(offset.x, offset.y);
    
    // Draw world
    drawWorld(ctx);
    
    ctx.restore();
    
    // Draw UI (not affected by camera)
    drawUI(ctx);
}
```

### Camera Shake on Impact

```javascript
class Player {
    takeDamage(amount) {
        this.health -= amount;
        
        // Shake camera based on damage
        const intensity = Math.min(amount / 2, 20);
        camera.startShake(intensity, 200);
        
        if (this.health <= 0) {
            // Big shake on death
            camera.startShake(30, 500);
        }
    }
}

// Shake on explosion
function createExplosion(x, y) {
    camera.startShake(15, 300);
    // ... create explosion particles
}
```

### Zoom Control

```javascript
// Zoom with mouse wheel
canvas.addEventListener('wheel', (e) => {
    e.preventDefault();
    
    const zoomSpeed = 0.1;
    if (e.deltaY < 0) {
        camera.zoom = Math.min(camera.zoom + zoomSpeed, 3);
    } else {
        camera.zoom = Math.max(camera.zoom - zoomSpeed, 0.5);
    }
});

// Apply zoom in render
function render(ctx) {
    ctx.save();
    
    const offset = camera.getOffset();
    ctx.translate(canvas.width / 2, canvas.height / 2);
    ctx.scale(camera.zoom, camera.zoom);
    ctx.translate(-canvas.width / 2 + offset.x, -canvas.height / 2 + offset.y);
    
    drawWorld(ctx);
    
    ctx.restore();
}
```

### Multiple Camera Modes

```javascript
class GameCamera extends Camera {
    constructor(width, height) {
        super(width, height);
        this.mode = 'follow';
        this.panTarget = null;
    }
    
    // Smooth pan to a location
    panTo(x, y, duration = 1000) {
        this.mode = 'pan';
        this.panTarget = { x, y };
        this.panDuration = duration;
        this.panElapsed = 0;
        this.panStart = { x: this.x + this.width / 2, y: this.y + this.height / 2 };
    }
    
    // Lock camera position
    lock() {
        this.mode = 'locked';
        this.stopFollow();
    }
    
    // Resume following
    unlock() {
        this.mode = 'follow';
    }
    
    update(deltaTime) {
        if (this.mode === 'pan' && this.panTarget) {
            this.panElapsed += deltaTime;
            const t = Math.min(this.panElapsed / this.panDuration, 1);
            
            // Ease out
            const ease = 1 - Math.pow(1 - t, 3);
            
            const newX = this.panStart.x + (this.panTarget.x - this.panStart.x) * ease;
            const newY = this.panStart.y + (this.panTarget.y - this.panStart.y) * ease;
            
            this.centerOn(newX, newY);
            
            if (t >= 1) {
                this.mode = 'follow';
                this.panTarget = null;
            }
        } else if (this.mode === 'follow') {
            super.update(deltaTime);
        }
        // 'locked' mode does nothing
    }
}

// Usage
const camera = new GameCamera(800, 600);
camera.follow(player);

// Cutscene
function startCutscene() {
    camera.panTo(boss.x, boss.y, 2000);
    setTimeout(() => {
        camera.panTo(player.x, player.y, 1000);
    }, 3000);
}
```

### Culling with Camera

```javascript
class Scene {
    draw(ctx) {
        // Only draw visible entities
        this.entities.forEach(entity => {
            if (camera.isVisible(entity.x, entity.y, entity.width, entity.height)) {
                entity.draw(ctx);
            }
        });
    }
}
```

## Related

- [Engine API](engine.md)
- [Rendering Guide](../guides/rendering.md)
- [Vector2 API](vector2.md)
