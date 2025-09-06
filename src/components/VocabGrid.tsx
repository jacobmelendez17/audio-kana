import React from 'react';
import { useSelection } from '../store/selection';

export const VocabGrid: React.FC = () => {
	const { vocab, selectedIds, toggle, selectAll, clearAll, loading, error } = useSelection();

	if (loading) return <p className="muted">Loading vocabulary...</p>;
	if (error) return <p className="error">{error}</p>;

	return (
		// src/components/VocabGrid.tsx (inside the return)
		<div className="vocab-grid">
			<div className="grid-controls">
				<button className="button outline" onClick={selectAll}>
					<div className="effect">Select all</div>
				</button>
				<button className="button outline" onClick={clearAll}>
					<div className="effect">Clear</div>
				</button>
				<div className="muted small">{selectedIds.size} selected</div>
			</div>

			{/* Optional column headers (fake) */}
			{/* <div className="muted" style={{margin:"4px 0"}}>Select all</div> */}

			<div className="grid">
				{vocab.map((v) => {
					const checked = selectedIds.has(v.id);
					return (
						<label key={v.id} className={`pill ${checked ? 'checked' : ''}`}>
							<input type="checkbox" checked={checked} onChange={() => toggle(v.id)} />
							<span className="jp">{v.characters}</span>
							<span className="en">{v.meanings[0]}</span>
						</label>
					);
				})}
			</div>
		</div>
	);
};
