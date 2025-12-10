// Загрузка ресурсов
export function loadImage(url) {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => resolve(img);
        img.onerror = () => reject(new Error(`Не удалось загрузить изображение: ${url}`));
        img.src = url;
    });
}

export function loadJSON(url) {
    return fetch(url).then(response => {
        if (!response.ok) {
            throw new Error(`Не удалось загрузить JSON: ${url}`);
        }
        return response.json();
    });
}