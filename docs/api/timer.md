# Timer API

XernEngine provides timer utilities for delays, intervals, and time-based logic.

## Import

```javascript
import { Timer, TimerManager, TimeUtils, timers } from './xernengine.js';
```

## Global Instance

A global `timers` instance is available:

```javascript
import { timers } from './xernengine.js';

const id = timers.setTimeout(1000, () => console.log('Hello!'));
```

## Timer Class

A single timer instance.

### Constructor

```javascript
const timer = new Timer();
```

### Properties

| Property | Type | Description |
|----------|------|-------------|
| `elapsed` | `number` | Time elapsed (ms) |
| `duration` | `number` | Total duration (ms) |
| `running` | `boolean` | Is timer running |
| `paused` | `boolean` | Is timer paused |
| `loop` | `boolean` | Should repeat |
| `onComplete` | `Function` | Completion callback |
| `onUpdate` | `Function` | Update callback |

### Methods

#### start(duration, onComplete, loop)

Starts the timer.

```javascript
timer.start(2000, () => {
    console.log('Timer finished!');
});

// Looping timer
timer.start(1000, () => {
    console.log('Tick!');
}, true);
```

#### stop()

Stops and resets the timer.

```javascript
timer.stop();
```

#### pause() / resume()

Pauses/resumes the timer.

```javascript
timer.pause();
// Later...
timer.resume();
```

#### update(deltaTime)

Updates the timer (call each frame).

```javascript
timer.update(deltaTime);
```

#### getProgress()

Gets progress from 0 to 1.

```javascript
const progress = timer.getProgress(); // 0.0 to 1.0
```

#### getRemaining()

Gets remaining time in ms.

```javascript
const remaining = timer.getRemaining();
```

#### isComplete()

Checks if timer finished.

```javascript
if (timer.isComplete()) {
    // Do something
}
```

## TimerManager Class

Manages multiple timers.

### Methods

#### setTimeout(duration, callback, loop)

Creates a one-shot timer.

```javascript
// Spawn enemy after 3 seconds
const id = timers.setTimeout(3000, () => {
    spawnEnemy();
});
```

**Returns:** `number` - Timer ID

---

#### setInterval(duration, callback)

Creates a repeating timer.

```javascript
// Spawn enemy every 5 seconds
const id = timers.setInterval(5000, () => {
    spawnEnemy();
});
```

**Returns:** `number` - Timer ID

---

#### clearTimeout(id) / clearInterval(id)

Cancels a timer.

```javascript
timers.clearTimeout(id);
timers.clearInterval(id);
```

---

#### update(deltaTime)

Updates all timers.

```javascript
// In game loop
timers.update(deltaTime);
```

---

#### pauseAll() / resumeAll()

Pauses/resumes all timers.

```javascript
// When pausing game
timers.pauseAll();

// When resuming
timers.resumeAll();
```

---

#### clear()

Removes all timers.

```javascript
timers.clear();
```

## TimeUtils

Utility functions for time.

### delay(ms)

Promise-based delay.

```javascript
async function cutscene() {
    showText('Hello...');
    await TimeUtils.delay(2000);
    showText('World!');
}
```

---

### debounce(func, wait)

Debounces a function.

```javascript
const debouncedSave = TimeUtils.debounce(() => {
    saveGame();
}, 1000);

// Won't save until 1 second after last change
input.addEventListener('change', debouncedSave);
```

---

### throttle(func, limit)

Throttles a function.

```javascript
const throttledShoot = TimeUtils.throttle(() => {
    player.shoot();
}, 200);

// Can only shoot every 200ms
document.addEventListener('click', throttledShoot);
```

---

### formatTime(ms)

Formats time as MM:SS.

```javascript
const formatted = TimeUtils.formatTime(125000);
// "02:05"
```

## Examples

### Cooldown System

```javascript
class Ability {
    constructor(cooldownTime) {
        this.cooldownTime = cooldownTime;
        this.cooldownTimer = new Timer();
        this.ready = true;
    }
    
    use() {
        if (!this.ready) return false;
        
        this.ready = false;
        this.cooldownTimer.start(this.cooldownTime, () => {
            this.ready = true;
        });
        
        return true;
    }
    
    update(dt) {
        this.cooldownTimer.update(dt);
    }
    
    getCooldownProgress() {
        return this.cooldownTimer.getProgress();
    }
    
    getCooldownRemaining() {
        return Math.ceil(this.cooldownTimer.getRemaining() / 1000);
    }
}

// Usage
const fireball = new Ability(5000);

if (keyboard.isJustPressed('KeyQ')) {
    if (fireball.use()) {
        castFireball();
    } else {
        showMessage(`Cooldown: ${fireball.getCooldownRemaining()}s`);
    }
}
```

