// Начальный экран
export function createStartScreen() {
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

    const title = document.createElement('h1');
    title.innerText = 'XernEngine';
    container.appendChild(title);

    const newProjectButton = document.createElement('button');
    newProjectButton.innerText = 'Новый проект';
    newProjectButton.style.margin = '10px';
    newProjectButton.onclick = () => alert('Создание нового проекта');
    container.appendChild(newProjectButton);

    const myProjectsButton = document.createElement('button');
    myProjectsButton.innerText = 'Мои проекты';
    myProjectsButton.style.margin = '10px';
    myProjectsButton.onclick = () => alert('Открытие списка проектов');
    container.appendChild(myProjectsButton);

    const exitButton = document.createElement('button');
    exitButton.innerText = 'Выйти';
    exitButton.style.margin = '10px';
    exitButton.onclick = () => alert('Выход из приложения');
    container.appendChild(exitButton);

    document.body.appendChild(container);
}