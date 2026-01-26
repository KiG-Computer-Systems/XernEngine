# StateMachine API

The `StateMachine` class provides a finite state machine for managing game states, AI states, or any state-based logic.

## Import

```javascript
import { StateMachine, State, GameStateMachine } from './xernengine.js';
```

## State Class

Base class for states.

### Constructor

```javascript
const state = new State(name);
```

### Methods to Override

```javascript
class MyState extends State {
    // Called when entering this state
    enter(prevState, params) {
        console.log('Entering', this.name);
    }
    
    // Called when leaving this state
    exit(nextState) {
        console.log('Exiting', this.name);
    }
    
    // Called every frame
    update(deltaTime) {
        // State logic
    }
    
    // Called every frame for rendering
    draw(context) {
        // State rendering
    }
}
```

## StateMachine Class

### Constructor

```javascript
const fsm = new StateMachine(owner);
```

**Parameters:**

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `owner` | `Object` | null | Optional owner object |

### Properties

| Property | Type | Description |
|----------|------|-------------|
| `owner` | `Object` | Owner reference |
| `states` | `Map` | Registered states |
| `currentState` | `State` | Active state |
| `previousState` | `State` | Previous state |
| `history` | `Array` | State transition history |
| `onStateChange` | `Function` | Callback on transitions |

### Methods

#### addState(state)

Adds a state instance.

```javascript
fsm.addState(new IdleState());
fsm.addState(new WalkState());
fsm.addState(new AttackState());
```

**Returns:** `StateMachine` - For chaining

---

#### createState(name, handlers)

Creates and adds a simple state.

```javascript
fsm.createState('idle', {
    enter: () => console.log('Now idle'),
    exit: () => console.log('No longer idle'),
    update: (dt) => { /* logic */ },
    draw: (ctx) => { /* render */ }
});
```

**Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| `name` | `string` | State identifier |
| `handlers` | `Object` | Handler functions |

**Returns:** `StateMachine` - For chaining

---

#### start(name, params)

Sets the initial state.

```javascript
fsm.start('idle');
fsm.start('menu', { selectedOption: 0 });
```

---

#### setState(name, params)

Transitions to a new state.

```javascript
fsm.setState('walking');
fsm.setState('attacking', { target: enemy });
```

---

#### goBack(params)

Returns to the previous state.

```javascript
// In pause menu
function resume() {
    fsm.goBack();
}
```

---

#### update(deltaTime)

Updates the current state.

```javascript
// In game loop
fsm.update(deltaTime);
```

---

#### draw(context)

Renders the current state.

```javascript
// In render loop
fsm.draw(ctx);
```

---

#### getCurrentState() / getCurrentStateName()

Gets current state info.

```javascript
const state = fsm.getCurrentState();
const name = fsm.getCurrentStateName();
```

---

#### is(name)

Checks if current state matches.

```javascript
if (fsm.is('attacking')) {
    // Can't move while attacking
}
```

---

#### getHistory()

Gets state transition history.

```javascript
const history = fsm.getHistory();
// [{ state: 'idle', timestamp: ... }, { state: 'walking', timestamp: ... }]
```

## GameStateMachine Class

Pre-configured state machine for common game states.

```javascript
const gameState = new GameStateMachine();
// Pre-built states: 'loading', 'menu', 'playing', 'paused', 'gameOver'

gameState.start('loading');
```

## Examples

### AI State Machine

```javascript
class Enemy {
    constructor() {
        this.x = 0;
        this.y = 0;
        this.target = null;
        this.health = 100;
        
        this.fsm = new StateMachine(this);
        this.setupStates();
        this.fsm.start('idle');
    }
    
    setupStates() {
        // Idle State
        this.fsm.createState('idle', {
            update: (dt) => {
                // Look for player
                if (this.canSeePlayer()) {
                    this.fsm.setState('chase');
                }
            }
        });
        
        // Chase State
        this.fsm.createState('chase', {
            enter: () => {
                this.target = game.player;
            },
            update: (dt) => {
                if (!this.target || !this.canSeePlayer()) {
                    this.fsm.setState('idle');
                    return;
                }
                
                // Move towards player
                this.moveTowards(this.target.x, this.target.y, dt);
                
                // Attack if close enough
                if (this.distanceTo(this.target) < 50) {
                    this.fsm.setState('attack');
                }
            }
        });
        
        // Attack State
        this.fsm.createState('attack', {
            enter: () => {
                this.attackCooldown = 0;
            },
            update: (dt) => {
                this.attackCooldown -= dt;
                
                if (this.attackCooldown <= 0) {
                    this.performAttack();
                    this.attackCooldown = 1000;
                    
                    // Return to chase
                    this.fsm.setState('chase');
                }
            }
        });
        
        // Hurt State
        this.fsm.createState('hurt', {
            enter: (prev, params) => {
                this.hurtTimer = 300;
                this.health -= params.damage;
                
                if (this.health <= 0) {
                    this.fsm.setState('dead');
                }
            },
            update: (dt) => {
                this.hurtTimer -= dt;
                if (this.hurtTimer <= 0) {
                    this.fsm.setState('chase');
                }
            }
        });
        
        // Dead State
        this.fsm.createState('dead', {
            enter: () => {
                this.active = false;
                spawnLoot(this.x, this.y);
            }
        });
    }
    
    takeDamage(amount) {
        this.fsm.setState('hurt', { damage: amount });
    }
    
    update(dt) {
        this.fsm.update(dt);
    }
    
    draw(ctx) {
        // Draw based on state
        ctx.fillStyle = this.fsm.is('hurt') ? '#ff0000' : '#e74c3c';
        ctx.fillRect(this.x - 16, this.y - 16, 32, 32);
        
        // Debug: show state
        ctx.fillStyle = '#fff';
        ctx.font = '10px Arial';
        ctx.fillText(this.fsm.getCurrentStateName(), this.x - 16, this.y - 20);
    }
}
```

