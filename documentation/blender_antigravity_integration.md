# CODEQUEST — Blender & Antigravity MCP Integration Guide

This guide establishes the production workflow connecting **Google Antigravity** to **Blender 5.2+** via the Model Context Protocol (MCP) using **BlendRelay MCP**.

---

## 1. System Specifications & Status

| Component | Target / Installed Version | Status |
| :--- | :--- | :--- |
| **Blender** | Blender 5.2.3 LTS (`C:\Program Files\Blender Foundation\Blender 5.2\blender.exe`) | **Verified** |
| **Embedded Python** | Python 3.13.13 (`C:\Program Files\Blender Foundation\Blender 5.2\5.2\python`) | **Verified** |
| **Host Python** | Python 3.12.7 (`C:\Users\LENOVO\AppData\Local\Programs\Python\Python312`) | **Verified** |
| **BlendRelay MCP** | Version 0.7.7 (`shefq/blendrelay-mcp`) | **Installed & Configured** |
| **Antigravity Protocol** | JSON-RPC Stdio Gateway (`python -m blendrelay_mcp.cli mcp`) | **Verified (24 Tools)** |
| **Blender Addon** | `bl_ext.user_default.blendrelay_mcp` | **Installed & Enabled** |

---

## 2. Architecture & Data Flow

```
[ Google Antigravity Agent ]
            | (MCP JSON-RPC over stdio)
            v
[ blendrelay-mcp CLI Gateway ]
            | (Local WebSocket Bridge)
            v
[ BlendRelay Runtime Daemon ] (localhost / ~/.local/BlendRelayMCP)
            | (bpy.app.timers socket poll)
            v
[ Blender 5.2.3 LTS UI or Headless ]
            | (Python bpy operations)
            v
[ CODEQUEST 3D Scene / GLB Exports / Previews ]
```

---

## 3. Configuration in Antigravity

Registered in `C:\Users\LENOVO\.gemini\config\mcp_config.json`:

```json
{
  "mcpServers": {
    "blendrelay": {
      "command": "python",
      "args": ["-m", "blendrelay_mcp.cli", "mcp"]
    }
  }
}
```

---

## 4. Operational Procedures

### A. Daily Startup
1. **Interactive Workflow (GUI)**:
   - Launch Blender 5.2.
   - BlendRelay is automatically enabled via extensions.
   - Click **Connect** in the 3D Viewport sidebar (`N` panel -> `BlendRelay`), or run:
     ```python
     bpy.ops.blendrelay.refresh()
     ```
   - Antigravity can now inspect viewports, edit meshes, manage materials, and trigger renders in real time.

2. **Automated / Headless Workflow**:
   - Run Blender scripts directly via command line:
     ```powershell
     & "C:\Program Files\Blender Foundation\Blender 5.2\blender.exe" -b path/to/project.blend --python script.py
     ```

### B. Daily Shutdown
- Close Blender normally.
- The daemon automatically handles disconnects. To force-terminate stale background daemons:
  ```powershell
  python -m blendrelay_mcp.cli status
  ```

### C. Troubleshooting & Recovery
If connection drops or a job stalls:
1. Run diagnostic self-test:
   ```powershell
   python -m blendrelay_mcp.cli doctor
   ```
2. Reset runtime connection state:
   - Clear stale connection files at `C:\Users\LENOVO\AppData\Local\BlendRelayMCP\connection.json`.
   - Restart the daemon:
     ```powershell
     python -c "import blendrelay_mcp.server as s; s.ensure_runtime()"
     ```
3. In Blender Python Console:
   ```python
   bpy.ops.blendrelay.refresh()
   ```

---

## 5. Phase 1 Verification Results

- **Harmless Test Operation**: Created beveled cube with custom `#6366F1` Cyber-Indigo emission material and 3-point lighting.
- **Render Output**: Verified render saved to `assets/exports/previews/phase1_cube_preview.png`.
- **Scene Modification**: Adjusted camera framing to `(6.0, -6.5, 4.2)`, added a glowing neon cyan energy ring (`CQ_Energy_Ring`), and re-rendered to `assets/exports/previews/phase1_cube_modified_preview.png`.
- **Project File**: Saved clean base project at `assets/blender_projects/test_connection.blend`.
- **Result**: **Phase 1 complete and passed.**
