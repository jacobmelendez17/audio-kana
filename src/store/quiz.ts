// src/store/quiz.ts
import { create } from 'zustand';
import type { VocabItem } from '../lib/wanikani';

/** ---------- Utils ---------- **/

/** Fisher–Yates shuffle (pure) */
function shuffle<T>(arr: T[]): T[] {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = (Math.random() * (i + 1)) | 0;
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/** Normalize text for comparison */
function norm(s: string) {
  return s
    .trim()
    .toLowerCase()
    .replace(/[.,/#!$%^&*;:{}=\-_`~()"]/g, '')
    .replace(/\s+/g, ' ');
}

/** Gather acceptable English answers from a (possibly varied) vocab shape */
function getEnglishAnswers(item: any): string[] {
  const out: string[] = [];

  // WaniKani-like meanings array (strings or { meaning: string })
  if (Array.isArray(item?.meanings)) {
    for (const m of item.meanings) {
      if (typeof m === 'string') out.push(m);
      else if (m && typeof m.meaning === 'string') out.push(m.meaning);
    }
  }

  // Common single-string fields
  if (typeof item?.meaning === 'string') out.push(item.meaning);
  if (typeof item?.en === 'string') out.push(item.en);
  if (typeof item?.english === 'string') out.push(item.english);
  if (typeof item?.primaryMeaning === 'string') out.push(item.primaryMeaning);

  // Optional synonyms
  if (Array.isArray(item?.synonyms)) {
    for (const s of item.synonyms) if (typeof s === 'string') out.push(s);
  }

  // Deduplicate (after normalization)
  const seen = new Set<string>();
  const dedup: string[] = [];
  for (const a of out) {
    const key = norm(a);
    if (!key || seen.has(key)) continue;
    seen.add(key);
    dedup.push(a);
  }
  return dedup;
}

/** Best-effort JP surface for feedback */
function getJP(item: any): string {
  return (
    item?.characters ??
    item?.jp ??
    item?.kana ??
    item?.readingsHiragana?.[0] ??
    item?.readingsKatakana?.[0] ??
    ''
  );
}

/** ---------- Store Types ---------- **/

type SubmitResult = {
  ok: boolean;
  correctAnswer: string; // EN (primary)
  jp: string;            // JP for inline feedback
};

type QuizState = {
  items: VocabItem[];
  index: number;
  finished: boolean;

  start: (items: VocabItem[]) => void;
  current: () => VocabItem | undefined;
  submit: (value: string) => SubmitResult; // PURE: no advancing
  next: () => void;                         // ONLY place that advances
};

/** ---------- Store ---------- **/

export const useQuiz = create<QuizState>((set, get) => ({
  items: [],
  index: 0,
  finished: false,

  /** Start a round: shuffle once (no repeats), reset pointers */
  start: (items) =>
    set({
      items: shuffle(items),
      index: 0,
      finished: false
    }),

  /** Current item or undefined if finished */
  current: () => {
    const { items, index, finished } = get();
    if (finished) return undefined;
    return items[index];
  },

  /** Check answer; do NOT advance here */
  submit: (value: string): SubmitResult => {
    const cur = get().current();
    if (!cur) return { ok: false, correctAnswer: '', jp: '' };

    const accepted = getEnglishAnswers(cur);
    const ok = accepted.some((a) => norm(a) === norm(value));
    const primaryEN = accepted[0] ?? '';
    const jp = getJP(cur);

    return { ok, correctAnswer: primaryEN, jp };
  },

  /** Advance to next, or mark finished if at the end */
  next: () => {
    const { index, items } = get();
    const last = index >= items.length - 1;
    if (last) set({ finished: true });
    else set({ index: index + 1 });
  }
}));
