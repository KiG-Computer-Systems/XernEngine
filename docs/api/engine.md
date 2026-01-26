# Engine API

The `Engine` class is the core of XernEngine. It manages scenes, game loop, and orchestrates all game systems.

## Import

```javascript
import { Engine } from './xernengine.js';
```

## Constructor

```javascript
const engine = new Engine(canvas);
```

### Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| `canvas` | `HTMLCanvasElement` | The canvas element for rendering |

### Throws

- `Error` if canvas is null or undefined
- `Error` if canvas is not an object
- `Error` if canvas has no `getContext` method

## Properties

| Property | Type | Description |
|----------|------|-------------|
| `canvas` | `HTMLCanvasElement` | The canvas element |
| `scenes` | `Array<Scene>` | List of all registered scenes |
| `activeScene` | `Scene` | Currently active scene |

## Methods

### addScene(scene)

Adds a scene to the engine.

```javascript
const menuScene = new Scene();
const gameScene = new Scene();

engine.addScene(menuScene);
engine.addScene(gameScene);
```

**Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| `scene` | `Scene` | The scene to add |

**Notes:**
- If no active scene is set, the first added scene becomes active

---

### setActiveScene(scene)

Sets the currently active scene.

```javascript
engine.setActiveScene(gameScene);
```

**Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| `scene` | `Scene` | The scene to activate |

**Throws:**
- `Error` if scene is null or not an object
- `Error` if scene has no `update` method
- `Error` if scene has no `draw` method

---

### update(deltaTime)

Updates the active scene.

```javascript
// In game loop
engine.update(deltaTime);
```

**Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| `deltaTime` | `number` | Time since last frame in milliseconds |

---

### render(context)

Renders the active scene.

```javascript
// In game loop
engine.render(ctx);
```

**Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| `context` | `CanvasRenderingContext2D` | The 2D rendering context |

## Complete Example

```javascript
import { Engine, Scene } from './xernengine.js';

// Setup
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const engine = new Engine(canvas);

// Create scenes
const menuScene = new Scene();
const gameScene = new Scene();

// Add entities to scenes
menuScene.addEntity({
    update(dt) {},
    draw(ctx) {
        ctx.fillStyle = '#fff';
        ctx.font = '32px Arial';
        ctx.fillText('Press ENTER to Start', 200, 300);
    }
});

// Add player to game scene
const player = {
    x: 400,
    y: 300,
    speed: 200,
    update(dt) {
        // Movement logic
    },
    draw(ctx) {
        ctx.fillStyle = '#3498db';
        ctx.fillRect(this.x - 25, this.y - 25, 50, 50);
    }
};
gameScene.addEntity(player);

// Register scenes
engine.addScene(menuScene);
engine.addScene(gameScene);

// Start with menu
engine.setActiveScene(menuScene);

// Input handling
document.addEventListener('keydown', (e) => {
    if (e.code === 'Enter' && engine.activeScene === menuScene) {
        engine.setActiveScene(gameScene);
    }
    if (e.code === 'Escape' && engine.activeScene === gameScene) {
        engine.setActiveScene(menuScene);
    }
});

// Game loop
let lastTime = 0;

function gameLoop(currentTime) {
    const deltaTime = currentTime - lastTime;
    lastTime = currentTime;
    
    // Clear
    ctx.fillStyle = '#1a1a2e';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Update and render
    engine.update(deltaTime);
    engine.render(ctx);
    
    requestAnimationFrame(gameLoop);
}

requestAnimationFrame(gameLoop);
```

## Quick Start Helper

XernEngine provides a `createGame()` helper for quick setup:

```javascript
import { createGame, Scene } from './xernengine.js';

const game = createGame({
    canvas: document.getElementById('gameCanvas'),
    width: 800,
    height: 600
});

// Access engine components
game.engine;      // Engine instance
game.renderer;    // Renderer instance
game.camera;      // Camera instance

// Control game
game.start();     // Start game loop
game.stop();      // Stop game loop
game.pause();     // Pause game
game.resume();    // Resume game
```

## Related

- [Scene API](scene.md)
- [Renderer API](renderer.md)
- [Game Loop Guide](../guides/game-loop.md)
