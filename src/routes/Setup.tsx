import React, { useEffect } from 'react';
import { LevelToggle } from '../components/LevelToggle';
import { VocabGrid } from '../components/VocabGrid';
import { useSelection } from '../store/selection';
import { useQuiz } from '../store/quiz';
import type { VocabItem } from '../lib/wanikani';
import { Button } from '../components/Button';

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
		<div className="setup-page page-container">
			<h2 className="title center">Choose your vocab</h2>
			<LevelToggle value={level} onChange={setLevel} />
			<VocabGrid />
			<div className="footer-actions">
				<Button variant="fill" onClick={handleStart}>
					Start quiz →
				</Button>
			</div>
		</div>
	);
};
