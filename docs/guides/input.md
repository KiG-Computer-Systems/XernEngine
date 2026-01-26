# Input Handling

XernEngine provides flexible input handling for keyboard, mouse, and touch events. Since this is a code-first engine, you have full control over how inputs are processed.

## Keyboard Input

### Basic Key Detection

```javascript
// Track pressed keys
const keys = {};

document.addEventListener('keydown', (e) => {
    keys[e.code] = true;
    
    // Prevent default for game keys
    if (['Space', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.code)) {
        e.preventDefault();
    }
});

document.addEventListener('keyup', (e) => {
    keys[e.code] = false;
});

// In update loop
function update(deltaTime) {
    if (keys['ArrowUp'] || keys['KeyW']) {
        player.moveUp();
    }
    if (keys['ArrowDown'] || keys['KeyS']) {
        player.moveDown();
    }
    if (keys['ArrowLeft'] || keys['KeyA']) {
        player.moveLeft();
    }
    if (keys['ArrowRight'] || keys['KeyD']) {
        player.moveRight();
    }
    if (keys['Space']) {
        player.shoot();
    }
}
```

### Advanced Keyboard Handler

```javascript
class Keyboard {
    constructor() {
        this.keys = {};
        this.justPressed = {};
        this.justReleased = {};
        
        document.addEventListener('keydown', (e) => this.onKeyDown(e));
        document.addEventListener('keyup', (e) => this.onKeyUp(e));
    }
    
    onKeyDown(e) {
        if (!this.keys[e.code]) {
            this.justPressed[e.code] = true;
        }
        this.keys[e.code] = true;
    }
    
    onKeyUp(e) {
        this.keys[e.code] = false;
        this.justReleased[e.code] = true;
    }
    
    // Call at end of each frame
    update() {
        this.justPressed = {};
        this.justReleased = {};
    }
    
    // Is key currently held down?
    isDown(code) {
        return this.keys[code] === true;
    }
    
    // Was key just pressed this frame?
    isJustPressed(code) {
        return this.justPressed[code] === true;
    }
    
    // Was key just released this frame?
    isJustReleased(code) {
        return this.justReleased[code] === true;
    }
    
    // Is any of these keys pressed?
    isAnyDown(codes) {
        return codes.some(code => this.isDown(code));
    }
    
    // Are all of these keys pressed?
    isAllDown(codes) {
        return codes.every(code => this.isDown(code));
    }
}

// Usage
const keyboard = new Keyboard();

function update(deltaTime) {
    // Continuous actions (held keys)
    if (keyboard.isDown('KeyW')) {
        player.moveUp();
    }
    
    // One-time actions (just pressed)
    if (keyboard.isJustPressed('Space')) {
        player.jump();
    }
    
    // Key combos
    if (keyboard.isAllDown(['ControlLeft', 'KeyS'])) {
        saveGame();
    }
    
    // At end of update
    keyboard.update();
}
```

### Key Code Reference

| Key | Code |
|-----|------|
| A-Z | `KeyA` - `KeyZ` |
| 0-9 | `Digit0` - `Digit9` |
| Arrow Keys | `ArrowUp`, `ArrowDown`, `ArrowLeft`, `ArrowRight` |
| Space | `Space` |
| Enter | `Enter` |
| Escape | `Escape` |
| Shift | `ShiftLeft`, `ShiftRight` |
| Ctrl | `ControlLeft`, `ControlRight` |
| Alt | `AltLeft`, `AltRight` |
| Tab | `Tab` |

## Mouse Input

### Basic Mouse Tracking

