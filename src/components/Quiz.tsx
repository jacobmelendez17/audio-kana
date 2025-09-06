import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useQuiz } from '../store/quiz';
import { AudioButton } from './AudioButton';

export const Quiz: React.FC<{ onFinish?: () => void }> = ({ onFinish }) => {
	const current = useQuiz((s) => s.current());
	const finished = useQuiz((s) => s.finished);
	const submitAnswer = useQuiz((s) => s.submit);
	const next = useQuiz((s) => s.next);

	const [value, setValue] = useState('');
	const [feedback, setFeedback] = useState<{ ok: Boolean; msg: string } | null>(null);
	const audioRef = useRef<HTMLAudioElement | null>(null);

	const audioUrl = useMemo(() => current?.audio?.[0], [current]);

	useEffect(() => {
		setValue('');
		setFeedback(null);
		if (!audioUrl) return;
		const audio = new Audio(audioUrl);
		audioRef.current = audio;
		audio.play().catch(() => {});
	}, [audioUrl]);

	useEffect(() => {
		if (finished && onFinish) onFinish();
	}, [finished, onFinish]);

	if (!current) {
		return finished ? (
			<div className="center muted">Done!</div>
		) : (
			<div className="center muted">Loading...</div>
		);
	}

	const handleSubmit = () => {
		if (!value.trim()) return;
		const { ok, correctAnswer } = submitAnswer(value);
		if (ok) {
			setFeedback({ ok: true, msg: 'Correct' });
			setValue('');
			// next();
			setTimeout(() => next(), 200);
		} else {
			setFeedback({ ok: false, msg: `Answer: ${correctAnswer}` });
		}
	};

	const handleHint = () => {
		const hint = current.readingsHiragana[0] ?? '';
		setFeedback({ ok: false, msg: `Hint: ${hint}` });
	};

	return (
		<div className="quiz-container">
			<div className="card">
				<div className="card-body center flex-col gap-5">
					<AudioButton src={audioUrl} label="Play audio" />

					<input
						className="input large"
						placeholder="Type the English meaning..."
						value={value}
						onChange={(e) => setValue(e.target.value)}
						onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
						autoFocus
					/>

					<div className="row gap-3">
						<button className="btn outline" onClick={handleHint}>
							Hint
						</button>
						<button className="btn" onClick={handleSubmit}>
							Enter
						</button>
					</div>

					{feedback && (
						<div className={`status ${feedback.ok ? 'correct' : 'wrong'}`}>{feedback.msg}</div>
					)}

					<div className="muted small">Press Enter to submit. Click "Play audio" to replay.</div>
				</div>
			</div>
		</div>
	);
};
