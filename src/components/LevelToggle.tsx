import React from 'react';

type Props = {
	value: number;
	onChange: (lv: number) => void;
};

export const LevelToggle: React.FC<Props> = ({ value, onChange }) => {
	return (
		<div className="level-toggle">
			<div className="label">WaniKani Level</div>
			<div className="chip-row">
				{Array.from({ length: 60 }, (_, i) => i + 1).map((lv) => (
					<button
						key={lv}
						className={`chip ${value === lv ? 'active' : ''}`}
						onClick={() => onChange(lv)}
					>
						{lv}
					</button>
				))}
			</div>
		</div>
	);
};
