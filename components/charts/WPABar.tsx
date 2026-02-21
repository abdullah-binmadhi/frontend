import React from 'react';

interface WPABarProps {
    wpa: number;
    maxWpa?: number;
    segments?: number;
}

export function WPABar({ wpa, maxWpa = 3.0, segments = 10 }: WPABarProps) {
    const isPositive = wpa >= 0;
    const absWpa = Math.abs(wpa);

    // Calculate how many segments should be filled based on the wpa value vs the max expected WPA
    const fillPercentage = Math.min((absWpa / maxWpa) * 100, 100);
    const filledSegmentsCount = Math.round((fillPercentage / 100) * segments);

    // Choose colors based on positive/negative
    const colorClass = isPositive ? 'bg-cyan-400' : 'bg-red-400';
    const emptyClass = 'bg-muted border border-border/40';

    return (
        <div className="flex items-center gap-3">
            <div className="flex items-center gap-[2px]">
                {/* Visual marker separating left/right if wanted, or just a leading bar */}
                <div className="h-4 w-1 rounded-sm bg-border/80 mr-1" />

                {Array.from({ length: segments }).map((_, i) => (
                    <div
                        key={i}
                        className={`h-3 w-2.5 rounded-[1px] ${i < filledSegmentsCount ? colorClass : emptyClass
                            }`}
                    />
                ))}
            </div>

            <div className={`text-sm font-semibold w-12 text-right ${isPositive ? 'text-cyan-400' : 'text-red-400'}`}>
                {isPositive ? '+' : ''}{wpa.toFixed(2)}
            </div>
        </div>
    );
}
