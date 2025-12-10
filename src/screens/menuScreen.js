// Экран меню
export function createMenuScreen() {
    const container = document.createElement('div');
    container.id = 'menuScreen';
    container.innerHTML = '<h2>Меню</h2>';
    document.body.appendChild(container);
}
