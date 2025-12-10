import React from 'react';
import { clsx } from 'clsx';

interface AvatarProps {
    src?: string;
    name?: string;
    size?: 'sm' | 'md' | 'lg';
    className?: string;
}

export const Avatar: React.FC<AvatarProps> = ({ src, name, size = 'md', className }) => {
    const initials = name
        ? name
            .split(' ')
            .map((n) => n[0])
            .slice(0, 2)
            .join('')
            .toUpperCase()
        : '??';

    const sizeClasses = {
        sm: 'h-6 w-6 text-xs',
        md: 'h-8 w-8 text-sm',
        lg: 'h-10 w-10 text-base',
    };

    return (
        <div
            className={clsx(
                'relative inline-flex items-center justify-center rounded-full bg-gray-200 text-gray-600 font-medium overflow-hidden ring-2 ring-white',
                sizeClasses[size],
                className
            )}
        >
            {src ? (
                <img src={src} alt={name || 'Avatar'} className="h-full w-full object-cover" />
            ) : (
                <span>{initials}</span>
            )}
        </div>
    );
};
