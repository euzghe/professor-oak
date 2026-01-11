# User Guide

Welcome, Trainer! This guide will teach you how to use Professor Oak to gamify your learning journey.

## Getting Started

### Your First Learning Session

```
You: /learn docker

Professor Oak: "Ah, a new region to explore! Welcome to the world of Docker,
trainer! Every great journey begins with a single step.

What's your current experience level?

- Starter: Complete beginner, no prior knowledge
- Beginner: Know the basics, want to build skills
- Advanced: Solid foundation, ready for complex patterns
- Expert: Deep experience, looking for mastery"

You: Starter

Professor Oak: "Excellent choice! I've mapped out your journey through Docker.
Here's your roadmap:

1. What is Docker? (Course)
2. Installing Docker (Course + Exercise)
3. Your First Container (Course + Exercises)

Let's begin with the fundamentals!"
```

## Commands Reference

### Learning Commands

#### `/learn [topic]`

Start or continue learning a topic.

**Examples:**
```
/learn docker           # Start learning Docker
/learn aws              # Start learning AWS
/learn python-async     # Start learning async Python
```

**What happens:**
1. If topic is new: Creates topic structure, asks for level
2. If topic exists: Shows next action, continues where you left off

#### `/progress [topic]`

Check your learning progress with Nurse Joy.

**Examples:**
```
/progress               # Overall progress across all topics
/progress docker        # Detailed Docker progress
```

**Sample output:**
```
Nurse Joy: "Let me check your progress, trainer!"

Overall Stats:
Trainer: Tom | Rank: Pokemon Trainer | Points: 1,250

Topics:
Docker      ████████░░ 80%  [Beginner]  2 badges
AWS         ██░░░░░░░░ 20%  [Starter]   1 badge
Python      ██████░░░░ 60%  [Advanced]  3 badges

Pokemon Caught: 42 | Badges: 6
```

#### `/quiz [topic] [course]`

Take a quiz to prove your knowledge and catch Pokemon.

**Examples:**
```
/quiz                   # Quiz on last learned course
/quiz docker            # Random quiz from current Docker level
/quiz docker 01-basics  # Quiz on specific course
```

**Quiz experience:**
```
Gym Leader Brock: "I am Brock! A wild CHARMANDER appeared!
Difficulty: ★★☆☆☆

Let's test your Docker knowledge, trainer!"

Q1/4: What command runs a Docker container?

A) docker run
B) docker start
C) docker execute
D) docker begin

You: A

Brock: "Solid answer! The foundation is strong."

... [more questions] ...

RESULT: 3/4 correct (75%)

"Gotcha! CHARMANDER was caught!"
+72 points earned!
```

### Collection Commands

#### `/pokedex [topic]`

View your caught Pokemon (knowledge collection).

**Examples:**
```
/pokedex                # Full Pokedex
/pokedex docker         # Docker Pokemon only
```

**Sample output:**
```
POKEDEX - Tom's Collection

Caught: 42 | Undiscovered: ???

DOCKER (12 Pokemon)
  #004 Charmander  - dockerfile-basics
  #005 Charmeleon  - multi-stage-builds     [EVOLVED]
  #006 Charizard   - orchestration          [EVOLVED]

AWS/EC2 (5 Pokemon)
  #025 Pikachu     - ec2-instances
  #026 Raichu      - auto-scaling           [EVOLVED]

PYTHON (8 Pokemon)
  #001 Bulbasaur   - list-comprehensions
  ...
```

#### `/wild` (Coming Soon)

Trigger a random knowledge encounter for bonus rewards.

```
/wild

*rustling in the tall grass*

A wild PIKACHU appeared!
Difficulty: ★★☆☆☆
Topic: Docker

Quick! Answer correctly to catch it!

Q1/3: What is the purpose of a Dockerfile?
...

PASS: +82 points (wild bonus: x1.5!)
"Gotcha! PIKACHU was caught!"

FAIL: +12 points
"Oh no! PIKACHU fled..."
```

**Note:** Wild encounters have higher rewards but also higher risk!

### Extra Learning Commands (Coming Soon)

> **Note**: The following commands are planned features and not yet implemented.

#### `/save [topic]` (Coming Soon)

Save ad-hoc learning from your conversation.

