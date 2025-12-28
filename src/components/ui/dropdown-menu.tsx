import React, { useState, useRef, useEffect } from 'react';
import { cn } from '../../utils/cn';

interface DropdownMenuProps {
    trigger: React.ReactNode;
    children: React.ReactNode;
    align?: 'left' | 'right';
}

export const DropdownMenu = ({ trigger, children, align = 'right' }: DropdownMenuProps) => {
    const [isOpen, setIsOpen] = useState(false);
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (ref.current && !ref.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <div className="relative inline-block text-left" ref={ref}>
            <div onClick={() => setIsOpen(!isOpen)}>
                {trigger}
            </div>
            {isOpen && (
                <div
                    className={cn(
                        "absolute z-10 mt-2 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg ring-1 ring-black dark:ring-gray-700 ring-opacity-5 dark:ring-opacity-100 focus:outline-none animate-in fade-in zoom-in-95 duration-100",
                        align === 'right' ? 'right-0' : 'left-0'
                    )}
                >
                    <div className="py-1" onClick={() => setIsOpen(false)}>
                        {children}
                    </div>
                </div>
            )}
        </div>
    );
};

export const DropdownItem = ({ children, onClick, className, destructive }: { children: React.ReactNode, onClick?: () => void, className?: string, destructive?: boolean }) => {
    return (
        <div
            className={cn(
                "block px-4 py-2 text-sm cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors",
                destructive ? "text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20" : "text-gray-700 dark:text-gray-200",
                className
            )}
            onClick={(e) => {
                e.stopPropagation();
                onClick?.();
            }}
        >
            {children}
        </div>
    );
};
