# Claude Code skills

Project-scoped skills for this repo. Claude Code auto-loads any `SKILL.md` under
`.claude/skills/<name>/` and triggers it based on the `description` in its
frontmatter, or on explicit `/skill-name` invocation.

## Guard skills

Quality gates for AI-generated work, adapted from
[amElnagdy/guard-skills](https://github.com/amElnagdy/guard-skills) (MIT). Run
them as a second-pass review *after* an agent finishes, before committing.

| Skill | Use it for |
|-------|------------|
| [`clean-code-guard`](clean-code-guard/SKILL.md) | Production code review — Clean Code / SOLID / DRY / YAGNI plus LLM-specific failure modes |
| [`test-guard`](test-guard/SKILL.md) | Test review — kills mock abuse, duplicate tests, and assertions that verify nothing |
| [`docs-guard`](docs-guard/SKILL.md) | Docs review — verifies every referenced symbol, flag, and code sample against the source |

The upstream `wp-guard` and `woo-guard` skills are intentionally **not** included
— predaiot is a Next.js/TypeScript app with no WordPress/WooCommerce.

Each `SKILL.md` is self-contained (all rules inline). The upstream
`references/*.md` deep dives are not bundled; links point back to the source repo.
