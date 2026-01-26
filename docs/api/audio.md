# Audio API

The `AudioManager` class handles sound effects and music using the Web Audio API.

## Import

```javascript
import { AudioManager, audio } from './xernengine.js';
```

## Global Instance

A global instance `audio` is provided for convenience:

```javascript
import { audio } from './xernengine.js';

await audio.loadSound('jump', 'assets/audio/jump.wav');
audio.playSound('jump');
```

## Constructor

```javascript
const audioManager = new AudioManager();
```

## Properties

| Property | Type | Description |
|----------|------|-------------|
| `context` | `AudioContext` | Web Audio context |
| `masterGain` | `GainNode` | Master volume control |
| `sounds` | `Map` | Loaded sound effects |
| `music` | `Map` | Loaded music tracks |
| `currentMusic` | `Object` | Currently playing music |
| `volumes` | `Object` | Volume levels {master, sfx, music} |
| `initialized` | `boolean` | Whether audio context is initialized |

## Methods

### init()

Initializes the audio context. Must be called after a user interaction (click/touch).

```javascript
// Initialize on first click
document.addEventListener('click', () => {
    audio.init();
}, { once: true });
```

**Notes:**
- Web Audio API requires user interaction before playing audio
- Call this in a click or touch event handler

---

### loadSound(name, url)

Loads a sound effect.

```javascript
await audio.loadSound('explosion', 'assets/audio/explosion.wav');
await audio.loadSound('jump', 'assets/audio/jump.mp3');
```

**Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| `name` | `string` | Unique identifier for the sound |
| `url` | `string` | URL to the audio file |

**Returns:** `Promise<AudioBuffer>`

---

### loadMusic(name, url)

Loads a music track.

```javascript
await audio.loadMusic('bgm', 'assets/audio/background.mp3');
await audio.loadMusic('boss', 'assets/audio/boss-theme.mp3');
```

**Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| `name` | `string` | Unique identifier for the music |
| `url` | `string` | URL to the audio file |

**Returns:** `Promise<AudioBuffer>`

---

### playSound(name, options)

Plays a loaded sound effect.

```javascript
// Basic playback
audio.playSound('jump');

// With options
audio.playSound('explosion', {
    volume: 0.8,
    playbackRate: 1.2
});

// Looping sound
audio.playSound('engine', { loop: true });
```

**Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| `name` | `string` | Sound identifier |
| `options` | `Object` | Playback options |
| `options.volume` | `number` | Volume (0-1), default: 1 |
| `options.loop` | `boolean` | Loop sound, default: false |
| `options.playbackRate` | `number` | Speed (1 = normal), default: 1 |

**Returns:** `AudioBufferSourceNode` or `null`

---

### playMusic(name, loop, fadeIn)

Plays a music track.

```javascript
// Basic playback with loop
audio.playMusic('bgm');

// Without loop
audio.playMusic('victory', false);

// With custom fade in
audio.playMusic('bgm', true, 2000);
```

**Parameters:**

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `name` | `string` | - | Music identifier |
| `loop` | `boolean` | true | Loop the music |
| `fadeIn` | `number` | 1000 | Fade in duration (ms) |

**Notes:**
- Automatically stops currently playing music
- Crossfades between tracks

---

### stopMusic(fadeOut)

Stops the currently playing music.

```javascript
// Stop with default fade
audio.stopMusic();

// Quick stop
audio.stopMusic(100);

// Long fade out
audio.stopMusic(3000);
```

**Parameters:**

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `fadeOut` | `number` | 500 | Fade out duration (ms) |

---

### pauseMusic()

Pauses all audio playback.

```javascript
// Pause when game pauses
audio.pauseMusic();
```

---

### resumeMusic()

Resumes audio playback.

```javascript
// Resume when game resumes
audio.resumeMusic();
```

---

### setVolume(type, value)

Sets volume for a category.

```javascript
audio.setVolume('master', 0.8);
audio.setVolume('sfx', 1.0);
audio.setVolume('music', 0.5);
```

**Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| `type` | `string` | 'master', 'sfx', or 'music' |
| `value` | `number` | Volume level (0-1) |

---

### getVolume(type)

Gets volume for a category.

```javascript
const musicVolume = audio.getVolume('music');
```

**Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| `type` | `string` | 'master', 'sfx', or 'music' |

**Returns:** `number`

---

### mute() / unmute()

Mutes or unmutes all audio.

```javascript
// Mute
audio.mute();

// Unmute
audio.unmute();
```

## Examples

### Loading All Game Audio

