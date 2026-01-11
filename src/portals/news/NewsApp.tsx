'use client';

import React, { useState, useEffect } from 'react';
import { ExternalLink, RefreshCw } from 'lucide-react';

interface NewsItem {
    id: number;
    title: string;
    url: string;
    by: string;
    time: number;
    score: number;
}

export default function NewsApp() {
    const [news, setNews] = useState<NewsItem[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchNews = async () => {
        setLoading(true);
        try {
            const topStoriesRes = await fetch('https://hacker-news.firebaseio.com/v0/topstories.json?print=pretty');
            const topStoriesIds = await topStoriesRes.json();
            const top10Ids = topStoriesIds.slice(0, 20);

            const newsPromises = top10Ids.map((id: number) =>
                fetch(`https://hacker-news.firebaseio.com/v0/item/${id}.json?print=pretty`).then((res) => res.json())
            );

            const newsItems = await Promise.all(newsPromises);
            setNews(newsItems);
        } catch (error) {
            console.error('Error fetching news:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchNews();
    }, []);

    return (
        <div className="h-full flex flex-col bg-slate-900/50 text-white">
            <div className="flex justify-between items-center p-4 border-b border-white/10">
                <h2 className="font-semibold text-lg flex items-center gap-2">
                    <span className="text-orange-500">Y</span> Hacker News
                </h2>
                <button
                    onClick={fetchNews}
                    className="p-2 hover:bg-white/10 rounded-full transition-colors"
                    disabled={loading}
                >
                    <RefreshCw size={18} className={loading ? 'animate-spin' : ''} />
                </button>
            </div>

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
                ) : (
                    news.map((item) => (
                        <div key={item.id} className="p-3 bg-white/5 hover:bg-white/10 rounded-lg transition-colors border border-white/5">
                            <a
                                href={item.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="font-medium text-slate-200 hover:text-blue-400 visited:text-slate-400 block mb-1"
                            >
                                {item.title}
                            </a>
                            <div className="flex items-center gap-3 text-xs text-slate-500">
                                <span>{item.score} points</span>
                                <span>by {item.by}</span>
                                <span className="flex items-center gap-1">
                                    <ExternalLink size={10} />
                                    {new URL(item.url || 'https://news.ycombinator.com').hostname.replace('www.', '')}
                                </span>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
