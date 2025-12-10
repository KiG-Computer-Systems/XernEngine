// Основной рендерер
import { initializeWebGL } from './webgl';

export class Renderer {
    constructor(canvas) {
        this.gl = initializeWebGL(canvas);
        this.width = canvas.width;
        this.height = canvas.height;
    }

    clear() {
        const gl = this.gl;
        gl.clearColor(0.0, 0.0, 0.0, 1.0);
        gl.clear(gl.COLOR_BUFFER_BIT);
    }

    resize(width, height) {
        this.width = width;
        this.height = height;
        this.gl.viewport(0, 0, width, height);
    }
}