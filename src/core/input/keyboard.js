// Управление клавиатурой
export class Keyboard {
    constructor() {
        this.keys = {};
        window.addEventListener('keydown', (e) => {
            if (e.code && this.keys) {
                this.keys[e.code] = true;
            }
        });
        window.addEventListener('keyup', (e) => {
            if (e.code && this.keys) {
                this.keys[e.code] = false;
            }
        });
    }

    isKeyPressed(key) {
        if (typeof key !== 'string') {
            throw new TypeError('Keyboard.isKeyPressed() expects a string argument');
        }
        if (!this.keys || !this.keys.hasOwnProperty(key)) {
            return false;
        }
        return !!this.keys[key];
    }

    getPressedKeys() {
        if (!this.keys) {
            throw new Error('Keyboard.getPressedKeys(): this.keys is null or undefined');
        }
        try {
            return Object.keys(this.keys).filter(key => this.keys[key]);
        } catch (e) {
            throw new Error(`Keyboard.getPressedKeys(): an error occurred: ${e}`);
        }
    }
}