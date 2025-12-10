// Пример сложной игры
import { Renderer } from '../../src/core/renderer/renderer';
import { Scene } from '../../src/components/scene';
import { Sprite } from '../../src/components/sprite';

const canvas = document.getElementById('gameCanvas');
const renderer = new Renderer(canvas);
const scene = new Scene();

function loadAssets() {
    // Загрузка ресурсов
}

function gameLoop() {
    renderer.clear();
    scene.update(0);
    scene.draw(renderer.gl);
    requestAnimationFrame(gameLoop);
}

loadAssets();
gameLoop();