```javascript
const mouse = {
    x: 0,
    y: 0,
    buttons: {},
    
    init(canvas) {
        canvas.addEventListener('mousemove', (e) => {
            const rect = canvas.getBoundingClientRect();
            this.x = e.clientX - rect.left;
            this.y = e.clientY - rect.top;
        });
        
        canvas.addEventListener('mousedown', (e) => {
            this.buttons[e.button] = true;
        });
        
        canvas.addEventListener('mouseup', (e) => {
            this.buttons[e.button] = false;
        });
        
        // Prevent context menu on right-click
        canvas.addEventListener('contextmenu', (e) => {
            e.preventDefault();
        });
    },
    
    isDown(button = 0) {
        return this.buttons[button] === true;
    }
};

// Initialize
mouse.init(canvas);

// Mouse button reference:
// 0 = Left button
// 1 = Middle button (wheel)
// 2 = Right button
```

### Advanced Mouse Handler

```javascript
class Mouse {
    constructor(canvas) {
        this.canvas = canvas;
        this.x = 0;
        this.y = 0;
        this.worldX = 0;
        this.worldY = 0;
        this.buttons = {};
        this.justPressed = {};
        this.justReleased = {};
        this.wheelDelta = 0;
        
        this.bindEvents();
    }
    
    bindEvents() {
        const canvas = this.canvas;
        
        canvas.addEventListener('mousemove', (e) => this.onMove(e));
        canvas.addEventListener('mousedown', (e) => this.onDown(e));
        canvas.addEventListener('mouseup', (e) => this.onUp(e));
        canvas.addEventListener('wheel', (e) => this.onWheel(e));
        canvas.addEventListener('contextmenu', (e) => e.preventDefault());
        
        // Handle mouse leaving canvas
        canvas.addEventListener('mouseleave', () => {
            this.buttons = {};
        });
    }
    
    onMove(e) {
        const rect = this.canvas.getBoundingClientRect();
        this.x = e.clientX - rect.left;
        this.y = e.clientY - rect.top;
    }
    
    onDown(e) {
        if (!this.buttons[e.button]) {
            this.justPressed[e.button] = true;
        }
        this.buttons[e.button] = true;
    }
    
    onUp(e) {
        this.buttons[e.button] = false;
        this.justReleased[e.button] = true;
    }
    
    onWheel(e) {
        this.wheelDelta = e.deltaY;
        e.preventDefault();
    }
    
    update(camera = null) {
        // Convert to world coordinates if camera provided
        if (camera) {
            this.worldX = this.x + camera.x;
            this.worldY = this.y + camera.y;
        } else {
            this.worldX = this.x;
            this.worldY = this.y;
        }
        
        // Reset per-frame states
        this.justPressed = {};
        this.justReleased = {};
        this.wheelDelta = 0;
    }
    
    isDown(button = 0) {
        return this.buttons[button] === true;
    }
    
    isJustPressed(button = 0) {
        return this.justPressed[button] === true;
    }
    
    isJustReleased(button = 0) {
        return this.justReleased[button] === true;
    }
    
    // Check if mouse is over a rectangle
    isOver(x, y, width, height) {
        return this.x >= x && this.x <= x + width &&
               this.y >= y && this.y <= y + height;
    }
    
    // Check if mouse is over a circle
    isOverCircle(cx, cy, radius) {
        const dx = this.x - cx;
        const dy = this.y - cy;
        return dx * dx + dy * dy <= radius * radius;
    }
    
    // Get position as Vector2
    getPosition() {
        return { x: this.x, y: this.y };
    }
    
    getWorldPosition() {
        return { x: this.worldX, y: this.worldY };
    }
}

// Usage
const mouse = new Mouse(canvas);

function update(deltaTime) {
    mouse.update(camera);
    
    // Check for clicks
    if (mouse.isJustPressed(0)) {
        // Shoot towards mouse
        const dx = mouse.worldX - player.x;
        const dy = mouse.worldY - player.y;
        player.shootAt(dx, dy);
    }
    
    // Check hover
    if (mouse.isOver(button.x, button.y, button.width, button.height)) {
        button.hovered = true;
    }
    
    // Zoom with scroll wheel
    if (mouse.wheelDelta !== 0) {
        camera.zoom += mouse.wheelDelta * -0.001;
    }
}
```

## Touch Input

### Basic Touch Handling

