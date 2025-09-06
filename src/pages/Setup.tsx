import React, { useEffect } from 'react';
import { LevelToggle } from '../components/LevelToggle';
import { VocabGrid } from '../components/VocabGrid';
import { useSelection } from '../store/selection';
import { useQuiz } from '../store/quiz';
import type { VocabItem } from '../lib/wanikani';

export const SetupPage: React.FC<{ onStart: () => void }> = ({ onStart }) => {
	const { level, setLevel, loadLevel, vocab, selectedIds } = useSelection();
	const start = useQuiz((s) => s.start);

	useEffect(() => {
		loadLevel(level);
	}, [level, loadLevel]);

	const handleStart = () => {
		const items: VocabItem[] = vocab.filter((v) => selectedIds.has(v.id));
		if (!items.length) return;
		start(items);
		onStart();
	};

	return (
		<div className="container">
			<h2 className="title center">Choose your vocab</h2>
			<LevelToggle value={level} onChange={setLevel} />
			<VocabGrid />
			<div className="footer-actions">
				<button className="btn" onClick={handleStart}>
					Start quiz →
				</button>
			</div>
		</div>
	);
};
