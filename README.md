# MIT P-set Templates

Create MIT problem-set notes for college classes. Built around how P-sets work at MIT: a class, a set number, and N problems.

A right sidebar (graduation cap) lets you pick class, P-set number, and problem count, then write a new note. Templates live in plugin settings, not in a templates folder.

For university coursework, problem sets, homework, and other academic notes — not only 6.1200.

## Create a P-set

- Ribbon: graduation cap, or command **Open P-set sidebar**
- Command: **Create P-set note** (same form in a modal)

Fill:

- Class (dropdown from settings)
- P-set number
- Number of problems

Name and date fill from settings.

## Settings

- Name
- Classes (subject number + title)
- Date and time formats (Moment tokens, same as core Templates)
- Filename pattern
- Document structure — full note, with `{{problems}}` where problem sections go
- Problem structure — one problem; repeated for the count you choose

## Tokens

| Token | Value |
|---|---|
| `{{name}}` / `{{Your Name}}` | Name from settings |
| `{{date}}` | Today, default `YYYY-MM-DD` |
| `{{date:FORMAT}}` | Today with a Moment format |
| `{{time}}` | Now, default `HH:mm` |
| `{{class-id}}` | Selected class number, for example `6.1200` |
| `{{class-name}}` | Selected class title |
| `{{n}}` / `{{N}}` | P-set number |
| `{{problems}}` | Generated problem sections |
| `{{problem-number}}` | 1, 2, 3, … inside the problem structure |

Core Templates help: https://obsidian.md/help/plugins/templates

Views: https://docs.obsidian.md/Plugins/User+interface/Views
