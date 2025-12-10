// Экран выхода
export function createExitScreen() {
    const container = document.createElement('div');
    container.id = 'exitScreen';
    container.innerHTML = '<h2>Выход</h2>';
    document.body.appendChild(container);
}
