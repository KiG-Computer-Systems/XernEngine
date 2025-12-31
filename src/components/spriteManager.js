// Менеджер спрайтов
export class SpriteManager {
    constructor() {
        if (!this || typeof this !== 'object') {
            throw new TypeError('SpriteManager constructor called without "new" keyword');
        }

        this.sprites = [];

        try {
            Object.seal(this);
        } catch (error) {
            if (error instanceof TypeError) {
                throw new TypeError('SpriteManager instance cannot be modified');
            } else {
                throw error;
            }
        }
    }

    addSprite(sprite) {
        if (!sprite || typeof sprite !== 'object') {
            throw new TypeError('sprite must be an object');
        }

        if (sprite instanceof Sprite) {
            this.sprites.push(sprite);
        } else {
            throw new TypeError('sprite must be an instance of Sprite');
        }
    }

    getSprite(index) {
        if (typeof index !== 'number') {
            throw new TypeError('index must be a number');
        }

        if (index < 0 || index >= this.sprites.length) {
            throw new RangeError('index is out of range');
        }

        const sprite = this.sprites[index];
        if (!sprite) {
            throw new ReferenceError('sprite at index ' + index + ' is null or undefined');
        }

        return sprite;
    }

    drawAll(context) {
        if (!context || typeof context !== 'object') {
            throw new TypeError('context must be an object');
        }

        try {
            this.sprites.forEach(sprite => {
                if (!sprite || typeof sprite !== 'object') {
                    throw new TypeError('sprite at index ' + this.sprites.indexOf(sprite) + ' is null or undefined');
                }

                if (!(sprite instanceof Sprite)) {
                    throw new TypeError('sprite at index ' + this.sprites.indexOf(sprite) + ' is not an instance of Sprite');
                }

                sprite.draw(context);
            });
        } catch (error) {
            if (error instanceof TypeError) {
                console.error('TypeError: ' + error.message);
            } else if (error instanceof ReferenceError) {
                console.error('ReferenceError: ' + error.message);
            } else {
                throw error;
            }
        }
    }
}
