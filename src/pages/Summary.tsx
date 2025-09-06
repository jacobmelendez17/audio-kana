import React from 'react';
import { useQuiz } from '../store/quiz';

export const SummaryPage: React.FC<{ onRestart: () => void }> = ({ onRestart }) => {
	const { correct, wrong, history } = useQuiz();

	return (
		<div className="contianer">
			<h2 className="title center">Session summary</h2>

			<div className="card">
				<div className="card-body">
					<p>
						Correct: <strong>{correct}</strong>
					</p>
					<p>
						Wrong: <strong>{wrong}</strong>
					</p>
					<p>
						Total: <strong>{history.length}</strong>
					</p>
				</div>
			</div>

			<div className="footer-actions">
				<button className="btn" onClick={onRestart}>
					Back to setup
				</button>
			</div>
		</div>
	);
};
