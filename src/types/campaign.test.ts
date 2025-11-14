import { FieldMetadata } from './document';
import { EntityKind, NPC, Location, Item, Quest, ItemRarity, ItemType, LocationType, QuestType, getEntityFields } from './campaign';


describe('Campaign Types', () => {
    describe('EntityKind enum', () => {
        it('should have all expected entity kinds', () => {
            expect(EntityKind.NPC).toBe('npc');
            expect(EntityKind.LOCATION).toBe('location');
            expect(EntityKind.ITEM).toBe('item');
            expect(EntityKind.QUEST).toBe('quest');
        });
    });

    describe('NPC type', () => {
        it('should create a valid NPC object', () => {
            const npc: NPC = {
                kind: EntityKind.NPC,
                title: 'Test Character',
                race: 'Human',
                class: 'Fighter',
                role: 'ally',
                status: 'active'
            };

            expect(npc.kind).toBe(EntityKind.NPC);
            expect(npc.title).toBe('Test Character');
            expect(npc.race).toBe('Human');
            expect(npc.class).toBe('Fighter');
            expect(npc.role).toBe('ally');
        });

        it('should support optional properties', () => {
            const npc: NPC = {
                kind: EntityKind.NPC,
                title: 'Advanced Character',
                tags: ['friendly', 'merchant'],
                faction: 'Merchants Guild',
                importance: 'major',
                aliases: ['The Trader'],
                location: 'Market Square',
                CR: '1/2'
            };

            expect(npc.tags).toContain('friendly');
            expect(npc.faction).toBe('Merchants Guild');
            expect(npc.importance).toBe('major');
            expect(npc.aliases).toContain('The Trader');
        });
    });

    describe('Location type', () => {
        it('should create a valid Location object', () => {
            const location: Location = {
                kind: EntityKind.LOCATION,
                title: 'Test Tavern',
                region: 'Town Square',
                type: LocationType.TAVERN,
                status: 'active'
            };

            expect(location.kind).toBe(EntityKind.LOCATION);
            expect(location.title).toBe('Test Tavern');
            expect(location.type).toBe(LocationType.TAVERN);
            expect(location.region).toBe('Town Square');
        });

        it('should support optional properties', () => {
            const location: Location = {
                kind: EntityKind.LOCATION,
                title: 'Mysterious Cave',
                tags: ['dangerous', 'unexplored'],
                region: 'Dark Forest',
                type: LocationType.DUNGEON,
                faction_presence: ['Goblins', 'Undead']
            };

            expect(location.tags).toContain('dangerous');
            expect(location.faction_presence).toContain('Goblins');
        });
    });

    describe('Item type', () => {
        it('should create a valid Item object', () => {
            const item: Item = {
                kind: EntityKind.ITEM,
                title: 'Magic Sword',
                type: ItemType.WEAPON,
                rarity: ItemRarity.RARE,
                attunement: true
            };

            expect(item.kind).toBe(EntityKind.ITEM);
            expect(item.title).toBe('Magic Sword');
            expect(item.type).toBe(ItemType.WEAPON);
            expect(item.rarity).toBe(ItemRarity.RARE);
            expect(item.attunement).toBe(true);
        });

        it('should support optional properties', () => {
            const item: Item = {
                kind: EntityKind.ITEM,
                title: 'Healing Potion',
                tags: ['consumable', 'magic'],
                type: ItemType.CONSUMABLE,
                rarity: ItemRarity.COMMON,
                owner: 'Party Inventory',
                status: 'available'
            };

            expect(item.tags).toContain('consumable');
            expect(item.owner).toBe('Party Inventory');
        });
    });

    describe('Quest type', () => {
        it('should create a valid Quest object', () => {
            const quest: Quest = {
                kind: EntityKind.QUEST,
                title: 'Rescue the Village',
                status: 'active',
                type: QuestType.MAIN,
                arc: 'Bandit Crisis'
            };

            expect(quest.kind).toBe(EntityKind.QUEST);
            expect(quest.title).toBe('Rescue the Village');
            expect(quest.status).toBe('active');
            expect(quest.type).toBe(QuestType.MAIN);
        });

        it('should support optional properties', () => {
            const quest: Quest = {
                kind: EntityKind.QUEST,
                title: 'Find the Lost Artifact',
                tags: ['magic', 'exploration'],
                status: 'in-progress',
                owner: 'Wizard Aldric',
                faction: 'Mages Guild',
                arc: 'Ancient Mysteries',
                type: QuestType.SIDE
            };

            expect(quest.tags).toContain('magic');
            expect(quest.owner).toBe('Wizard Aldric');
            expect(quest.faction).toBe('Mages Guild');
        });

        jest.mock('@/lib/validation/entity', () => ({
            itemSchema: { mock: 'itemSchema' },
            locationSchema: { mock: 'locationSchema' },
            npcSchema: { mock: 'npcSchema' },
            playerSchema: { mock: 'playerSchema' },
            questSchema: { mock: 'questSchema' },
            sessionPrepSchema: { mock: 'sessionPrepSchema' },
            sessionSummarySchema: { mock: 'sessionSummarySchema' },
        }));

        jest.mock('@/lib/utils/form', () => ({
            generateFieldsFromSchema: jest.fn(() => [
                { name: 'field1', label: 'Field 1', type: 'text' },
                { name: 'field2', label: 'Field 2', type: 'text' }
            ]),
            FieldMetadata: jest.requireActual('@/lib/utils/form').FieldMetadata
        }));

        describe('EntityFieldMap', () => {
            const hasBaseFields = (fields: FieldMetadata[]) => {
                return fields.some((field) => field.label === 'Title');
            };
            it('should generate fields for ITEM kind', () => {
                const fields = getEntityFields(EntityKind.ITEM);
                expect(Array.isArray(fields)).toBe(true);
                expect(fields.length).toBeGreaterThan(0);
                expect(hasBaseFields(fields)).toBe(true);
                expect(fields.some((field) => field.label === 'Type')).toBe(true);
            });

            it('should generate fields for LOCATION kind', () => {
                const fields = getEntityFields(EntityKind.LOCATION);
                expect(Array.isArray(fields)).toBe(true);
                expect(hasBaseFields(fields)).toBe(true);
                expect(fields.some((field) => field.label === 'Region')).toBe(true);
            });

            it('should generate fields for NPC kind', () => {
                const fields = getEntityFields(EntityKind.NPC);
                expect(Array.isArray(fields)).toBe(true);
                expect(hasBaseFields(fields)).toBe(true);
                expect(fields.some((field) => field.label === 'Role')).toBe(true);
            });

            it('should generate fields for PLAYER kind', () => {
                const fields = getEntityFields(EntityKind.PLAYER);
                expect(Array.isArray(fields)).toBe(true);
                expect(hasBaseFields(fields)).toBe(true);
                expect(fields.some((field) => field.label === 'Character Name')).toBe(true);
            });

            it('should generate fields for QUEST kind', () => {
                const fields = getEntityFields(EntityKind.QUEST);
                expect(Array.isArray(fields)).toBe(true);
                expect(hasBaseFields(fields)).toBe(true);
                expect(fields.some((field) => field.label === 'Status')).toBe(true);
            });

            it('should generate fields for SESSION_PREP kind', () => {
                const fields = getEntityFields(EntityKind.SESSION_PREP);
                expect(Array.isArray(fields)).toBe(true);
                expect(hasBaseFields(fields)).toBe(true);
                expect(fields.some((field) => field.label === 'Planned Date')).toBe(true);
            });

            it('should generate fields for SESSION_SUMMARY kind', () => {
                const fields = getEntityFields(EntityKind.SESSION_SUMMARY);
                expect(Array.isArray(fields)).toBe(true);
                expect(hasBaseFields(fields)).toBe(true);
                expect(fields.some((field) => field.label === 'Summary')).toBe(true);
            });

            it('should return empty array for UNKNOWN kind', () => {
                const fields = getEntityFields(EntityKind.UNKNOWN);
                expect(Array.isArray(fields)).toBe(true);
                expect(fields.length).toBe(0);
            });

            it('should memoize fields per entity kind', () => {
                const firstCall = getEntityFields(EntityKind.ITEM);
                const secondCall = getEntityFields(EntityKind.ITEM);
                expect(secondCall).toBe(firstCall);
            });
        });
    });
});