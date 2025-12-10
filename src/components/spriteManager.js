// Менеджер спрайтов
export class SpriteManager {
    constructor() {
        this.sprites = [];
    }

    addSprite(sprite) {
        this.sprites.push(sprite);
    }

    getSprite(index) {
        return this.sprites[index];
    }

    drawAll(context) {
        this.sprites.forEach(sprite => sprite.draw(context));
    }
}
