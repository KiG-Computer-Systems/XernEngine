// Менеджер ввода
export class InputManager {
    constructor(keyboard, mouse) {
        if (!keyboard || !mouse) {
            throw new Error('Keyboard or mouse is null');
        }
        this.keyboard = keyboard;
        this.mouse = mouse;
        try {
            Object.entries(this.keyboard).forEach(([key, value]) => {
                if (value === null) {
                    throw new Error(`Keyboard key ${key} is null`);
                }
            });
            Object.entries(this.mouse).forEach(([key, value]) => {
                if (value === null) {
                    throw new Error(`Mouse key ${key} is null`);
                }
            });
        } catch (error) {
            if (error instanceof Error) {
                console.error(error.message);
            } else {
                console.error('An unexpected error occurred');
            }
        }
    }

    update() {
        try {
            if (!this.keyboard || !this.mouse) {
                throw new Error('Keyboard or mouse is null');
            }
            // Check for null pointer references
            if (this.keyboard === null || this.mouse === null) {
                throw new Error('Keyboard or mouse is null');
            }
            // Check for unhandled exceptions
            if (typeof this.keyboard.update !== 'function' || typeof this.mouse.update !== 'function') {
                throw new Error('Keyboard or mouse update function is not defined');
            }
            // Check for other bugs
            if (Object.keys(this.keyboard).length === 0 || Object.keys(this.mouse).length === 0) {
                throw new Error('Keyboard or mouse is empty');
            }
            // Call update functions
            this.keyboard.update();
            this.mouse.update();
        } catch (error) {
            console.error(error);
        }
    }
}
