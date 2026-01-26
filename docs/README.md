# XernEngine Documentation

Welcome to the official documentation for **XernEngine** — a 2D game engine for browser-based games built with JavaScript and WebGL.

## Overview

XernEngine is a lightweight, code-first game engine similar to libGDX. Unlike visual editors like Unity or Godot, XernEngine requires you to write all game logic and rendering code manually. This approach gives you complete control over your game's behavior and performance.

## Philosophy

- **Code-First**: Everything is done through code — no visual editors
- **Manual Rendering**: You control exactly what gets drawn and when
- **Modular Design**: Use only what you need
- **WebGL Powered**: Hardware-accelerated 2D graphics
- **Lightweight**: No bloat, fast loading times

## Table of Contents

### Getting Started
- [Quick Start Guide](guides/quickstart.md)
- [Installation](guides/installation.md)
- [Project Structure](guides/project-structure.md)
- [Your First Game](guides/first-game.md)

### Core Concepts
- [Game Loop](guides/game-loop.md)
- [Scenes & Entities](guides/scenes-entities.md)
- [Rendering](guides/rendering.md)
- [Input Handling](guides/input.md)

### API Reference
- [Engine](api/engine.md)
- [Scene](api/scene.md)
- [Character](api/character.md)
- [Renderer](api/renderer.md)
- [Camera](api/camera.md)
- [Tilemap](api/tilemap.md)
- [Animation](api/animation.md)
- [Physics](api/physics.md)
- [Audio](api/audio.md)
- [Input](api/input.md)

### Utilities
- [Vector2](api/vector2.md)
- [EventEmitter](api/events.md)
- [ObjectPool](api/object-pool.md)
- [StateMachine](api/state-machine.md)
- [Timer](api/timer.md)
- [SaveManager](api/save-manager.md)
- [Logger](api/logger.md)

### Advanced Topics
- [Particle Systems](guides/particles.md)
- [Performance Optimization](guides/optimization.md)
- [Building for Production](guides/production.md)

## Quick Example

```javascript
import { Engine, Scene, Character, Sprite } from './xernengine.js';

// Get canvas element
const canvas = document.getElementById('gameCanvas');

// Create engine instance
const engine = new Engine(canvas);

// Create a scene
const gameScene = new Scene();

// Create a player character
const playerSprite = new Sprite('player.png');
const player = new Character('Hero', playerSprite);
player.setPosition(100, 100);

// Add player to scene
gameScene.addEntity(player);

// Set active scene
engine.setActiveScene(gameScene);

// Game loop
function gameLoop(timestamp) {
    const deltaTime = /* calculate delta */;
    
    // Update game logic
    engine.update(deltaTime);
    
    // Clear and render
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    engine.render(ctx);
    
    requestAnimationFrame(gameLoop);
}

// Start the game
requestAnimationFrame(gameLoop);
```

## Requirements

- Modern web browser with WebGL support
- Node.js 16+ (for development)
- npm or yarn

## License

XernEngine is licensed under Apache 2.0.
