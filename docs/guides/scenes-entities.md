# Scenes and Entities

XernEngine uses a Scene-Entity architecture to organize your game. Scenes contain entities, and entities are the objects in your game world.

## Overview

```
Engine
  └── Scenes
        └── Entities (Characters, Sprites, Objects)
```

## Scenes

A Scene is a container for game objects. Think of it as a level, screen, or game state.

### Creating a Scene

```javascript
import { Scene } from './xernengine.js';

// Create a new scene
const menuScene = new Scene();
const gameScene = new Scene();
const pauseScene = new Scene();
```

### Adding Entities to a Scene

```javascript
// Create entities
const player = createPlayer();
const enemy = createEnemy();
const background = createBackground();

// Add to scene
gameScene.addEntity(background);
gameScene.addEntity(player);
gameScene.addEntity(enemy);
```

### Removing Entities

```javascript
// Remove specific entity
gameScene.removeEntity(enemy);

// Clear all entities
gameScene.entities = [];
```

### Scene Methods

```javascript
class Scene {
    constructor() {
        this.entities = [];
    }
    
    // Add entity to scene
    addEntity(entity) {
        this.entities.push(entity);
    }
    
    // Remove entity from scene
    removeEntity(entity) {
        this.entities = this.entities.filter(e => e !== entity);
    }
    
    // Update all entities
    update(deltaTime) {
        this.entities.forEach(entity => entity.update(deltaTime));
    }
    
    // Draw all entities
    draw(context) {
        this.entities.forEach(entity => entity.draw(context));
    }
}
```

## Entities

Entities are the basic building blocks of your game. Every game object (player, enemy, bullet, tree) is an entity.

### Entity Interface

All entities must implement `update()` and `draw()` methods:

```javascript
// Basic entity structure
const entity = {
    x: 0,
    y: 0,
    
    update(deltaTime) {
        // Update logic here
    },
    
    draw(context) {
        // Render logic here
    }
};
```

### Creating a Custom Entity Class

```javascript
class Entity {
    constructor(x = 0, y = 0) {
        this.x = x;
        this.y = y;
        this.width = 32;
        this.height = 32;
        this.active = true;
        this.visible = true;
    }
    
    update(deltaTime) {
        // Override in subclass
    }
    
    draw(context) {
        // Override in subclass
    }
    
    // Utility methods
    getBounds() {
        return {
            x: this.x,
            y: this.y,
            width: this.width,
            height: this.height
        };
    }
    
    isCollidingWith(other) {
        const a = this.getBounds();
        const b = other.getBounds();
        return a.x < b.x + b.width &&
               a.x + a.width > b.x &&
               a.y < b.y + b.height &&
               a.y + a.height > b.y;
    }
}
```

### Player Entity Example

```javascript
class Player extends Entity {
    constructor(x, y) {
        super(x, y);
        this.width = 32;
        this.height = 48;
        this.speed = 200;
        this.color = '#3498db';
        this.health = 100;
        this.maxHealth = 100;
        
        // Velocity
        this.vx = 0;
        this.vy = 0;
    }
    
    update(deltaTime) {
        const dt = deltaTime / 1000;
        
        // Apply velocity
        this.x += this.vx * dt;
        this.y += this.vy * dt;
        
        // Reset velocity (will be set by input handler)
        this.vx = 0;
        this.vy = 0;
    }
    
    draw(ctx) {
        if (!this.visible) return;
        
        // Draw player
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x, this.y, this.width, this.height);
        
        // Draw health bar
        const barWidth = this.width;
        const barHeight = 4;
        const healthPercent = this.health / this.maxHealth;
        
        ctx.fillStyle = '#333';
        ctx.fillRect(this.x, this.y - 10, barWidth, barHeight);
        
        ctx.fillStyle = healthPercent > 0.3 ? '#2ecc71' : '#e74c3c';
        ctx.fillRect(this.x, this.y - 10, barWidth * healthPercent, barHeight);
    }
    
    moveUp() { this.vy = -this.speed; }
    moveDown() { this.vy = this.speed; }
    moveLeft() { this.vx = -this.speed; }
    moveRight() { this.vx = this.speed; }
    
    takeDamage(amount) {
        this.health = Math.max(0, this.health - amount);
        if (this.health <= 0) {
            this.die();
        }
    }
    
    die() {
        this.active = false;
        // Trigger game over or respawn
    }
}
```

### Enemy Entity Example

