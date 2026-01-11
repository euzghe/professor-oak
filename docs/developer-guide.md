# Developer Guide

This guide covers contributing to Professor Oak, extending the MCP server, and working with the codebase.

## Development Environment

### Prerequisites

- Docker (required - no local Node.js needed)
- Git
- VS Code (recommended, with Dev Containers extension)

### Quick Start

```bash
# Clone the repository
git clone https://github.com/yourusername/professor-oak.git
cd professor-oak

# Open in VS Code with devcontainers
code .
# Then: "Reopen in Container" when prompted
```

### Manual Development (Without VS Code)

```bash
cd mcp/professor-oak-mcp

# Install dependencies
docker run --rm -v $(pwd):/app -w /app node:20-alpine npm ci

# Build TypeScript
docker run --rm -v $(pwd):/app -w /app node:20-alpine npm run build

# Run tests
docker run --rm -v $(pwd):/app -w /app node:20-alpine npm run test:run

# Watch mode for development
docker run --rm -v $(pwd):/app -w /app node:20-alpine npm run dev
```

## Project Structure

```
professor-oak/
├── CLAUDE.md                 # Claude instructions (critical file)
├── .mcp.json                 # MCP configuration
├── .claudeignore             # Protected files
├── mcp/
│   └── professor-oak-mcp/    # MCP server
│       ├── src/
│       │   ├── index.ts      # Entry point
│       │   ├── tools/        # Tool implementations
│       │   ├── services/     # Shared services
│       │   ├── types/        # TypeScript interfaces
│       │   └── config/       # Constants and configs
│       ├── Dockerfile
│       ├── package.json
│       └── tsconfig.json
├── .claude/
│   ├── commands/             # Slash command definitions
│   ├── hooks/                # Pre-commit hooks
│   └── settings.json         # Hook configuration
├── personas/                 # Character persona files
├── topics/                   # Learning content (auto-generated)
└── docs/                     # Documentation
```

## Adding New Topics

Topics are created automatically when users run `/learn`. The MCP server handles the structure:

### Topic Structure Created

```
topics/[topic]/
├── progress.yaml           # Auto-managed by MCP
├── rewards.yaml            # Auto-managed by MCP
├── rewards/                # Badge assets
├── extras/                 # Ad-hoc learnings
├── courses/
│   ├── starter/
│   ├── beginner/
│   ├── advanced/
│   └── expert/
└── exercices/
    ├── starter/
    ├── beginner/
    ├── advanced/
    └── expert/
```

### Adding Pre-Made Content

To add pre-made courses for a topic:

1. Create the topic structure:
```bash
# Either use /learn or manually create:
mkdir -p topics/my-topic/courses/starter
mkdir -p topics/my-topic/exercices/starter
```

2. Create course files:
```bash
# topics/my-topic/courses/starter/01-introduction.md
```

3. Create progress.yaml:
```yaml
version: 1
topic: my-topic
display_name: "My Topic"
description: "Description here"
created_at: 2026-01-11
current_level: null
roadmap: {}
progress: {}
extras: []
```

4. Create rewards.yaml:
```yaml
version: 1
topic: my-topic
created_at: 2026-01-11
badges: []
milestones: []
```

## Extending the MCP Server

### Adding a New Tool

1. **Create the tool file** (or add to existing category):

```typescript
// mcp/professor-oak-mcp/src/tools/my-tool.ts
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";

export function registerMyTools(server: McpServer) {
  server.tool(
    "myToolName",
    `Description of what this tool does.
     Explain when Claude should use it.
     Include any important notes.`,
    {
      // Zod schema for parameters
      param1: z.string().describe("What this parameter is for"),
      param2: z.number().optional().describe("Optional parameter"),
    },
    async ({ param1, param2 }) => {
      // Tool implementation
      const result = {
        success: true,
        data: "...",
      };

      return {
        content: [{ type: "text", text: JSON.stringify(result) }],
      };
    }
  );
}
```

2. **Register in index.ts**:

```typescript
// mcp/professor-oak-mcp/src/index.ts
import { registerMyTools } from "./tools/my-tool.js";

// ... in server setup
registerMyTools(server);
```

3. **Update CLAUDE.md** with the new tool:

```markdown
### MCP Tools

- MyTools: `myToolName`
```

### Tool Best Practices

1. **Descriptive names**: Use clear, action-oriented names
2. **Detailed descriptions**: Tell Claude when to use the tool
3. **Zod validation**: Validate all inputs
4. **JSON responses**: Always return structured JSON
5. **Error handling**: Return `{ success: false, error: "..." }` on failure

