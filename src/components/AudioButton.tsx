import React from 'react';

export const AudioButton: React.FC<{ onPlay: () => void; disabled?: boolean }> = ({
	onPlay,
	disabled
}) => {
	return (
		<button className="btn primary" aria-label="Play audio" onClick={onPlay} disabled={disabled}>
			▶︎ Play audio
		</button>
	);
};
