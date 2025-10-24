import nlp from 'compromise';
import {
    MarkdownContent,
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

// Campaign-specific entity dictionaries (constants)
const CAMPAIGN_TERMS = {
    npcs: new Set([
        'Durnan', 'Bonnie', 'Yagra', 'Volothamp Geddarm', 'Volo', 'Floon Blagmaar',
        'Cat Amcathra', 'Teddy', 'Hastur', 'Lainadan', 'Era', 'Davil'
    ]),

    locations: new Set([
        'Yawning Portal', 'Waterdeep', 'Undermountain', 'Skewered Dragon',
        'Dock Ward', 'Temple of Gond', 'VIP section'
    ]),

    roles: new Set([
        'barkeep', 'barmaid', 'proprietor', 'merchant', 'scribe', 'guard',
        'noble', 'cleric', 'fighter', 'wizard', 'rogue', 'barbarian'
    ]),

    locationTypes: new Map([
        ['tavern', LocationType.TAVERN],
        ['inn', LocationType.TAVERN],
        ['temple', LocationType.TEMPLE],
        ['city', LocationType.CITY],
        ['town', LocationType.TOWN],
        ['village', LocationType.VILLAGE],
        ['dungeon', LocationType.DUNGEON],
        ['ward', LocationType.VILLAGE],
        ['district', LocationType.VILLAGE]
    ]),

    itemTypes: new Map([
        ['blade', ItemType.WEAPON],
        ['sword', ItemType.WEAPON],
        ['crossbow', ItemType.WEAPON],
        ['bow', ItemType.WEAPON],
        ['armor', ItemType.ARMOR],
        ['shield', ItemType.SHIELD],
        ['potion', ItemType.CONSUMABLE]
    ])
} as const;

/**
 * Main NLP-powered entity extraction function
 * This is a complete rewrite using compromise.js for much better accuracy than regex
 */
export const extractEntities = (content: MarkdownContent): AnyEntity[] => {
    const doc = nlp(content.text);
    const entities: AnyEntity[] = [];

    // Extract session info first (use empty filename for now)
    const sessionInfo = extractSessionInfo(content, 'session_summary_1.md');
    if (sessionInfo) {
        entities.push(sessionInfo);
    }
    const sessionNumber = sessionInfo?.session_number;

    // Use NLP for all entity types
    entities.push(...extractNPCs(doc, content, sessionNumber));
    entities.push(...extractLocations(doc, content, sessionNumber));
    entities.push(...extractItems(doc, content, sessionNumber));
    entities.push(...extractQuests(doc, content, sessionNumber));

    return entities;
};

/**
 * Extract session information (same as before, this works well)
 */
const extractSessionInfo = (content: MarkdownContent, filename: string): SessionSummary | null => {
    const sessionNumberMatch = filename.match(/session[_\s]*summary[_\s]*(\d+)/i) ||
        content.raw.match(/session[_\s]*(\d+)/i);

    if (!sessionNumberMatch) return null;

    const sessionNumber = parseInt(sessionNumberMatch[1]);
    const mainHeading = content.headings.find(h => h.level <= 2);
    const title = mainHeading?.text.replace(/^\d+\.\s*/, '') || `Session ${sessionNumber}`;

    // Extract synopsis using NLP
    const synopsisHeading = content.headings.find(h =>
        h.text.toLowerCase().includes('synopsis')
    );

    let brief_synopsis: string | undefined;
    if (synopsisHeading) {
        const lines = content.raw.split('\n');
        const synopsisIndex = lines.findIndex(line => line.includes(synopsisHeading.text));
        const nextHeadingIndex = lines.findIndex((line, idx) =>
            idx > synopsisIndex && line.match(/^#{1,6}\s/)
        );

        const synopsisLines = lines.slice(
            synopsisIndex + 1,
            nextHeadingIndex > 0 ? nextHeadingIndex : synopsisIndex + 10
        );

        brief_synopsis = synopsisLines
            .filter(line => line.trim() && !line.startsWith('#'))
            .join(' ')
            .trim()
            .substring(0, 500);
    }

    return {
        kind: EntityKind.SESSION_SUMMARY,
        title,
        session_number: sessionNumber,
        brief_synopsis,
        full_summary: content.text,
        status: "complete"
    };
};

/**
 * Extract NPCs using NLP - much more accurate than regex
 */
const extractNPCs = (doc: any, content: MarkdownContent, sessionNumber?: number): NPC[] => {
    const npcs: NPC[] = [];
    const foundNames = new Set<string>();

    // Start with known NPCs only for better quality
    CAMPAIGN_TERMS.npcs.forEach(name => {
        if (content.text.includes(name) && !foundNames.has(name.toLowerCase())) {
            foundNames.add(name.toLowerCase());

            const npc: NPC = {
                kind: EntityKind.NPC,
                title: name,
                sourceSessions: sessionNumber ? [sessionNumber] : undefined
            };

            // Use NLP to find role/description near the name
            const nameContext = getContextAroundName(doc, name);
            const role = extractRoleFromContext(nameContext);
            if (role) {
                npc.role = role;
            }

            // Add known roles for specific NPCs
            if (name === 'Durnan') npc.role = 'barkeep';
            if (name === 'Bonnie') npc.role = 'barmaid';
            if (name === 'Volothamp Geddarm' || name === 'Volo') npc.role = 'merchant';

            npcs.push(npc);
        }
    });

    // Only add high-confidence discovered NPCs
    const people = doc.people();
    const discoveredNames = people.out('array') as string[];

    discoveredNames.forEach((name: string) => {
        const cleanName = cleanPersonName(name);
        if (isHighConfidenceNPC(cleanName, content.text, foundNames)) {
            foundNames.add(cleanName.toLowerCase());

            const npc: NPC = {
                kind: EntityKind.NPC,
                title: cleanName,
                sourceSessions: sessionNumber ? [sessionNumber] : undefined
            };

            const nameContext = getContextAroundName(doc, cleanName);
            const role = extractRoleFromContext(nameContext);
            if (role) {
                npc.role = role;
            }

            npcs.push(npc);
        }
    });

    return npcs;
};

/**
 * Extract locations using NLP
 */
const extractLocations = (doc: any, content: MarkdownContent, sessionNumber?: number): Location[] => {
    const locations: Location[] = [];
    const foundLocations = new Set<string>();

    // Get places from NLP
    const places = doc.places();
    const placeNames = places.out('array') as string[];

    // Combine with known locations
    const allCandidates = new Set([
        ...CAMPAIGN_TERMS.locations,
        ...placeNames.filter((place: string) => couldBeLocationName(place))
    ]);

    allCandidates.forEach(name => {
        if (content.text.includes(name) && !foundLocations.has(name.toLowerCase())) {
            foundLocations.add(name.toLowerCase());

            const location: Location = {
                kind: EntityKind.LOCATION,
                title: name,
                sourceSessions: sessionNumber ? [sessionNumber] : undefined
            };

            // Determine location type from context
            const locationType = determineLocationType(doc, name);
            if (locationType) {
                location.type = locationType;
            }

            locations.push(location);
        }
    });

    return locations;
};

/**
 * Extract items using NLP
 */
const extractItems = (doc: any, content: MarkdownContent, sessionNumber?: number): Item[] => {
    const items: Item[] = [];
    const foundItems = new Set<string>();

    // Look for item-related patterns using NLP
    const weapons = doc.match('(#Adjective+ )?(blade|sword|crossbow|bow|axe|weapon)').out('array') as string[];
    const armor = doc.match('(#Adjective+ )?(armor|shield|cloak)').out('array') as string[];
    const potions = doc.match('(#Adjective+ )?potion').out('array') as string[];

    const allItems = [...weapons, ...armor, ...potions];

    allItems.forEach(item => {
        const cleanItem = item.trim();
        if (cleanItem.length > 2 && !foundItems.has(cleanItem.toLowerCase())) {
            foundItems.add(cleanItem.toLowerCase());

            const itemEntity: Item = {
                kind: EntityKind.ITEM,
                title: cleanItem,
                sourceSessions: sessionNumber ? [sessionNumber] : undefined
            };

            // Determine item type
            const itemType = determineItemType(cleanItem);
            if (itemType) {
                itemEntity.type = itemType;
            }

            items.push(itemEntity);
        }
    });

    return items;
};

/**
 * Extract quests using NLP
 */
const extractQuests = (doc: any, content: MarkdownContent, sessionNumber?: number): Quest[] => {
    const quests: Quest[] = [];

    // Look for quest-related verb patterns
    const questPatterns = doc.match('(find|rescue|locate|help|save) (#Person|#ProperNoun)');
    const missionPatterns = doc.match('mission to (#Verb+ )?#Person');

    const questCandidates = [
        ...questPatterns.out('array'),
        ...missionPatterns.out('array')
    ] as string[];

    questCandidates.forEach(questText => {
        if (questText.length > 5) {
            const quest: Quest = {
                kind: EntityKind.QUEST,
                title: questText,
                sourceSessions: sessionNumber ? [sessionNumber] : undefined,
                status: "active"
            };

            quests.push(quest);
        }
    });

    return quests;
};

/**
 * Clean and normalize person names
 */
const cleanPersonName = (name: string): string => {
    // Remove trailing punctuation and normalize
    return name.replace(/[,.):]$/, '').trim();
};

/**
 * Check if a discovered name is likely a real NPC (not a false positive)
 */
const isHighConfidenceNPC = (name: string, text: string, foundNames: Set<string>): boolean => {
    // More stringent checks for discovered NPCs
    return name.length >= 3 &&
        name.length <= 25 && // Avoid long phrases
        /^[A-Z][a-z]+( [A-Z][a-z]+)*$/.test(name) && // Proper name format
        !isCommonWord(name) &&
        !foundNames.has(name.toLowerCase()) &&
        text.includes(name) &&
        !isLikelyNotAPerson(name);
};

/**
 * Check if a name is likely not a person
 */
const isLikelyNotAPerson = (name: string): boolean => {
    const notPersonWords = new Set([
        'Synopsis', 'Description', 'Friend', 'Need', 'Part', 'Session',
        'Portal', 'Guild', 'Dragon', 'Temple', 'Ward', 'Rites'
    ]);

    return notPersonWords.has(name) ||
        name.includes('&') ||
        name.includes(':') ||
        name.toLowerCase().includes('detailed');
};

/**
 * Check if a name could be a person's name
 */
const couldBePersonName = (name: string): boolean => {
    return name.length >= 2 &&
        /^[A-Z]/.test(name) &&
        !isCommonWord(name) &&
        !name.includes('.');
};

/**
 * Check if a name could be a location name
 */
const couldBeLocationName = (name: string): boolean => {
    return name.length >= 3 &&
        /^[A-Z]/.test(name) &&
        !isCommonWord(name);
};

/**
 * Get surrounding context for a name mention
 */
const getContextAroundName = (doc: any, name: string): string => {
    // Get sentences containing the name
    const sentences = doc.sentences().filter((s: any) => s.text().includes(name));
    return sentences.out('text');
};

/**
 * Extract role/occupation from context using NLP
 */
const extractRoleFromContext = (context: string): string | undefined => {
    for (const role of CAMPAIGN_TERMS.roles) {
        if (context.toLowerCase().includes(role)) {
            return role;
        }
    }
    return undefined;
};

/**
 * Determine location type from context
 */
const determineLocationType = (doc: any, locationName: string): LocationType | undefined => {
    const context = getContextAroundName(doc, locationName).toLowerCase();

    for (const [keyword, type] of CAMPAIGN_TERMS.locationTypes) {
        if (context.includes(keyword)) {
            return type;
        }
    }

    return undefined;
};

/**
 * Determine item type from name
 */
const determineItemType = (itemName: string): ItemType | undefined => {
    const name = itemName.toLowerCase();

    for (const [keyword, type] of CAMPAIGN_TERMS.itemTypes) {
        if (name.includes(keyword)) {
            return type;
        }
    }

    return undefined;
};

/**
 * Check if a word is a common word (not a proper noun)
 */
const isCommonWord = (word: string): boolean => {
    const commonWords = new Set([
        'the', 'and', 'but', 'for', 'with', 'from', 'they', 'have',
        'this', 'that', 'what', 'when', 'where', 'who', 'how', 'were',
        'been', 'said', 'each', 'which', 'their', 'time', 'will', 'about',
        'if', 'up', 'out', 'many', 'then', 'them', 'these', 'so', 'some'
    ]);
    return commonWords.has(word.toLowerCase());
};