# CODEQUEST Architecture Specification

## 1. System Design Principles
- **Separation of Narrative and Code Evaluation**: The Story Engine governs narrative nodes, dialogue sequences, and camera transitions independently of the language execution pipeline.
- **Strict Sandbox Isolation**: Learner Python scripts execute exclusively in isolated subprocess workers with resource boundaries (CPU timeout 4.0s, memory caps, stdout/stderr truncation) and never inside the core API process.
- **Reactive 3D Environments**: In-game visual states (lighting, animations, shaders) react directly to deterministic code evaluation results.
- **Think Before You Code**: Conceptual comprehension precedes code execution via multiple-choice reasoning checks and 4-tier progressive hints.

## 2. Audio & Voice Architecture
- **Service**: Dedicated Python microservice utilizing Microsoft Edge-TTS (`edge_tts`).
- **Profiles**:
  - `ARIA`: `en-US-AriaNeural`, empathetic companion tone.
  - `KAEL`: `en-US-GuyNeural`, energetic explorer.
  - `ORION`: `en-US-ChristopherNeural`, mentor.
  - `NYX`: `en-GB-SoniaNeural`, mysterious antagonist.
  - `ECHO`: `en-US-EricNeural`, robotic assistant.
- **Caching**: SHA-256 content hashes of `(text, voiceId, rate, pitch, volume)` ensure dialogue is generated once and served instantly from disk cache.
- **Subtitle Tracking**: Sentence and word boundaries are timestamped in milliseconds and synchronized with client audio playback.

## 3. Database & Persistence
- **ORM**: Prisma ORM with PostgreSQL provider (with flexible configuration for local SQLite dev).
- **Core Models**:
  - `User`, `UserPreference` (Theme: Light/Dark/System, audio channel volumes, quality preset)
  - `Story`, `StoryVersion`, `Chapter`, `Scene`, `Choice`
  - `Concept`, `Mission`, `TestCase`, `Submission`
  - `UserStoryProgress`, `UserDecision`, `UserMissionProgress`, `SkillMastery`, `Achievement`, `HintUsage`
