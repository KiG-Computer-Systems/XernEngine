# EventEmitter API

The `EventEmitter` class provides a publish-subscribe pattern for decoupled communication between game components.

## Import

```javascript
import { EventEmitter, globalEvents } from './xernengine.js';
```

## Global Instance

A global `globalEvents` instance is available for game-wide events:

```javascript
import { globalEvents } from './xernengine.js';

globalEvents.on('player-death', () => {
    showGameOver();
});
```

## Constructor

```javascript
const emitter = new EventEmitter();
```

## Methods

### on(event, callback)

Subscribes to an event.

```javascript
emitter.on('damage', (amount) => {
    console.log(`Took ${amount} damage!`);
});
```

**Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| `event` | `string` | Event name |
| `callback` | `Function` | Handler function |

**Returns:** `Function` - Unsubscribe function

---

### once(event, callback)

Subscribes to an event (fires only once).

```javascript
emitter.once('gameStart', () => {
    playIntro();
});
```

---

### off(event, callback)

Unsubscribes from an event.

```javascript
function onDamage(amount) {
    // Handle damage
}

emitter.on('damage', onDamage);
// Later...
emitter.off('damage', onDamage);
```

---

### emit(event, ...args)

Triggers an event with optional arguments.

```javascript
emitter.emit('damage', 25);
emitter.emit('collision', player, enemy);
emitter.emit('itemCollected', { type: 'coin', value: 10 });
```

---

### removeAllListeners(event)

Removes all listeners for an event.

```javascript
// Remove all 'damage' listeners
emitter.removeAllListeners('damage');

// Remove ALL listeners
emitter.removeAllListeners();
```

---

### listenerCount(event)

Gets the number of listeners.

```javascript
const count = emitter.listenerCount('damage');
```

## Examples

### Game Events System

```javascript
import { globalEvents } from './xernengine.js';

// In Player class
class Player {
    takeDamage(amount) {
        this.health -= amount;
        globalEvents.emit('player-damage', amount, this.health);
        
        if (this.health <= 0) {
            globalEvents.emit('player-death', this);
        }
    }
    
    collectCoin(value) {
        this.coins += value;
        globalEvents.emit('coin-collected', value, this.coins);
    }
    
    levelUp() {
        this.level++;
        globalEvents.emit('player-levelup', this.level);
    }
}

// In UI class
class GameUI {
    constructor() {
        globalEvents.on('player-damage', (amount, health) => {
            this.showDamageIndicator(amount);
            this.updateHealthBar(health);
        });
        
        globalEvents.on('player-death', () => {
            this.showGameOverScreen();
        });
        
        globalEvents.on('coin-collected', (value, total) => {
            this.showCoinPopup(value);
            this.updateCoinCounter(total);
        });
        
        globalEvents.on('player-levelup', (level) => {
            this.showLevelUpEffect(level);
        });
    }
}

// In AudioManager
class GameAudio {
    constructor() {
        globalEvents.on('player-damage', () => {
            audio.playSound('hurt');
        });
        
        globalEvents.on('player-death', () => {
            audio.stopMusic();
            audio.playSound('death');
        });
        
        globalEvents.on('coin-collected', () => {
            audio.playSound('coin');
        });
    }
}

// In AchievementSystem
class Achievements {
    constructor() {
        this.coinsCollected = 0;
        this.damageReceived = 0;
        
        globalEvents.on('coin-collected', (value) => {
            this.coinsCollected += value;
            if (this.coinsCollected >= 100) {
                this.unlock('coin_collector');
            }
        });
        
        globalEvents.on('player-damage', (amount) => {
            this.damageReceived += amount;
            // Track for achievements
        });
    }
}
```

### Component Communication

```javascript
// Enemy emits event when dying
class Enemy {
    constructor() {
        this.events = new EventEmitter();
    }
    
    die() {
        this.events.emit('death', {
            position: { x: this.x, y: this.y },
            type: this.type,
            lootTable: this.lootTable
        });
        this.active = false;
    }
}

// Spawn system listens
class SpawnSystem {
    addEnemy(enemy) {
        this.enemies.push(enemy);
        
        enemy.events.once('death', (data) => {
            this.onEnemyDeath(enemy, data);
        });
    }
    
    onEnemyDeath(enemy, data) {
        this.spawnLoot(data.position, data.lootTable);
        this.removeEnemy(enemy);
        this.checkWaveComplete();
    }
}
```

### Input Events

```javascript
class InputManager {
    constructor() {
        this.events = new EventEmitter();
        this.bindEvents();
    }
    
    bindEvents() {
        document.addEventListener('keydown', (e) => {
            this.events.emit('keydown', e.code);
            this.events.emit(`key:${e.code}`, true);
        });
        
        document.addEventListener('keyup', (e) => {
            this.events.emit('keyup', e.code);
            this.events.emit(`key:${e.code}`, false);
        });
    }
}

// Usage
const input = new InputManager();

input.events.on('key:Space', (pressed) => {
    if (pressed) player.jump();
});

input.events.on('key:Escape', (pressed) => {
    if (pressed) togglePause();
});
```

### Scene Events

```javascript
class Scene {
    constructor() {
        this.events = new EventEmitter();
    }
    
    onEnter(data) {
        this.events.emit('enter', data);
    }
    
    onExit() {
        this.events.emit('exit');
        this.events.removeAllListeners();
    }
}

// Usage
const gameScene = new Scene();

gameScene.events.on('enter', (data) => {
    console.log('Entering game scene with:', data);
    initializeLevel(data.level);
});

gameScene.events.on('exit', () => {
    console.log('Leaving game scene');
    cleanup();
});
```

### Unsubscribe Pattern

```javascript
class GameComponent {
    constructor() {
        this.unsubscribers = [];
        this.setup();
    }
    
    setup() {
        // Store unsubscribe functions
        this.unsubscribers.push(
            globalEvents.on('player-damage', this.onPlayerDamage.bind(this)),
            globalEvents.on('player-death', this.onPlayerDeath.bind(this)),
            globalEvents.on('level-complete', this.onLevelComplete.bind(this))
        );
    }
    
    destroy() {
        // Clean up all subscriptions
        this.unsubscribers.forEach(unsub => unsub());
        this.unsubscribers = [];
    }
    
    onPlayerDamage(amount) { /* ... */ }
    onPlayerDeath() { /* ... */ }
    onLevelComplete() { /* ... */ }
}
```

### Event with Response

```javascript
// Request-response pattern
class InventoryManager {
    constructor() {
        globalEvents.on('check-inventory', (itemType, callback) => {
            const count = this.getItemCount(itemType);
            callback(count);
        });
    }
}

// Somewhere else
function buyItem(item) {
    globalEvents.emit('check-inventory', 'gold', (goldCount) => {
        if (goldCount >= item.price) {
            purchaseItem(item);
        } else {
            showMessage('Not enough gold!');
        }
    });
}
```

## Best Practices

1. **Use descriptive event names**: `player-damage` not just `damage`
2. **Clean up listeners**: Remove listeners when components are destroyed
3. **Don't overuse**: Direct method calls are often simpler
4. **Document events**: Keep a list of all events in your game

```javascript
// Good: Use globalEvents for decoupled systems
globalEvents.emit('player-scored', 100);

// Better for direct communication: Use method calls
scoreManager.addScore(100);
```

## Related

- [State Machine API](state-machine.md)
- [Timer API](timer.md)
- [Input Guide](../guides/input.md)
