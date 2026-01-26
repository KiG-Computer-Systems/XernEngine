// Экран меню
export function createMenuScreen() {
    try {
        console.log('Attempting to create menu screen');
        const container = document.createElement('div');
        if (!container) {
            throw new Error('Failed to create container element');
        }
        container.id = 'menuScreen';
        container.innerHTML = '<h2>Меню</h2>';

        const body = document.body;
        if (!body) {
            throw new Error('Failed to get document body');
        }
        if (!body.appendChild) {
            throw new Error('Failed to append child element to body');
        }
        console.log('Attempting to append child element to body');
        body.appendChild(container);
        console.log('Successfully appended child element to body');
    } catch (error) {
        if (error instanceof TypeError) {
            console.error('TypeError creating menu screen:', error);
        } else if (error instanceof ReferenceError) {
            console.error('ReferenceError creating menu screen:', error);
        } else {
            console.error('Error creating menu screen:', error);
        }
    }
    console.log('Finished creating menu screen');
}