**Example flow:**
```
You: What is GraphRAG?

Claude: [explains GraphRAG in detail]

You: /save

Professor Oak: "Ah, excellent learning moment!
Where shall we file this knowledge?"

- langchain (exists)
- neo4j (exists)
- Create new topic...

You: graph-rag

Professor Oak: "Knowledge saved!

Topic: graph-rag (new!)
Entry: What is GraphRAG
Tags: #rag #knowledge-graph #llm

+15 points

Want a quick quiz to catch a Pokemon?
[Yes] [No, maybe later]"
```

#### `/extras [topic]` (Coming Soon)

Browse your saved extra learnings.

```
/extras

Extra Learnings:

neo4j (2 entries)
  2026-01-11 - LangChain Extension  #integration
  2026-01-10 - Cypher Basics        #query

graph-rag (1 entry)
  2026-01-11 - What is GraphRAG     #rag #llm

docker (3 entries)
  2026-01-09 - Alpine vs Debian     #images
  2026-01-08 - Multi-arch builds    #advanced
  2026-01-05 - Docker secrets       #security

Total: 6 extras | 45 points earned
```

### Management Commands (Coming Soon)

> **Note**: The following commands are planned features and not yet implemented.

#### `/reset [scope]` (Coming Soon)

Reset progress at various levels.

**Scopes:**
| Scope | Command | What it resets |
|-------|---------|----------------|
| Course | `/reset docker/starter/01-basics` | Single course |
| Level | `/reset docker/starter` | Entire level |
| Topic | `/reset docker` | All topic progress |
| Global | `/reset all` | Everything |

**Example:**
```
/reset docker/beginner

Professor Oak: "Hmm, you want to reset your Beginner progress in Docker?

Reset Preview:
  3 courses
  5 exercises
  -175 points
  Cascade Badge removed

Pokemon will be kept (knowledge preserved).

Are you sure? [Yes, reset] [No, cancel]"
```

## Understanding the Game Mechanics

### Levels

| Level | Description | Gym Leader | Badge |
|-------|-------------|------------|-------|
| Starter | Absolute fundamentals | Brock | Boulder Badge |
| Beginner | Building basic skills | Misty | Cascade Badge |
| Advanced | Complex patterns | Lt. Surge | Thunder Badge |
| Expert | Deep mastery | Sabrina | Marsh Badge |

### Earning Points

| Action | Points |
|--------|--------|
| Complete a course | +25 |
| Complete mandatory exercise | +30 |
| Complete optional exercise | +15 |
| Save extra learning | +15 |
| Extra learning with quiz | +45 |
| Pass quiz (varies) | +50 to +380 |
| Earn a badge | +500 |
| Evolve a Pokemon | +100 |
| First legendary catch | +500 (one-time) |

### Quiz Tiers

| Tier | Questions | Pass Rate | Typical Level |
|------|-----------|-----------|---------------|
| 1 Easy | 3 | 66% (2/3) | Starter |
| 2 Medium | 4 | 75% (3/4) | Starter-Beginner |
| 3 Hard | 5 | 80% (4/5) | Beginner-Advanced |
| 4 Expert | 6 | 83% (5/6) | Advanced-Expert |
| 5 Legendary | 8 | 87% (7/8) | Expert |

### Trainer Ranks

| Points | Rank |
|--------|------|
| 0+ | Rookie Trainer |
| 500+ | Pokemon Trainer |
| 2,000+ | Great Trainer |
| 5,000+ | Expert Trainer |
| 10,000+ | Pokemon Master |

### Pokemon Evolution

Your caught Pokemon can evolve when you deepen your knowledge:

```
Evolution triggers:
- Review quiz: Re-quiz a topic to evolve related Pokemon
- Deep dive: Complete advanced course on same topic
- Perfect score: Get 100% on a quiz

Example:
  Charmander (caught with dockerfile-basics)
      ↓ Review quiz
  Charmeleon (knows multi-stage-builds)
      ↓ Expert course
  Charizard (masters orchestration)
```

### Earning Badges

To earn a badge, complete all requirements for a level:

1. **Complete all courses** in the level
2. **Complete mandatory exercises** (marked in roadmap)
3. **Pass the level quiz**

```
Badge Ceremony:

Gym Leader Brock: "You've proven your Docker knowledge is rock-solid!"

*Brock presents the Boulder Badge*

You earned the BOULDER BADGE!
Level: Starter
Topic: Docker

+500 points
Beginner level unlocked!
```

## Personas

You'll interact with different characters during your journey:

