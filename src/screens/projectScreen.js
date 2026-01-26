// Экран проектов
export function createProjectScreen() {
    try {
        console.log('createProjectScreen: Started');
        const container = document.createElement('div');
        if (container === null) {
            console.error('createProjectScreen: Failed to create container element');
            throw new Error('Failed to create container element');
        }
        container.id = 'projectScreen';
        console.log('createProjectScreen: Container element created');
        container.innerHTML = '<h2>Мои проекты</h2>';
        console.log('createProjectScreen: Container element content set');
        if (document.body === null) {
            console.error('createProjectScreen: Failed to get document body');
            throw new Error('Failed to get document body');
        }
        console.log('createProjectScreen: Document body obtained');
        document.body.appendChild(container);
        console.log('createProjectScreen: Container element appended to document body');
        console.log('createProjectScreen: Finished');
    } catch (error) {
        console.error('createProjectScreen: Error occurred', error);
    }
}
