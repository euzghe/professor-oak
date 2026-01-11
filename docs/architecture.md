# Architecture Guide

This document describes the technical architecture of Professor Oak, including the MCP server design, data flow, and system components.

## System Overview

Professor Oak uses a layered architecture where Claude acts as the orchestrator, communicating with an MCP server that manages all game state and logic.

```
┌─────────────────────────────────────────────────────────────────┐
│                          USER                                    │
│                     (Claude CLI/Desktop)                         │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                         CLAUDE                                   │
│              (AI Orchestrator + Personas)                        │
│                                                                  │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐              │
│  │ Prof. Oak   │  │ Nurse Joy   │  │ Gym Leaders │              │
│  │  Persona    │  │  Persona    │  │  Personas   │              │
│  └─────────────┘  └─────────────┘  └─────────────┘              │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                    PROFESSOR OAK MCP SERVER                      │
│                                                                  │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │                     TOOL CATEGORIES                       │   │
│  ├──────────────────────────────────────────────────────────┤   │
│  │ Topic Management │ Progress │ Trainer │ Pokedex │ Quiz   │   │
│  │     6 tools      │ 5 tools  │ 5 tools │ 5 tools │ 5 tools│   │
│  └──────────────────────────────────────────────────────────┘   │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │ Rewards: 4 tools │ Persona: 1 tool                        │   │
│  └──────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                        DATA LAYER                                │
│                       (YAML Files)                               │
│                                                                  │
│  ┌────────────────┐  ┌────────────────┐  ┌────────────────┐     │
│  │ trainer.yaml   │  │ pokedex.yaml   │  │ quiz-history/  │     │
│  │ (Global Stats) │  │ (Collection)   │  │ (Quiz Records) │     │
│  └────────────────┘  └────────────────┘  └────────────────┘     │
│                                                                  │
│  ┌────────────────────────────────────────────────────────┐     │
│  │                   topics/[topic]/                       │     │
│  │  progress.yaml │ rewards.yaml │ courses/ │ exercices/   │     │
│  └────────────────────────────────────────────────────────┘     │
└─────────────────────────────────────────────────────────────────┘
```

## Core Principles

### 1. MCP as Gatekeeper

The MCP server is the **single source of truth** for all game state. Claude never directly reads or writes protected files.

```
┌─────────────────────────────────────────────────────────────────┐
│                    PROFESSOR OAK MCP                             │
│            (ONLY way to interact with game structure)           │
├─────────────────────────────────────────────────────────────────┤
│  Creates:              │  Manages:           │  Enforces:       │
│  - Folder structure    │  - YAML configs     │  - Naming rules  │
│  - Course placeholders │  - Progress         │  - Auto-numbering│
│  - Exercise folders    │  - Points/ranks     │  - Validations   │
└─────────────────────────────────────────────────────────────────┘
                               │
                               ▼
┌─────────────────────────────────────────────────────────────────┐
│                      CLAUDE (Native Tools)                       │
│                     (Content Generation Only)                    │
├─────────────────────────────────────────────────────────────────┤
│  Writes:                          │  Uses:                      │
│  - Course content (.md)           │  - Read/Write/Edit tools    │
│  - Exercise instructions (.md)    │  - Native file operations   │
│  - Quiz questions                 │                             │
└─────────────────────────────────────────────────────────────────┘
```

### 2. File Protection

Protected files are listed in `.claudeignore` and can only be modified through MCP tools:

| Protected File | MCP Tools to Use |
|----------------|------------------|
| `trainer.yaml` | `getTrainer()`, `addPoints()`, `updateTrainer()` |
| `pokedex.yaml` | `getPokedex()`, `addPokemon()`, `evolvePokemon()` |
| `**/progress.yaml` | `getProgress()`, `completeItem()`, `setRoadmap()` |
| `**/rewards.yaml` | `getRewards()`, `awardBadge()` |

### 3. Persona System

Personas provide consistent character interactions without affecting game logic:

```
┌─────────────────────────────────────────────────────────────────┐
│                     User Command: /quiz docker                   │
└─────────────────────────────────────────────────────────────────┘
                               │
                               ▼
┌─────────────────────────────────────────────────────────────────┐
│                        CLAUDE                                    │
│  1. Calls getProgress("docker") → currentLevel: "starter"       │
│  2. Selects Brock persona (starter level Gym Leader)            │
│  3. Calls startQuiz({ topic: "docker", type: "standard" })      │
└─────────────────────────────────────────────────────────────────┘
                               │
                               ▼
┌─────────────────────────────────────────────────────────────────┐
│                    BROCK PERSONA ACTIVE                          │
│  - Speaks with Brock's personality                              │
│  - Presents quiz questions                                      │
│  - Awards Boulder Badge on level completion                     │
└─────────────────────────────────────────────────────────────────┘
```

