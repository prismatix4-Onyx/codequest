# CODEQUEST — Animation & Cinematics Guide

## 1. Animation Standards

- **Framerate**: Standard 30 FPS for WebGL performance and smooth interpolation.
- **NLA Actions**: Every animation clip is isolated into a named Blender NLA action prefixed with the actor name (e.g., `ARIA_Idle`, `Reactor_Core_Oscillation`).
- **Looping**: Idle and looping actions must match first and last keyframe values with cyclical bezier extrapolation.

---

## 2. ARIA Action Specifications

| Action Name | Frame Range | Description & Timing |
| :--- | :--- | :--- |
| `ARIA_Idle` | 1 – 60 (2s loop) | Gentle torso breathing, floating holographic micro-drift, natural eye blinks. |
| `ARIA_Talking` | 1 – 45 (1.5s loop) | Expressive hand gestures, head tilts, rhythmic jaw/mouth modulation. |
| `ARIA_Listening` | 1 – 60 (2s loop) | Attentive head inclination towards the camera/player, subtle nodding. |
| `ARIA_Thinking` | 1 – 40 (1.33s) | Hand near chin, eyes shifting upward, subtle contemplative posture. |
| `ARIA_Surprised` | 1 – 30 (1s) | Quick recoil, raised eyebrows, widened eyes, stabilizing hand motion. |
| `ARIA_Happy` | 1 – 40 (1.33s) | Joyful posture, gentle upward float, warm nod. |
| `ARIA_Concerned`| 1 – 45 (1.5s) | Forward lean, furrowed brow, urgent hand gesture toward the reactor. |
| `ARIA_Mission_Success` | 1 – 60 (2s) | Celebratory gesture, energized spin/flourish, glowing holographic pulse. |

---

## 3. Opening Cinematic Choreography: "THE SILENT VESSEL"

- **Shot 1 (Frames 1–120 / 4s)**: Exterior orbital approach. Camera pans slowly over the battered hull toward the glowing bridge window.
- **Shot 2 (Frames 121–240 / 4s)**: Interior reveal. Camera dollies through the darkened bridge, revealing abandoned stations and dead consoles.
- **Shot 3 (Frames 241–360 / 4s)**: Hologram pedestal ignites with spiraling particles. ARIA materializes and stretches, blinking into consciousness.
- **Shot 4 (Frames 361–480 / 4s)**: Dialogue Shot A. Close-up on ARIA: *"Oh! You're awake. That's... unexpected. Welcome aboard ORPHEUS."*
- **Shot 5 (Frames 481–630 / 5s)**: Emergency Climax. Red strobes flash, klaxon sounds, reactor core sparks. ARIA gestures in alarm: *"Our reactor is about to become a very expensive firework."*
- **Shot 6 (Frames 631–750 / 4s)**: Holographic HUD expands in front of player displaying: `MISSION 1: RESTORE REACTOR STABILITY`.
