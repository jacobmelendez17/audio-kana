import { useState } from 'react';
import { SetupPage } from './routes/Setup';
import { SessionPage } from './routes/Session';
import { SummaryPage } from './routes/Summary';

type Step = 'setup' | 'session' | 'summary';
type Tab = 'speak' | 'listen';
type Language = 'Japanese' | 'Korean';

export default function App() {
	const [step, setStep] = useState<Step>('setup');
	const [activeTab, setActiveTab] = useState<Tab>('speak');
	const [language, setLanguage] = useState<Language>('Japanese');

	return (
		<div className="app container">
			{/* Top Header */}
			<header
				className="header"
				style={{
					display: 'flex',
					justifyContent: 'space-between',
					alignItems: 'center',
					margin: '20px 0 16px',
					width: '100%'
				}}
			>
				<div style={{ fontWeight: 800, fontSize: '1.3rem', color: 'var(--text-color)' }}>
					Audio Kana
				</div>

				<nav style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
					{(['speak', 'listen'] as const).map((key) => {
						const isActive = activeTab === key;
						return (
							<button
								key={key}
								onClick={() => setActiveTab(key)}
								style={{
									padding: '6px 14px',
									borderRadius: 'var(--standard-border-radius)',
									border: '2px solid var(--background-contrast)',
									background: isActive ? 'var(--accent-color)' : 'var(--form-element-background)',
									color: isActive ? 'var(--text-color-on-accent-color)' : 'var(--text-color)',
									fontWeight: 600,
									cursor: 'pointer'
								}}
							>
								{key === 'speak' ? 'Speak' : 'Listen'}
							</button>
						);
					})}

					<select
						value={language}
						onChange={(e) => setLanguage(e.target.value as Language)}
						style={{
							padding: '6px 12px',
							borderRadius: 'var(--standard-border-radius)',
							border: '2px solid var(--background-contrast)',
							background: 'var(--form-element-background)',
							color: 'var(--text-color)',
							fontWeight: 600,
							cursor: 'pointer'
						}}
					>
						<option value="Japanese">Japanese</option>
						<option value="Korean">Korean</option>
					</select>
				</nav>
			</header>

			{/* Existing Pages */}
			<main className="content">
				{step === 'setup' && <SetupPage onStart={() => setStep('session')} />}
				{step === 'session' && (
					<SessionPage onFinish={() => setStep('summary')} onBack={() => setStep('setup')} />
				)}
				{step === 'summary' && <SummaryPage onRestart={() => setStep('setup')} />}
			</main>
		</div>
	);
}
