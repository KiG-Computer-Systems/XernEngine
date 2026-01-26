// Спрайты
export class Sprite {
    constructor(image, x, y, width, height) {
        if (image === null || image === undefined) {
            throw new Error('Image is null or undefined');
        }
        if (typeof x !== 'number' || typeof y !== 'number' || typeof width !== 'number' || typeof height !== 'number') {
            throw new Error('Coordinates and dimensions must be numbers');
        }
        if (isNaN(x) || isNaN(y) || isNaN(width) || isNaN(height)) {
            throw new Error('Coordinates and dimensions must be valid numbers');
        }
        this.image = image;
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.opacity = 1.0;
    }

    draw(context) {
        context.globalAlpha = this.opacity;
        context.drawImage(this.image, this.x, this.y, this.width, this.height);
        context.globalAlpha = 1.0;
    }

    setOpacity(opacity) {
        this.opacity = opacity;
    }
}