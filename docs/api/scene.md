# Scene API

The `Scene` class is a container for game entities. It manages updating and rendering all entities within it.

## Import

```javascript
import { Scene } from './xernengine.js';
```

## Constructor

```javascript
const scene = new Scene();
```

Creates a new empty scene.

## Properties

| Property | Type | Description |
|----------|------|-------------|
| `entities` | `Array` | List of all entities in the scene |

## Methods

### addEntity(entity)

Adds an entity to the scene.

```javascript
const player = new Player();
scene.addEntity(player);
```

**Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| `entity` | `Object` | Entity with `update()` and `draw()` methods |

**Throws:**
- `Error` if entity is null or undefined

**Notes:**
- Entities must implement `update(deltaTime)` and `draw(context)` methods

---

### removeEntity(entity)

Removes an entity from the scene.

```javascript
scene.removeEntity(enemy);
```

**Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| `entity` | `Object` | The entity to remove |

---

### update(deltaTime)

Updates all entities in the scene.

```javascript
scene.update(deltaTime);
```

**Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| `deltaTime` | `number` | Time since last frame (milliseconds) |

---

### draw(context)

Renders all entities in the scene.

```javascript
scene.draw(ctx);
```

**Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| `context` | `CanvasRenderingContext2D` | The 2D rendering context |

## Entity Interface

Entities added to a scene must implement:

```javascript
const entity = {
    // Called every frame with delta time
    update(deltaTime) {
        // Update logic
    },
    
    // Called every frame for rendering
    draw(context) {
        // Render logic
    }
};
```

## Examples

### Basic Scene Setup

```javascript
import { Scene } from './xernengine.js';

const gameScene = new Scene();

// Simple entity object
const player = {
    x: 100,
    y: 100,
    width: 32,
    height: 32,
    speed: 200,
    
    update(dt) {
        // Movement handled by input system
    },
    
    draw(ctx) {
        ctx.fillStyle = '#3498db';
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }
};

gameScene.addEntity(player);
```

### Multiple Entities

```javascript
const scene = new Scene();

// Background (drawn first)
scene.addEntity({
    update(dt) {},
    draw(ctx) {
        ctx.fillStyle = '#2c3e50';
        ctx.fillRect(0, 0, 800, 600);
    }
});

// Game objects
for (let i = 0; i < 10; i++) {
    scene.addEntity(createEnemy(Math.random() * 800, Math.random() * 600));
}

// Player (drawn last, on top)
scene.addEntity(player);
```

### Extending Scene

```javascript
class GameScene extends Scene {
    constructor() {
        super();
        this.score = 0;
        this.paused = false;
    }
    
    onEnter(data) {
        // Called when scene becomes active
        this.score = data?.score || 0;
        this.setupLevel(data?.level || 1);
    }
    
    onExit() {
        // Called when leaving scene
        this.cleanup();
    }
    
    setupLevel(level) {
        // Clear existing entities
        this.entities = [];
        
        // Add background
        this.addEntity(new Background());
        
        // Add player
        this.player = new Player(400, 300);
        this.addEntity(this.player);
        
        // Spawn enemies based on level
        for (let i = 0; i < level * 5; i++) {
            this.addEntity(new Enemy(
                Math.random() * 800,
                Math.random() * 600,
                this.player
            ));
        }
    }
    
    update(deltaTime) {
        if (this.paused) return;
        
        super.update(deltaTime);
        
        // Check for dead entities
        this.entities = this.entities.filter(e => e.active !== false);
    }
    
    cleanup() {
        this.entities = [];
    }
}
```

### Scene with Layers

```javascript
class LayeredScene extends Scene {
    constructor() {
        super();
        this.layers = {
            background: [],
            entities: [],
            effects: [],
            ui: []
        };
    }
    
    addToLayer(layer, entity) {
        if (this.layers[layer]) {
            this.layers[layer].push(entity);
            this.addEntity(entity);
        }
    }
    
    update(deltaTime) {
        // Update all layers
        for (const layerName of Object.keys(this.layers)) {
            this.layers[layerName].forEach(entity => {
                if (entity.active !== false) {
                    entity.update(deltaTime);
                }
            });
        }
    }
    
    draw(context) {
        // Draw in layer order
        const layerOrder = ['background', 'entities', 'effects', 'ui'];
        
        for (const layerName of layerOrder) {
            this.layers[layerName].forEach(entity => {
                if (entity.visible !== false) {
                    entity.draw(context);
                }
            });
        }
    }
}
```

## Scene Management Pattern

```javascript
// Scene manager for multiple scenes
class SceneManager {
    constructor(engine) {
        this.engine = engine;
        this.scenes = {};
        this.currentScene = null;
    }
    
    add(name, scene) {
        this.scenes[name] = scene;
        this.engine.addScene(scene);
    }
    
    switch(name, data) {
        const scene = this.scenes[name];
        if (!scene) {
            throw new Error(`Scene "${name}" not found`);
        }
        
        // Exit current scene
        if (this.currentScene?.onExit) {
            this.currentScene.onExit();
        }
        
        // Enter new scene
        if (scene.onEnter) {
            scene.onEnter(data);
        }
        
        this.currentScene = scene;
        this.engine.setActiveScene(scene);
    }
}

// Usage
const scenes = new SceneManager(engine);

scenes.add('menu', new MenuScene());
scenes.add('game', new GameScene());
scenes.add('pause', new PauseScene());
scenes.add('gameOver', new GameOverScene());

scenes.switch('menu');

// Later...
scenes.switch('game', { level: 1 });
```

## Related

- [Engine API](engine.md)
- [Character API](character.md)
- [Scenes & Entities Guide](../guides/scenes-entities.md)
