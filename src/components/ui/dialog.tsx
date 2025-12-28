import React, { useEffect } from 'react';

import { cn } from '../../utils/cn';

interface DialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    children: React.ReactNode;
}

export const Dialog = ({ open, onOpenChange, children }: DialogProps) => {
    useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onOpenChange(false);
        };
        if (open) {
            document.addEventListener('keydown', handleEscape);
            document.body.style.overflow = 'hidden';
        }
        return () => {
            document.removeEventListener('keydown', handleEscape);
            document.body.style.overflow = 'unset';
        };
    }, [open, onOpenChange]);

    if (!open) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div
                className="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
                onClick={() => onOpenChange(false)}
            />
            {children}
        </div>
    );
};

export const DialogContent = ({ children, className }: { children: React.ReactNode; className?: string }) => (
    <div className={cn("relative bg-white dark:bg-gray-800 rounded-xl shadow-xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95 duration-200 z-50", className)}>
        {children}
    </div>
);

export const DialogHeader = ({ children }: { children: React.ReactNode }) => (
    <div className="px-6 py-4 border-b dark:border-gray-700">
        {children}
    </div>
);

export const DialogTitle = ({ children }: { children: React.ReactNode }) => (
    <h3 className="font-semibold text-lg leading-none tracking-tight">
        {children}
    </h3>
);

export const DialogFooter = ({ children }: { children: React.ReactNode }) => (
    <div className="px-6 py-4 bg-gray-50 dark:bg-gray-900 flex items-center justify-end gap-2">
        {children}
    </div>
);
