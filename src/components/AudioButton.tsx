import React, { useRef } from 'react';

type Props = {
	src: string | undefined;
	label?: string;
};

export const AutioButton: React.FC<Props> = ({ src, label = 'Play' }) => {
	const audioRef = useRef<HTMLAudioElement | null>(null);

	const play = async () => {
		if (!src) return;
		const audio = new Audio(src);
		audioRef.current = audio;
		try {
			await audio.play();
		} catch {
			// ignore autoplay errors
		}
	};

	return (
		<button
			className="btn primary"
			aria-label={label}
			onClick={play}
			disabled={!src}
			style={{ fontSize: '1.25rem', padding: '0.75rem 1.25rem' }}
		>
			▶︎ {label}
		</button>
	);
};