```javascript
async function loadAudio() {
    // Initialize on user interaction
    audio.init();
    
    // Load sound effects
    const sounds = [
        ['jump', 'assets/audio/jump.wav'],
        ['shoot', 'assets/audio/shoot.wav'],
        ['explosion', 'assets/audio/explosion.wav'],
        ['pickup', 'assets/audio/pickup.wav'],
        ['hit', 'assets/audio/hit.wav'],
        ['death', 'assets/audio/death.wav']
    ];
    
    // Load music
    const music = [
        ['menu', 'assets/audio/menu-theme.mp3'],
        ['game', 'assets/audio/game-theme.mp3'],
        ['boss', 'assets/audio/boss-theme.mp3'],
        ['victory', 'assets/audio/victory.mp3'],
        ['gameover', 'assets/audio/gameover.mp3']
    ];
    
    // Load all in parallel
    await Promise.all([
        ...sounds.map(([name, url]) => audio.loadSound(name, url)),
        ...music.map(([name, url]) => audio.loadMusic(name, url))
    ]);
    
    console.log('All audio loaded');
}
```

### Audio Settings Menu

```javascript
class AudioSettings {
    constructor() {
        this.masterSlider = document.getElementById('masterVolume');
        this.sfxSlider = document.getElementById('sfxVolume');
        this.musicSlider = document.getElementById('musicVolume');
        
        this.loadSettings();
        this.bindEvents();
    }
    
    loadSettings() {
        const settings = JSON.parse(localStorage.getItem('audioSettings') || '{}');
        
        audio.setVolume('master', settings.master ?? 1);
        audio.setVolume('sfx', settings.sfx ?? 1);
        audio.setVolume('music', settings.music ?? 0.5);
        
        this.masterSlider.value = audio.getVolume('master');
        this.sfxSlider.value = audio.getVolume('sfx');
        this.musicSlider.value = audio.getVolume('music');
    }
    
    saveSettings() {
        localStorage.setItem('audioSettings', JSON.stringify({
            master: audio.getVolume('master'),
            sfx: audio.getVolume('sfx'),
            music: audio.getVolume('music')
        }));
    }
    
    bindEvents() {
        this.masterSlider.addEventListener('input', (e) => {
            audio.setVolume('master', parseFloat(e.target.value));
            this.saveSettings();
        });
        
        this.sfxSlider.addEventListener('input', (e) => {
            audio.setVolume('sfx', parseFloat(e.target.value));
            audio.playSound('pickup'); // Preview sound
            this.saveSettings();
        });
        
        this.musicSlider.addEventListener('input', (e) => {
            audio.setVolume('music', parseFloat(e.target.value));
            this.saveSettings();
        });
    }
}
```

### Game Audio Integration

```javascript
class Game {
    constructor() {
        this.currentScene = 'menu';
    }
    
    async init() {
        await loadAudio();
        audio.playMusic('menu');
    }
    
    startGame() {
        this.currentScene = 'game';
        audio.playMusic('game', true, 1500);
    }
    
    startBossFight() {
        audio.playMusic('boss', true, 500);
    }
    
    gameOver() {
        audio.stopMusic(1000);
        audio.playSound('death');
        setTimeout(() => {
            audio.playMusic('gameover', false);
        }, 1000);
    }
    
    victory() {
        audio.playMusic('victory', false, 500);
    }
    
    pause() {
        audio.pauseMusic();
    }
    
    resume() {
        audio.resumeMusic();
    }
}

// Player class
class Player {
    jump() {
        if (this.canJump) {
            this.velocity.y = -this.jumpForce;
            audio.playSound('jump');
        }
    }
    
    shoot() {
        audio.playSound('shoot', { volume: 0.7 });
        // Create bullet...
    }
    
    takeDamage(amount) {
        this.health -= amount;
        audio.playSound('hit');
        
        if (this.health <= 0) {
            audio.playSound('death', { volume: 1.0 });
        }
    }
    
    collectItem(item) {
        audio.playSound('pickup', {
            playbackRate: 0.8 + Math.random() * 0.4 // Slight variation
        });
    }
}
```

### Spatial Audio (Basic)

```javascript
function playSpatialSound(name, sourceX, sourceY, listenerX, listenerY) {
    const dx = sourceX - listenerX;
    const dy = sourceY - listenerY;
    const distance = Math.sqrt(dx * dx + dy * dy);
    
    // Max hearing distance
    const maxDistance = 500;
    
    if (distance > maxDistance) return;
    
    // Calculate volume based on distance
    const volume = 1 - (distance / maxDistance);
    
    // Calculate stereo pan (-1 to 1)
    const pan = Math.max(-1, Math.min(1, dx / maxDistance));
    
    audio.playSound(name, { volume });
}

// Usage
playSpatialSound('explosion', explosion.x, explosion.y, player.x, player.y);
```

## Supported Formats

| Format | Extension | Browser Support |
|--------|-----------|-----------------|
| WAV | .wav | All |
| MP3 | .mp3 | All |
| OGG | .ogg | Firefox, Chrome, Opera |
| AAC | .aac, .m4a | Safari, Chrome, Edge |
| WebM | .webm | Chrome, Firefox, Opera |

**Recommendation:** Use MP3 for music (smaller files) and WAV for sound effects (no decoding latency).

## Related

- [Save Manager API](save-manager.md) - For saving audio settings
- [Timer API](timer.md) - For delayed audio playback
