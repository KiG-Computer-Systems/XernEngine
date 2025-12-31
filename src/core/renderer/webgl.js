// Управление WebGL контекстом
export function initializeWebGL(canvas) {
    const gl = canvas.getContext('webgl');
    if (!gl) {
        console.log('initializeWebGL: Cannot create WebGL context: WebGL is not supported');
        throw new Error('WebGL не поддерживается');
    }
    if (gl === null) {
        console.log('initializeWebGL: Cannot create WebGL context: null pointer reference');
        throw new Error('Cannot create WebGL context: null pointer reference');
    }
    try {
        console.log('initializeWebGL: Clearing WebGL context...');
        gl.clearColor(1.0, 0.0, 0.0, 1.0);
        gl.clear(gl.COLOR_BUFFER_BIT);
        console.log('initializeWebGL: Successfully cleared WebGL context');
    } catch (e) {
        console.log(`initializeWebGL: Cannot clear WebGL context: ${e.message}`);
        throw new Error(`Cannot clear WebGL context: ${e.message}`);
    }
    return gl;
}

export function createShader(gl, type, source) {
    const shader = gl.createShader(type);
    if (!shader || shader === null) {
        throw new Error('Cannot create shader: null pointer reference');
    }
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    const status = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
    if (!status) {
        try {
            const log = gl.getShaderInfoLog(shader);
            console.log(`createShader: FAILED to compile shader: ${type}`);
            console.log(`createShader: shader info log: ${log}`);
            const error = new Error(`Ошибка компиляции шейдера: ${log}`);
            throw error;
        } catch (e) {
            console.log(`createShader: FAILED to get shader info log: ${e}`);
            throw new Error(`Cannot get shader info log: ${e}`);
        }
    } else {
        console.log(`createShader: Successfully compiled shader: ${type}`);
    }
    return shader;
}
