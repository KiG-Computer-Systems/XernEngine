// Управление мышью
export class Mouse {
    constructor(canvas) {
        this.position = { x: 0, y: 0 };
        this.buttons = {};
        canvas.addEventListener('mousemove', (e) => {
            this.position.x = e.offsetX;
            this.position.y = e.offsetY;
        });
        canvas.addEventListener('mousedown', (e) => this.buttons[e.button] = true);
        canvas.addEventListener('mouseup', (e) => this.buttons[e.button] = false);
    }

    isButtonPressed(button) {
        return !!this.buttons[button];
    }
}