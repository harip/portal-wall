'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { ExternalLink, RotateCw, Bot, CircuitBoard, Code2, Shield, Brain } from 'lucide-react';
import { usePortalHeader } from '@/components/portal/PortalHeaderContext';

interface NewsItem {
    id: string;
    title: string;
    url: string;
    author: string;
    points: number;
    created_at_i: number;
    category?: 'models' | 'ide' | 'insurance';
}

export default function AIApp() {
    const [news, setNews] = useState<NewsItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [lastUpdated, setLastUpdated] = useState<Date>(new Date());
    const { setHeaderRight } = usePortalHeader();

    const fetchCategoryDocs = async (query: string, category: NewsItem['category'], hitsPerPage: number) => {
        // Fetch stories from the last 6 months to ensure broad coverage
        const timeWindow = Math.floor(Date.now() / 1000) - (180 * 24 * 60 * 60);
        // Using Algolia Search API (search_by_date for latest)
        const url = `https://hn.algolia.com/api/v1/search_by_date?query=${encodeURIComponent(query)}&tags=story&numericFilters=created_at_i>${timeWindow}&hitsPerPage=${hitsPerPage}`;

        try {
            const res = await fetch(url);
            if (!res.ok) throw new Error(`API returned ${res.status}`);
            const data = await res.json();
            return data.hits.map((hit: any) => ({
                id: hit.objectID,
                title: hit.title,
                url: hit.url,
                author: hit.author,
                points: hit.points,
                created_at_i: hit.created_at_i,
                category
            }));
        } catch (error) {
            console.error(`Error fetching ${category}:`, error);
            throw error;
        }
    };

    const fetchAINews = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            // Parallel fetch for the 3 categories
            // 1. Models & Agents
            const modelsQuery = '"AI model" OR "AI agent" OR "LLM agent" OR "Foundation model" OR "Large Language Model" OR "OpenAI" OR "Anthropic" OR "DeepMind"';

            // 2. AI IDEs
            const ideQuery = '"AI IDE" OR "AI code editor" OR "Cursor editor" OR "GitHub Copilot" OR "Windsurf IDE" OR "VS Code AI"';

            // 3. Insurance
            const insuranceQuery = 'insurance AND (AI OR "Generative AI" OR LLM)';

            // Fetch all, catching individual errors to allow partial success
            const [modelsData, ideData, insuranceData] = await Promise.all([
                fetchCategoryDocs(modelsQuery, 'models', 12).catch(e => { console.warn('Models fetch failed', e); return []; }),
                fetchCategoryDocs(ideQuery, 'ide', 8).catch(e => { console.warn('IDE fetch failed', e); return []; }),
                fetchCategoryDocs(insuranceQuery, 'insurance', 8).catch(e => { console.warn('Insurance fetch failed', e); return []; })
            ]);

            // Combine and deduplicate by ID
            const allItems = [...modelsData, ...ideData, ...insuranceData];

            if (allItems.length === 0) {
                // Try a very broad fallback search if everything else failed
                console.log("No specific results found, trying fallback...");
                const fallbackData = await fetchCategoryDocs('"AI"', 'models', 20).catch(e => []);
                allItems.push(...fallbackData);
            }

            const uniqueItems = Array.from(new Map(allItems.map(item => [item.id, item])).values());

            // Sort by date descending
            uniqueItems.sort((a, b) => b.created_at_i - a.created_at_i);

            setNews(uniqueItems);
            setLastUpdated(new Date());
        } catch (error: any) {
            console.error('Error fetching AI news:', error);
            setError(error.message || 'Failed to fetch news');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchAINews();
        // Auto-refresh every 5 minutes
        const interval = setInterval(fetchAINews, 300000);
        return () => clearInterval(interval);
    }, [fetchAINews]);

    // Update Header Right content
    useEffect(() => {
        setHeaderRight(
            <div className="flex items-center gap-3">
                <span className="text-[10px] text-white/40 font-mono hidden sm:inline-block">
                    Updated: {lastUpdated.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                </span>
                <button
                    onClick={fetchAINews}
                    disabled={loading}
                    className="p-1.5 hover:bg-white/10 rounded-lg text-white/60 hover:text-white transition-colors"
                    title="Refresh AI Feed"
                >
                    <RotateCw size={14} className={loading ? 'animate-spin' : ''} />
                </button>
            </div>
        );

        return () => setHeaderRight(null);
    }, [setHeaderRight, lastUpdated, loading, fetchAINews]);

    const getCategoryIcon = (category?: string) => {
        switch (category) {
            case 'ide': return <Code2 size={12} className="text-blue-400" />;
            case 'insurance': return <Shield size={12} className="text-emerald-400" />;
            default: return <Brain size={12} className="text-purple-400" />;
        }
    };

    const getCategoryLabel = (category?: string) => {
        switch (category) {
            case 'ide': return 'Dev Tools';
            case 'insurance': return 'Insurance';
            default: return 'Models & Agents';
        }
    };

    return (
        <div className="h-full flex flex-col bg-slate-900/50 text-white">
            <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar">
                {error ? (
                    <div className="flex flex-col items-center justify-center h-full text-red-400 p-4 text-center">
                        <Bot size={48} className="mb-4 opacity-50" />
                        <p className="font-medium">Error loading feed</p>
                        <p className="text-sm mt-2 opacity-80">{error}</p>
                        <button
                            onClick={fetchAINews}
                            className="mt-4 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-md text-sm text-white/80 transition-colors"
                        >
                            Try Again
                        </button>
                    </div>
                ) : loading && news.length === 0 ? (
                    <div className="space-y-4">
                        {[...Array(5)].map((_, i) => (
                            <div key={i} className="animate-pulse flex flex-col gap-2">
                                <div className="h-4 bg-white/10 rounded w-3/4"></div>
                                <div className="h-3 bg-white/5 rounded w-1/2"></div>
                            </div>
                        ))}
                    </div>
                ) : news.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full text-white/40">
                        <Bot size={48} className="mb-4 opacity-50" />
                        <p className="text-sm">No trending AI news found.</p>
                        <p className="text-xs mt-1">Try again later.</p>
                    </div>
                ) : (
                    news.map((item) => (
                        <div key={item.id} className="p-3 bg-white/5 hover:bg-white/10 rounded-lg transition-colors border border-white/5 group flex flex-col gap-2">
                            <div className="flex items-start justify-between gap-2">
                                <a
                                    href={item.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="font-medium text-slate-200 hover:text-cyan-400 visited:text-slate-400 leading-snug break-words"
                                >
                                    {item.title}
                                </a>
                                <div className="shrink-0">
                                    <div className={`text-[10px] px-1.5 py-0.5 rounded border border-white/10 flex items-center gap-1 bg-white/5 ${item.category === 'insurance' ? 'text-emerald-300' :
                                        item.category === 'ide' ? 'text-blue-300' : 'text-purple-300'
                                        }`}>
                                        {getCategoryIcon(item.category)}
                                        <span className="hidden sm:inline">{getCategoryLabel(item.category)}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center gap-3 text-xs text-slate-500">
                                <span className="flex items-center gap-1">
                                    <Bot size={12} className="text-cyan-500/70" />
                                    {item.points}
                                </span>
                                <span>by {item.author}</span>
                                <span className="flex items-center gap-1">
                                    <ExternalLink size={10} />
                                    {item.url ? new URL(item.url).hostname.replace('www.', '') : 'news.ycombinator.com'}
                                </span>
                                <span className="text-slate-600">•</span>
                                <span>{new Date(item.created_at_i * 1000).toLocaleDateString()}</span>
                            </div>
                        </div>
                    ))
                )}
            </div>

            <div className="p-3 bg-slate-900/80 text-center text-[10px] text-slate-600 border-t border-white/5 flex items-center justify-center gap-2">
                <CircuitBoard size={12} />
                <span>Curated from Hacker News (Algolia)</span>
            </div>
        </div>
    );
}