### Example: Adding a Leaderboard Tool

```typescript
// mcp/professor-oak-mcp/src/tools/leaderboard.ts
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { readYaml } from "../services/yaml.js";

export function registerLeaderboardTools(server: McpServer) {
  server.tool(
    "getLeaderboard",
    `Get a leaderboard of top trainers by points.
     Use this when users ask about rankings or competition.`,
    {
      limit: z.number().optional().describe("Number of trainers to show (default: 10)"),
      topic: z.string().optional().describe("Filter by specific topic"),
    },
    async ({ limit = 10, topic }) => {
      // Implementation here
      const leaderboard = [
        { name: "Ash", points: 5000, rank: "Expert Trainer" },
        // ...
      ];

      return {
        content: [{
          type: "text",
          text: JSON.stringify({
            success: true,
            leaderboard,
            count: leaderboard.length,
          })
        }],
      };
    }
  );
}
```

## Adding New Personas

### 1. Create Persona File

```markdown
<!-- personas/my-character.md -->
# My Character

You are [Character Name], a [role description].

## Role
[What this character does in the system]

## Personality
- Trait 1
- Trait 2
- Trait 3

## Speech Patterns
- "Example phrase 1"
- "Example phrase 2"

## Behaviors

### When [trigger 1]
[How to behave]

### When [trigger 2]
[How to behave]

## MCP Tools Available
[List relevant tools this persona uses]

## Example Dialogue
[Example conversations]
```

### 2. Update CLAUDE.md

Add the persona to the persona table:

```markdown
| Command | Persona | File |
|---------|---------|------|
| `/my-command` | My Character | personas/my-character.md |
```

### 3. Create Command (if needed)

```markdown
<!-- .claude/commands/my-command.md -->
Trigger my character persona.

## Arguments
- $ARGUMENTS: [description]

## Flow
1. Call `getPersona("my-character", {})`
2. Adopt persona
3. [Additional steps]

## Persona
See personas/my-character.md
```

## Adding New Commands

### Command File Structure

```markdown
<!-- .claude/commands/my-command.md -->
Brief description of what this command does.

## Arguments
- $ARGUMENTS: Description of expected arguments

## Flow
1. Step 1 - what to do
2. Step 2 - MCP calls to make
3. Step 3 - how to respond

## Persona
Which persona to adopt (if any)

## Example
[Optional example usage]
```

### Command Example: Achievement Display

```markdown
<!-- .claude/commands/achievements.md -->
Display user achievements and milestones.

## Arguments
- $ARGUMENTS: Optional topic filter

## Flow
1. Call `getTrainer()` to get achievement data
2. Call `getBadges()` for badge information
3. Call `getPokedexStats()` for collection stats
4. Display achievements in a celebratory format

## Display Format
```
Your Achievements:

First Steps:
- First Pokemon caught: 2026-01-11
- First badge earned: 2026-01-12

Collection:
- Pokemon caught: 42
- Legendaries: 2
- Perfect quizzes: 8

Mastery:
- Topics mastered: 1
- Total badges: 6
```

## Persona
Use neutral/celebratory tone, no specific persona required.
```

## Testing

### Running Tests

```bash
cd mcp/professor-oak-mcp

# Run all tests
docker run --rm -v $(pwd):/app -w /app node:20-alpine npm run test:run

# Run with coverage
docker run --rm -v $(pwd):/app -w /app node:20-alpine npm run test:run -- --coverage

# Watch mode
docker run --rm -v $(pwd):/app -w /app node:20-alpine npm test
```

### Writing Tests

```typescript
// mcp/professor-oak-mcp/src/__tests__/my-tool.test.ts
import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { readYaml, writeYaml } from "../services/yaml.js";

const TEST_DATA_PATH = "/tmp/professor-oak-test";

describe("My Tool", () => {
  beforeEach(async () => {
    process.env.DATA_PATH = TEST_DATA_PATH;
    // Setup test data
  });

  afterEach(async () => {
    // Cleanup
  });

  it("should do something", async () => {
    // Arrange
    const input = { param1: "test" };

    // Act
    const result = await myFunction(input);

    // Assert
    expect(result.success).toBe(true);
  });
});
```

### Testing MCP Tools

```bash
# Test with JSON-RPC directly
echo '{"jsonrpc":"2.0","id":1,"method":"tools/list"}' | \
  docker run --rm -i professor-oak-mcp

# Test specific tool
echo '{"jsonrpc":"2.0","id":1,"method":"tools/call","params":{"name":"listTopics","arguments":{}}}' | \
  docker run --rm -i -v $(pwd):/data professor-oak-mcp
```

