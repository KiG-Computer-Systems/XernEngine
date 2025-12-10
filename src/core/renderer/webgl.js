// Управление WebGL контекстом
export function initializeWebGL(canvas) {
    const gl = canvas.getContext('webgl');
    if (!gl) {
        throw new Error('WebGL не поддерживается');
    }
    return gl;
}

export function createShader(gl, type, source) {
    const shader = gl.createShader(type);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        throw new Error('Ошибка компиляции шейдера: ' + gl.getShaderInfoLog(shader));
    }
    return shader;
}