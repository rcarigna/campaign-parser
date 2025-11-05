---
tags: [item]
rarity: "{{rarity}}"
type: "{{type}}"
attunement: {{#if attunement}}{{attunement}}{{else}}false{{/if}}
owner: "{{owner}}"
status: "{{#if status}}{{status}}{{else}}available{{/if}}"
---

# 💎 {{title}}

**Type:** {{type}}
**Rarity:** {{rarity}}
**Requires Attunement:** {{#if attunement}}Yes{{else}}No{{/if}}
**Current Owner:** {{owner}}

---

## ✨ Description

{{#if description}}{{description}}{{else}}Flavor text or appearance details.{{/if}}

---

## ⚙️ Mechanics

{{#if mechanics}}
{{mechanics}}
{{else}}

- **Bonus / Effect:**
- **Charges:**
- **Special Rules:**
{{/if}}

---

## 🕯️ Lore / Origin

{{#if lore}}
{{lore}}
{{else}}
Where it came from, who forged it, what legends surround it.
{{/if}}

{{#if sourceSessions}}

---

## 📚 Campaign References

*Referenced in Sessions: {{sourceSessions}}*
{{/if}}
