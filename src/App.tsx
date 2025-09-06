import { useState } from 'react';
import { SetupPage } from './pages/Setup';
import { SessionPage } from './pages/Session';
import { SummaryPage } from './pages/Summary';

type Step = 'setup' | 'session' | 'summary';

export default function App() {
	const [step, setStep] = useState<Step>('setup');

	return (
		<div className="app container">
			<header className="header center">
				<h1 className="logo">Audio Kana</h1>
			</header>

			<main className="content">
				{step === 'setup' && <SetupPage onStart={() => setStep('session')} />}
				{step === 'session' && <SessionPage onFinish={() => setStep('summary')} />}
				{step === 'summary' && <SummaryPage onRestart={() => setStep('setup')} />}
			</main>
		</div>
	);
}
