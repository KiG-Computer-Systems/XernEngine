// Спрайты
export class Sprite {
    constructor(image, x, y, width, height) {
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