### Professor Oak

**Appears during:** `/learn`, `/save`, topic creation

**Style:** Warm, wise, encouraging

```
"Ah, what a fascinating discovery! Let me add this to our records."

"Every trainer starts somewhere. Your journey through Docker begins now!"

"Your Pokedex grows stronger with each piece of knowledge you catch!"
```

### Nurse Joy

**Appears during:** `/progress`, after quiz failures

**Style:** Caring, supportive, constructive

```
"Let me check your progress, trainer!"

"Don't worry about that missed quiz. Let's review what you need to study."

"You've made excellent progress! Just a few more courses to go."
```

### Gym Leaders

**Appear during:** `/quiz`, badge ceremonies

**Brock (Starter):** Firm but fair, focuses on fundamentals
```
"I am Brock! I believe in rock-solid defense!"
"Your knowledge is impressive, trainer!"
```

**Misty (Beginner):** More challenging, tests understanding
```
"I'm Misty! Think you can keep up with my questions?"
"Your knowledge flows like water!"
```

**Lt. Surge (Advanced):** Intense, expects quick answers
```
"I'm Lt. Surge! Show me that lightning-fast knowledge!"
"Outstanding, soldier!"
```

**Sabrina (Expert):** Mysterious, tests deep mastery
```
"I am Sabrina. I foresaw your arrival."
"Your mastery transcends the ordinary."
```

### Wild Encounter Narrator

**Appears during:** `/wild`

**Style:** Dramatic, exciting

```
*rustling in the tall grass*

A wild BULBASAUR appeared!
Quick! Answer correctly to catch it!
```

## Tips for Success

### 1. Start with Starter Level

Even if you know a topic, starting at Starter helps:
- Build a solid foundation
- Earn easy Pokemon
- Get familiar with the system

### 2. Complete Courses Before Quizzes

Read through courses before taking quizzes. This ensures:
- Better quiz performance
- Higher catch rates
- More points per quiz

### 3. Do the Exercises

Exercises give bonus points and reinforce learning:
- Mandatory exercises: +30 points each
- Optional exercises: +15 points each
- Practice makes permanent!

### 4. Use Wild Encounters Wisely

Wild encounters are high risk/high reward:
- Pass: Points x1.5
- Fail: Points x0.3

Save them for topics you're confident in.

### 5. Save Extra Learnings

When you learn something interesting in conversation:
1. Use `/save` to capture it
2. Take the optional quiz
3. Catch a bonus Pokemon!

### 6. Review for Evolution

Don't forget about evolution:
- Review past topics
- Take review quizzes
- Watch your Pokemon evolve!

## Example Learning Path

Here's a typical learning journey:

```
Day 1:
  /learn docker (Starter)
  Complete: What is Docker
  +25 points

Day 2:
  Continue learning
  Complete: Installation + exercises
  Take quiz → Catch Pidgey!
  +25 + 30 + 72 = +127 points

Day 3:
  Complete: First Container
  Take level quiz → Catch Charmander!
  Earn Boulder Badge!
  +25 + 500 = +525 points

Week 2:
  /learn docker (Beginner)
  More courses, harder quizzes
  Charmander evolves to Charmeleon!
  Earn Cascade Badge!

Month 2:
  Docker mastery achieved!
  Start /learn kubernetes...
```

## Frequently Asked Questions

**Q: Can I learn multiple topics at once?**

A: Yes! You can switch between topics anytime. Your progress is saved for each.

**Q: What happens if I fail a quiz?**

A: The Pokemon flees, but you still earn partial points. Nurse Joy will suggest what to review.

**Q: Can I redo a quiz?**

A: Yes! But you'll encounter a different Pokemon. Each quiz is a new opportunity.

**Q: How do Pokemon relate to knowledge?**

A: Each Pokemon represents a piece of knowledge. Harder concepts = rarer Pokemon.

**Q: What if I already know a topic well?**

A: Start at a higher level (Beginner or Advanced). You can also use `/quiz` directly to test yourself.

## Next Steps

Ready to begin?

1. Run `/learn [topic]` to start your first topic
2. Follow the roadmap Professor Oak creates
3. Take quizzes to catch Pokemon
4. Earn badges and become a Pokemon Master!

Good luck, Trainer! Your journey awaits!

---

*"The world of knowledge is vast and full of wonders. Go forth and catch 'em all!"* - Professor Oak
