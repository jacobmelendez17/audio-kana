import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useQuiz } from '../store/quiz';
import { AudioButton } from './AudioButton';
import { Button } from './Button';

export const Quiz: React.FC<{ onFinish?: () => void }> = ({ onFinish }) => {
	const current = useQuiz((s) => s.current());
	const finished = useQuiz((s) => s.finished);
	const submitAnswer = useQuiz((s) => s.submit);
	const next = useQuiz((s) => s.next);

	const [value, setValue] = useState('');
	const [locked, setLocked] = useState(false);
	const [wasCorrect, setWasCorrect] = useState<boolean | null>(null);
	const [hint, setHint] = useState<string | null>(null);

	// Derived labels (fallbacks so we don't crash if fields vary)
	const jp =
		(current as any)?.characters ??
		(current as any)?.jp ??
		(current as any)?.readingsHiragana?.[0] ??
		(current as any)?.readingsKatakana?.[0] ??
		'';

	// New: grab first hiragana reading for feedback
	const hira: string =
		(current as any)?.readingsHiragana?.[0] ??
		(current as any)?.readings?.[0] ?? // in case your data names it this way
		'';

	// ====== Audio handling =====================================================
	const audioRef = useRef<HTMLAudioElement | null>(null);

	const playCurrent = useCallback(() => {
		if (!current?.audio?.[0]) return;
		if (audioRef.current) {
			audioRef.current.pause();
			audioRef.current.src = '';
			audioRef.current.load();
			audioRef.current = null;
		}
		const a = new Audio(current.audio[0]);
		audioRef.current = a;
		a.play().catch(() => {});
	}, [current]);

	// Autoplay when the card changes and reset UI
	useEffect(() => {
		setValue('');
		setLocked(false);
		setWasCorrect(null);
		setHint(null);
		playCurrent();

		return () => {
			if (audioRef.current) {
				audioRef.current.pause();
				audioRef.current.src = '';
				audioRef.current.load();
				audioRef.current = null;
			}
		};
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

	// ====== Submit / Next ======================================================
	const [correctionEN, setCorrectionEN] = useState<string>('');

	const handleSubmit = () => {
		if (!value.trim() || locked) return;
		const { ok, correctAnswer } = submitAnswer(value);
		setWasCorrect(ok);
		setCorrectionEN(String(correctAnswer ?? ''));
		setLocked(true); // Gate progression until Next/Enter
	};

	const gotoNext = () => {
		if (!locked) return;
		setLocked(false);
		setWasCorrect(null);
		setValue('');
		setHint(null);
		next(); // advancing triggers the effect to (re)play audio
	};

	// Enter key on the input: submit or advance
	const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
		if (e.key !== 'Enter') return;
		e.preventDefault();
		e.stopPropagation(); // prevents this submit from reaching the window listener
		if (locked) gotoNext();
		else handleSubmit();
	};

	// NEW: global Enter hotkey so it works even when input is disabled/not focused
	useEffect(() => {
		const onDocKeyDown = (e: KeyboardEvent) => {
			if (e.key === 'Enter' && locked) {
				e.preventDefault();
				gotoNext(); // only runs on a *second* press, after feedback is visible
			}
		};
		window.addEventListener('keydown', onDocKeyDown);
		return () => window.removeEventListener('keydown', onDocKeyDown);
	}, [locked]);

	const onHint = () => {
		const h = (current as any)?.readingsHiragana?.[0] ?? '';
		if (h) setHint(h);
	};

	// ====== Styles for inline feedback (no modal) ==============================
	const feedbackStyleBase: React.CSSProperties = {
		width: '100%',
		maxWidth: 540,
		borderRadius: 14,
		padding: 12,
		textAlign: 'center',
		fontWeight: 600
	};
	const correctStyle: React.CSSProperties = {
		...feedbackStyleBase,
		border: '2px solid #4ade80',
		background: '#f0fdf4',
		color: '#166534'
	};
	const wrongStyle: React.CSSProperties = {
		...feedbackStyleBase,
		border: '2px solid #f87171',
		background: '#fef2f2',
		color: '#991b1b'
	};
	const jpStyle: React.CSSProperties = { fontSize: '1.4rem', marginTop: 4, fontWeight: 800 };
	const hiraStyle: React.CSSProperties = { fontSize: '1.05rem', marginTop: 2, opacity: 0.9 };
	const enStyle: React.CSSProperties = { fontSize: '1rem', marginTop: 2, opacity: 0.9 };

	// ====== Render =============================================================
	return (
		<div className="card-body center flex-col gap-4">
			{/* Feedback ABOVE the audio button */}
			{wasCorrect !== null && (
				<div style={wasCorrect ? correctStyle : wrongStyle} aria-live="polite">
					<div style={{ opacity: 0.8, fontSize: '0.95rem' }}>
						{wasCorrect ? 'Correct' : 'Incorrect'}
					</div>

					{/* JP always shown */}
					<div style={jpStyle}>{jp}</div>

					{/* When wrong, show hiragana (if present) and EN meaning */}
					{!wasCorrect && hira && <div style={hiraStyle}>{hira}</div>}
					{!wasCorrect && correctionEN && <div style={enStyle}>{correctionEN}</div>}
				</div>
			)}

			{/* Audio button */}
			<AudioButton onPlay={playCurrent} />

			{/* Input */}
			<input
				className="input large"
				placeholder="Type the English meaning…"
				value={value}
				onChange={(e) => setValue(e.target.value)}
				onKeyDown={handleKeyDown}
				disabled={locked}
				autoFocus
			/>

			{/* Actions */}
			<div className="session-actions">
				<Button variant="outline" onClick={onHint} disabled={locked}>
					Hint
				</Button>

				{!locked ? (
					<Button onClick={handleSubmit}>Enter</Button>
				) : (
					<Button onClick={gotoNext}>Enter / Next →</Button>
				)}
			</div>

			<div className="muted small">
				{!locked
					? 'Press Enter to submit. Click ▶︎ to replay audio.'
					: 'Press Enter to continue (hotkey enabled).'}
			</div>

			{/* Inline hint (non-blocking) */}
			{hint && !locked && (
				<div className="muted small" style={{ marginTop: -6 }}>
					Hint: {hint}
				</div>
			)}
		</div>
	);
};
