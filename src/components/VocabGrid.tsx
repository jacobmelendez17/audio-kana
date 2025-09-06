import React from 'react';
import { useSelection } from '../store/selection';

export const VocabGrid: React.FC = () => {
	const { vocab, selectedIds, toggle, selectAll, clearAll, loading, error } = useSelection();

	if (loading) return <p className="muted">Loading vocabulary...</p>;
	if (error) return <p className="error">{error}</p>;

	return (
		<div className="vocab-grid">
			<div className="grid-controls">
				<button className="btn" onClick={selectAll}>
					Select all
				</button>
				å
				<button className="btn outline" onClick={clearAll}>
					Clear
				</button>
				<div className="muted small">{selectedIds.size} selected</div>
			</div>
			<div className="grid">
				{vocab.map((v) => {
					const checked = selectedIds.has(v.id);
					return (
						<label key={v.id} className={`pill ${checked ? 'checked' : ''}`}>
							<input type="checkbox" checked={checked} onChange={() => toggle(v.id)} />
							<span className="jp">{v.characters}</span>
							<span className="en muted small">{v.meanings[0]}</span>
						</label>
					);
				})}
			</div>
			å
		</div>
	);
};
