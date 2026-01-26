# SaveManager API

The `SaveManager` class handles game save/load functionality using localStorage.

## Import

```javascript
import { SaveManager, saves } from './xernengine.js';
```

## Global Instance

A global instance `saves` is provided:

```javascript
import { saves } from './xernengine.js';

saves.save('slot1', gameData);
const data = saves.load('slot1');
```

## Constructor

```javascript
const saveManager = new SaveManager(gameId);
```

**Parameters:**

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `gameId` | `string` | 'xernengine-game' | Unique identifier for your game |

## Properties

| Property | Type | Description |
|----------|------|-------------|
| `gameId` | `string` | Game identifier prefix |
| `autoSaveInterval` | `number` | Auto-save interval ID |
| `onSave` | `Function` | Callback after save |
| `onLoad` | `Function` | Callback after load |

## Methods

### save(slot, data)

Saves data to a slot.

```javascript
const gameState = {
    level: 5,
    score: 12500,
    playerPosition: { x: 100, y: 200 },
    inventory: ['sword', 'shield', 'potion'],
    playTime: 3600000
};

saves.save('slot1', gameState);
```

**Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| `slot` | `string` | Save slot identifier |
| `data` | `Object` | Data to save (must be JSON-serializable) |

**Returns:** `boolean` - Success status

---

### load(slot)

Loads data from a slot.

```javascript
const gameState = saves.load('slot1');
if (gameState) {
    player.x = gameState.playerPosition.x;
    player.y = gameState.playerPosition.y;
    score = gameState.score;
}
```

**Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| `slot` | `string` | Save slot identifier |

**Returns:** `Object | null` - Saved data or null if not found

---

### delete(slot)

Deletes a save slot.

```javascript
saves.delete('slot1');
```

---

### exists(slot)

Checks if a save exists.

```javascript
if (saves.exists('slot1')) {
    showContinueButton();
}
```

**Returns:** `boolean`

---

### getInfo(slot)

Gets metadata about a save.

```javascript
const info = saves.getInfo('slot1');
// {
//   slot: 'slot1',
//   timestamp: 1706234567890,
//   date: '1/25/2024, 3:42:47 PM',
//   version: 1
// }
```

**Returns:** `Object | null`

---

### getAllSaves()

Gets all saves for the game.

```javascript
const allSaves = saves.getAllSaves();
allSaves.forEach(save => {
    console.log(`${save.slot}: ${save.date}`);
});
```

**Returns:** `Array` - Array of save info objects, sorted by newest first

---

### enableAutoSave(interval, getData)

Enables automatic saving.

```javascript
saves.enableAutoSave(60000, () => {
    return {
        level: currentLevel,
        score: player.score,
        position: { x: player.x, y: player.y }
    };
});
```

**Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| `interval` | `number` | Interval in milliseconds |
| `getData` | `Function` | Function that returns data to save |

---

### disableAutoSave()

Disables automatic saving.

```javascript
saves.disableAutoSave();
```

---

### quickSave(data)

Quick save (F5 style).

```javascript
document.addEventListener('keydown', (e) => {
    if (e.code === 'F5') {
        e.preventDefault();
        saves.quickSave(getGameState());
    }
});
```

---

### quickLoad()

Quick load (F9 style).

```javascript
document.addEventListener('keydown', (e) => {
    if (e.code === 'F9') {
        e.preventDefault();
        const state = saves.quickLoad();
        if (state) loadGameState(state);
    }
});
```

**Returns:** `Object | null`

---

### exportToFile(slot)

Exports a save to a downloadable file.

```javascript
saves.exportToFile('slot1');
// Downloads: 'xernengine-game_slot1.json'
```

---

### importFromFile(file)

Imports a save from a file.

```javascript
const fileInput = document.getElementById('importSave');
fileInput.addEventListener('change', async (e) => {
    const file = e.target.files[0];
    if (file) {
        const success = await saves.importFromFile(file);
        if (success) {
            showMessage('Save imported successfully!');
        }
    }
});
```

**Returns:** `Promise<boolean>`

---

### clearAll()

Deletes all saves for this game.

```javascript
if (confirm('Delete all saves?')) {
    saves.clearAll();
}
```

---

### getStorageSize()

Gets total storage used by this game.

```javascript
const bytes = saves.getStorageSize();
console.log(`Using ${(bytes / 1024).toFixed(2)} KB`);
```

**Returns:** `number` - Size in bytes

## Examples

### Complete Save System

