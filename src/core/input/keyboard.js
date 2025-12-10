// Управление клавиатурой
export class Keyboard {
    constructor() {
        this.keys = {};
        window.addEventListener('keydown', (e) => this.keys[e.code] = true);
        window.addEventListener('keyup', (e) => this.keys[e.code] = false);
    }

    isKeyPressed(key) {
        return !!this.keys[key];
    }

    getPressedKeys() {
        return Object.keys(this.keys).filter(key => this.keys[key]);
    }
}