```javascript
class Enemy extends Entity {
    constructor(x, y, target) {
        super(x, y);
        this.width = 24;
        this.height = 24;
        this.speed = 80;
        this.color = '#e74c3c';
        this.target = target;
        this.health = 30;
    }
    
    update(deltaTime) {
        if (!this.active || !this.target) return;
        
        const dt = deltaTime / 1000;
        
        // Simple AI: move towards target
        const dx = this.target.x - this.x;
        const dy = this.target.y - this.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance > 0) {
            const dirX = dx / distance;
            const dirY = dy / distance;
            
            this.x += dirX * this.speed * dt;
            this.y += dirY * this.speed * dt;
        }
    }
    
    draw(ctx) {
        if (!this.visible) return;
        
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(
            this.x + this.width / 2,
            this.y + this.height / 2,
            this.width / 2,
            0,
            Math.PI * 2
        );
        ctx.fill();
    }
}
```

## Managing Multiple Scenes

Use the Engine class to manage scene switching:

```javascript
import { Engine, Scene } from './xernengine.js';

const engine = new Engine(canvas);

// Create scenes
const scenes = {
    menu: new Scene(),
    game: new Scene(),
    pause: new Scene(),
    gameOver: new Scene()
};

// Populate scenes
setupMenuScene(scenes.menu);
setupGameScene(scenes.game);
setupPauseScene(scenes.pause);
setupGameOverScene(scenes.gameOver);

// Set initial scene
engine.setActiveScene(scenes.menu);

// Scene transitions
function startGame() {
    resetGameState();
    engine.setActiveScene(scenes.game);
}

function pauseGame() {
    engine.setActiveScene(scenes.pause);
}

function resumeGame() {
    engine.setActiveScene(scenes.game);
}

function gameOver() {
    engine.setActiveScene(scenes.gameOver);
}

function returnToMenu() {
    engine.setActiveScene(scenes.menu);
}
```

## Scene Manager Pattern

For complex games, use a dedicated Scene Manager:

```javascript
class SceneManager {
    constructor(engine) {
        this.engine = engine;
        this.scenes = new Map();
        this.currentScene = null;
        this.previousScene = null;
    }
    
    register(name, scene) {
        this.scenes.set(name, scene);
    }
    
    switch(name, data = null) {
        const scene = this.scenes.get(name);
        if (!scene) {
            throw new Error(`Scene "${name}" not found`);
        }
        
        // Exit current scene
        if (this.currentScene && this.currentScene.onExit) {
            this.currentScene.onExit();
        }
        
        this.previousScene = this.currentScene;
        this.currentScene = scene;
        
        // Enter new scene
        if (scene.onEnter) {
            scene.onEnter(data);
        }
        
        this.engine.setActiveScene(scene);
    }
    
    back(data = null) {
        if (this.previousScene) {
            this.switch(this.getSceneName(this.previousScene), data);
        }
    }
    
    getSceneName(scene) {
        for (const [name, s] of this.scenes) {
            if (s === scene) return name;
        }
        return null;
    }
}

// Usage
const sceneManager = new SceneManager(engine);

sceneManager.register('menu', menuScene);
sceneManager.register('game', gameScene);
sceneManager.register('pause', pauseScene);

sceneManager.switch('menu');
// Later...
sceneManager.switch('game', { level: 1 });
```

## Entity Groups

For managing many entities of the same type:

```javascript
class EntityGroup {
    constructor() {
        this.entities = [];
    }
    
    add(entity) {
        this.entities.push(entity);
    }
    
    remove(entity) {
        const index = this.entities.indexOf(entity);
        if (index > -1) {
            this.entities.splice(index, 1);
        }
    }
    
    update(deltaTime) {
        // Update in reverse to safely remove entities
        for (let i = this.entities.length - 1; i >= 0; i--) {
            const entity = this.entities[i];
            if (entity.active) {
                entity.update(deltaTime);
            } else {
                this.entities.splice(i, 1);
            }
        }
    }
    
    draw(context) {
        this.entities.forEach(entity => {
            if (entity.visible) {
                entity.draw(context);
            }
        });
    }
    
    forEach(callback) {
        this.entities.forEach(callback);
    }
    
    find(predicate) {
        return this.entities.find(predicate);
    }
    
    clear() {
        this.entities = [];
    }
    
    get count() {
        return this.entities.length;
    }
}

// Usage
const bullets = new EntityGroup();
const enemies = new EntityGroup();

// In game loop
bullets.update(deltaTime);
enemies.update(deltaTime);

bullets.draw(ctx);
enemies.draw(ctx);
```

## Best Practices

1. **Keep entities simple** - Each entity should do one thing well
2. **Use composition** - Combine simple entities to create complex behavior
3. **Clean up inactive entities** - Remove or recycle entities that are no longer needed
4. **Layer your rendering** - Draw background first, then game objects, then UI
5. **Use scene lifecycle methods** - `onEnter()`, `onExit()`, `onPause()`, `onResume()`

## Next Steps

- [Rendering](rendering.md)
- [Input Handling](input.md)
- [Animation](../api/animation.md)
