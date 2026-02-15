'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { mockChampions } from '@/lib/mock/champions';
import { mockItems } from '@/lib/mock/items';
import { useBuilderStore } from '@/lib/stores/builderStore';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { X, Plus, ArrowLeft, Save } from 'lucide-react';
import Link from 'next/link';

const POSITIONS = ['TOP', 'JUNGLE', 'MIDDLE', 'BOTTOM', 'SUPPORT'];

export default function CreateBuildPage() {
    const store = useBuilderStore();
    const [showChampionPicker, setShowChampionPicker] = useState(false);
    const [showItemPicker, setShowItemPicker] = useState<'core' | 'situational' | null>(null);

    const selectedChampion = mockChampions.find((c) => c.id === store.championId);
    const coreItemData = store.coreItems.map((id) => mockItems.find((i) => i.id === id)).filter(Boolean);
    const _situationalItemData = store.situationalItems.map((id) => mockItems.find((i) => i.id === id)).filter(Boolean);

    return (
        <div className="space-y-6">
            <Link
                href="/builds"
                className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
                <ArrowLeft className="h-4 w-4" />
                Back to Builds
            </Link>

            <div className="flex items-center justify-between">
                <h1 className="text-xl font-bold font-[var(--font-outfit)]">Create Build</h1>
                <Button className="bg-gold text-navy hover:bg-gold/90 text-xs font-semibold gap-1.5">
                    <Save className="h-3.5 w-3.5" />
                    Save Build
                </Button>
            </div>

            <div className="grid gap-6 lg:grid-cols-3">
                {/* Build info */}
                <div className="space-y-4 lg:col-span-2">
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-sm">Build Details</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label className="text-xs">Build Name</Label>
                                <Input
                                    value={store.buildName}
                                    onChange={(e) => store.setBuildName(e.target.value)}
                                    placeholder="e.g. Crit ADC Jinx"
                                    className="bg-muted/50 text-sm"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label className="text-xs">Description</Label>
                                <Textarea
                                    value={store.description}
                                    onChange={(e) => store.setDescription(e.target.value)}
                                    placeholder="Describe your build strategy..."
                                    className="bg-muted/50 text-sm min-h-[80px]"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label className="text-xs">Position</Label>
                                <div className="flex gap-1.5">
                                    {POSITIONS.map((pos) => (
                                        <Badge
                                            key={pos}
                                            variant={store.position === pos ? 'default' : 'outline'}
                                            className={`cursor-pointer text-xs ${store.position === pos ? 'bg-gold text-navy' : ''
                                                }`}
                                            onClick={() => store.setPosition(pos)}
                                        >
                                            {pos}
                                        </Badge>
                                    ))}
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Champion Selection */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-sm">Champion</CardTitle>
                        </CardHeader>
                        <CardContent>
                            {selectedChampion ? (
                                <div className="flex items-center gap-3">
                                    <div className="relative h-12 w-12 overflow-hidden rounded-sm border border-gold/20">
                                        <Image src={selectedChampion.imageUrl} alt={selectedChampion.name} fill sizes="48px" className="object-cover" />
                                    </div>
                                    <span className="font-medium text-sm">{selectedChampion.name}</span>
                                    <Button variant="ghost" size="sm" onClick={() => store.setChampion(0)} className="ml-auto text-xs">Change</Button>
                                </div>
                            ) : (
                                <div>
                                    <Button variant="outline" size="sm" onClick={() => setShowChampionPicker(!showChampionPicker)} className="text-xs gap-1.5">
                                        <Plus className="h-3 w-3" />
                                        Select Champion
                                    </Button>
                                    {showChampionPicker && (
                                        <motion.div
                                            initial={{ opacity: 0, height: 0 }}
                                            animate={{ opacity: 1, height: 'auto' }}
                                            className="mt-3 grid grid-cols-6 gap-2 sm:grid-cols-8"
                                        >
                                            {mockChampions.map((c) => (
                                                <button
                                                    key={c.id}
                                                    onClick={() => { store.setChampion(c.id); setShowChampionPicker(false); }}
                                                    className="relative aspect-square overflow-hidden rounded-sm border border-border hover:border-gold/50 transition-colors"
                                                >
                                                    <Image src={c.imageUrl} alt={c.name} fill sizes="48px" className="object-cover" />
                                                </button>
                                            ))}
                                        </motion.div>
                                    )}
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Core Items */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-sm">Core Items ({store.coreItems.length}/6)</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="flex flex-wrap gap-3">
                                {coreItemData.map((item) =>
                                    item ? (
                                        <div key={item.id} className="relative">
                                            <div className="relative h-12 w-12 overflow-hidden rounded-sm border border-border">
                                                <Image src={item.imageUrl} alt={item.name} fill sizes="48px" className="object-cover" />
                                            </div>
                                            <button
                                                onClick={() => store.removeCoreItem(item.id)}
                                                className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-destructive text-white text-[10px]"
                                            >
                                                <X className="h-2.5 w-2.5" />
                                            </button>
                                        </div>
                                    ) : null
                                )}
                                {store.coreItems.length < 6 && (
                                    <Button
                                        variant="outline"
                                        className="h-12 w-12 p-0"
                                        onClick={() => setShowItemPicker(showItemPicker === 'core' ? null : 'core')}
                                    >
                                        <Plus className="h-4 w-4" />
                                    </Button>
                                )}
                            </div>
                            {showItemPicker === 'core' && (
                                <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: 'auto' }}
                                    className="mt-3 grid grid-cols-6 gap-2 sm:grid-cols-8"
                                >
                                    {mockItems
                                        .filter((i) => !store.coreItems.includes(i.id))
                                        .map((item) => (
                                            <button
                                                key={item.id}
                                                onClick={() => { store.addCoreItem(item.id); setShowItemPicker(null); }}
                                                className="relative aspect-square overflow-hidden rounded-sm border border-border hover:border-gold/50 transition-colors"
                                            >
                                                <Image src={item.imageUrl} alt={item.name} fill sizes="48px" className="object-cover" />
                                            </button>
                                        ))}
                                </motion.div>
                            )}
                        </CardContent>
                    </Card>
                </div>

                {/* Preview */}
                <div>
                    <Card className="sticky top-20">
                        <CardHeader>
                            <CardTitle className="text-sm">Preview</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            <p className="text-sm font-semibold">
                                {store.buildName || 'Untitled Build'}
                            </p>
                            <p className="text-xs text-muted-foreground line-clamp-2">
                                {store.description || 'No description'}
                            </p>
                            <Badge variant="outline" className="text-xs">{store.position}</Badge>
                            {selectedChampion && (
                                <div className="flex items-center gap-2 mt-2">
                                    <div className="relative h-6 w-6 overflow-hidden rounded-sm">
                                        <Image src={selectedChampion.imageUrl} alt={selectedChampion.name} fill sizes="24px" className="object-cover" />
                                    </div>
                                    <span className="text-xs">{selectedChampion.name}</span>
                                </div>
                            )}
                            <div className="flex gap-1.5 mt-2">
                                {coreItemData.map((item) =>
                                    item ? (
                                        <div key={item.id} className="relative h-8 w-8 overflow-hidden rounded-sm border border-border/50">
                                            <Image src={item.imageUrl} alt={item.name} fill sizes="32px" className="object-cover" />
                                        </div>
                                    ) : null
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