**Key principle:** MCP handles DATA, personas handle PERSONALITY.

## MCP Server Tools

The MCP server provides 25+ tools across 7 categories:

### Topic Management (6 tools)

| Tool | Purpose |
|------|---------|
| `createTopic` | Create new learning topic with folder structure |
| `getTopic` | Get topic details and roadmap |
| `listTopics` | List all topics with optional progress |
| `initializeLevel` | Set starting level for a topic |
| `setRoadmap` | Save AI-generated roadmap, create placeholders |
| `unlockNextLevel` | Progress to next level after completion |

### Progress (5 tools)

| Tool | Purpose |
|------|---------|
| `getProgress` | Get progress for topic or overall |
| `getOverallProgress` | Global stats across all topics |
| `completeItem` | Mark course/exercise as done |
| `getNextAction` | Smart suggestion for next step |
| `resetProgress` | Reset completion at various scopes |

### Trainer (5 tools)

| Tool | Purpose |
|------|---------|
| `getTrainer` | Get trainer profile and stats |
| `updateTrainer` | Update trainer settings/name |
| `addPoints` | Add points with history tracking |
| `getRank` | Get current rank and next milestone |
| `getPointHistory` | Get detailed point history |

### Pokedex (5 tools)

| Tool | Purpose |
|------|---------|
| `getPokedex` | Get caught Pokemon collection |
| `getPokemon` | Get specific Pokemon details |
| `addPokemon` | Add newly caught Pokemon |
| `evolvePokemon` | Evolve Pokemon on review/deep learning |
| `getPokedexStats` | Collection statistics |

### Quiz (5 tools)

| Tool | Purpose |
|------|---------|
| `startQuiz` | Initialize quiz session |
| `getQuizParameters` | Get quiz config for tier/level |
| `selectPokemon` | Select appropriate Pokemon for quiz |
| `submitQuizResult` | Record completion, process rewards |
| `getQuizHistory` | Get past quiz attempts |

### Rewards (4 tools)

| Tool | Purpose |
|------|---------|
| `awardBadge` | Award badge for level completion |
| `getBadges` | Get all earned badges |
| `checkBadgeEligibility` | Check if badge can be earned |
| `generateBadgeAsset` | Create badge SVG asset |

### Persona (1 tool)

| Tool | Purpose |
|------|---------|
| `getPersona` | Get persona system prompt and context |

## Data Flow Examples

### Learning Flow: `/learn docker`

```
1. User: /learn docker

2. Claude calls MCP: createTopic("docker")
   MCP creates:
   └── topics/docker/
       ├── progress.yaml    (initialized)
       ├── rewards.yaml     (empty)
       ├── courses/
       │   ├── starter/
       │   ├── beginner/
       │   ├── advanced/
       │   └── expert/
       └── exercices/
           └── [same structure]

3. Claude asks user: "What's your level?"
   User selects: "Starter"

4. Claude calls MCP: initializeLevel("docker", "starter")

5. Claude generates roadmap (AI-powered)

6. Claude calls MCP: setRoadmap("docker", "starter", {...})
   MCP creates:
   └── topics/docker/courses/starter/
       ├── 01-what-is-docker.md   (placeholder)
       ├── 02-installation.md
       └── 03-first-container.md
   MCP updates: progress.yaml with roadmap

7. Claude writes course content using native tools

8. Claude confirms: "Course created!"
```

### Quiz Flow: `/quiz docker`

```
1. User: /quiz docker

2. Claude calls MCP: startQuiz({ topic: "docker", type: "standard" })
   MCP returns: {
     sessionId: "quiz-2026-01-11-001",
     pokemon: { name: "Charmander", tier: 2 },
     parameters: { questions: 4, passCount: 3 },
     gymLeader: { name: "Brock", badge: "Boulder Badge" }
   }

3. Claude adopts Brock persona, generates questions

4. Claude presents quiz interactively

5. User answers questions

6. Claude calls MCP: submitQuizResult("...", { correct: 3, total: 4 })
   MCP:
   - Calculates points: 25 + 35 + (3 × 4) = 72
   - Updates trainer.yaml
   - Adds Pokemon to pokedex.yaml
   - Returns: { passed: true, points: 72, caught: "Charmander" }

7. Claude displays result with Pokemon catch animation
```

## File Structure

### Root Level

```
professor-oak/
├── CLAUDE.md              # Instructions for Claude (root)
├── .claudeignore          # Protected files list
├── docs/                  # Documentation
├── topics/                # Learning content (auto-created)
└── src/
    ├── CLAUDE.md          # Persona system instructions
    ├── .mcp.json          # MCP server configuration
    ├── trainer.yaml       # Global trainer profile (MCP-managed, auto-created)
    ├── pokedex.yaml       # Global Pokemon collection (MCP-managed, auto-created)
    ├── quiz-history/      # Monthly quiz records
    │   └── YYYY-MM.yaml
    └── mcp-server/        # MCP server source
```

