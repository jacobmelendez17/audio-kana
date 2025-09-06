import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useQuiz } from '../store/quiz';
import { AudioButton } from './AudioButton';

type Result = { open: boolean; ok: boolean; message: string };

export const Quiz: React.FC<{ onFinish?: () => void }> = ({ onFinish }) => {
	const current = useQuiz((s) => s.current());
	const finished = useQuiz((s) => s.finished);
	const submitAnswer = useQuiz((s) => s.submit);
	const next = useQuiz((s) => s.next);

	const [value, setValue] = useState('');
	const [result, setResult] = useState<Result>({ open: false, ok: false, message: '' });
	const audioRef = useRef<HTMLAudioElement | null>(null);

	// Play helper that always stops previous audio first
	const playCurrent = useCallback(() => {
		if (!current?.audio?.[0]) return;
		// stop previous if any
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

	// Autoplay when the card changes
	useEffect(() => {
		setValue('');
		setResult({ open: false, ok: false, message: '' });
		playCurrent();
		return () => {
			// cleanup on unmount/change
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

	const handleSubmit = () => {
		if (!value.trim()) return;
		const { ok, correctAnswer } = submitAnswer(value);
		setResult({
			open: true,
			ok,
			message: ok ? '✓ Correct!' : `Answer: ${correctAnswer}`
		});
		// Do NOT call next() here; user will click Next or press Enter while modal is open
	};

	const closeAndNext = () => {
		setResult((r) => ({ ...r, open: false }));
		setValue('');
		next(); // now advance
		// audio for next item will be handled by the useEffect above
	};

	// Allow Enter to submit OR to go next if modal open
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
		<div className="quiz-container">
			<div className="card">
				<div className="card-body center flex-col gap-4">
					<AudioButton onPlay={playCurrent} />

					<input
						className="input large"
						placeholder="Type the English meaning…"
						value={value}
						onChange={(e) => setValue(e.target.value)}
						onKeyDown={handleKeyDown}
						autoFocus
					/>

					<div className="row gap-3">
						<button className="btn outline" onClick={showHint}>
							Hint
						</button>
						<button className="btn" onClick={handleSubmit}>
							Enter
						</button>
					</div>

					<div className="muted small">Press Enter to submit. Click ▶︎ to replay audio.</div>
				</div>
			</div>

			{/* Modal */}
			{result.open && (
				<div className="modal-backdrop" onClick={closeAndNext}>
					<div className="modal" onClick={(e) => e.stopPropagation()}>
						<div className={result.ok ? 'correct' : 'wrong'} style={{ marginBottom: 8 }}>
							{result.message}
						</div>
						<button className="btn" onClick={closeAndNext}>
							Next →
						</button>
					</div>
				</div>
			)}
		</div>
	);
};
