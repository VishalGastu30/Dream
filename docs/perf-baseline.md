# 3D Performance Baseline

> **Roadmap ref:** `docs/PORTFOLIO_MASTER_PLAN.md §14 — Phase 2`

This document records the frames per second (FPS) of the heaviest 3D features (tested in `apps/sandbox-3d`) to ensure we meet the performance budget.

## Test Environment
- **Device:** [Pending user test - e.g. iPhone 13]
- **Browser:** [Pending user test - e.g. Safari]
- **Date:** 2026-10-04

## Risk Prototypes (P2-05)

| Prototype | Description | Target FPS | Actual FPS | Status |
| :--- | :--- | :--- | :--- | :--- |
| **Test A** | Spline + Bloom (Post-processing) | ≥ 45 | *Pending* | 🟡 Needs Testing |
| **Test B** | Instanced Mesh (50k stars) | 60 | *Pending* | 🟡 Needs Testing |
| **Test C** | Unified Ghost Light Material | ≥ 55 | *Pending* | 🟡 Needs Testing |

*Note: Automated headless testing via Puppeteer failed due to lack of a physical GPU (WebGL context error). These numbers must be filled manually by running `pnpm --filter sandbox-3d dev` and loading the local network URL on a mobile device.*
