---
description: Activity taxonomy design summary for Activity Architect app
---

# Activity Architect - Design Summary

## Core Concept
A multi-dimensional taxonomy system for categorizing activities (games, hobbies, tasks) using decimal values (0-10) instead of binary labels. This allows precise matching based on user needs.

## Key Principles
1. **Multi-category classification**: Activities belong to multiple categories simultaneously (unlike physical boxes)
2. **Decimal values**: Use 0-10 scale for nuanced classification vs. binary high/low
3. **User-need matching**: Categories represent what problems/needs an activity solves

## The 14 Dimensions

| Key | Label | Description |
|-----|-------|-------------|
| `physiological` | Physiological Need | Supply of bodily/physical needs |
| `actualization` | Self-Actualization | Growth, meaning, transcendence |
| `chakra` | Chakra Balance | Internal emotional alignment |
| `objective` | Objective Clarity | How well-defined goals are |
| `interactivity` | Interactivity | Impact of user acts on next steps |
| `speed` | Time Quantum | Length of steps relative to time |
| `spatial` | Spatial Needs | Physical/simulated space required |
| `discovery` | Discovery Amount | Potential to find new aspects |
| `response` | Response Intensity | Force of activity's feedback |
| `challenge` | Challenge Alignment | Abilities vs requirements match |
| `personalization` | Personalization Depth | Ability to express core self |
| `avatar` | Avatar Agency | Control over self-representation |
| `curve` | Learning Curve | Steepness of skill progression |
| `random` | Randomicity | Prevalence of unpredictable elements |

## Philosophy
- Don't lazily compare new activities to known ones
- See each activity for its unique utility in solving specific problems
- Users can create their own "game within a game" - find fun anywhere
- The "Innovation Zone" appears when no existing activity matches precise requirements

## Technical Implementation
- React app with slider-based filters for each dimension
- Tolerance threshold for matching flexibility
- Visual cards showing matched activities with key dimension bars
- When no match found, prompt user to "Draft a New Activity"
