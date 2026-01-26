// Персонаж
export class Character {
    constructor(name, sprite) {
        if (name === null || typeof name !== 'string') {
            throw new TypeError('Name must be a valid string');
        }
        if (sprite === null || typeof sprite !== 'object') {
            throw new TypeError('Sprite must be a valid object');
        }
        this.name = name;
        this.sprite = sprite;
        this.x = 0;
        this.y = 0;
        this.health = 100;
        this.scripts = [];
        try {
            Object.freeze(this); // Prevents accidental changes to the object
        } catch (error) {
            console.warn('Failed to freeze character object:', error);
        }
    }

    update(deltaTime) {
        try {
            if (this.scripts !== null && this.scripts !== undefined) {
                this.scripts.forEach(script => {
                    if (script !== null && typeof script === 'function') {
                        script(this, deltaTime);
                    } else {
                        console.warn('Skipping invalid script:', script);
                    }
                });
            }
        } catch (error) {
            console.error('Error updating character:', error);
        }
    }

    draw(context) {
        try {
            if (this.sprite !== null && this.sprite !== undefined) {
                this.sprite.draw(context);
            }
        } catch (error) {
            console.error('Error drawing character:', error);
        }
    }

    addScript(script) {
        if (script === null || typeof script !== 'function') {
            throw new TypeError('Script must be a valid function');
        }
        try {
            this.scripts.push(script);
        } catch (error) {
            console.error('Error adding script to character:', error);
        }
    }

    setPosition(x, y) {
        if (x === null || y === null) {
            throw new TypeError('x and y must not be null');
        }
        this.x = x;
        this.y = y;
        if (this.sprite !== null && this.sprite !== undefined) {
            try {
                this.sprite.x = x;
                this.sprite.y = y;
            } catch (error) {
                console.error('Error setting sprite position:', error);
            }
        }
    }
}
