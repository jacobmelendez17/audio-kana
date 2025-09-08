// src/routes/Session.tsx
import React from 'react';
import { Quiz } from '../components/Quiz';

export const SessionPage: React.FC<{
	onFinish: () => void;
	onBack: () => void;
}> = ({ onFinish, onBack }) => {
	return (
		<div className="session-page">
			<div className="session-card card">
				<Quiz onFinish={onFinish} onBack={onBack} /> {/* 👈 pass through */}
			</div>
		</div>
	);
};
