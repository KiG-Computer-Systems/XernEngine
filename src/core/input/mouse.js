// Управление мышью
export class Mouse {
    constructor(canvas) {
        if (!canvas) {
            throw new Error('canvas is null or undefined');
        }

        this.position = { x: 0, y: 0 };
        this.buttons = {};

        const handleMouseMove = (e) => {
            this.position.x = e.offsetX;
            this.position.y = e.offsetY;
        };

        const handleMouseDown = (e) => {
            this.buttons[e.button] = true;
        };

        const handleMouseUp = (e) => {
            this.buttons[e.button] = false;
        };

        canvas.addEventListener('mousemove', handleMouseMove);
        canvas.addEventListener('mousedown', handleMouseDown);
        canvas.addEventListener('mouseup', handleMouseUp);
    }

    isButtonPressed(button) {
        if (this.buttons === null || typeof this.buttons !== 'object') {
            throw new Error('this.buttons is null or not an object');
        }

        if (typeof button !== 'number') {
            throw new Error('button must be a number');
        }

        return !!this.buttons[button];
    }
}
