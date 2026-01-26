# API Reference

Complete API documentation for XernEngine.

## Core

| Module | Description |
|--------|-------------|
| [Engine](engine.md) | Main engine class, manages scenes and game loop |
| [Scene](scene.md) | Container for game entities |
| [Renderer](renderer.md) | WebGL rendering system |
| [Camera](camera.md) | Viewport management with follow, shake, zoom |

## Components

| Module | Description |
|--------|-------------|
| [Character](character.md) | Game character with sprites and scripts |
| [Animation](animation.md) | Sprite animation system |
| [Tilemap](tilemap.md) | Tile-based level creation |
| [ParticleEmitter](../guides/particles.md) | Particle effects system |

## Systems

| Module | Description |
|--------|-------------|
| [Audio](audio.md) | Sound effects and music (Web Audio API) |
| [Physics](physics.md) | Collision detection and resolution |
| [Input](../guides/input.md) | Keyboard, mouse, touch handling |

## Utilities

| Module | Description |
|--------|-------------|
| [Vector2](vector2.md) | 2D vector mathematics |
| [EventEmitter](events.md) | Publish-subscribe event system |
| [ObjectPool](object-pool.md) | Object pooling for performance |
| [StateMachine](state-machine.md) | Finite state machine |
| [Timer](timer.md) | Timers, delays, intervals |
| [SaveManager](save-manager.md) | Game save/load system |
| [Logger](logger.md) | Logging with levels |

## Quick Reference

### Creating a Game

```javascript
import { createGame, Scene } from './xernengine.js';

const game = createGame({
    canvas: document.getElementById('gameCanvas'),
    width: 800,
    height: 600
});

game.start();
```

### Manual Setup

```javascript
import { Engine, Scene, Renderer, Camera } from './xernengine.js';

const canvas = document.getElementById('gameCanvas');
const engine = new Engine(canvas);
const renderer = new Renderer(canvas);
const camera = new Camera(800, 600);

const scene = new Scene();
engine.addScene(scene);
engine.setActiveScene(scene);
```

### Entity Pattern

All entities must implement:

```javascript
const entity = {
    update(deltaTime) {
        // Update logic
    },
    draw(context) {
        // Render logic
    }
};

scene.addEntity(entity);
```

## Version

Current version: **1.0.0**

```javascript
import { VERSION } from './xernengine.js';
console.log(VERSION); // "1.0.0"
```
