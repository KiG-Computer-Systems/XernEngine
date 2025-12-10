// Персонаж
export class Character {
    constructor(name, sprite) {
        this.name = name;
        this.sprite = sprite;
        this.x = 0;
        this.y = 0;
        this.health = 100;
        this.scripts = [];
    }

    update(deltaTime) {
        this.scripts.forEach(script => script(this, deltaTime));
    }

    draw(context) {
        if (this.sprite) this.sprite.draw(context);
    }

    addScript(script) {
        this.scripts.push(script);
    }

    setPosition(x, y) {
        this.x = x;
        this.y = y;
        if (this.sprite) {
            this.sprite.x = x;
            this.sprite.y = y;
        }
    }
}
