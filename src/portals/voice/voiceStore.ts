import { openDB, IDBPDatabase } from 'idb';
import { create } from 'zustand';

export interface Recording {
    id: string;
    blob: Blob;
    duration: number;
    timestamp: number;
}

interface VoiceStore {
    recordings: Omit<Recording, 'blob'>[];
    loading: boolean;
    initialized: boolean;
    init: () => Promise<void>;
    addRecording: (blob: Blob, duration: number) => Promise<void>;
    deleteRecording: (id: string) => Promise<void>;
    getBlob: (id: string) => Promise<Blob | undefined>;
}

const DB_NAME = 'voice-memos-db';
const STORE_NAME = 'recordings';

let dbPromise: Promise<IDBPDatabase> | null = null;

const getDB = () => {
    if (!dbPromise) {
        dbPromise = openDB(DB_NAME, 1, {
            upgrade(db) {
                if (!db.objectStoreNames.contains(STORE_NAME)) {
                    db.createObjectStore(STORE_NAME, { keyPath: 'id' });
                }
            },
        });
    }
    return dbPromise;
};

export const useVoiceStore = create<VoiceStore>((set, get) => ({
    recordings: [],
    loading: false,
    initialized: false,

    init: async () => {
        if (get().initialized) return;
        set({ loading: true });
        try {
            const db = await getDB();
            const allRecordings = await db.getAll(STORE_NAME);
            // We don't want to keep blobs in Zustand state to avoid memory issues
            const metadataOnly = allRecordings.map(({ blob, ...rest }) => rest);
            set({
                recordings: metadataOnly.sort((a, b) => b.timestamp - a.timestamp),
                initialized: true
            });
        } catch (error) {
            console.error('Failed to init voice store:', error);
        } finally {
            set({ loading: false });
        }
    },

    addRecording: async (blob, duration) => {
        const id = crypto.randomUUID();
        const timestamp = Date.now();
        const recording = { id, blob, duration, timestamp };

        try {
            const db = await getDB();
            await db.add(STORE_NAME, recording);

            const { blob: _, ...metadata } = recording;
            set((state) => ({
                recordings: [metadata, ...state.recordings]
            }));
        } catch (error) {
            console.error('Failed to add recording:', error);
        }
    },

    deleteRecording: async (id) => {
        try {
            const db = await getDB();
            await db.delete(STORE_NAME, id);
            set((state) => ({
                recordings: state.recordings.filter((r) => r.id !== id)
            }));
        } catch (error) {
            console.error('Failed to delete recording:', error);
        }
    },

    getBlob: async (id) => {
        try {
            const db = await getDB();
            const recording = await db.get(STORE_NAME, id);
            return recording?.blob;
        } catch (error) {
            console.error('Failed to get blob:', error);
            return undefined;
        }
    },
}));
