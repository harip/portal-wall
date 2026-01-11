'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { ExternalLink, RotateCw, Bot, CircuitBoard } from 'lucide-react';
import { usePortalHeader } from '@/components/portal/PortalHeaderContext';

interface NewsItem {
    id: number;
    title: string;
    url: string;
    by: string;
    time: number;
    score: number;
}

const AI_KEYWORDS = [
    'AI', 'Artificial Intelligence', 'LLM', 'GPT', 'ChatGPT', 'OpenAI', 'Anthropic',
    'DeepMind', 'Nvidia', 'GPU', 'Transformer', 'Neural', 'Machine Learning', 'ML',
    'Deep Learning', 'Generative', 'Stable Diffusion', 'Midjourney', 'Llama', 'Mistral',
    'Insurance' // Added per specific request
];

export default function AIApp() {
    const [news, setNews] = useState<NewsItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [lastUpdated, setLastUpdated] = useState<Date>(new Date());
    const { setHeaderRight } = usePortalHeader();

    const fetchAINews = useCallback(async () => {
        setLoading(true);
        try {
            // Fetch top 100 stories to ensure we find enough AI related content
            const topStoriesRes = await fetch('https://hacker-news.firebaseio.com/v0/topstories.json?print=pretty');
            const topStoriesIds = await topStoriesRes.json();
            const candidateIds = topStoriesIds.slice(0, 100);

            const storyPromises = candidateIds.map((id: number) =>
                fetch(`https://hacker-news.firebaseio.com/v0/item/${id}.json?print=pretty`).then((res) => res.json())
            );

            const stories = await Promise.all(storyPromises);

            // Filter for AI keywords in title
            const aiStories = stories.filter((story: any) => {
                if (!story || !story.title) return false;
                const title = story.title.toLowerCase();
                return AI_KEYWORDS.some(keyword => {
                    // Simple word boundary check or just raw includes
                    return title.includes(keyword.toLowerCase());
                });
            }).slice(0, 20); // Keep top 20

            setNews(aiStories);
            setLastUpdated(new Date());
        } catch (error) {
            console.error('Error fetching AI news:', error);
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

        // Cleanup on unmount
        return () => setHeaderRight(null);
    }, [setHeaderRight, lastUpdated, loading, fetchAINews]);

    return (
        <div className="h-full flex flex-col bg-slate-900/50 text-white">
            <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar">
                {loading && news.length === 0 ? (
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
                        <p className="text-sm">No trending AI news found right now.</p>
                        <p className="text-xs mt-1">Try refreshing later.</p>
                    </div>
                ) : (
                    news.map((item) => (
                        <div key={item.id} className="p-3 bg-white/5 hover:bg-white/10 rounded-lg transition-colors border border-white/5 group">
                            <a
                                href={item.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="font-medium text-slate-200 hover:text-cyan-400 visited:text-slate-400 block mb-1"
                            >
                                {item.title}
                            </a>
                            <div className="flex items-center gap-3 text-xs text-slate-500">
                                <span className="flex items-center gap-1">
                                    <Bot size={12} className="text-cyan-500/70" />
                                    {item.score}
                                </span>
                                <span>by {item.by}</span>
                                <span className="flex items-center gap-1">
                                    <ExternalLink size={10} />
                                    {item.url ? new URL(item.url).hostname.replace('www.', '') : 'news.ycombinator.com'}
                                </span>
                            </div>
                        </div>
                    ))
                )}
            </div>

            <div className="p-3 bg-slate-900/80 text-center text-[10px] text-slate-600 border-t border-white/5 flex items-center justify-center gap-2">
                <CircuitBoard size={12} />
                <span>Curated from Hacker News</span>
            </div>
        </div>
    );
}
