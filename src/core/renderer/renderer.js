// Основной рендерер
import { initializeWebGL } from './webgl';

export class Renderer {
    constructor(canvas) {
        if (!canvas) throw new Error('Canvas is null');
        console.log('Initializing WebGL...');
        try {
            this.gl = initializeWebGL(canvas);
            console.log('WebGL initialized successfully.');
            this.width = canvas.width;
            this.height = canvas.height;
            console.log(`Renderer width: ${this.width}, height: ${this.height}`);
        } catch (e) {
            console.error('Error initializing WebGL:', e);
            throw e;
        }
    }

    clear() {
        const gl = this.gl;
        if (!gl) throw new Error('Renderer.gl is null');

        try {
            console.log('Clearing WebGL context...');
            gl.clearColor(0.0, 0.0, 0.0, 1.0);
            gl.clear(gl.COLOR_BUFFER_BIT);
            console.log('WebGL context cleared successfully.');
        } catch (e) {
            if (e instanceof Error) {
                console.error('Error clearing WebGL context:', e);
            } else {
                console.error('Unknown error clearing WebGL context:', e);
            }
            throw e;
        }
    }

    resize(width, height) {
        if (this.gl === null) throw new Error('Renderer.gl is null');

        if (width === null || height === null) {
            throw new Error('Width and height must not be null');
        }

        try {
            console.log(`Resizing WebGL context to ${width}x${height}`);
            this.width = width;
            this.height = height;
            this.gl.viewport(0, 0, width, height);
        } catch (e) {
            if (e instanceof Error) {
                console.error(`Error resizing WebGL context to ${width}x${height}:`, e);
            } else {
                console.error(`Unknown error resizing WebGL context to ${width}x${height}:`, e);
            }
            throw e;
        }
    }
}
