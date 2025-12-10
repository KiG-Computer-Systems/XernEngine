// Подключение библиотек
import * as THREE from 'three';
import * as glMatrix from 'gl-matrix';
import * as twgl from 'twgl.js';
import createREGL from 'regl';
import shaderLoader from 'shader-loader';
import Stats from 'stats.js';

// Создание canvas и WebGL 2.0 контекста
const canvas = document.createElement('canvas');
canvas.id = 'gameCanvas';
canvas.width = 800;
canvas.height = 600;
document.body.appendChild(canvas);

const gl = canvas.getContext('webgl2');
if (!gl) {
    throw new Error('WebGL 2.0 не поддерживается');
}

// Инициализация stats.js для мониторинга производительности
const stats = new Stats();
stats.showPanel(0);
document.body.appendChild(stats.dom);

// Загрузка шейдеров
shaderLoader.load('./shaders/vertex.hlsl', './shaders/fragment.hlsl', (shaders) => {
    const vertexShader = shaders.vertex;
    const fragmentShader = shaders.fragment;

    // Использование TWGL для создания программ
    const programInfo = twgl.createProgramInfo(gl, [vertexShader, fragmentShader]);

    // Основной цикл игры
    function gameLoop() {
        stats.begin();

        // Очистка экрана
        gl.clearColor(0.0, 0.0, 0.0, 1.0);
        gl.clear(gl.COLOR_BUFFER_BIT);

        // Рендеринг сцены
        twgl.drawBufferInfo(gl, programInfo);

        stats.end();
        requestAnimationFrame(gameLoop);
    }

    gameLoop();
});