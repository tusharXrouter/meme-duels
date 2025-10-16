import { Check, Copy } from 'lucide-react';
import { useState } from 'react';
import { useCopyToClipboard } from 'usehooks-ts';
import { Button, type ButtonProps } from './button';

interface CopyButtonProps extends ButtonProps {
	textToCopy: string | undefined;
	children?: React.ReactNode;
}

const CopyButton: React.FC<CopyButtonProps> = ({
	textToCopy,
	children,
	disabled,
	...props
}) => {
	const [copied, setCopied] = useState(false);
	const [, copy] = useCopyToClipboard();

	const handleCopy = async (e: React.MouseEvent) => {
		e.preventDefault();
		e.stopPropagation();
		if (!textToCopy || disabled) {
			console.error('No text to copy or button is disabled');
			return;
		}
		const success = await copy(textToCopy);
		if (success) {
			setCopied(true);
			setTimeout(() => setCopied(false), 2000); // Show tick for 2 seconds
		}
	};

	return (
		<Button
			variant="ghost"
			size="icon"
			className="h-6 w-6"
			onClick={handleCopy}
			disabled={disabled}
			{...props}
		>
			{copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
			{children}
		</Button>
	);
};

export default CopyButton;
