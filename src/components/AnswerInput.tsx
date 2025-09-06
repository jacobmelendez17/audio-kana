import React, { useEffect, useRef, useState } from 'react';

type Props = {
	placeholder?: string;
	onSubmit: (value: string) => void;
	autoFocus?: boolean;
	disabled?: boolean;
};

export const AnswerInput: React.FC<Props> = ({
	placeholder = 'Type the English meaning...',
	onSubmit,
	autoFocus = true,
	disabled = false
}) => {
	const [value, setValue] = useState('');
	const ref = useRef<HTMLInputElement>(null);

	useEffect(() => {
		if (autoFocus) ref.current?.focus();
	}, [autoFocus]);

	const handleKey = (e: React.KeyboardEvent<HTMLInputElement>) => {
		if (e.key === 'Enter' && value.trim()) {
			onSubmit(value);
		}
	};

	return (
		<input
			ref={ref}
			className="input large"
			placeholder={placeholder}
			disabled={disabled}
			value={value}
			onChange={(e) => setValue(e.target.value)}
			onKeyDown={handleKey}
			autoCapitalize="none"
			autoCorrect="off"
			spellCheck={false}
		/>
	);
};