### Topic Structure

```
topics/[topic]/
├── progress.yaml          # Topic progress (MCP-managed)
├── rewards.yaml           # Badges and milestones (MCP-managed)
├── rewards/               # Generated badge assets
├── extras/                # Ad-hoc learnings
│   └── YYYY-MM-DD-[name].md
├── courses/
│   ├── starter/           # Level 1 courses
│   │   └── 01-[name].md
│   ├── beginner/          # Level 2 courses
│   ├── advanced/          # Level 3 courses
│   └── expert/            # Level 4 courses
└── exercices/
    ├── starter/
    │   └── 01-[course-name]/
    │       └── exercice-01/
    │           ├── exercice.md    # Instructions
    │           ├── result/        # Expected solution
    │           └── sandbox/       # User work area
    ├── beginner/
    ├── advanced/
    └── expert/
```

### MCP Server Structure

```
src/mcp-server/
├── src/
│   ├── index.ts           # Server entry point
│   ├── tools/
│   │   ├── topic.ts       # Topic management tools
│   │   ├── progress.ts    # Progress tools
│   │   ├── trainer.ts     # Trainer tools
│   │   ├── pokedex.ts     # Pokedex tools
│   │   ├── quiz.ts        # Quiz tools
│   │   ├── rewards.ts     # Rewards tools
│   │   └── persona.ts     # Persona tools
│   ├── services/
│   │   ├── yaml.ts        # YAML read/write
│   │   ├── filesystem.ts  # File operations
│   │   ├── validation.ts  # Input validation
│   │   └── points.ts      # Points calculation
│   ├── types/             # TypeScript interfaces
│   └── config/
│       ├── constants.ts   # Game constants
│       ├── personas.ts    # Persona definitions
│       └── badges.ts      # Badge templates
├── Dockerfile
├── docker-compose.yml
├── package.json
└── tsconfig.json
```

## Game Mechanics

### Quiz Tier System

| Tier | Questions | Pass Rate | Base Points | Level Range |
|------|-----------|-----------|-------------|-------------|
| 1 | 3 | 66% | 15 | Starter |
| 2 | 4 | 75% | 25 | Starter-Beginner |
| 3 | 5 | 80% | 35 | Beginner-Advanced |
| 4 | 6 | 83% | 50 | Advanced-Expert |
| 5 | 8 | 87% | 100 | Expert (Legendary) |

### Pokemon Complexity

Based on base stat total from PokeAPI:

| Tier | Stat Range | Examples |
|------|------------|----------|
| Easy | < 300 | Pidgey, Rattata |
| Medium | 300-400 | Pikachu, Charmander |
| Hard | 400-500 | Charizard, Venusaur |
| Expert | 500-600 | Dragonite, Tyranitar |
| Legendary | 600+ | Mewtwo, Rayquaza |

### Badge Requirements

To earn a badge, you must:
1. Complete all courses in the level
2. Complete all mandatory exercises
3. Pass the level quiz

## Docker Architecture

The MCP server runs in a Docker container with the project directory mounted:

```yaml
# .mcp.json
{
  "mcpServers": {
    "professor-oak": {
      "command": "docker",
      "args": [
        "run", "--rm", "-i",
        "-v", "${workspaceFolder}:/data:rw",
        "professor-oak-mcp:latest"
      ]
    }
  }
}
```

### Multi-Stage Dockerfile

```dockerfile
# Stage 1: Build
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Stage 2: Runtime
FROM node:20-alpine AS runtime
WORKDIR /app
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./
ENV DATA_PATH=/data
CMD ["node", "dist/index.js"]
```

## Security Considerations

1. **File Protection**: `.claudeignore` prevents direct file manipulation
2. **Point Validation**: Points can only be awarded through legitimate actions
3. **Input Validation**: All MCP tool inputs are validated with Zod schemas
4. **Docker Isolation**: MCP server runs in isolated container

## Extensibility

### Adding New Topics

1. User runs `/learn new-topic`
2. MCP creates structure automatically
3. Claude generates roadmap and content

### Adding New Tools

1. Create tool in `src/mcp-server/src/tools/`
2. Register in `index.ts`
3. Update CLAUDE.md with usage instructions

### Adding New Personas

1. Create persona file in `personas/`
2. Update persona selection logic
3. Add trigger conditions in commands

## Related Documentation

- [Setup Guide](setup.md) - Installation instructions
- [User Guide](user-guide.md) - How to use the system
- [Developer Guide](developer-guide.md) - Contributing and extending
