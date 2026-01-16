# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Black Hole Keyboard (bhk) - An Ergogen v4 keyboard design for a split ergonomic keyboard with 7-column matrix, 3-key thumbfan, and wireless MCU support (nice!nano/supermini with nice!view display).

## Build Commands

**IMPORTANT:** When using custom footprints (from `footprints/` directory), you MUST pass the directory path instead of the config file directly. Passing `config.yaml` will skip loading custom footprints and cause errors.

```bash
# Generate outputs (KiCad PCB, DXF outlines, points)
# Use '.' for current directory to load custom footprints
npx ergogen .

# Generate to specific output directory
npx ergogen . -o output/

# Preview only (faster, no PCB generation)
npx ergogen . --debug

# Clean output before building
npx ergogen . --clean
```

**Why directory input?** Ergogen only loads external footprints from the `footprints/` directory when analyzing a directory or ZIP bundle. File input (e.g., `npx ergogen config.yaml`) skips footprint injection entirely.

Output files are generated in `output/` directory:
- `outlines/*.dxf` - DXF files for each outline
- `pcbs/*.kicad_pcb` - KiCad 8 PCB files
- `points/points.yaml` - Calculated point positions

## Architecture

The entire keyboard is defined in `config.yaml` using Ergogen v4 declarative syntax:

### Key Sections

| Section | Purpose |
|---------|---------|
| `presets` | Switch type configurations (choc_v1, choc_v2, mx) with spacing/sizing |
| `units` | Extends a preset and defines MCU/display dimensions, physical measures |
| `points.zones` | Defines key positions: `matrix` (7 cols), `thumbfan` (3 cols), `mcu`, `display`, screw holes |
| `outlines` | 2D shapes for PCB edge cuts and case design |
| `pcbs` | KiCad output with footprint placement |

### Outline Composition Pattern

Outlines prefixed with `_` are hidden (no DXF export) and used as building blocks:

```yaml
_matrix:      # Matrix keys only
_thumbfan:    # Thumb cluster only
_mcu_area:    # MCU + display + bridge

bhk:          # Composed from above using 'stack' operation
```

### Ergogen Filter Logic (Critical)

When filtering points by multiple criteria, array nesting determines AND vs OR:

```yaml
# OR logic (matches matrix OR key tag)
where: [/matrix/, key]

# AND logic (matches matrix AND key tag)
where: [[/matrix/, key]]
```

Rule: Odd nesting = OR, even nesting = AND.

### Key Size Tags

Points use tags to indicate key dimensions for outline generation:
- `key` - Standard 1u keys (uses `kx` x `ky`)
- `key_1_25u` - 1.25u keys (uses `kx * 1.25` x `ky`)
- `key_1_5u` - 1.5u keys (uses `kx * 1.5` x `ky`)

### Unit Variables

- `kx`, `ky` - Key spacing (depends on switch preset, e.g., 19mm for MX)
- `kcow`, `kcoh` - Key cutout dimensions
- `keycw`, `keych` - Keycap preview dimensions
- `mcu_x`, `mcu_y` - MCU footprint size
- `display_x`, `display_y` - Display footprint size

### PCB Footprints

Uses ceoloide's ergogen footprint library. Key footprints:
- `ceoloide/switch_choc_v1_v2` - Reversible hotswap switches
- `ceoloide/mcu_supermini_nrf52840` - Wireless MCU
- `ceoloide/display_nice_view` - E-ink display
- `ceoloide/diode_tht_sod123` - SMD/THT diodes

## Debugging

- Check `output/points/points.yaml` to verify point calculations
- Individual outline DXFs in `output/outlines/` help isolate filtering issues
- Error messages reference the YAML path (e.g., `outlines._thumbfan.0.where`)