```javascript
class Touch {
    constructor(canvas) {
        this.canvas = canvas;
        this.touches = [];
        this.justTouched = false;
        this.justReleased = false;
        
        canvas.addEventListener('touchstart', (e) => this.onTouchStart(e));
        canvas.addEventListener('touchmove', (e) => this.onTouchMove(e));
        canvas.addEventListener('touchend', (e) => this.onTouchEnd(e));
    }
    
    onTouchStart(e) {
        e.preventDefault();
        this.updateTouches(e.touches);
        this.justTouched = true;
    }
    
    onTouchMove(e) {
        e.preventDefault();
        this.updateTouches(e.touches);
    }
    
    onTouchEnd(e) {
        e.preventDefault();
        this.updateTouches(e.touches);
        this.justReleased = true;
    }
    
    updateTouches(touchList) {
        const rect = this.canvas.getBoundingClientRect();
        this.touches = [];
        
        for (let i = 0; i < touchList.length; i++) {
            const touch = touchList[i];
            this.touches.push({
                id: touch.identifier,
                x: touch.clientX - rect.left,
                y: touch.clientY - rect.top
            });
        }
    }
    
    update() {
        this.justTouched = false;
        this.justReleased = false;
    }
    
    isTouching() {
        return this.touches.length > 0;
    }
    
    getTouchCount() {
        return this.touches.length;
    }
    
    getTouch(index = 0) {
        return this.touches[index] || null;
    }
}
```

### Virtual Joystick

```javascript
class VirtualJoystick {
    constructor(x, y, radius) {
        this.baseX = x;
        this.baseY = y;
        this.radius = radius;
        this.knobRadius = radius * 0.4;
        
        this.knobX = x;
        this.knobY = y;
        this.active = false;
        this.touchId = null;
        
        // Output values (-1 to 1)
        this.horizontal = 0;
        this.vertical = 0;
    }
    
    handleTouch(touch) {
        if (!touch) {
            this.reset();
            return;
        }
        
        const dx = touch.x - this.baseX;
        const dy = touch.y - this.baseY;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance > this.radius) {
            // Clamp to radius
            this.knobX = this.baseX + (dx / distance) * this.radius;
            this.knobY = this.baseY + (dy / distance) * this.radius;
        } else {
            this.knobX = touch.x;
            this.knobY = touch.y;
        }
        
        // Calculate normalized output
        this.horizontal = (this.knobX - this.baseX) / this.radius;
        this.vertical = (this.knobY - this.baseY) / this.radius;
        this.active = true;
    }
    
    reset() {
        this.knobX = this.baseX;
        this.knobY = this.baseY;
        this.horizontal = 0;
        this.vertical = 0;
        this.active = false;
    }
    
    draw(ctx) {
        // Base circle
        ctx.fillStyle = 'rgba(255, 255, 255, 0.2)';
        ctx.beginPath();
        ctx.arc(this.baseX, this.baseY, this.radius, 0, Math.PI * 2);
        ctx.fill();
        
        // Knob
        ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
        ctx.beginPath();
        ctx.arc(this.knobX, this.knobY, this.knobRadius, 0, Math.PI * 2);
        ctx.fill();
    }
}

// Usage
const joystick = new VirtualJoystick(100, canvas.height - 100, 50);

function update(deltaTime) {
    const touch = touchInput.getTouch(0);
    joystick.handleTouch(touch);
    
    // Use joystick values
    player.x += joystick.horizontal * player.speed * deltaTime;
    player.y += joystick.vertical * player.speed * deltaTime;
}

function render(ctx) {
    joystick.draw(ctx);
}
```

## Input Actions System

For flexible key bindings:

