# CODEQUEST — 3D Asset Library & Production Pipeline

This directory holds all source 3D files, materials, rigs, animation actions, texture maps, audio stems, and web-optimized exports for **CODEQUEST**, the cinematic story-driven Python learning adventure.

---

## Directory Hierarchy & Rules

```
assets/
  characters/               # Character assets (models, rigs, facial blendshapes)
    aria/                   # Primary AI companion
      source/               # High-poly .blend source scenes
      textures/             # PBR and holographic texture maps
      exports/              # Character-specific GLB files
      previews/             # Orthographic & cinematic turntable renders
      documentation/        # Proportions, color swatches, blendshape lists
    mira/                   # Dr. Mira Nair (ARIA's creator)
    mateo/                  # Specialist Mateo Cruz
    amara/                  # Engineer Amara Chen
    kenji/                  # Lead Cyberneticist Kenji Sato
    eidolon/                # Rogue AI Antagonist

  environments/             # Story chapters & exploration locations
    orpheus/                # Chapter 1: The Silent Vessel
      source/               # Source environment .blend
      textures/             # Skyboxes, modular sci-fi trim sheets
      exports/              # Web-optimized GLBs
      previews/             # Environment beauty renders
    research_archive/       # Chapter 2: Forgotten Knowledge
    restoration_facilities/ # Chapter 3: Cybernetic Rebirth
    silent_city/            # Chapter 4: Monolithic Grid
    atlas_core/             # Chapter 5: Mainframe Apex

  props/                    # Interactive story items and machinery
    reactor/                # Reactor core, conduits, coolant chambers
    consoles/               # Tactical, diagnostic, and terminal consoles
    holograms/              # Floating HUD elements, code holographic displays
    machinery/              # Heavy blast doors, automated server racks

  animations/               # Master animation library
    aria/                   # Idle, Talking, Listening, Thinking, Success
    environment/            # Reactor pulsation, flickering emergency lights
    cinematic/              # Opening sequence camera tracks & choreography

  materials/                # Shared Blender node groups & PBR shaders
  textures/                 # Common trim sheets, roughness maps, emission decals
  audio/                    # Story voice lines, ambient drones, UI sound effects
    dialogue/
    music/
    sound_effects/

  exports/                  # Global optimized deliverables
    glb/                    # Production browser-ready glTF 2.0 Binary files
    previews/               # Rendered reference frames, turnaround sheets

  blender_projects/         # Unified production .blend files
```

---

## Naming Conventions

- **Objects**: `CQ_[Type]_[Name]` (e.g., `CQ_Char_ARIA`, `CQ_Prop_ReactorCore`, `CQ_Env_ObservationWindow`)
- **Materials**: `M_CQ_[Style]_[Name]` (e.g., `M_CQ_Holo_Cyan`, `M_CQ_Metal_BrushedNavy`)
- **Textures**: `T_CQ_[Name]_[Channel]` (e.g., `T_CQ_ARIA_Suit_BaseColor.png`, `T_CQ_Orpheus_Roughness.png`)
- **Armatures / Bones**: Standard naming with `.L` and `.R` suffixes (e.g., `Arm_Upper.L`, `Eye.R`)
- **Animation Actions**: `[Character/Target]_[ActionName]` (e.g., `ARIA_Idle`, `ARIA_Talking`, `Reactor_Pulse`)
- **GLB Exports**: Lowercase snake_case (e.g., `aria.glb`, `orpheus_bridge.glb`, `reactor_core.glb`)
