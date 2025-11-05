---
tags: [item]
rarity: "{{rarity}}"
type: "{{type}}"
attunement: {{attunement || false}}
owner: "{{owner}}"
status: "{{status || 'available'}}"
---

# 💎 {{title}}

**Type:** {{type}}
**Rarity:** {{rarity}}
**Requires Attunement:** {{#if attunement}}Yes{{else}}No{{/if}}
**Current Owner:** {{owner}}

---

## ✨ Description
{{description || 'Flavor text or appearance details.'}}

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