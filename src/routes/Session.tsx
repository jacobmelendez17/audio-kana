import React from 'react';
import { Quiz } from '../components/Quiz';

export const SessionPage: React.FC<{ onFinish: () => void }> = ({ onFinish }) => {
	return (
		<div className="session-page">
			<div className="session-card card">
				<Quiz onFinish={onFinish} />
			</div>
		</div>
	);
};
