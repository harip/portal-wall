'use client';

import React, { useState, useEffect } from 'react';
import { Play, Pause, SkipForward, SkipBack, Volume2, Radio } from 'lucide-react';

interface Station {
    id: string;
    name: string;
    url: string;
    category: string;
    color: string;
}

import { useRadioStore } from './store';

const stations: Station[] = [
    { id: 'lofi', name: 'Lofi Girl', url: 'https://www.youtube.com/embed/jfKfPfyJRdk?autoplay=1&controls=0', category: 'Focus', color: 'from-purple-500 to-pink-500' },
    { id: 'synth', name: 'Synthwave', url: 'https://www.youtube.com/embed/4xDzrJKXOOY?autoplay=1&controls=0', category: 'Vibe', color: 'from-cyan-500 to-blue-500' },
    { id: 'jazz', name: 'Coffee Jazz', url: 'https://www.youtube.com/embed/FjqI62b2Z4w?autoplay=1&controls=0', category: 'Relax', color: 'from-amber-700 to-yellow-600' },
    { id: 'classical', name: 'Classical', url: 'https://www.youtube.com/embed/OpqgMyXF89c?autoplay=1&controls=0', category: 'Study', color: 'from-slate-600 to-slate-400' },
];

export default function RadioApp() {
    const { currentStationId, setStation, hydrated, setHydrated } = useRadioStore();
    const [isPlaying, setIsPlaying] = useState(false);

    // Hydrate store on mount
    useEffect(() => {
        if (!hydrated) {
            setHydrated();
        }
    }, [hydrated, setHydrated]);

    const currentStation = stations.find(s => s.id === currentStationId) || stations[0];

    const togglePlay = () => {
        setIsPlaying(!isPlaying);
    };

    const changeStation = (station: Station) => {
        setStation(station.id);
        setIsPlaying(true);
    };

    if (!hydrated) return null; // Prevent flash of default state

    return (
        <div className="h-full flex flex-col bg-slate-900/90 text-white relative overflow-hidden">
            {/* Visualizer Background Effect */}
            <div
                className={`absolute inset-0 opacity-20 bg-gradient-to-br ${currentStation.color} blur-3xl transition-colors duration-1000`}
            />

            <div className="relative z-10 flex flex-col h-full">
                {/* Header */}
                <div className="p-6 text-center">
                    <div className="w-32 h-32 mx-auto rounded-full bg-gradient-to-br from-white/10 to-white/5 border-4 border-white/10 flex items-center justify-center mb-4 shadow-xl shadow-black/20 animate-[spin_10s_linear_infinite]" style={{ animationPlayState: isPlaying ? 'running' : 'paused' }}>
                        <Radio size={48} className="text-white/80" />
                    </div>
                    <h2 className="text-2xl font-bold tracking-tight">{currentStation.name}</h2>
                    <p className="text-white/50 text-sm font-medium uppercase tracking-widest mt-1">{currentStation.category}</p>
                </div>

                {/* Hidden Youtube Embed */}
                <div className="absolute opacity-0 pointer-events-none w-0 h-0 overflow-hidden">
                    {isPlaying && (
                        <iframe
                            width="560"
                            height="315"
                            src={currentStation.url}
                            title="YouTube video player"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        ></iframe>
                    )}
                </div>

                {/* Controls */}
                <div className="flex items-center justify-center gap-6 mb-8 mt-auto">
                    <button className="p-3 text-white/50 hover:text-white transition-colors" title="Previous (Mock)">
                        <SkipBack size={24} />
                    </button>
                    <button
                        onClick={togglePlay}
                        className="w-16 h-16 rounded-full bg-white text-slate-900 flex items-center justify-center hover:scale-105 transition-transform shadow-lg shadow-white/20"
                    >
                        {isPlaying ? <Pause size={28} fill="currentColor" /> : <Play size={28} fill="currentColor" className="ml-1" />}
                    </button>
                    <button className="p-3 text-white/50 hover:text-white transition-colors" title="Next (Mock)">
                        <SkipForward size={24} />
                    </button>
                </div>

                {/* Volume & Stations List */}
                <div className="bg-black/20 backdrop-blur-md border-t border-white/10 flex-1 overflow-y-auto">
                    <div className="p-4 space-y-2">
                        <h3 className="text-xs font-bold text-white/40 uppercase tracking-wider mb-2 px-2">Stations</h3>
                        {stations.map((station) => (
                            <button
                                key={station.id}
                                onClick={() => changeStation(station)}
                                className={`w-full flex items-center justify-between p-3 rounded-lg transition-all ${currentStation.id === station.id
                                    ? 'bg-white/10 text-white shadow-inner'
                                    : 'text-white/60 hover:bg-white/5 hover:text-white'
                                    }`}
                            >
                                <span className="font-medium">{station.name}</span>
                                {currentStation.id === station.id && isPlaying && (
                                    <div className="flex gap-0.5 items-end h-3">
                                        <div className="w-0.5 bg-green-400 h-2 animate-[pulse_0.5s_ease-in-out_infinite]" />
                                        <div className="w-0.5 bg-green-400 h-3 animate-[pulse_0.7s_ease-in-out_infinite]" />
                                        <div className="w-0.5 bg-green-400 h-1.5 animate-[pulse_0.4s_ease-in-out_infinite]" />
                                    </div>
                                )}
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
