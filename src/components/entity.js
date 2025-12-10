// Игровые объекты
export class Entity {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.velocity = { x: 0, y: 0 };
    }

    update(deltaTime) {
        this.x += this.velocity.x * deltaTime;
        this.y += this.velocity.y * deltaTime;
    }

    draw(context) {
        // Логика отрисовки объекта
    }

    setVelocity(x, y) {
        this.velocity.x = x;
        this.velocity.y = y;
    }
}