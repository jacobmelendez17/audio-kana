// src/lib/wanikani.ts
import ky from "ky";

const TOKEN = import.meta.env.VITE_WANIKANI_API_TOKEN as string;

const api = ky.create({
  prefixUrl: "https://api.wanikani.com/v2",
  headers: { Authorization: `Bearer ${TOKEN}` },
});

// ---------- Types ----------
export type WKMeaning = { meaning: string; primary: boolean; accepted_answer?: boolean };
export type WKReading = { reading: string; primary: boolean };
export type WKAudio = { url: string; content_type: string; metadata: { gender: string } };

export type WKSubject = {
  id: number;
  object: "vocabulary" | "kana_vocabulary";
  data: {
    characters: string;
    meanings: WKMeaning[];
    readings?: WKReading[];
    pronunciation_audios: WKAudio[];
    level: number;
  };
};

export type VocabItem = {
  id: number;
  level: number;
  characters: string;
  readingsHiragana: string[];
  meanings: string[];
  audio: string[];
};

type WKCollection<T> = {
  data: T[];
  pages: { next_url: string | null };
};

// ---------- Helpers ----------
function toVocabItem(s: WKSubject): VocabItem | null {
  const audio: string[] =
    s.data.pronunciation_audios
      ?.filter((a) => a.content_type.includes("mpeg") || a.url.endsWith(".mp3"))
      .map((a) => a.url) ?? [];
  if (audio.length === 0) return null;

  const meanings: string[] = s.data.meanings?.map((m) => m.meaning) ?? [];
  if (meanings.length === 0) return null;

  const readingsHiragana: string[] =
    s.object === "kana_vocabulary"
      ? [s.data.characters]
      : (s.data.readings ?? []).map((r) => r.reading);

  return {
    id: s.id,
    level: s.data.level,
    characters: s.data.characters,
    meanings,
    readingsHiragana,
    audio,
  };
}

// ---------- Public API ----------
export async function fetchVocabForLevels(
  levels: number[],
  max = 500
): Promise<VocabItem[]> {
  const lv = levels.join(",");
  let next: string | null = `subjects?types=vocabulary,kana_vocabulary&levels=${lv}&per_page=100`;
  const out: VocabItem[] = [];

  while (next && out.length < max) {
    // EXPLICIT type annotation removes the “res implicitly any” error
    const res: WKCollection<WKSubject> = await api.get(next).json<WKCollection<WKSubject>>();

    // Parameter 'x' implicitly any → give it a type guard
    const batch: VocabItem[] = res.data
      .map(toVocabItem)
      .filter((x: VocabItem | null): x is VocabItem => x !== null);

    out.push(...batch);

    next = res.pages.next_url
      ? res.pages.next_url.replace("https://api.wanikani.com/v2/", "")
      : null;
  }

  return out.slice(0, max);
}
