import React from 'react';

type Tab = 'speak' | 'listen';
type Language = 'Japanese' | 'Korean';

export const Header: React.FC<{
	activeTab: Tab;
	onTabChange: (tab: Tab) => void;
	language: Language;
	onLanguageChange: (lang: Language) => void;
}> = ({ activeTab, onTabChange, language, onLanguageChange }) => {
	return (
		<header
			className="header"
			style={{
				position: 'sticky',
				top: 0,
				zIndex: 10,
				backdropFilter: 'saturate(180%) blur(8px)',
				background: 'color-mix(in oklab, var(--background-color) 90%, white)',
				borderBottom: '1px solid var(--background-contrast)'
			}}
		>
			<div
				className="header-inner"
				style={{
					maxWidth: 'var(--page-max, 1100px)',
					margin: '0 auto',
					padding: '12px 16px',
					display: 'flex',
					alignItems: 'center',
					justifyContent: 'space-between',
					gap: 12
				}}
			>
				{/* Brand / Title */}
				<div style={{ fontWeight: 800, letterSpacing: 0.2, color: 'var(--text-color)' }}>
					Dashboard
				</div>

				{/* Tabs */}
				<nav aria-label="Primary" style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
					{(
						[
							{ key: 'speak', label: 'Speak' },
							{ key: 'listen', label: 'Listen' }
						] as const
					).map(({ key, label }) => {
						const isActive = activeTab === key;
						return (
							<button
								key={key}
								onClick={() => onTabChange(key)}
								className="tab-btn"
								style={{
									padding: '8px 14px',
									borderRadius: 999,
									border: '1px solid var(--background-contrast)',
									background: isActive
										? 'var(--accent-color)'
										: 'var(--form-element-background, white)',
									color: isActive
										? 'var(--text-color-on-accent-color, white)'
										: 'var(--text-color)',
									fontWeight: 600,
									cursor: 'pointer'
								}}
							>
								{label}
							</button>
						);
					})}
				</nav>

				{/* Language dropdown */}
				<div>
					<label
						htmlFor="language"
						style={{
							marginRight: 8,
							color: 'var(--text-color-light)',
							fontSize: 12,
							textTransform: 'uppercase',
							letterSpacing: 0.8
						}}
					>
						Language
					</label>
					<select
						id="language"
						value={language}
						onChange={(e) => onLanguageChange(e.target.value as Language)}
						style={{
							padding: '8px 12px',
							borderRadius: 10,
							border: '1px solid var(--background-contrast)',
							background: 'var(--form-element-background, white)',
							color: 'var(--text-color)',
							fontWeight: 600,
							cursor: 'pointer',
							minWidth: 140
						}}
					>
						<option value="Japanese">Japanese</option>
						<option value="Korean">Korean</option>
					</select>
				</div>
			</div>
		</header>
	);
};
