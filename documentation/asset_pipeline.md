# CODEQUEST — 3D Asset Pipeline Guide

This document defines the production lifecycle for 3D assets in **CODEQUEST**, from conceptual modeling in Blender 5.2 to real-time rendering in **React Three Fiber (R3F) / Three.js**.

---

## 1. Asset Lifecycle

```
[ Concept / References ]
           |
           v
[ High-Poly Modeling in Blender ]
   - Modifiers: Subdiv / Bevel / Mirror
   - Clear Object & Datablock naming
           |
           v
[ Materials & Shaders ]
   - Principled BSDF standard PBR
   - Controlled Emission & Fresnel holographic accents
           |
           v
[ Rigging & Animation ]
   - Skeletons with standardized bone naming
   - Reusable NLA Animation Actions
           |
           v
[ Quality Control Inspection ]
   - Orthographic & Turnaround Preview Renders
           |
           v
[ glTF / GLB Web Optimization ]
   - Apply modifiers, bake animations, strip redundant data
   - Scale: 1 Blender Unit = 1 Meter in Three.js
   - Target size: < 2.5MB per prop / < 6MB per environment
           |
           v
[ Web Integration in Next.js / R3F ]
   - Asynchronous loading via `@react-three/drei` (`useGLTF`)
```

---

## 2. Scale, Unit, and Coordinate System
- **Units**: Metric (Meters).
- **Forward Axis**: `-Z` (glTF standard).
- **Up Axis**: `+Y` in Three.js (`+Z` in Blender native, handled automatically by glTF exporter).
- **Pivot Point / Origin**:
  - Characters: Ground level between feet `(0, 0, 0)`.
  - Props / Consoles: Bottom-center for easy snapping.
  - Symmetrical assets: Centered along the X-axis.

---

## 3. WebGL Budget Guidelines

| Asset Category | Target Polygon Count | Texture Resolution | Max File Size (GLB) |
| :--- | :--- | :--- | :--- |
| Main Characters (ARIA) | 12k – 25k tris | 2048x2048 (or procedural) | < 3.5 MB |
| Secondary Characters | 8k – 15k tris | 1024x1024 | < 2.5 MB |
| Hero Props (Reactor) | 5k – 12k tris | 1024x1024 / 2048x2048 | < 2.0 MB |
| Minor Props / Consoles | 1k – 4k tris | 512x512 / 1024x1024 | < 800 KB |
| Modular Bridge Environment | 25k – 45k tris | 2048x2048 atlas / trims | < 6.0 MB |
