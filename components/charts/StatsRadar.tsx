'use client';

import {
    RadarChart,
    PolarGrid,
    PolarAngleAxis,
    PolarRadiusAxis,
    Radar,
    ResponsiveContainer,
} from 'recharts';

interface StatPoint {
    stat: string;
    value: number;
    fullMark: number;
}

interface StatsRadarProps {
    data: StatPoint[];
    color?: string;
}

export function StatsRadar({ data, color = '#C8AA6E' }: StatsRadarProps) {
    return (
        <div className="rounded-sm border border-border bg-card p-4">
            <h3 className="mb-4 text-sm font-semibold">Stat Distribution</h3>
            <ResponsiveContainer width="100%" height={400}>
                <RadarChart cx="50%" cy="50%" outerRadius="70%" data={data}>
                    <PolarGrid stroke="rgba(200, 170, 110, 0.15)" />
                    <PolarAngleAxis
                        dataKey="stat"
                        tick={{ fill: '#8B95A5', fontSize: 11 }}
                    />
                    <PolarRadiusAxis
                        tick={{ fill: '#8B95A5', fontSize: 9 }}
                        axisLine={false}
                    />
                    <Radar
                        name="Stats"
                        dataKey="value"
                        stroke={color}
                        fill={color}
                        fillOpacity={0.2}
                        strokeWidth={2}
                    />
                </RadarChart>
            </ResponsiveContainer>
        </div>
    );
}