## CI/CD Pipeline

### GitHub Actions Workflows

| Workflow | Trigger | Purpose |
|----------|---------|---------|
| `ci.yml` | Push, PR | Build, test, lint |
| `pr-review.yml` | PR opened | AI code review |
| `codeql.yml` | Push, PR, Schedule | Security scanning |
| `release.yml` | Version tags | Create releases |

### Pre-Commit Hooks

The project uses Claude Code hooks for local development:

**Configuration**: `.claude/settings.json`
```json
{
  "hooks": {
    "PreToolUse": [
      {
        "matcher": "Bash",
        "hooks": [
          {
            "type": "command",
            "command": "bash -c '...'",
            "timeout": 300000
          }
        ]
      }
    ]
  }
}
```

**Hook Script**: `.claude/hooks/precommit.sh`
- Runs TypeScript build
- Runs type checking
- Runs all tests

### Adding New CI Checks

Edit `.github/workflows/ci.yml`:

```yaml
- name: My Custom Check
  run: |
    cd mcp/professor-oak-mcp
    docker run --rm -v $(pwd):/app -w /app node:20-alpine npm run my-check
```

## Code Style

### TypeScript Guidelines

1. **Use strict types**: Avoid `any`
2. **Async/await**: Always use async/await for promises
3. **Error handling**: Return result objects, don't throw
4. **Naming**: camelCase for functions, PascalCase for types

### Result Pattern

```typescript
interface Result<T> {
  success: boolean;
  data?: T;
  error?: string;
}

async function myFunction(): Promise<Result<MyData>> {
  try {
    const data = await doSomething();
    return { success: true, data };
  } catch (error) {
    return { success: false, error: String(error) };
  }
}
```

### Tool Response Format

```typescript
function jsonResponse(data: any) {
  return {
    content: [{ type: "text" as const, text: JSON.stringify(data) }],
  };
}

// Usage in tool
return jsonResponse({
  success: true,
  data: result,
  message: "Operation completed",
});
```

## Building Docker Image

### Development Build

```bash
cd mcp/professor-oak-mcp
docker build -t professor-oak-mcp:dev .
```

### Production Build

```bash
docker build -t professor-oak-mcp:latest .
docker tag professor-oak-mcp:latest ghcr.io/username/professor-oak:latest
docker push ghcr.io/username/professor-oak:latest
```

### Multi-Platform Build

```bash
docker buildx build --platform linux/amd64,linux/arm64 \
  -t professor-oak-mcp:latest \
  --push .
```

## Debugging

### MCP Debug Mode

```bash
claude --mcp-debug
```

This shows all MCP communication in real-time.

### Docker Logs

```bash
# Run with verbose output
docker run --rm -i \
  -v $(pwd):/data \
  -e DEBUG=true \
  professor-oak-mcp
```

### Common Issues

**Tool not found**
- Check tool is registered in `index.ts`
- Rebuild Docker image after changes
- Verify MCP configuration

**YAML parsing errors**
- Check file exists
- Validate YAML syntax
- Check file permissions

**Type errors**
- Run `npx tsc --noEmit` to see all errors
- Check type imports are correct
- Ensure `.js` extensions in imports

## Contributing

### Pull Request Process

1. Fork the repository
2. Create feature branch: `git checkout -b feature/my-feature`
3. Make changes
4. Run tests: `npm run test:run`
5. Commit with conventional commits
6. Push and create PR

### Commit Message Format

```
type(scope): description

[optional body]

[optional footer]
```

Types: `feat`, `fix`, `docs`, `style`, `refactor`, `test`, `chore`

Examples:
```
feat(quiz): add legendary Pokemon bonus points
fix(progress): correct level completion check
docs(readme): update installation steps
```

### Code Review Checklist

- [ ] Tests pass
- [ ] TypeScript compiles without errors
- [ ] New tools have descriptions
- [ ] CLAUDE.md updated if needed
- [ ] Documentation updated

## Resources

### MCP Documentation
- [Model Context Protocol](https://modelcontextprotocol.io/)
- [MCP SDK](https://github.com/modelcontextprotocol/sdk)

### Project Links
- [Architecture Guide](architecture.md)
- [Setup Guide](setup.md)
- [User Guide](user-guide.md)

### External Resources
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Zod Documentation](https://zod.dev/)
- [Vitest Documentation](https://vitest.dev/)
