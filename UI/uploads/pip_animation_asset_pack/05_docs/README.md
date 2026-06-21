# Pip Animation Asset Pack

This ZIP contains a tracked draft asset pack for implementing Pip, the tax advisory app mascot, inside a Lovable-built UI.

## Character

**Pip** is the app's visual tax companion: a friendly paper/document character with a mint folded corner, navy limbs, a navy satchel, expressive eyes, and a mint checkmark smile.

Brand personality:

- Trustworthy
- Calm
- Smart
- Human
- Playful but not childish
- Premium enough for tax/finance

## Folder structure

- `00_original/` — the original full asset sheet and preview.
- `01_raw_pose_cells/` — crops of each original pose cell with the label included.
- `02_transparent_pose_sprites/` — cropped PNG sprites for UI implementation.
- `03_expression_cells/` — facial expression references.
- `04_mouth_shapes/` — mouth shape references for dialogue animation.
- `05_docs/` — implementation documentation.
- `06_manifest/` — structured JSON manifests for Lovable/dev handoff.
- `07_lovable/` — Lovable-ready implementation prompt and component draft.

## Best first implementation

Use the transparent PNG pose sprites as a simple state-based animation system:

1. Default: `idle`.
2. User focuses the chat input: `listening`.
3. User submits a message: `standingUp`.
4. While response is loading: `thinking`.
5. While response streams: `explaining` / `speaking`.
6. If a document or checklist is referenced: `holdingDocument`.
7. At response completion: `reassuring` → `sittingBackDown` → `idleAlt`.

This is designed as a static sprite-swap system first. Later, the same state logic can be upgraded to Rive, Lottie, Framer Motion, or a rigged character animation.

## Important note

The sprites are cropped from a concept sheet. For production, regenerate each pose as a separate transparent PNG at the same style/proportions or commission a vector/Rive version.
