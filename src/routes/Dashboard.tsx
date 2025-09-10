import React from 'react';

export const Dashboard: React.FC = () => {
	return (
		<main
			style={{
				maxWidth: 'var(--page-max, 1100px)',
				margin: '0 auto',
				padding: '24px 16px'
			}}
		>
			{/* Placeholder for future widgets/content */}
			<div
				style={{
					border: '1px dashed var(--background-contrast)',
					borderRadius: 16,
					padding: 24,
					color: 'var(--text-color-light)'
				}}
			>
				Dashboard content coming soon…
			</div>
		</main>
	);
};
