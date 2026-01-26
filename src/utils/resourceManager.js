// Менеджер ресурсов
export class ResourceManager {
    constructor() {
        console.log('Initializing ResourceManager');
        this.resources = {
            images: {},
            sounds: {}
        };
        console.log('ResourceManager initialized');
    }

    loadImage(name, url) {
        console.log(`Loading image: ${name} from ${url}`);
        const image = new Image();
        image.onload = () => {
            console.log(`Image loaded: ${name}`);
            this.resources.images[name] = image;
        };
        image.onerror = () => {
            console.error(`Failed to load image: ${name} from ${url}`);
        };
        image.src = url;
    }

    loadSound(name, url) {
        console.log(`Loading sound: ${name} from ${url}`);
        const sound = new Audio(url);
        this.resources.sounds[name] = sound;
        console.log(`Sound loaded: ${name}`);
    }
} // 
