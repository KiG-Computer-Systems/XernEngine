// Система тайловых карт для создания уровней
export class Tilemap {
    /**
     * @param {number} tileWidth - ширина тайла
     * @param {number} tileHeight - высота тайла
     * @param {number} cols - количество колонок
     * @param {number} rows - количество строк
     */
    constructor(tileWidth, tileHeight, cols, rows) {
        this.tileWidth = tileWidth;
        this.tileHeight = tileHeight;
        this.cols = cols;
        this.rows = rows;
        
        // Слои карты
        this.layers = new Map();
        
        // Тайлсет (спрайт-лист)
        this.tileset = null;
        this.tilesetCols = 0;
        
        // Коллизии
        this.collisionTiles = new Set();
    }

    /**
     * Установить тайлсет
     * @param {HTMLImageElement} image - изображение тайлсета
     * @param {number} cols - количество колонок в тайлсете
     */
    setTileset(image, cols) {
        this.tileset = image;
        this.tilesetCols = cols;
    }

    /**
     * Создать слой
     * @param {string} name - имя слоя
     * @param {number} zIndex - порядок отрисовки
     * @returns {Array} - массив данных слоя
     */
    createLayer(name, zIndex = 0) {
        const data = new Array(this.rows * this.cols).fill(-1);
        this.layers.set(name, { data, zIndex, visible: true });
        return data;
    }

    /**
     * Загрузить слой из массива
     * @param {string} name - имя слоя
     * @param {Array} data - данные тайлов
     * @param {number} zIndex - порядок отрисовки
     */
    loadLayer(name, data, zIndex = 0) {
        this.layers.set(name, { data: [...data], zIndex, visible: true });
    }

    /**
     * Установить тайл
     * @param {string} layer - имя слоя
     * @param {number} col - колонка
     * @param {number} row - строка
     * @param {number} tileId - ID тайла
     */
    setTile(layer, col, row, tileId) {
        const layerData = this.layers.get(layer);
        if (layerData && col >= 0 && col < this.cols && row >= 0 && row < this.rows) {
            layerData.data[row * this.cols + col] = tileId;
        }
    }

    /**
     * Получить тайл
     * @param {string} layer - имя слоя
     * @param {number} col - колонка
     * @param {number} row - строка
     * @returns {number} - ID тайла
     */
    getTile(layer, col, row) {
        const layerData = this.layers.get(layer);
        if (layerData && col >= 0 && col < this.cols && row >= 0 && row < this.rows) {
            return layerData.data[row * this.cols + col];
        }
        return -1;
    }

    /**
     * Получить тайл по мировым координатам
     * @param {string} layer - имя слоя
     * @param {number} x - X координата
     * @param {number} y - Y координата
     * @returns {number} - ID тайла
     */
    getTileAt(layer, x, y) {
        const col = Math.floor(x / this.tileWidth);
        const row = Math.floor(y / this.tileHeight);
        return this.getTile(layer, col, row);
    }

    /**
     * Установить тайлы коллизий
     * @param {Array<number>} tileIds - массив ID тайлов с коллизией
     */
    setCollisionTiles(tileIds) {
        this.collisionTiles = new Set(tileIds);
    }

    /**
     * Проверить коллизию в точке
     * @param {number} x - X координата
     * @param {number} y - Y координата
     * @param {string} layer - слой для проверки (по умолчанию все)
     * @returns {boolean}
     */
    checkCollision(x, y, layer = null) {
        const col = Math.floor(x / this.tileWidth);
        const row = Math.floor(y / this.tileHeight);

        if (col < 0 || col >= this.cols || row < 0 || row >= this.rows) {
            return true; // За границами карты
        }

        if (layer) {
            const tileId = this.getTile(layer, col, row);
            return this.collisionTiles.has(tileId);
        }

        // Проверить все слои
        for (const [name, layerData] of this.layers) {
            const tileId = layerData.data[row * this.cols + col];
            if (this.collisionTiles.has(tileId)) {
                return true;
            }
        }
        return false;
    }

