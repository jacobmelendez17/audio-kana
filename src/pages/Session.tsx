import React from 'react';
import { Quiz } from '../components/Quiz';

export const SessionPage: React.FC<{ onFinish: () => void }> = ({ onFinish }) => {
	return <Quiz onFinish={onFinish} />;
};
