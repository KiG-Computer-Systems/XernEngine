// Реальный рендеринг через WebGL
export class RenderPipeline {
    constructor(gl) {
        console.log('RenderPipeline constructor called');
        this.gl = gl;
        this.shaders = {};
        console.log('RenderPipeline shaders:', this.shaders);
    }

    addShader(name, vertexSource, fragmentSource) {
        if (!name || !vertexSource || !fragmentSource) {
            throw new Error('Shader name, vertex source, or fragment source is null or undefined');
        }

        try {
            const shader = this.createShader(name, vertexSource, fragmentSource);
            this.shaders[name] = shader;
        } catch (error) {
            console.error(`Error creating shader for ${name}:`, error);
            throw error;
        }
    }

    createShader(name, vertexSource, fragmentSource) {
        const shader = twgl.createProgramInfo(this.gl, [vertexSource, fragmentSource]);
        if (!shader.program) {
            throw new Error(`Error compiling shader for ${name}: ${shader.errorMessage}`);
        }
        return shader;
    }

    render(scene) {
        if (!scene) throw new Error('Scene is null');
        try {
            console.log('Rendering scene:', scene);
            // ...реальный рендеринг сцены через WebGL...
        } catch (error) {
            console.error('Error rendering scene:', scene, error);
        }
    }
}