    /**
     * Проверить коллизию прямоугольника
     * @param {number} x 
     * @param {number} y 
     * @param {number} width 
     * @param {number} height 
     * @returns {boolean}
     */
    checkRectCollision(x, y, width, height) {
        const startCol = Math.floor(x / this.tileWidth);
        const endCol = Math.floor((x + width) / this.tileWidth);
        const startRow = Math.floor(y / this.tileHeight);
        const endRow = Math.floor((y + height) / this.tileHeight);

        for (let row = startRow; row <= endRow; row++) {
            for (let col = startCol; col <= endCol; col++) {
                if (this.checkCollision(col * this.tileWidth, row * this.tileHeight)) {
                    return true;
                }
            }
        }
        return false;
    }

    /**
     * Отрисовать карту
     * @param {CanvasRenderingContext2D} ctx - контекст канваса
     * @param {Object} camera - камера {x, y, width, height}
     */
    draw(ctx, camera = null) {
        if (!this.tileset) return;

        // Сортировка слоёв по zIndex
        const sortedLayers = [...this.layers.entries()]
            .sort((a, b) => a[1].zIndex - b[1].zIndex);

        // Определить видимую область
        let startCol = 0, endCol = this.cols;
        let startRow = 0, endRow = this.rows;

        if (camera) {
            startCol = Math.max(0, Math.floor(camera.x / this.tileWidth));
            endCol = Math.min(this.cols, Math.ceil((camera.x + camera.width) / this.tileWidth));
            startRow = Math.max(0, Math.floor(camera.y / this.tileHeight));
            endRow = Math.min(this.rows, Math.ceil((camera.y + camera.height) / this.tileHeight));
        }

        for (const [name, layer] of sortedLayers) {
            if (!layer.visible) continue;

            for (let row = startRow; row < endRow; row++) {
                for (let col = startCol; col < endCol; col++) {
                    const tileId = layer.data[row * this.cols + col];
                    if (tileId < 0) continue;

                    // Позиция тайла в тайлсете
                    const srcX = (tileId % this.tilesetCols) * this.tileWidth;
                    const srcY = Math.floor(tileId / this.tilesetCols) * this.tileHeight;

                    // Позиция на экране
                    let destX = col * this.tileWidth;
                    let destY = row * this.tileHeight;

                    if (camera) {
                        destX -= camera.x;
                        destY -= camera.y;
                    }

                    ctx.drawImage(
                        this.tileset,
                        srcX, srcY, this.tileWidth, this.tileHeight,
                        destX, destY, this.tileWidth, this.tileHeight
                    );
                }
            }
        }
    }

    /**
     * Получить размеры карты в пикселях
     * @returns {{width: number, height: number}}
     */
    getSize() {
        return {
            width: this.cols * this.tileWidth,
            height: this.rows * this.tileHeight
        };
    }

    /**
     * Экспортировать карту в JSON
     * @returns {Object}
     */
    toJSON() {
        const layers = {};
        this.layers.forEach((layer, name) => {
            layers[name] = {
                data: layer.data,
                zIndex: layer.zIndex,
                visible: layer.visible
            };
        });

        return {
            tileWidth: this.tileWidth,
            tileHeight: this.tileHeight,
            cols: this.cols,
            rows: this.rows,
            layers,
            collisionTiles: [...this.collisionTiles]
        };
    }

    /**
     * Загрузить карту из JSON
     * @param {Object} json 
     * @returns {Tilemap}
     */
    static fromJSON(json) {
        const tilemap = new Tilemap(
            json.tileWidth,
            json.tileHeight,
            json.cols,
            json.rows
        );

        for (const [name, layer] of Object.entries(json.layers)) {
            tilemap.loadLayer(name, layer.data, layer.zIndex);
            tilemap.layers.get(name).visible = layer.visible;
        }

        if (json.collisionTiles) {
            tilemap.setCollisionTiles(json.collisionTiles);
        }

        return tilemap;
    }
}
