'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Mic, Square, Play, Trash2, StopCircle, Clock, Calendar, Download } from 'lucide-react';
import { useVoiceStore } from './voiceStore';
import { motion, AnimatePresence } from 'framer-motion';
import { format } from 'date-fns';

export default function VoiceApp() {
    const { recordings, init, addRecording, deleteRecording, getBlob, loading } = useVoiceStore();
    const [isRecording, setIsRecording] = useState(false);
    const [recordingTime, setRecordingTime] = useState(0);
    const [playingId, setPlayingId] = useState<string | null>(null);

    const mediaRecorderRef = useRef<MediaRecorder | null>(null);
    const chunksRef = useRef<Blob[]>([]);
    const timerRef = useRef<NodeJS.Timeout | null>(null);
    const audioRef = useRef<HTMLAudioElement | null>(null);

    useEffect(() => {
        init();
    }, [init]);

    const startRecording = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            const mediaRecorder = new MediaRecorder(stream);
            mediaRecorderRef.current = mediaRecorder;
            chunksRef.current = [];

            mediaRecorder.ondataavailable = (e) => {
                if (e.data.size > 0) {
                    chunksRef.current.push(e.data);
                }
            };

            mediaRecorder.onstop = async () => {
                const blob = new Blob(chunksRef.current, { type: 'audio/webm' });
                await addRecording(blob, recordingTime);
                stream.getTracks().forEach(track => track.stop());
                setRecordingTime(0);
            };

            mediaRecorder.start();
            setIsRecording(true);

            setRecordingTime(0);
            timerRef.current = setInterval(() => {
                setRecordingTime(prev => prev + 1);
            }, 1000);

        } catch (err) {
            console.error('Failed to start recording:', err);
            alert('Could not access microphone');
        }
    };

    const stopRecording = () => {
        if (mediaRecorderRef.current && isRecording) {
            mediaRecorderRef.current.stop();
            setIsRecording(false);
            if (timerRef.current) clearInterval(timerRef.current);
        }
    };

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    const playRecording = async (id: string) => {
        if (playingId === id) {
            audioRef.current?.pause();
            setPlayingId(null);
            return;
        }

        const blob = await getBlob(id);
        if (blob) {
            const url = URL.createObjectURL(blob);
            if (audioRef.current) {
                audioRef.current.src = url;
                audioRef.current.play();
                setPlayingId(id);
                audioRef.current.onended = () => {
                    setPlayingId(null);
                    URL.revokeObjectURL(url);
                };
            }
        }
    };

    return (
        <div className="flex flex-col h-full bg-slate-900/50 text-white font-sans overflow-hidden">
            {/* Recording Controls */}
            <div className="p-6 border-b border-white/10 bg-white/5 flex flex-col items-center gap-4">
                <div className="flex items-center gap-6">
                    <motion.button
                        whileTap={{ scale: 0.95 }}
                        onClick={isRecording ? stopRecording : startRecording}
                        className={`w-14 h-14 rounded-full flex items-center justify-center transition-all ${isRecording
                                ? 'bg-red-500 shadow-lg shadow-red-500/40 ring-4 ring-red-500/20'
                                : 'bg-white/10 hover:bg-white/20'
                            }`}
                    >
                        {isRecording ? (
                            <StopCircle size={28} className="text-white" />
                        ) : (
                            <Mic size={28} className="text-white/80" />
                        )}

                        {/* Minimalist Pulsing Ring */}
                        {isRecording && (
                            <motion.div
                                initial={{ scale: 1, opacity: 0.5 }}
                                animate={{ scale: 1.5, opacity: 0 }}
                                transition={{ duration: 1.5, repeat: Infinity }}
                                className="absolute w-14 h-14 rounded-full bg-red-500 -z-10"
                            />
                        )}
                    </motion.button>

                    <div className="flex flex-col justify-center">
                        <span className={`text-2xl font-mono ${isRecording ? 'text-red-400' : 'text-white/40'}`}>
                            {formatTime(recordingTime)}
                        </span>
                        <span className="text-[10px] uppercase tracking-wider text-white/30 font-medium">
                            {isRecording ? 'Recording...' : 'Tap Mic to Start'}
                        </span>
                    </div>
                </div>
            </div>

            {/* Recordings List */}
            <div className="flex-1 overflow-y-auto custom-scrollbar p-2">
                <audio ref={audioRef} className="hidden" />

                <AnimatePresence initial={false}>
                    {recordings.length === 0 ? (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="h-full flex flex-col items-center justify-center opacity-30 gap-3"
                        >
                            <Mic size={40} />
                            <p className="text-sm">No recordings yet</p>
                        </motion.div>
                    ) : (
                        <div className="space-y-2">
                            {recordings.map((recording) => (
                                <motion.div
                                    key={recording.id}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    className="group flex items-center justify-between p-3 bg-white/5 hover:bg-white/10 rounded-xl border border-white/5 transition-all"
                                >
                                    <div className="flex items-center gap-3">
                                        <button
                                            onClick={() => playRecording(recording.id)}
                                            className={`w-10 h-10 rounded-lg flex items-center justify-center transition-colors ${playingId === recording.id
                                                    ? 'bg-orange-500/20 text-orange-400'
                                                    : 'bg-white/5 text-white/60 hover:text-white hover:bg-white/10'
                                                }`}
                                        >
                                            {playingId === recording.id ? <StopCircle size={18} /> : <Play size={18} />}
                                        </button>

                                        <div className="flex flex-col">
                                            <span className="text-sm font-medium text-white/90">
                                                Memo {format(recording.timestamp, 'HH:mm:ss')}
                                            </span>
                                            <div className="flex items-center gap-2 text-[10px] text-white/40">
                                                <span className="flex items-center gap-1">
                                                    <Calendar size={10} />
                                                    {format(recording.timestamp, 'MMM d, yyyy')}
                                                </span>
                                                <span>•</span>
                                                <span className="flex items-center gap-1">
                                                    <Clock size={10} />
                                                    {formatTime(recording.duration)}
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button
                                            onClick={() => deleteRecording(recording.id)}
                                            className="p-2 text-white/20 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-all"
                                            title="Delete recording"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    )}
                </AnimatePresence>
            </div>

            {/* Footer Info */}
            <div className="px-4 py-2 border-t border-white/5 bg-slate-900/80 text-[10px] text-white/20 flex justify-between items-center">
                <span>Stored locally in browser</span>
                <span>{recordings.length} items</span>
            </div>
        </div>
    );
}
