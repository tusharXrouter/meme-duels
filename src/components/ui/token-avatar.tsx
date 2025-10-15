import { getTokenInitial } from '@/utils/token';
import React from 'react';

interface TokenAvatarProps {
	name: string;
	image?: string;
	size?: 'sm' | 'md' | 'lg';
	className?: string;
}

const sizeClasses = {
	sm: 'w-8 h-8',
	md: 'w-10 h-10',
	lg: 'w-12 h-12',
};

export const TokenAvatar: React.FC<TokenAvatarProps> = ({
	name,
	image,
	size = 'md',
	className = '',
}) => {
	console.log("🚀 ~ TokenAvatar ~ image:", image)
	return (
		<div
			className={`${sizeClasses[size]} rounded-full border-2 border-white overflow-hidden bg-white flex items-center justify-center ${className}`}
		>
			{image ? (
				<img
					src={image}
					alt={name}
					className="w-full h-full object-cover"
					onError={(e) => {
						console.log("🚀 ~ TokenAvatar ~ e:", e)
						e.currentTarget.style.display = 'none';
						e.currentTarget.nextElementSibling?.classList.remove('hidden');
					}}
				/>
			) : null}
			<span
				className={`text-gray-800 font-bold ${
					size === 'sm' ? 'text-xs' : 'text-sm'
				} ${image ? 'hidden' : ''}`}
			>
				{getTokenInitial(name)}
			</span>
		</div>
	);
};
