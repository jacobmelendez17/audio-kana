import React from 'react';

type Variant = 'fill' | 'outline';

type CommonProps = {
	children: React.ReactNode;
	title?: string;
	disabled?: boolean;
	variant?: Variant; // Svelte used prop name "style" but that's reserved in React
	className?: string;
};

type ButtonProps = CommonProps &
	React.ButtonHTMLAttributes<HTMLButtonElement> & {
		href?: undefined;
		type?: 'button' | 'submit';
	};

type LinkProps = CommonProps &
	React.AnchorHTMLAttributes<HTMLAnchorElement> & {
		href: string;
		target?: React.HTMLAttributeAnchorTarget;
		rel?: string;
	};

export function Button(props: ButtonProps | LinkProps) {
	const { children, title, disabled = false, variant = 'fill', className, ...rest } = props as any;

	const classes =
		`button ${variant} ${disabled ? 'disabled' : ''}` + (className ? ` ${className}` : '');

	// Anchor version (like Svelte branch with {#if href})
	if ('href' in props && props.href) {
		const { href, target, rel, onClick, ...anchorRest } = rest as LinkProps;

		const handleClick: React.MouseEventHandler<HTMLAnchorElement> = (e) => {
			if (disabled) {
				e.preventDefault();
				e.stopPropagation();
				return;
			}
			onClick?.(e);
		};

		return (
			<a
				href={href}
				className={classes}
				aria-disabled={disabled || undefined}
				tabIndex={disabled ? -1 : undefined}
				target={target}
				rel={rel}
				title={title}
				onClick={handleClick}
				{...anchorRest}
			>
				<div className="effect">{children}</div>
			</a>
		);
	}

	// Button version
	const { type = 'button', onClick, ...buttonRest } = rest as ButtonProps;

	return (
		<button
			type={type}
			className={classes}
			title={title}
			disabled={disabled}
			onClick={onClick}
			{...buttonRest}
		>
			<div className="effect">{children}</div>
		</button>
	);
}
