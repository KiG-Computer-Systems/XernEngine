// Загрузка ресурсов
export function loadImage(url) {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => {
            console.log(`Image loaded: ${url}`);
            resolve(img);
        };
        img.onerror = () => {
            console.log(`Error loading image: ${url}`);
            reject(new Error(`Не удалось загрузить изображение: ${url}`));
        };
        img.src = url;
        console.log(`Loading image from ${url}`);
    });
}

export function loadJSON(url) {
    return fetch(url).then(response => {
        if (!response.ok) {
            console.log(`Error loading JSON: ${url}`);
            throw new Error(`Не удалось загрузить JSON: ${url}`);
        }
        console.log(`Loading JSON from ${url}`);
        return response.json();
    }).catch(error => {
        console.log(`Error loading JSON: ${url}`, error);
        throw error;
    });
}
