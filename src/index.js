// Точка входа движка
import { Renderer } from './core/renderer/renderer';
// Импорт начального экрана
import { createStartScreen } from './screens/startScreen';

const canvas = document.getElementById('gameCanvas');
const renderer = new Renderer(canvas);

function initializeGame() {
    console.log('Инициализация игры');
    // Дополнительная логика инициализации
}

function gameLoop() {
    renderer.clear();
    // Логика обновления и отрисовки
    requestAnimationFrame(gameLoop);
}

initializeGame();
gameLoop();

// Создание начального экрана
createStartScreen();