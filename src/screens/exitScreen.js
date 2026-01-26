// Экран выхода
export function createExitScreen() {
    if (!document.body) {
        throw new Error('document.body is null');
    }

    const container = document.createElement('div');
    if (!container) {
        throw new Error('Failed to create div element');
    }

    container.id = 'exitScreen';
    container.innerHTML = '<h2>Выход</h2>';

    console.log('createExitScreen: starting to append child to document.body');
    try {
        document.body.appendChild(container);
        console.log('createExitScreen: successfully appended child to document.body');
    } catch (e) {
        console.error(`createExitScreen: Failed to append child to document.body: ${e}`);
    }
}
