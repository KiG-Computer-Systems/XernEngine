// Игровые объекты
export class Entity {
    constructor(x, y) {
        if (x === null || x === undefined) {
            throw new Error('x is null or undefined');
        }
        if (y === null || y === undefined) {
            throw new Error('y is null or undefined');
        }
        this.x = x;
        this.y = y;
        this.velocity = { x: 0, y: 0 };
    }

    update(deltaTime) {
        if (deltaTime === null || deltaTime === undefined) {
            throw new Error('deltaTime is null or undefined');
        }

        try {
            this.x += this.velocity.x * deltaTime;
            this.y += this.velocity.y * deltaTime;
        } catch (error) {
            console.error('Error while updating entity:', error);
        }
    }

    draw(context) {
        if (!context) {
            throw new Error('Context is null or undefined');
        }

        try {
            // Логика отрисовки объекта
        } catch (error) {
            if (error instanceof ReferenceError) {
                console.error('ReferenceError while drawing entity:', error);
            } else if (error instanceof TypeError) {
                console.error('TypeError while drawing entity:', error);
            } else {
                console.error('Error while drawing entity:', error);
            }
        }
    }

    setVelocity(x, y) {
        if (x === null || x === undefined) {
            throw new Error('x is null or undefined');
        }
        if (y === null || y === undefined) {
            throw new Error('y is null or undefined');
        }

        try {
            if (this.velocity === null || this.velocity === undefined) {
                throw new Error('this.velocity is null or undefined');
            }

            if (typeof this.velocity.x !== 'number' || typeof this.velocity.y !== 'number') {
                throw new TypeError('this.velocity.x or this.velocity.y is not a number');
            }

            this.velocity.x = x;
            this.velocity.y = y;
        } catch (error) {
            if (error instanceof TypeError) {
                console.error('TypeError while setting velocity:', error);
            } else if (error instanceof ReferenceError) {
                console.error('ReferenceError while setting velocity:', error);
            } else {
                console.error('Error while setting velocity:', error);
            }
        }
    }
}