'use client';

import { useState } from 'react';
import { toast } from 'react-hot-toast';
import { loadDemoData, type DemoDataResponse } from '@/client/api';
import { MarkdownRenderer } from './MarkdownRenderer';
import { EntityViewer } from '@/components';
import { type EntityWithId, type AnyEntity } from '@/types';

type DemoSectionProps = {
    onDemoLoad?: (data: DemoDataResponse) => void;
};

export const DemoSection = ({ onDemoLoad }: DemoSectionProps) => {
    const [loading, setLoading] = useState(false);
    const [demoData, setDemoData] = useState<DemoDataResponse | null>(null);
    const [entities, setEntities] = useState<EntityWithId[]>([]);
    const [showRaw, setShowRaw] = useState(false);

    const handleLoadDemo = async () => {
        setLoading(true);
        try {
            const data = await loadDemoData();
            setDemoData(data);
            
            // Convert entities to EntityWithId format
            if (data.entities) {
                const entitiesWithIds = data.entities.map((entity, index) => {
                    const anyEntity = entity as AnyEntity;
                    return {
                        ...anyEntity,
                        id: `${anyEntity.kind}-${index}`,
                    } as EntityWithId;
                });
                setEntities(entitiesWithIds);
            }
            
            toast.success('Demo data loaded successfully!');
            onDemoLoad?.(data);
        } catch (error) {
            const message = error instanceof Error ? error.message : 'Failed to load demo';
            toast.error(message);
            console.error('Demo load error:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleClear = () => {
        setDemoData(null);
        setEntities([]);
        toast.success('Demo cleared');
    };

    const handleEntityDiscard = (entityId: string) => {
        setEntities((prev) => prev.filter((entity) => entity.id !== entityId));
    };

    const handleEntityMerge = (primaryEntity: EntityWithId, duplicateIds: string[]) => {
        setEntities((prev) => {
            const filtered = prev.filter((entity) => !duplicateIds.includes(entity.id));
            const primaryIndex = filtered.findIndex((entity) => entity.id === primaryEntity.id);
            if (primaryIndex >= 0) {
                filtered[primaryIndex] = primaryEntity;
            } else {
                filtered.push(primaryEntity);
            }
            return filtered;
        });
    };

    return (
        <div className="space-y-6">
            {/* Demo Header */}
            <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg border border-purple-200 p-6">
                <div className="flex items-start justify-between">
                    <div className="flex-1">
                        <h2 className="text-2xl font-semibold text-gray-800 mb-2">
                            🎭 Try the Demo
                        </h2>
                        <p className="text-gray-600 mb-4">
                            Load an example session note from a Dungeons & Dragons campaign to see how
                            the parser extracts NPCs, locations, items, and other entities automatically.
                        </p>
                        <div className="bg-white/70 rounded-lg p-4 mb-4">
                            <p className="text-sm text-gray-700 font-medium mb-2">
                                📚 Example: Session Summary #1
                            </p>
                            <p className="text-sm text-gray-600">
                                This session note describes adventurers gathering at the Yawning Portal tavern,
                                meeting various NPCs, and receiving their first quest. The parser will identify
                                characters like Durnan, Volothamp Geddarm, and locations like Waterdeep.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3">
                    <button
                        onClick={handleLoadDemo}
                        disabled={loading}
                        className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:bg-gray-300 disabled:cursor-not-allowed font-medium transition-colors flex items-center gap-2"
                    >
                        {loading ? (
                            <>
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                Loading Demo...
                            </>
                        ) : (
                            <>
                                <span>🚀</span>
                                Load Example Session
                            </>
                        )}
                    </button>
                    
                    {demoData && (
                        <button
                            onClick={handleClear}
                            className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 font-medium transition-colors"
                        >
                            Clear Demo
                        </button>
                    )}
                </div>
            </div>

            {/* Demo Content */}
            {demoData && (
                <div className="space-y-6">
                    {/* Markdown Display */}
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-xl font-semibold text-gray-800">
                                📄 Session Notes
                            </h3>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => setShowRaw(false)}
                                    className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                                        !showRaw
                                            ? 'bg-blue-600 text-white'
                                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                    }`}
                                >
                                    Formatted
                                </button>
                                <button
                                    onClick={() => setShowRaw(true)}
                                    className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                                        showRaw
                                            ? 'bg-blue-600 text-white'
                                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                    }`}
                                >
                                    Raw Markdown
                                </button>
                            </div>
                        </div>

                        {showRaw ? (
                            <pre className="bg-gray-50 rounded-lg p-4 overflow-x-auto text-sm text-gray-800 whitespace-pre-wrap">
                                {demoData.rawMarkdown}
                            </pre>
                        ) : (
                            <div className="bg-gray-50 rounded-lg p-4 overflow-y-auto max-h-96">
                                <MarkdownRenderer markdown={demoData.rawMarkdown} />
                            </div>
                        )}
                    </div>

                    {/* Extracted Entities */}
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                        <div className="mb-4">
                            <h3 className="text-xl font-semibold text-gray-800 mb-2">
                                ✨ Extracted Entities
                            </h3>
                            <p className="text-gray-600 text-sm">
                                The parser automatically identified {entities.length} entities from the session notes.
                                You can view, edit, merge duplicates, and export them to Obsidian format.
                            </p>
                        </div>
                        
                        <EntityViewer
                            entities={entities}
                            onEntityDiscard={handleEntityDiscard}
                            onEntityMerge={handleEntityMerge}
                            parsedData={demoData}
                        />
                    </div>
                </div>
            )}
        </div>
    );
};
