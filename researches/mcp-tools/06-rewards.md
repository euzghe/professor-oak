# MCP Tools: Rewards

## Overview

| Tool | Purpose |
|------|---------|
| `awardBadge` | Award a badge for level completion |
| `getBadges` | Get all earned badges |
| `getBadge` | Get details of a specific badge |
| `checkBadgeEligibility` | Check if badge can be earned |
| `generateBadgeAsset` | Create badge SVG/PNG asset |
| `getRewards` | Get all rewards for a topic |

---

## `awardBadge`

**Purpose**: Award a badge when level is completed

**Input**:
```typescript
{
  topic: string,
  level: string
}
```

**Validation** (via `checkLevelComplete`):
- All courses completed
- All mandatory exercises done
- Level quiz passed

**Side Effects**:
1. Create badge entry in topic's `rewards.yaml`
2. Generate badge asset (SVG) in `rewards/` folder
3. Award badge points (+500) via `addPoints`
4. Unlock next level via `unlockNextLevel`
5. Trigger Gym Leader ceremony

**Returns**:
```typescript
{
  success: true,

  badge: {
    id: "boulder-badge-docker",
    name: "Boulder Badge",
    topic: "docker",
    topicDisplay: "Docker",
    level: "starter",
    gymLeader: "Brock",
    earnedAt: "2026-01-11",
    asset: "src/docker/rewards/boulder-badge.svg"
  },

  points: {
    awarded: 500,
    newTotal: 1750
  },

  ceremony: {
    gymLeader: "Brock",
    message: "You've proven your Docker knowledge is rock-solid!",
    announcement: `
🏆 Gym Leader Brock:
"Incredible! Your fundamentals are unshakeable!"

🏅 You earned the BOULDER BADGE!
   Level: Starter
   Topic: Docker

⭐ +500 points
📊 Progress: Starter 100% → Beginner unlocked!
`
  },

  nextLevel: {
    unlocked: "beginner",
    gymLeader: "Misty",
    badge: "Cascade Badge"
  }
}
```

---

## `getBadges`

**Purpose**: Get all earned badges across topics

**Input**:
```typescript
{
  topic?: string,           // Filter by topic
  includeAssets?: boolean   // Include asset paths/data
}
```

**Returns**:
```typescript
{
  trainer: "Tom",

  badges: [
    {
      id: "boulder-badge-docker",
      name: "Boulder Badge",
      topic: "docker",
      topicDisplay: "Docker",
      level: "starter",
      gymLeader: "Brock",
      earnedAt: "2026-01-11",
      asset: "src/docker/rewards/boulder-badge.svg"
    },
    {
      id: "cascade-badge-docker",
      name: "Cascade Badge",
      topic: "docker",
      topicDisplay: "Docker",
      level: "beginner",
      gymLeader: "Misty",
      earnedAt: "2026-01-15",
      asset: "src/docker/rewards/cascade-badge.svg"
    },
    {
      id: "boulder-badge-aws",
      name: "Boulder Badge",
      topic: "aws",
      topicDisplay: "AWS",
      level: "starter",
      gymLeader: "Brock",
      earnedAt: "2026-01-12",
      asset: "src/aws/rewards/boulder-badge.svg"
    }
  ],

  summary: {
    total: 3,
    byTopic: {
      docker: 2,
      aws: 1
    },
    byLevel: {
      starter: 2,
      beginner: 1,
      advanced: 0,
      expert: 0
    }
  },

  nextBadges: [
    {
      name: "Thunder Badge",
      topic: "docker",
      level: "advanced",
      gymLeader: "Lt. Surge",
      requirements: { courses: 2, exercises: 1, quiz: true }
    }
  ]
}
```

---

## `getBadge`

**Purpose**: Get details of a specific badge

**Input**:
```typescript
{
  badgeId: string           // "boulder-badge-docker"
}
```

**Returns**:
```typescript
{
  badge: {
    id: "boulder-badge-docker",
    name: "Boulder Badge",
    topic: "docker",
    topicDisplay: "Docker",
    level: "starter",
    levelDisplay: "Starter",

    gymLeader: {
      name: "Brock",
      title: "The Rock-Solid Pokemon Trainer",
      quote: "I believe in rock-solid defense!"
    },

    earnedAt: "2026-01-11",
    pointsAwarded: 500,

    asset: {
      path: "src/docker/rewards/boulder-badge.svg",
      url: null    // Could be CDN URL if hosted
    },

    requirements: {
      courses: ["01-what-is-docker", "02-installation"],
      mandatoryExercises: 2,
      quizPassed: true
    },

    stats: {
      coursesCompleted: 2,
      exercisesDone: 4,
      quizScore: "3/4",
      timeToEarn: "2 days"
    }
  }
}
```

---

## `checkBadgeEligibility`

**Purpose**: Check if a badge can be earned (before awarding)

**Input**:
```typescript
{
  topic: string,
  level: string
}
```

