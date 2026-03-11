import { useState, useEffect } from 'react';

/**
 * Custom hook to animate a numeric value from 0 to a target number
 * 
 * @param end - The target number to count up to
 * @param duration - Animation duration in milliseconds
 * @returns The current count value
 */
export function useCountUp(end: string | number, duration: number = 2000) {
    // Extract numeric value if string (e.g., "1,200+" -> 1200)
    const numericTarget = typeof end === 'string' 
        ? parseInt(end.replace(/[^0-9]/g, '')) 
        : end;
    
    const [count, setCount] = useState(0);

    useEffect(() => {
        if (isNaN(numericTarget) || numericTarget <= 0) {
            return;
        }

        let startTime: number | null = null;
        let animationFrameId: number;

        const animate = (timestamp: number) => {
            if (!startTime) startTime = timestamp;
            const progress = Math.min((timestamp - startTime) / duration, 1);
            
            // Ease out quad function
            const easeOutProgress = 1 - (1 - progress) * (1 - progress);
            
            setCount(Math.floor(easeOutProgress * numericTarget));

            if (progress < 1) {
                animationFrameId = window.requestAnimationFrame(animate);
            }
        };

        animationFrameId = window.requestAnimationFrame(animate);

        return () => window.cancelAnimationFrame(animationFrameId);
    }, [numericTarget, duration]);

    // Format the number back if it was a string with suffixes
    if (typeof end === 'string') {
        const suffix = end.replace(/[0-9,]/g, '');
        const hasComma = end.includes(',');
        
        let formatted = count.toString();
        if (hasComma) {
            formatted = new Intl.NumberFormat('ar-EG').format(count);
        }
        
        return `${formatted}${suffix}`;
    }

    return count;
}
