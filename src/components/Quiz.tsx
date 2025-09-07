import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useQuiz } from '../store/quiz';
import { AudioButton } from './AudioButton';
import { Button } from './Button';

type Result = { open: boolean; ok: boolean; message: string };

export const Quiz: React.FC<{ onFinish?: () => void }> = ({ onFinish }) => {
	const current = useQuiz((s) => s.current());
	const finished = useQuiz((s) => s.finished);
	const submitAnswer = useQuiz((s) => s.submit);
	const next = useQuiz((s) => s.next);

	const [value, setValue] = useState('');
	const [result, setResult] = useState<Result>({ open: false, ok: false, message: '' });

	// Single reusable audio element (fixes Safari quirks and avoids creating many <audio> nodes)
	const audioRef = useRef<HTMLAudioElement | null>(null);
	const hasUserInteractedRef = useRef(false);

	// Create one <audio> element on mount
	useEffect(() => {
		const a = document.createElement('audio');
		a.preload = 'auto';
		audioRef.current = a;

		return () => {
			try {
				a.pause();
				a.src = '';
				a.load();
			} catch {}
			audioRef.current = null;
		};
	}, []);

	// Play current item’s audio (safe across browsers)
	const playCurrent = useCallback(() => {
		const url = current?.audio?.[0];
		const a = audioRef.current;
		if (!url || !a) return;

		try {
			a.pause();
			if (a.src !== url) a.src = url;
			a.currentTime = 0;
			const p = a.play();
			// Ignore autoplay rejections (e.g., Safari before any user gesture)
			if (p && typeof p.then === 'function') p.catch(() => {});
		} catch {
			/* no-op */
		}
	}, [current]);

	// Reset UI when the quiz item changes; attempt an autoplay (will no-op if blocked)
	useEffect(() => {
		setValue('');
		setResult({ open: false, ok: false, message: '' });
		playCurrent();
	}, [playCurrent]);

	// Navigate away when finished
	useEffect(() => {
		if (finished && onFinish) onFinish();
	}, [finished, onFinish]);

	if (!current) {
		return finished ? (
			<div className="center muted">Done! 🎉</div>
		) : (
			<div className="center muted">Loading…</div>
		);
	}

	const handleSubmit = () => {
		if (!value.trim()) return;
		const { ok, correctAnswer } = submitAnswer(value);
		setResult({
			open: true,
			ok,
			message: ok ? '✓ Correct!' : `Answer: ${correctAnswer}`
		});
	};

	const closeAndNext = () => {
		setResult((r) => ({ ...r, open: false }));
		setValue('');
		next();
	};

	// Allow Enter to submit OR go next if modal is open
	const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
		if (e.key !== 'Enter') return;
		if (result.open) closeAndNext();
		else handleSubmit();
	};

	const showHint = () => {
		const hint = current.readingsHiragana[0] ?? '';
		setResult({ open: true, ok: false, message: `Hint: ${hint}` });
	};

	return (
		<div className="card-body center flex-col gap-4">
			<AudioButton
				onPlay={() => {
					hasUserInteractedRef.current = true;
					playCurrent();
				}}
			/>

			<input
				className="input large"
				placeholder="Type the English meaning…"
				value={value}
				onChange={(e) => setValue(e.target.value)}
				onKeyDown={handleKeyDown}
				autoFocus
			/>

			<div className="session-actions">
				<Button variant="outline" onClick={showHint}>
					Hint
				</Button>
				<Button onClick={handleSubmit}>Enter</Button>
			</div>

			<div className="muted small">Press Enter to submit. Click ▶︎ to replay audio.</div>

			{result.open && (
				<div className="modal-backdrop" onClick={closeAndNext}>
					<div className="modal" onClick={(e) => e.stopPropagation()}>
						<div className={result.ok ? 'correct' : 'wrong'} style={{ marginBottom: 8 }}>
							{result.message}
						</div>
						<Button onClick={closeAndNext}>Next →</Button>
					</div>
				</div>
			)}
		</div>
	);
};