### Wave Spawner

```javascript
class WaveSpawner {
    constructor() {
        this.wave = 0;
        this.enemiesPerWave = 5;
        this.spawnDelay = 1000;
        this.waveDelay = 5000;
    }
    
    startWave() {
        this.wave++;
        const enemiesToSpawn = this.enemiesPerWave + this.wave * 2;
        
        showMessage(`Wave ${this.wave}!`);
        
        // Spawn enemies with delay
        for (let i = 0; i < enemiesToSpawn; i++) {
            timers.setTimeout(this.spawnDelay * i, () => {
                this.spawnEnemy();
            });
        }
        
        // Schedule next wave
        const totalSpawnTime = this.spawnDelay * enemiesToSpawn;
        timers.setTimeout(totalSpawnTime + this.waveDelay, () => {
            this.startWave();
        });
    }
    
    spawnEnemy() {
        const enemy = new Enemy();
        enemy.x = Math.random() * 800;
        enemy.y = -50;
        enemies.push(enemy);
    }
}
```

### Tween Animation

```javascript
class Tween {
    constructor(target, property, from, to, duration, easing = 'linear') {
        this.target = target;
        this.property = property;
        this.from = from;
        this.to = to;
        this.duration = duration;
        this.easing = easing;
        
        this.timer = new Timer();
        this.timer.onUpdate = (progress) => {
            const easedProgress = this.applyEasing(progress);
            this.target[this.property] = this.from + (this.to - this.from) * easedProgress;
        };
    }
    
    applyEasing(t) {
        switch (this.easing) {
            case 'linear': return t;
            case 'easeIn': return t * t;
            case 'easeOut': return 1 - (1 - t) * (1 - t);
            case 'easeInOut': return t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
            default: return t;
        }
    }
    
    start() {
        this.timer.start(this.duration, null, false);
        return this;
    }
    
    update(dt) {
        this.timer.update(dt);
    }
    
    isComplete() {
        return this.timer.isComplete();
    }
}

// Usage
const fadeIn = new Tween(sprite, 'alpha', 0, 1, 500, 'easeOut');
fadeIn.start();

// In update
fadeIn.update(deltaTime);
```

### Combo System with Timer

```javascript
class ComboSystem {
    constructor(comboWindow = 500) {
        this.comboWindow = comboWindow;
        this.currentCombo = [];
        this.comboTimer = new Timer();
        
        this.combos = {
            'punch,punch,kick': () => this.performSpecialMove('uppercut'),
            'kick,kick,punch': () => this.performSpecialMove('spin'),
            'punch,kick,punch': () => this.performSpecialMove('combo')
        };
    }
    
    addInput(input) {
        // Reset timer
        this.comboTimer.start(this.comboWindow, () => {
            this.currentCombo = [];
        });
        
        this.currentCombo.push(input);
        
        // Check for combo
        const comboString = this.currentCombo.join(',');
        for (const [pattern, action] of Object.entries(this.combos)) {
            if (comboString.endsWith(pattern)) {
                action();
                this.currentCombo = [];
                return;
            }
        }
    }
    
    update(dt) {
        this.comboTimer.update(dt);
    }
    
    performSpecialMove(name) {
        console.log('Special Move:', name);
    }
}
```

### Game Timer Display

```javascript
class GameTimer {
    constructor(initialTime) {
        this.time = initialTime;
        this.running = false;
    }
    
    start() {
        this.running = true;
    }
    
    pause() {
        this.running = false;
    }
    
    update(dt) {
        if (!this.running) return;
        
        this.time -= dt;
        
        if (this.time <= 0) {
            this.time = 0;
            this.running = false;
            onTimeUp();
        }
    }
    
    draw(ctx) {
        const formatted = TimeUtils.formatTime(this.time);
        
        ctx.font = '32px monospace';
        ctx.fillStyle = this.time < 10000 ? '#e74c3c' : '#fff';
        ctx.fillText(formatted, 370, 40);
    }
}

// Usage
const gameTimer = new GameTimer(120000); // 2 minutes
gameTimer.start();
```

## Related

- [State Machine API](state-machine.md)
- [Animation API](animation.md)
- [Game Loop Guide](../guides/game-loop.md)