**Returns**:
```typescript
// If eligible:
{
  eligible: true,
  badge: {
    name: "Boulder Badge",
    gymLeader: "Brock"
  },
  message: "All requirements met! Ready for the Gym battle!"
}

// If not eligible:
{
  eligible: false,
  badge: {
    name: "Cascade Badge",
    gymLeader: "Misty"
  },

  requirements: {
    courses: { required: 3, completed: 2, met: false },
    mandatoryExercises: { required: 2, completed: 2, met: true },
    quiz: { required: true, passed: false, met: false }
  },

  missing: [
    { type: "course", id: "03-volumes", name: "Volumes" },
    { type: "quiz", level: "beginner" }
  ],

  message: "Complete 1 more course and pass the level quiz to challenge Misty!"
}
```

---

## `generateBadgeAsset`

**Purpose**: Generate SVG badge asset

**Input**:
```typescript
{
  topic: string,
  level: string,
  format?: "svg" | "png"    // Default: svg
}
```

**Logic**:
- Use predefined badge templates per level
- Customize with topic name/colors
- Save to `src/[topic]/rewards/[badge-name].svg`

**Badge Templates**:
```typescript
const badgeTemplates = {
  starter: {
    name: "Boulder Badge",
    shape: "octagon",
    colors: { primary: "#8B4513", secondary: "#D2691E" },
    icon: "rock"
  },
  beginner: {
    name: "Cascade Badge",
    shape: "teardrop",
    colors: { primary: "#1E90FF", secondary: "#87CEEB" },
    icon: "water"
  },
  advanced: {
    name: "Thunder Badge",
    shape: "lightning",
    colors: { primary: "#FFD700", secondary: "#FFA500" },
    icon: "bolt"
  },
  expert: {
    name: "Marsh Badge",
    shape: "circle",
    colors: { primary: "#9932CC", secondary: "#DDA0DD" },
    icon: "psychic"
  }
};
```

**Returns**:
```typescript
{
  success: true,
  asset: {
    path: "src/docker/rewards/boulder-badge.svg",
    format: "svg",
    size: { width: 200, height: 200 }
  },
  message: "Badge asset generated!"
}
```

---

## `getRewards`

**Purpose**: Get all rewards for a topic (badges + extras)

**Input**:
```typescript
{
  topic: string
}
```

**Returns**:
```typescript
{
  topic: "docker",
  topicDisplay: "Docker",

  badges: [
    {
      id: "boulder-badge-docker",
      name: "Boulder Badge",
      level: "starter",
      earned: true,
      earnedAt: "2026-01-11"
    },
    {
      id: "cascade-badge-docker",
      name: "Cascade Badge",
      level: "beginner",
      earned: true,
      earnedAt: "2026-01-15"
    },
    {
      id: "thunder-badge-docker",
      name: "Thunder Badge",
      level: "advanced",
      earned: false,
      progress: 45
    },
    {
      id: "marsh-badge-docker",
      name: "Marsh Badge",
      level: "expert",
      earned: false,
      locked: true
    }
  ],

  milestones: [
    {
      name: "First Docker Pokemon",
      achieved: true,
      date: "2026-01-11"
    },
    {
      name: "Docker Collection: 10",
      achieved: true,
      date: "2026-01-14"
    },
    {
      name: "Docker Mastery",
      achieved: false,
      requirement: "Earn all 4 badges"
    }
  ],

  stats: {
    totalPoints: 1250,
    badgesEarned: 2,
    pokemonCaught: 12,
    coursesCompleted: 8
  }
}
```

---

## Storage: rewards.yaml

```yaml
# src/docker/rewards.yaml
topic: docker
created_at: 2026-01-11

badges:
  - id: boulder-badge-docker
    name: "Boulder Badge"
    level: starter
    gym_leader: Brock
    earned_at: 2026-01-11
    asset: rewards/boulder-badge.svg
    points_awarded: 500

  - id: cascade-badge-docker
    name: "Cascade Badge"
    level: beginner
    gym_leader: Misty
    earned_at: 2026-01-15
    asset: rewards/cascade-badge.svg
    points_awarded: 500

milestones:
  - id: first-pokemon
    name: "First Docker Pokemon"
    achieved_at: 2026-01-11
    pokemon: Charmander

  - id: collection-10
    name: "Docker Collection: 10"
    achieved_at: 2026-01-14

  - id: mastery
    name: "Docker Mastery"
    achieved_at: null           # Not yet achieved
    requirement: "Earn all 4 badges"
```

---

## Badge Asset Generation

Example SVG template for Boulder Badge:

```svg
<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
  <!-- Badge background -->
  <polygon points="100,10 180,50 180,150 100,190 20,150 20,50"
           fill="#8B4513" stroke="#5D3A1A" stroke-width="4"/>

  <!-- Inner design -->
  <polygon points="100,30 160,60 160,140 100,170 40,140 40,60"
           fill="#D2691E"/>

  <!-- Topic name -->
  <text x="100" y="90" text-anchor="middle"
        font-family="Arial" font-size="16" font-weight="bold" fill="#FFF">
    DOCKER
  </text>

  <!-- Badge name -->
  <text x="100" y="115" text-anchor="middle"
        font-family="Arial" font-size="12" fill="#FFF">
    Boulder Badge
  </text>

  <!-- Level indicator -->
  <text x="100" y="145" text-anchor="middle"
        font-family="Arial" font-size="10" fill="#FFD700">
    ★ STARTER ★
  </text>
</svg>
```