### Game State Management

```javascript
class Game {
    constructor() {
        this.fsm = new StateMachine(this);
        this.setupStates();
    }
    
    setupStates() {
        // Loading
        this.fsm.createState('loading', {
            enter: async () => {
                await this.loadAssets();
                this.fsm.setState('menu');
            },
            draw: (ctx) => {
                ctx.fillStyle = '#fff';
                ctx.font = '32px Arial';
                ctx.fillText('Loading...', 350, 300);
            }
        });
        
        // Menu
        this.fsm.createState('menu', {
            enter: () => {
                this.menuSelection = 0;
                audio.playMusic('menu');
            },
            update: (dt) => {
                if (keyboard.isJustPressed('ArrowUp')) {
                    this.menuSelection--;
                }
                if (keyboard.isJustPressed('ArrowDown')) {
                    this.menuSelection++;
                }
                if (keyboard.isJustPressed('Enter')) {
                    if (this.menuSelection === 0) {
                        this.fsm.setState('playing');
                    } else if (this.menuSelection === 1) {
                        this.fsm.setState('options');
                    }
                }
            },
            draw: (ctx) => {
                this.drawMenu(ctx);
            }
        });
        
        // Playing
        this.fsm.createState('playing', {
            enter: () => {
                if (!this.gameStarted) {
                    this.startNewGame();
                }
                audio.playMusic('game');
            },
            update: (dt) => {
                if (keyboard.isJustPressed('Escape')) {
                    this.fsm.setState('paused');
                }
                
                this.updateGame(dt);
            },
            draw: (ctx) => {
                this.renderGame(ctx);
            }
        });
        
        // Paused
        this.fsm.createState('paused', {
            enter: () => {
                audio.pauseMusic();
            },
            exit: () => {
                audio.resumeMusic();
            },
            update: (dt) => {
                if (keyboard.isJustPressed('Escape')) {
                    this.fsm.goBack();
                }
            },
            draw: (ctx) => {
                // Draw game behind
                this.renderGame(ctx);
                
                // Draw pause overlay
                ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
                ctx.fillRect(0, 0, 800, 600);
                
                ctx.fillStyle = '#fff';
                ctx.font = '48px Arial';
                ctx.textAlign = 'center';
                ctx.fillText('PAUSED', 400, 280);
                ctx.font = '24px Arial';
                ctx.fillText('Press ESC to resume', 400, 330);
                ctx.textAlign = 'left';
            }
        });
        
        // Game Over
        this.fsm.createState('gameOver', {
            enter: () => {
                audio.stopMusic();
                audio.playSound('gameover');
            },
            update: (dt) => {
                if (keyboard.isJustPressed('Enter')) {
                    this.gameStarted = false;
                    this.fsm.setState('menu');
                }
            },
            draw: (ctx) => {
                ctx.fillStyle = '#000';
                ctx.fillRect(0, 0, 800, 600);
                
                ctx.fillStyle = '#e74c3c';
                ctx.font = '64px Arial';
                ctx.textAlign = 'center';
                ctx.fillText('GAME OVER', 400, 250);
                
                ctx.fillStyle = '#fff';
                ctx.font = '24px Arial';
                ctx.fillText(`Final Score: ${this.score}`, 400, 320);
                ctx.fillText('Press ENTER to continue', 400, 400);
                ctx.textAlign = 'left';
            }
        });
    }
    
    start() {
        this.fsm.start('loading');
        this.gameLoop();
    }
    
    gameLoop() {
        // ... game loop calling fsm.update() and fsm.draw()
    }
}
```

### Player States

```javascript
class Player {
    constructor() {
        this.fsm = new StateMachine(this);
        
        this.fsm.createState('idle', {
            enter: () => this.animator.play('idle'),
            update: (dt) => {
                if (Math.abs(this.vx) > 10) {
                    this.fsm.setState('walk');
                }
                if (keyboard.isJustPressed('Space')) {
                    this.fsm.setState('jump');
                }
                if (mouse.isJustPressed(0)) {
                    this.fsm.setState('attack');
                }
            }
        });
        
        this.fsm.createState('walk', {
            enter: () => this.animator.play('walk'),
            update: (dt) => {
                if (Math.abs(this.vx) < 10) {
                    this.fsm.setState('idle');
                }
                if (keyboard.isJustPressed('Space')) {
                    this.fsm.setState('jump');
                }
            }
        });
        
        this.fsm.createState('jump', {
            enter: () => {
                this.animator.play('jump');
                this.vy = -400;
            },
            update: (dt) => {
                if (this.isGrounded) {
                    this.fsm.setState('idle');
                }
            }
        });
        
        this.fsm.createState('attack', {
            enter: () => {
                this.animator.play('attack');
                this.animator.animations.get('attack').onComplete = () => {
                    this.fsm.setState('idle');
                };
            }
        });
        
        this.fsm.start('idle');
    }
}
```

## Related

- [Animation API](animation.md)
- [Timer API](timer.md)
- [Game Loop Guide](../guides/game-loop.md)