```javascript
import { saves } from './xernengine.js';

class GameSaveSystem {
    constructor(game) {
        this.game = game;
        this.maxSlots = 10;
        
        // Set up callbacks
        saves.onSave = (slot, data) => {
            this.showNotification('Game Saved');
        };
        
        saves.onLoad = (slot, data) => {
            this.showNotification('Game Loaded');
        };
    }
    
    getGameState() {
        return {
            player: {
                x: this.game.player.x,
                y: this.game.player.y,
                health: this.game.player.health,
                level: this.game.player.level,
                experience: this.game.player.experience,
                inventory: [...this.game.player.inventory]
            },
            world: {
                currentLevel: this.game.currentLevel,
                discoveredAreas: [...this.game.discoveredAreas],
                defeatedBosses: [...this.game.defeatedBosses],
                collectedItems: [...this.game.collectedItems]
            },
            stats: {
                playTime: this.game.playTime,
                enemiesDefeated: this.game.stats.enemiesDefeated,
                itemsCollected: this.game.stats.itemsCollected
            },
            settings: {
                musicVolume: audio.getVolume('music'),
                sfxVolume: audio.getVolume('sfx')
            }
        };
    }
    
    loadGameState(state) {
        // Restore player
        this.game.player.x = state.player.x;
        this.game.player.y = state.player.y;
        this.game.player.health = state.player.health;
        this.game.player.level = state.player.level;
        this.game.player.experience = state.player.experience;
        this.game.player.inventory = state.player.inventory;
        
        // Restore world
        this.game.loadLevel(state.world.currentLevel);
        this.game.discoveredAreas = new Set(state.world.discoveredAreas);
        this.game.defeatedBosses = new Set(state.world.defeatedBosses);
        this.game.collectedItems = new Set(state.world.collectedItems);
        
        // Restore stats
        this.game.playTime = state.stats.playTime;
        this.game.stats = state.stats;
        
        // Restore settings
        audio.setVolume('music', state.settings.musicVolume);
        audio.setVolume('sfx', state.settings.sfxVolume);
    }
    
    save(slotNumber) {
        const slot = `slot${slotNumber}`;
        const state = this.getGameState();
        return saves.save(slot, state);
    }
    
    load(slotNumber) {
        const slot = `slot${slotNumber}`;
        const state = saves.load(slot);
        if (state) {
            this.loadGameState(state);
            return true;
        }
        return false;
    }
    
    getSaveSlots() {
        const slots = [];
        for (let i = 1; i <= this.maxSlots; i++) {
            const slot = `slot${i}`;
            const info = saves.getInfo(slot);
            slots.push({
                number: i,
                isEmpty: !info,
                date: info?.date || null,
                preview: info ? this.getSavePreview(slot) : null
            });
        }
        return slots;
    }
    
    getSavePreview(slot) {
        const data = saves.load(slot);
        if (!data) return null;
        
        return {
            level: data.world.currentLevel,
            playTime: this.formatPlayTime(data.stats.playTime),
            progress: this.calculateProgress(data)
        };
    }
    
    formatPlayTime(ms) {
        const hours = Math.floor(ms / 3600000);
        const minutes = Math.floor((ms % 3600000) / 60000);
        return `${hours}:${minutes.toString().padStart(2, '0')}`;
    }
    
    calculateProgress(data) {
        const totalBosses = 10;
        const totalItems = 100;
        const bossProgress = data.world.defeatedBosses.length / totalBosses;
        const itemProgress = data.world.collectedItems.length / totalItems;
        return Math.floor((bossProgress + itemProgress) / 2 * 100);
    }
    
    showNotification(message) {
        // Show in-game notification
    }
}
```

### Save/Load Menu UI

```javascript
class SaveLoadMenu {
    constructor(saveSystem) {
        this.saveSystem = saveSystem;
        this.mode = 'save'; // or 'load'
        this.selectedSlot = 1;
    }
    
    render(ctx) {
        // Draw background
        ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
        ctx.fillRect(100, 50, 600, 500);
        
        // Draw title
        ctx.fillStyle = '#fff';
        ctx.font = '32px Arial';
        ctx.fillText(this.mode === 'save' ? 'Save Game' : 'Load Game', 320, 100);
        
        // Draw slots
        const slots = this.saveSystem.getSaveSlots();
        slots.forEach((slot, i) => {
            const y = 140 + i * 45;
            const isSelected = this.selectedSlot === slot.number;
            
            // Background
            ctx.fillStyle = isSelected ? '#3498db' : '#2c3e50';
            ctx.fillRect(120, y, 560, 40);
            
            // Text
            ctx.fillStyle = '#fff';
            ctx.font = '18px Arial';
            
            if (slot.isEmpty) {
                ctx.fillText(`Slot ${slot.number}: Empty`, 140, y + 27);
            } else {
                ctx.fillText(
                    `Slot ${slot.number}: Level ${slot.preview.level} - ${slot.preview.playTime} - ${slot.preview.progress}%`,
                    140, y + 27
                );
                ctx.fillStyle = '#95a5a6';
                ctx.font = '12px Arial';
                ctx.fillText(slot.date, 500, y + 27);
            }
        });
        
        // Instructions
        ctx.fillStyle = '#95a5a6';
        ctx.font = '14px Arial';
        ctx.fillText('↑↓ Select Slot | Enter Confirm | Escape Cancel', 250, 520);
    }
    
    handleInput(key) {
        switch (key) {
            case 'ArrowUp':
                this.selectedSlot = Math.max(1, this.selectedSlot - 1);
                break;
            case 'ArrowDown':
                this.selectedSlot = Math.min(10, this.selectedSlot + 1);
                break;
            case 'Enter':
                this.confirm();
                break;
            case 'Escape':
                this.close();
                break;
        }
    }
    
    confirm() {
        if (this.mode === 'save') {
            this.saveSystem.save(this.selectedSlot);
        } else {
            this.saveSystem.load(this.selectedSlot);
        }
        this.close();
    }
    
    close() {
        // Return to game
    }
}
```

## Storage Limits

localStorage typically has a 5-10 MB limit. To check available space:

```javascript
function getAvailableStorage() {
    const testKey = '__storage_test__';
    let size = 0;
    
    try {
        while (true) {
            localStorage.setItem(testKey, new Array(1024 * 1024).join('a'));
            size++;
        }
    } catch (e) {
        localStorage.removeItem(testKey);
    }
    
    return size; // Approximate MB available
}
```

## Related

- [Timer API](timer.md)
- [State Machine API](state-machine.md)
- [Audio API](audio.md) - For saving audio settings
