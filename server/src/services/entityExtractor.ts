import { MarkdownContent } from '@obsidian-parser/shared';
import {
    EntityKind,
    AnyEntity,
    SessionSummary,
    NPC,
    Location,
    Item,
    Quest,
    LocationType,
    ItemType
} from '@obsidian-parser/shared';

/**
 * Extracts campaign entities from parsed markdown content
 */
export class EntityExtractor {

    /**
     * Extract all entities from a parsed markdown document
     */
    extractEntities(content: MarkdownContent, filename: string): AnyEntity[] {
        const entities: AnyEntity[] = [];

        // First, try to determine what type of document this is
        const sessionInfo = this.extractSessionInfo(content, filename);
        if (sessionInfo) {
            entities.push(sessionInfo);
        }

        // Extract NPCs from the content
        entities.push(...this.extractNPCs(content, sessionInfo?.session_number));

        // Extract locations
        entities.push(...this.extractLocations(content, sessionInfo?.session_number));

        // Extract items
        entities.push(...this.extractItems(content, sessionInfo?.session_number));

        // Extract quests/missions
        entities.push(...this.extractQuests(content, sessionInfo?.session_number));

        return entities;
    }

    /**
     * Extract session information from content and filename
     */
    private extractSessionInfo(content: MarkdownContent, filename: string): SessionSummary | null {
        // Look for session number in filename or headings
        const sessionNumberMatch = filename.match(/session[_\s]*summary[_\s]*(\d+)/i) ||
            content.raw.match(/session[_\s]*(\d+)/i);

        if (!sessionNumberMatch) return null;

        const sessionNumber = parseInt(sessionNumberMatch[1]);

        // Extract title from first main heading (level 1 or 2)
        const mainHeading = content.headings.find(h => h.level <= 2);
        const title = mainHeading?.text.replace(/^\d+\.\s*/, '') || `Session ${sessionNumber}`;

        // Look for synopsis section
        const synopsisHeading = content.headings.find(h =>
            h.text.toLowerCase().includes('synopsis')
        );

        let brief_synopsis: string | undefined;
        if (synopsisHeading) {
            // Find the next heading at same or higher level
            const nextHeadingIndex = content.headings.findIndex(h =>
                h.level <= synopsisHeading.level &&
                h !== synopsisHeading
            );

            // Extract text between headings
            const synopsisSection = content.raw.split('\n')
                .slice(content.raw.split('\n').findIndex(line => line.includes(synopsisHeading.text)) + 1)
                .slice(0, nextHeadingIndex >= 0 ? 10 : undefined) // Take reasonable chunk
                .filter(line => !line.startsWith('#'))
                .join(' ')
                .trim();

            brief_synopsis = synopsisSection.substring(0, 500); // Limit length
        }

        return {
            kind: EntityKind.SESSION_SUMMARY,
            title,
            session_number: sessionNumber,
            brief_synopsis,
            full_summary: content.text,
            status: "complete"
        };
    }

