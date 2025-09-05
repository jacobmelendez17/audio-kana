import { create } from "zustand";
import type { VocabItem } from "../lib/wanikani";

type QuizItem = VocabItem & { attempts: number };

type State = {
    queue: QuizItem[];
    idx: number;
    finished: boolean;
    correct: number;
    wrong: number;
    history: { id: number; ok: boolean }[];
    start: (items: VocabItem[]) => void;
    current: () => QuizItem | null;
    submit: (answer: string) => { ok: boolean; correctAnswer: string; kanaHint: string };
    next: () => void;
};

function normalize(s: string) {
    return s.trim().toLowerCase();
}

export const useQuiz = create<State>((set, get) => ({
    queue: [],
    idx: 0,
    finished: false,
    correct: 0,
    wrong: 0,
    history: [],

    start: (items) => {
        const queue = items.map((i) => ({ ...i, attempts: 0 }));
        set({
            queue,
            idx: 0,
            finished: false,
            correct: 0,
            wrong: 0,
            history: [],
        });
    },

    current: () => {
        const { queue, idx } = get();
        return queue[idx] ?? null;
    },

    submit: (answer) => {
        const cur = get().current();
        if (!cur) return { ok: true, correctAnswer: "", kanaHint: "" };

        const english = cur.meanings.map(normalize);
        const ok = english.includes(normalize(answer));

        let { queue, idx, correct, wrong, history } = get();
        history = [...history, { id: cur.id, ok }];

        if (!ok) {
            wrong += 1;
            queue[idx].attempts += 1;

            const item = queue[idx];
            queue = [...queue.slice(0, idx), ...queue.slice(idx + 1)];
            const insertAt = Math.min(idx + 3, queue.length);
            queue.splice(insertAt, 0, item);
        } else {
            correct += 1;
            queue = [...queue.slice(0, idx), ...queue.slice(idx + 1)];
        }

        const finished = queue.length === 0;
        set({
            queue,
            idx: Math.min(idx, queue.length - 1),
            correct,
            wrong,
            history,
            finished,
        });

        return {
            ok,
            correctAnswer: cur.meanings[0],
            kanaHint: cur.readingsHiragana[0] ?? "",
        };
    },

    next: () => {
        const { queue, idx } = get();
        if (idx + 1 < queue.length) set({ idx: idx + 1 });
    },
}));