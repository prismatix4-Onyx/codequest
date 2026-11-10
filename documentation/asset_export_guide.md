# CODEQUEST — Asset Export & Three.js Integration Guide

## 1. Export Settings (Blender glTF 2.0 Exporter)

When exporting assets from Blender for the CODEQUEST React Three Fiber web client, use these verified settings:

- **Format**: `GLB` (glTF 2.0 Binary single file with embedded buffers/textures).
- **Transform**:
  - `+Y Up`: Enabled
  - Apply Modifiers: Enabled
- **Geometry**:
  - Apply Modifiers: Checked
  - Normals: Checked
  - Tangents: Checked (for normal-mapped surfaces)
  - Materials: Export (`PBR Material Type`)
- **Animation**:
  - Animation: Checked
  - NLA Strips: Checked (exports all isolated actions as named tracks)
  - Force Start/End Keyframes: Checked
  - Optimize Animation Size: Checked
- **Compression**:
  - Optional Draco mesh compression enabled for complex environment geometry.

---

## 2. React Three Fiber Integration Pattern

```tsx
import { useGLTF, useAnimations } from '@react-three/drei';
import { useRef, useEffect } from 'react';
import * as THREE from 'three';

export function AriaModel({ currentAction = 'ARIA_Idle' }) {
  const group = useRef<THREE.Group>(null);
  const { scene, animations } = useGLTF('/models/aria.glb');
  const { actions } = useAnimations(animations, group);

  useEffect(() => {
    // Fade into requested action
    actions[currentAction]?.reset().fadeIn(0.3).play();
    return () => actions[currentAction]?.fadeOut(0.3);
  }, [currentAction, actions]);

  return <primitive ref={group} object={scene} />;
}

useGLTF.preload('/models/aria.glb');
```