```javascript
class InputActions {
    constructor() {
        this.actions = new Map();
        this.keyboard = new Keyboard();
        this.mouse = new Mouse(canvas);
    }
    
    // Define an action with its bindings
    define(name, bindings) {
        this.actions.set(name, bindings);
    }
    
    // Check if action is currently active
    isActive(name) {
        const bindings = this.actions.get(name);
        if (!bindings) return false;
        
        for (const binding of bindings) {
            if (binding.type === 'key' && this.keyboard.isDown(binding.code)) {
                return true;
            }
            if (binding.type === 'mouse' && this.mouse.isDown(binding.button)) {
                return true;
            }
        }
        return false;
    }
    
    // Check if action was just triggered
    isJustActive(name) {
        const bindings = this.actions.get(name);
        if (!bindings) return false;
        
        for (const binding of bindings) {
            if (binding.type === 'key' && this.keyboard.isJustPressed(binding.code)) {
                return true;
            }
            if (binding.type === 'mouse' && this.mouse.isJustPressed(binding.button)) {
                return true;
            }
        }
        return false;
    }
    
    update(camera) {
        this.keyboard.update();
        this.mouse.update(camera);
    }
}

// Usage
const input = new InputActions();

// Define actions
input.define('move_up', [
    { type: 'key', code: 'KeyW' },
    { type: 'key', code: 'ArrowUp' }
]);
input.define('move_down', [
    { type: 'key', code: 'KeyS' },
    { type: 'key', code: 'ArrowDown' }
]);
input.define('shoot', [
    { type: 'key', code: 'Space' },
    { type: 'mouse', button: 0 }
]);
input.define('interact', [
    { type: 'key', code: 'KeyE' }
]);

// In game loop
function update(deltaTime) {
    input.update(camera);
    
    if (input.isActive('move_up')) player.moveUp();
    if (input.isActive('move_down')) player.moveDown();
    if (input.isJustActive('shoot')) player.shoot();
    if (input.isJustActive('interact')) player.interact();
}
```

## Gamepad Support

```javascript
class Gamepad {
    constructor() {
        this.gamepads = {};
        this.deadzone = 0.15;
        
        window.addEventListener('gamepadconnected', (e) => {
            console.log('Gamepad connected:', e.gamepad.id);
            this.gamepads[e.gamepad.index] = e.gamepad;
        });
        
        window.addEventListener('gamepaddisconnected', (e) => {
            console.log('Gamepad disconnected:', e.gamepad.id);
            delete this.gamepads[e.gamepad.index];
        });
    }
    
    update() {
        // Must poll for updated state
        const pads = navigator.getGamepads();
        for (let i = 0; i < pads.length; i++) {
            if (pads[i]) {
                this.gamepads[i] = pads[i];
            }
        }
    }
    
    getGamepad(index = 0) {
        return this.gamepads[index];
    }
    
    getAxis(index, axis) {
        const pad = this.gamepads[index];
        if (!pad) return 0;
        
        const value = pad.axes[axis];
        return Math.abs(value) > this.deadzone ? value : 0;
    }
    
    isButtonDown(index, button) {
        const pad = this.gamepads[index];
        if (!pad) return false;
        
        return pad.buttons[button]?.pressed || false;
    }
    
    // Standard mapping axes
    getLeftStickX(index = 0) { return this.getAxis(index, 0); }
    getLeftStickY(index = 0) { return this.getAxis(index, 1); }
    getRightStickX(index = 0) { return this.getAxis(index, 2); }
    getRightStickY(index = 0) { return this.getAxis(index, 3); }
}
```

## Best Practices

1. **Use `e.code` not `e.key`** - `code` is consistent across keyboard layouts
2. **Prevent default carefully** - Only for keys that would interfere (arrows, space)
3. **Handle focus loss** - Reset keys when window loses focus
4. **Normalize analog input** - Apply deadzone to joysticks
5. **Support multiple input methods** - Allow keyboard, mouse, and gamepad

```javascript
// Reset on focus loss
window.addEventListener('blur', () => {
    keyboard.keys = {};
    mouse.buttons = {};
});
```

## Next Steps

- [Physics & Collision](../api/physics.md)
- [Audio](../api/audio.md)
- [Save System](../api/save-manager.md)