    /**
     * Extract NPC entities from content
     */
    private extractNPCs(content: MarkdownContent, sessionNumber?: number): NPC[] {
        const npcs: NPC[] = [];
        const text = content.text;

        // More precise NPC patterns
        const npcPatterns = [
            // "Name, the role" or "Name the role"
            /\b([A-Z][a-z]+(?:\s+[A-Z][a-z]+)?),?\s+(?:the\s+)?(barkeep|barmaid|proprietor|merchant|scribe|guard)\b/gi,
            // Character with class/race descriptions
            /\b([A-Z][a-z]+(?:\s+[A-Z][a-z]+)?),?\s+(?:(?:a|the)\s+)?(?:(noble|secretive)\s+)?(half-elf|half-orc|drow|elf|dwarf|human|bugbear|halfling)\s+(barbarian|fighter|cleric|wizard|rogue|ranger|paladin|bard|sorcerer|warlock|druid|monk|artificer|hexblade)\b/gi,
            // Simple proper name patterns in key positions
            /(?:introduced\s+himself\s+as|called\s+herself|named|approached\s+by)\s+([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*)/gi,
        ];

        const foundNames = new Set<string>();

        // Also add some manually known names from context
        const knownNPCs = [
            'Durnan', 'Bonnie', 'Yagra', 'Volothamp Geddarm', 'Volo', 'Floon Blagmaar',
            'Cat Amcathra', 'Teddy', 'Hastur', 'Lainadan', 'Era', 'Davil'
        ];

        // Extract known NPCs first
        knownNPCs.forEach(name => {
            if (text.includes(name) && !foundNames.has(name.toLowerCase())) {
                foundNames.add(name.toLowerCase());

                const npc: NPC = {
                    kind: EntityKind.NPC,
                    title: name,
                    sourceSessions: sessionNumber ? [sessionNumber] : undefined
                };

                // Add role info if we can determine it
                if (name === 'Durnan') npc.role = 'barkeep';
                if (name === 'Bonnie') npc.role = 'barmaid';
                if (name === 'Volothamp Geddarm' || name === 'Volo') npc.role = 'merchant';

                npcs.push(npc);
            }
        });

        // Then use patterns for additional NPCs
        npcPatterns.forEach(pattern => {
            let match;
            while ((match = pattern.exec(text)) !== null) {
                const name = match[1].trim();

                // Skip if we've already found this name or it's too generic
                if (foundNames.has(name.toLowerCase()) || this.isCommonWord(name) || name.length < 3) {
                    continue;
                }

                foundNames.add(name.toLowerCase());

                const npc: NPC = {
                    kind: EntityKind.NPC,
                    title: name,
                    sourceSessions: sessionNumber ? [sessionNumber] : undefined
                };

                // Extract role/class info from match groups
                if (match[2] && this.isRole(match[2])) {
                    npc.role = match[2].toLowerCase();
                }

                if (match[4] && this.isClass(match[4])) {
                    npc.tags = npc.tags || [];
                    npc.tags.push(`class:${match[4].toLowerCase()}`);
                }

                npcs.push(npc);
            }
        });

        return npcs;
    }

    /**
     * Extract location entities from content
     */
    private extractLocations(content: MarkdownContent, sessionNumber?: number): Location[] {
        const locations: Location[] = [];
        const text = content.text;

        // Known locations from the content
        const knownLocations = [
            { name: 'Yawning Portal', type: LocationType.TAVERN },
            { name: 'Waterdeep', type: LocationType.CITY },
            { name: 'Undermountain', type: LocationType.DUNGEON },
            { name: 'Skewered Dragon', type: LocationType.TAVERN },
            { name: 'Dock Ward', type: LocationType.VILLAGE },
            { name: 'Temple of Gond', type: LocationType.TEMPLE }
        ];

        const foundLocations = new Set<string>();

        // Extract known locations
        knownLocations.forEach(({ name, type }) => {
            if (text.includes(name) && !foundLocations.has(name.toLowerCase())) {
                foundLocations.add(name.toLowerCase());

                const location: Location = {
                    kind: EntityKind.LOCATION,
                    title: name,
                    type,
                    sourceSessions: sessionNumber ? [sessionNumber] : undefined
                };

                locations.push(location);
            }
        });

        // Additional pattern-based extraction for missed locations
        const locationPatterns = [
            // "the [Name] tavern/inn/temple" etc.
            /\bthe\s+([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*)\s+(tavern|inn|temple|guild)\b/gi,
        ];

        locationPatterns.forEach(pattern => {
            let match;
            while ((match = pattern.exec(text)) !== null) {
                const name = match[1].trim();
                const locationType = match[2].toLowerCase();

                if (foundLocations.has(name.toLowerCase()) || name.length < 3) continue;
                foundLocations.add(name.toLowerCase());

                const location: Location = {
                    kind: EntityKind.LOCATION,
                    title: name,
                    sourceSessions: sessionNumber ? [sessionNumber] : undefined
                };

                // Set type based on pattern
                if (locationType === 'tavern' || locationType === 'inn') {
                    location.type = LocationType.TAVERN;
                } else if (locationType === 'temple') {
                    location.type = LocationType.TEMPLE;
                }

                locations.push(location);
            }
        });

        return locations;
    }

    /**
     * Extract item entities from content
     */
    private extractItems(content: MarkdownContent, sessionNumber?: number): Item[] {
        const items: Item[] = [];
        const text = content.text;

        // Item patterns
        const itemPatterns = [
            // "ancestral blade", "magic sword", etc.
            /([a-z]+\s+(?:blade|sword|axe|bow|crossbow|armor|shield|potion|ring|amulet|cloak))/gi,
            // "weapon" mentions
            /(weapon|blade|sword|crossbow)(?:\s+[a-z]+)?/gi
        ];

        const foundItems = new Set<string>();

        itemPatterns.forEach(pattern => {
            let match;
            while ((match = pattern.exec(text)) !== null) {
                const name = match[1].trim();

                if (foundItems.has(name.toLowerCase())) continue;
                foundItems.add(name.toLowerCase());

                const item: Item = {
                    kind: EntityKind.ITEM,
                    title: name,
                    sourceSessions: sessionNumber ? [sessionNumber] : undefined
                };

                // Try to determine item type
                if (name.toLowerCase().includes('blade') || name.toLowerCase().includes('sword')) {
                    item.type = ItemType.WEAPON;
                } else if (name.toLowerCase().includes('crossbow') || name.toLowerCase().includes('bow')) {
                    item.type = ItemType.WEAPON;
                }

                items.push(item);
            }
        });

        return items;
    }

    /**
     * Extract quest entities from content
     */
    private extractQuests(content: MarkdownContent, sessionNumber?: number): Quest[] {
        const quests: Quest[] = [];
        const text = content.text;

        // Look for quest-related language
        const questPatterns = [
            /(?:find|rescue|locate)\s+([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*)/gi,
            /mission\s+(?:to\s+)?([^.!?]+)/gi,
            /quest\s+(?:to\s+)?([^.!?]+)/gi
        ];

        questPatterns.forEach(pattern => {
            let match;
            while ((match = pattern.exec(text)) !== null) {
                const objective = match[1].trim();

                const quest: Quest = {
                    kind: EntityKind.QUEST,
                    title: `Find ${objective}`,
                    sourceSessions: sessionNumber ? [sessionNumber] : undefined,
                    status: "active"
                };

                quests.push(quest);
            }
        });

        return quests;
    }

    // Helper methods
    private isCommonWord(word: string): boolean {
        const commonWords = ['the', 'and', 'but', 'for', 'with', 'from', 'they', 'have', 'this', 'that', 'what', 'when', 'where', 'who', 'how'];
        return commonWords.includes(word.toLowerCase());
    }

    private isRace(word: string): boolean {
        const races = ['human', 'elf', 'dwarf', 'halfling', 'gnome', 'half-elf', 'half-orc', 'tiefling', 'dragonborn', 'drow', 'bugbear'];
        return races.includes(word.toLowerCase().replace(/\s+/g, '-'));
    }

    private isClass(word: string): boolean {
        const classes = ['barbarian', 'fighter', 'cleric', 'wizard', 'rogue', 'ranger', 'paladin', 'bard', 'sorcerer', 'warlock', 'druid', 'monk', 'artificer', 'hexblade'];
        return classes.includes(word.toLowerCase());
    }

    private isRole(word: string): boolean {
        const roles = ['barkeep', 'barmaid', 'proprietor', 'merchant', 'scribe', 'guard', 'noble'];
        return roles.includes(word.toLowerCase());
    }
}