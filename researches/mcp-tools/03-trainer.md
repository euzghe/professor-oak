# MCP Tools: Trainer

## Overview

| Tool | Purpose |
|------|---------|
| `getTrainer` | Get trainer profile and stats |
| `updateTrainer` | Update trainer profile |
| `addPoints` | Add points (with history) |
| `getRank` | Get current rank and next milestone |
| `getPointHistory` | Get point earning history |

---

## `getTrainer`

**Purpose**: Get full trainer profile and statistics

**Input**:
```typescript
{
  // No input required - reads from trainer.yaml
}
```

**Returns**:
```typescript
{
  name: "Tom",
  startedAt: "2026-01-11",

  stats: {
    totalPoints: 1250,
    rank: "Pokemon Trainer",
    nextRank: {
      name: "Great Trainer",
      pointsNeeded: 750,
      progress: 62.5  // percentage to next rank
    }
  },

  achievements: {
    topics: 2,
    badges: 3,
    pokemon: 42,
    legendaries: 1,
    perfectQuizzes: 5,
    completedLevels: 4
  },

  recentActivity: [
    { date: "2026-01-11", action: "quiz_pass", topic: "docker", points: 72 },
    { date: "2026-01-11", action: "badge_earned", topic: "docker", points: 500 },
    { date: "2026-01-10", action: "course_complete", topic: "aws", points: 25 }
  ]
}
```

---

## `updateTrainer`

**Purpose**: Update trainer profile information

**Input**:
```typescript
{
  name?: string,         // Update trainer name
  settings?: {
    wildEncounters?: boolean,   // Enable/disable wild encounters
    notifications?: boolean      // Enable/disable progress notifications
  }
}
```

**Returns**:
```typescript
{
  success: true,
  updated: ["name"],
  trainer: { /* updated trainer object */ }
}
```

---

## `addPoints`

**Purpose**: Add points to trainer with history tracking

**Input**:
```typescript
{
  points: number,
  action: "course_complete" | "exercise_complete" | "quiz_pass" | "quiz_fail"
        | "wild_pass" | "wild_fail" | "badge_earned" | "pokemon_evolved"
        | "extra_saved" | "legendary_bonus" | "perfect_bonus",
  topic: string,
  details?: {
    course?: string,
    exercise?: string,
    pokemon?: string,
    badge?: string,
    level?: string
  }
}
```

**Side Effects**:
1. Updates `trainer.yaml` totalPoints
2. Adds entry to point_history
3. Checks for rank promotion
4. Returns rank change if applicable

**Returns**:
```typescript
{
  success: true,
  pointsAdded: 500,
  newTotal: 1750,

  rankChange?: {
    previous: "Pokemon Trainer",
    new: "Great Trainer",
    message: "Congratulations! You've been promoted to Great Trainer!"
  }
}
```

---

## `getRank`

**Purpose**: Get current rank and progress to next

**Input**:
```typescript
{
  // No input required
}
```

**Returns**:
```typescript
{
  currentRank: {
    name: "Pokemon Trainer",
    minPoints: 500,
    badge: "trainer-badge"
  },

  nextRank: {
    name: "Great Trainer",
    minPoints: 2000,
    pointsNeeded: 750,
    progress: 62.5
  },

  allRanks: [
    { name: "Rookie Trainer", minPoints: 0, achieved: true },
    { name: "Pokemon Trainer", minPoints: 500, achieved: true, current: true },
    { name: "Great Trainer", minPoints: 2000, achieved: false },
    { name: "Expert Trainer", minPoints: 5000, achieved: false },
    { name: "Pokemon Master", minPoints: 10000, achieved: false }
  ]
}
```

---

## `getPointHistory`

**Purpose**: Get detailed point earning history

**Input**:
```typescript
{
  limit?: number,        // Default: 20
  offset?: number,       // For pagination
  topic?: string,        // Filter by topic
  action?: string        // Filter by action type
}
```

**Returns**:
```typescript
{
  entries: [
    {
      date: "2026-01-11",
      action: "badge_earned",
      topic: "docker",
      level: "starter",
      badge: "Boulder Badge",
      points: 500
    },
    {
      date: "2026-01-11",
      action: "quiz_pass",
      topic: "docker",
      course: "01-first-container",
      pokemon: "Charmander",
      points: 72
    }
  ],

  pagination: {
    total: 45,
    limit: 20,
    offset: 0,
    hasMore: true
  },

  summary: {
    totalEarned: 1250,
    byAction: {
      course_complete: 125,
      quiz_pass: 425,
      badge_earned: 500,
      exercise_complete: 200
    }
  }
}
```

---

## Storage: trainer.yaml

```yaml
trainer: Tom
started_at: 2026-01-11
total_points: 1250
rank: Pokemon Trainer

settings:
  wild_encounters: true
  notifications: true

achievements:
  first_pokemon: 2026-01-11
  first_badge: 2026-01-11
  first_legendary: null

point_history:
  - date: 2026-01-11
    action: course_complete
    topic: docker
    points: +25
  - date: 2026-01-11
    action: quiz_pass
    topic: docker
    pokemon: Charmander
    points: +72
  - date: 2026-01-11
    action: badge_earned
    topic: docker
    level: starter
    badge: "Boulder Badge"
    points: +500
```
