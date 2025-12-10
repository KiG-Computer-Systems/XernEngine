// Экран проектов
export function createProjectScreen() {
    const container = document.createElement('div');
    container.id = 'projectScreen';
    container.innerHTML = '<h2>Мои проекты</h2>';
    document.body.appendChild(container);
}
