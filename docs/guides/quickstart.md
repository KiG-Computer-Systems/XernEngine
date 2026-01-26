# Quick Start Guide

This guide will help you create your first game with XernEngine in under 10 minutes.

## Prerequisites

- Node.js 16 or higher
- A modern web browser (Chrome, Firefox, Edge)
- Basic JavaScript knowledge

## Installation

1. Clone or download XernEngine:

```bash
git clone https://github.com/your-repo/xernengine.git
cd xernengine
```

2. Install dependencies:

```bash
npm install
```

3. Start the development server:

```bash
npm start
```

4. Open your browser at `http://localhost:8080`

## Project Structure

```
xernengine/
├── src/
│   ├── core/           # Engine core (renderer, physics, input)
│   ├── components/     # Game components (scene, character, sprite)
│   ├── utils/          # Utilities (math, events, timers)
│   └── index.js        # Entry point
├── examples/           # Example games
├── docs/               # Documentation
└── tests/              # Unit tests
```

## Creating Your First Game

### Step 1: Set Up the HTML

Create an HTML file with a canvas element:

```html
<!DOCTYPE html>
<html>
<head>
    <title>My First XernEngine Game</title>
    <style>
        canvas {
            border: 1px solid black;
            display: block;
            margin: 0 auto;
        }
    </style>
</head>
<body>
    <canvas id="gameCanvas" width="800" height="600"></canvas>
    <script type="module" src="game.js"></script>
</body>
</html>
```

### Step 2: Create the Game File

Create `game.js`:

```javascript
// Import engine modules
import { Engine, Scene, Renderer } from './src/xernengine.js';

// Get canvas and context
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Initialize engine
const engine = new Engine(canvas);
const renderer = new Renderer(canvas);

// Create main scene
const mainScene = new Scene();

// Simple player object
const player = {
    x: 400,
    y: 300,
    width: 50,
    height: 50,
    speed: 200,
    color: '#3498db',
    
    update(deltaTime) {
        // Movement handled via input
    },
    
    draw(ctx) {
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x - this.width/2, this.y - this.height/2, 
                     this.width, this.height);
    }
};

// Add player to scene
mainScene.addEntity(player);

// Set active scene
engine.setActiveScene(mainScene);

// Input handling
const keys = {};

document.addEventListener('keydown', (e) => {
    keys[e.code] = true;
});

document.addEventListener('keyup', (e) => {
    keys[e.code] = false;
});

// Game loop variables
let lastTime = 0;

function gameLoop(currentTime) {
    // Calculate delta time in seconds
    const deltaTime = (currentTime - lastTime) / 1000;
    lastTime = currentTime;
    
    // Handle input
    if (keys['KeyW'] || keys['ArrowUp']) {
        player.y -= player.speed * deltaTime;
    }
    if (keys['KeyS'] || keys['ArrowDown']) {
        player.y += player.speed * deltaTime;
    }
    if (keys['KeyA'] || keys['ArrowLeft']) {
        player.x -= player.speed * deltaTime;
    }
    if (keys['KeyD'] || keys['ArrowRight']) {
        player.x += player.speed * deltaTime;
    }
    
    // Keep player in bounds
    player.x = Math.max(player.width/2, Math.min(canvas.width - player.width/2, player.x));
    player.y = Math.max(player.height/2, Math.min(canvas.height - player.height/2, player.y));
    
    // Update
    engine.update(deltaTime * 1000); // Engine expects milliseconds
    
    // Clear screen
    ctx.fillStyle = '#1a1a2e';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Render
    engine.render(ctx);
    
    // Continue loop
    requestAnimationFrame(gameLoop);
}

// Start game
console.log('Game starting...');
requestAnimationFrame(gameLoop);
```

### Step 3: Run Your Game

Open the HTML file in a browser or use the dev server:

```bash
npm start
```

You should see a blue square that you can move with WASD or arrow keys!

## Next Steps

Now that you have a basic game running, explore these topics:

1. **[Sprites & Animation](./rendering.md)** - Learn to draw images and animate them
2. **[Collision Detection](./physics.md)** - Add physics and collision handling
3. **[Audio](./audio.md)** - Add sound effects and music
4. **[Scenes](./scenes-entities.md)** - Manage multiple game screens
5. **[Save System](../api/save-manager.md)** - Save and load game progress

## Common Issues

### "Canvas is null" Error

Make sure your script runs after the DOM is loaded:

```javascript
document.addEventListener('DOMContentLoaded', () => {
    // Your game code here
});
```

### WebGL Not Supported

XernEngine requires WebGL. Check browser compatibility or use a fallback:

```javascript
const gl = canvas.getContext('webgl');
if (!gl) {
    alert('WebGL is not supported in your browser');
}
```

### Performance Issues

- Use `requestAnimationFrame` instead of `setInterval`
- Implement object pooling for frequently created/destroyed objects
- Only render visible objects (culling)
