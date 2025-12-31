// Начальный экран
export function createStartScreen() {
    console.log('Creating start screen');
    const container = document.createElement('div');
    container.id = 'startScreen';
    container.style.position = 'absolute';
    container.style.top = '0';
    container.style.left = '0';
    container.style.width = '100%';
    container.style.height = '100%';
    container.style.display = 'flex';
    container.style.flexDirection = 'column';
    container.style.justifyContent = 'center';
    container.style.alignItems = 'center';
    container.style.backgroundColor = '#282c34';
    container.style.color = '#fff';
    container.style.fontFamily = 'Arial, sans-serif';

    try {
        console.log('Creating title element');
        const title = document.createElement('h1');
        title.innerText = 'XernEngine';
        container.appendChild(title);

        console.log('Creating new project button');
        const newProjectButton = document.createElement('button');
        newProjectButton.innerText = 'Новый проект';
        newProjectButton.style.margin = '10px';
        newProjectButton.onclick = () => alert('Создание нового проекта');
        container.appendChild(newProjectButton);

        console.log('Creating my projects button');
        const myProjectsButton = document.createElement('button');
        myProjectsButton.innerText = 'Мои проекты';
        myProjectsButton.style.margin = '10px';
        myProjectsButton.onclick = () => alert('Открытие списка проектов');
        container.appendChild(myProjectsButton);

        console.log('Creating exit button');
        const exitButton = document.createElement('button');
        exitButton.innerText = 'Выйти';
        exitButton.style.margin = '10px';
        exitButton.onclick = () => alert('Выход из приложения');
        container.appendChild(exitButton);

        console.log('Appending start screen to body');
        if (document.body) {
            document.body.appendChild(container);
        } else {
            throw new Error('document.body is null');
        }
    } catch (error) {
        console.error(`Error creating start screen: ${error}`);
    }
}
