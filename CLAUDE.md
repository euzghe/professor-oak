# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Overview

Professor Oak is a gamified learning system that transforms educational journeys into Pokemon adventures. Users "catch" knowledge like Pokemon while progressing through learning levels. The system uses an MCP server for game state management while Claude handles persona-based interactions and content.

## Important Instructions

### Always Delegate to Specialized Subagents

Use the Task tool with specialized agents for complex work:
- **Explore agent** - For codebase exploration and understanding
- **Plan agent** - For designing implementation strategies
- **Code reviewer** - For reviewing PRs before merge

### Git Workflow

**Never develop on main branch.** Always use git worktree for feature work:

```bash
git worktree add ../professor-oak-feature-name feature-name
```

### PR Reviews

**Always use a specialized code reviewer subagent** to review pull requests before merging.

### Research & Documentation

All agents (main and subagents) can and should:
- Refer to Claude knowledge base
- Search Claude documentation
- Use web search for up-to-date information

## Development Workflow

All development happens inside Docker. Never install Node.js locally.

```bash
# From src/mcp-server directory:
npm run build        # Compile TypeScript
npm run dev          # Watch mode for development
npm run test:run     # Run tests once
npm run test         # Run tests in watch mode
npm start            # Run the MCP server
```

Pre-commit hooks automatically run build, type-check, and tests via Docker.

## Architecture

### Two Responsibility Domains

1. **MCP Server** (`src/mcp-server/`) - Manages all game state via tools
   - Protected files (`.claudeignore`): `trainer.yaml`, `pokedex.yaml`, `**/progress.yaml`, `**/rewards.yaml`

2. **Claude (Persona Layer)** - Handles content and user interaction
   - Can directly edit: `courses/**/*.md`, `exercices/**/*.md`, `extras/**/*.md`, `sandbox/*`
   - Must use MCP tools for any game state changes

### MCP Server Structure

```
src/mcp-server/src/
├── index.ts           # Stdio-based MCP server entry
├── tools/             # Tools: topic, progress, trainer, pokedex, quiz, rewards, persona
├── services/          # yaml.ts, filesystem.ts, validation.ts (Zod), points.ts
├── types/             # TypeScript interfaces
└── config/            # constants.ts, personas.ts, badges.ts
```

### Topic Content Structure

```
topics/[topic]/
├── progress.yaml      # MCP-managed
├── rewards.yaml       # MCP-managed
├── courses/
│   ├── starter/       # Level progression: starter → beginner → advanced → expert
│   ├── beginner/
│   ├── advanced/
│   └── expert/
├── exercices/[level]/[course]/exercice-[num]/
└── extras/            # Ad-hoc learnings (YYYY-MM-DD-name.md)
```

## Persona System

See `src/CLAUDE.md` for full persona details and message formatting guidelines.

## Testing

- Framework: Vitest with v8 coverage
- Tests co-located with source as `*.test.ts` or `*.spec.ts`
- Config: `src/mcp-server/vitest.config.ts`

## Docker Setup

- Devcontainer config: `.devcontainer/devcontainer.json`
- Multi-stage Dockerfile: `src/mcp-server/Dockerfile`
- Docker Compose: `src/mcp-server/docker-compose.yml` (dev and mcp services)
