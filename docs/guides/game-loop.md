# The Game Loop

The game loop is the heart of any game. It's responsible for updating game logic and rendering graphics at a consistent rate.

## Understanding the Game Loop

A typical game loop consists of three phases:

1. **Process Input** - Handle keyboard, mouse, and other inputs
2. **Update** - Update game state, physics, AI, etc.
3. **Render** - Draw everything to the screen

```
┌─────────────────────────────────────────┐
│              Game Loop                   │
│                                          │
│  ┌──────────┐  ┌──────────┐  ┌────────┐ │
│  │  Input   │→ │  Update  │→ │ Render │ │
│  └──────────┘  └──────────┘  └────────┘ │
│        ↑                          │      │
│        └──────────────────────────┘      │
└─────────────────────────────────────────┘
```

## Basic Game Loop

```javascript
// Game loop variables
let lastTime = 0;
let running = true;

function gameLoop(currentTime) {
    if (!running) return;
    
    // Calculate delta time (time since last frame)
    const deltaTime = currentTime - lastTime;
    lastTime = currentTime;
    
    // 1. Process Input
    processInput();
    
    // 2. Update game state
    update(deltaTime);
    
    // 3. Render
    render();
    
    // Request next frame
    requestAnimationFrame(gameLoop);
}

// Start the loop
requestAnimationFrame(gameLoop);
```

## Delta Time

Delta time is crucial for frame-rate independent movement. Without it, your game would run at different speeds on different computers.

### Wrong Way (Frame-Dependent)

```javascript
// BAD: Movement depends on frame rate
function update() {
    player.x += 5; // 5 pixels per frame
    // At 60 FPS: 300 pixels/second
    // At 30 FPS: 150 pixels/second
}
```

### Correct Way (Time-Based)

```javascript
// GOOD: Movement is consistent regardless of frame rate
function update(deltaTime) {
    const speed = 200; // pixels per second
    player.x += speed * (deltaTime / 1000);
    // Always 200 pixels per second
}
```

## Fixed Time Step

For physics and gameplay consistency, use a fixed time step:

```javascript
const FIXED_DELTA = 1000 / 60; // 60 updates per second
let accumulator = 0;

function gameLoop(currentTime) {
    const deltaTime = currentTime - lastTime;
    lastTime = currentTime;
    
    accumulator += deltaTime;
    
    // Fixed update loop
    while (accumulator >= FIXED_DELTA) {
        fixedUpdate(FIXED_DELTA);
        accumulator -= FIXED_DELTA;
    }
    
    // Variable render
    render();
    
    requestAnimationFrame(gameLoop);
}

function fixedUpdate(dt) {
    // Physics, collision detection, game logic
    physics.update(dt);
    engine.update(dt);
}
```

## Complete Game Loop Example

```javascript
import { Engine, Scene, Camera, timers, logger } from './xernengine.js';

class Game {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        
        this.engine = new Engine(canvas);
        this.camera = new Camera(canvas.width, canvas.height);
        
        this.lastTime = 0;
        this.running = false;
        this.paused = false;
        
        // Performance tracking
        this.fps = 0;
        this.frameCount = 0;
        this.fpsTime = 0;
        
        // Fixed timestep
        this.fixedDelta = 1000 / 60;
        this.accumulator = 0;
    }
    
    start() {
        this.running = true;
        this.lastTime = performance.now();
        requestAnimationFrame((t) => this.loop(t));
        logger.info('Game started');
    }
    
    stop() {
        this.running = false;
        logger.info('Game stopped');
    }
    
    pause() {
        this.paused = true;
        logger.info('Game paused');
    }
    
    resume() {
        this.paused = false;
        this.lastTime = performance.now();
        logger.info('Game resumed');
    }
    
    loop(currentTime) {
        if (!this.running) return;
        
        const deltaTime = currentTime - this.lastTime;
        this.lastTime = currentTime;
        
        // Calculate FPS
        this.frameCount++;
        this.fpsTime += deltaTime;
        if (this.fpsTime >= 1000) {
            this.fps = this.frameCount;
            this.frameCount = 0;
            this.fpsTime = 0;
        }
        
        if (!this.paused) {
            // Process input (handled via event listeners)
            
            // Fixed update for physics
            this.accumulator += deltaTime;
            while (this.accumulator >= this.fixedDelta) {
                this.fixedUpdate(this.fixedDelta);
                this.accumulator -= this.fixedDelta;
            }
            
            // Variable update
            this.update(deltaTime);
        }
        
        // Always render (even when paused)
        this.render();
        
        requestAnimationFrame((t) => this.loop(t));
    }
    
    fixedUpdate(dt) {
        // Physics and collision detection
        // These need consistent timing
    }
    
    update(dt) {
        // Update engine
        this.engine.update(dt);
        
        // Update camera
        this.camera.update(dt);
        
        // Update timers
        timers.update(dt);
    }
    
    render() {
        const ctx = this.ctx;
        
        // Clear screen
        ctx.fillStyle = '#1a1a2e';
        ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Apply camera transform
        ctx.save();
        const offset = this.camera.getOffset();
        ctx.translate(offset.x, offset.y);
        
        // Render game
        this.engine.render(ctx);
        
        ctx.restore();
        
        // Render UI (not affected by camera)
        this.renderUI(ctx);
    }
    
    renderUI(ctx) {
        // FPS counter
        ctx.fillStyle = '#ffffff';
        ctx.font = '14px monospace';
        ctx.fillText(`FPS: ${this.fps}`, 10, 20);
        
        if (this.paused) {
            ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
            ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
            
            ctx.fillStyle = '#ffffff';
            ctx.font = '48px Arial';
            ctx.textAlign = 'center';
            ctx.fillText('PAUSED', this.canvas.width / 2, this.canvas.height / 2);
            ctx.textAlign = 'left';
        }
    }
}

// Usage
const canvas = document.getElementById('gameCanvas');
const game = new Game(canvas);
game.start();

// Pause on blur
window.addEventListener('blur', () => game.pause());
window.addEventListener('focus', () => game.resume());
```

## Best Practices

### 1. Separate Update and Render

Keep update logic separate from rendering:

```javascript
// Good
function update(dt) {
    player.x += player.vx * dt;
}

function render(ctx) {
    ctx.drawImage(playerSprite, player.x, player.y);
}

// Bad - mixing concerns
function update(dt, ctx) {
    player.x += player.vx * dt;
    ctx.drawImage(playerSprite, player.x, player.y); // Don't render in update!
}
```

### 2. Handle Tab Visibility

Pause your game when the tab is not visible:

```javascript
document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        game.pause();
    } else {
        game.resume();
    }
});
```

### 3. Cap Delta Time

Prevent spiral of death when tab comes back:

```javascript
const MAX_DELTA = 100; // Cap at 100ms

function loop(currentTime) {
    let deltaTime = currentTime - lastTime;
    deltaTime = Math.min(deltaTime, MAX_DELTA); // Cap delta time
    // ...
}
```

### 4. Use Performance.now()

Always use `performance.now()` instead of `Date.now()` for timing:

```javascript
// Good - high precision
const start = performance.now();
// ... some operation
const elapsed = performance.now() - start;

// Bad - lower precision
const start = Date.now();
```

## Next Steps

- [Scenes & Entities](scenes-entities.md)
- [Rendering](rendering.md)
- [Input Handling](input.md)
