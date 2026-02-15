'use client';

import {
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
    ReferenceLine,
    Area,
    AreaChart,
} from 'recharts';

interface TimelinePoint {
    gameTime: number;
    winProbability100: number;
    winProbability200: number;
}

interface WinProbChartProps {
    timeline: TimelinePoint[];
}

const mockTimeline: TimelinePoint[] = Array.from({ length: 40 }, (_, i) => {
    const t = i * 60;
    const base = 50 + Math.sin(i * 0.3) * 15 + (Math.random() - 0.5) * 8;
    return {
        gameTime: t,
        winProbability100: Math.min(95, Math.max(5, base)),
        winProbability200: Math.min(95, Math.max(5, 100 - base)),
    };
});

export function WinProbChart({ timeline }: WinProbChartProps) {
    const data = (timeline.length > 0 ? timeline : mockTimeline).map((p) => ({
        time: Math.floor(p.gameTime / 60),
        team100: Number((p.winProbability100).toFixed(1)),
        team200: Number((p.winProbability200).toFixed(1)),
    }));

    return (
        <div className="rounded-sm border border-border bg-card p-4">
            <h3 className="mb-4 text-sm font-semibold">Win Probability Timeline</h3>
            <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={data}>
                    <defs>
                        <linearGradient id="blueGrad" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#0AC8B9" stopOpacity={0.3} />
                            <stop offset="95%" stopColor="#0AC8B9" stopOpacity={0} />
                        </linearGradient>
                        <linearGradient id="redGrad" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#FF4654" stopOpacity={0.3} />
                            <stop offset="95%" stopColor="#FF4654" stopOpacity={0} />
                        </linearGradient>
                    </defs>
                    <XAxis
                        dataKey="time"
                        tick={{ fill: '#8B95A5', fontSize: 11 }}
                        tickLine={false}
                        axisLine={{ stroke: 'rgba(200, 170, 110, 0.15)' }}
                        label={{ value: 'Minutes', position: 'insideBottom', offset: -5, fill: '#8B95A5', fontSize: 11 }}
                    />
                    <YAxis
                        domain={[0, 100]}
                        tick={{ fill: '#8B95A5', fontSize: 11 }}
                        tickLine={false}
                        axisLine={{ stroke: 'rgba(200, 170, 110, 0.15)' }}
                        label={{ value: 'Win %', angle: -90, position: 'insideLeft', fill: '#8B95A5', fontSize: 11 }}
                    />
                    <ReferenceLine y={50} stroke="rgba(200, 170, 110, 0.2)" strokeDasharray="4 4" />
                    <Tooltip
                        contentStyle={{
                            background: '#0F1629',
                            border: '1px solid rgba(200, 170, 110, 0.2)',
                            borderRadius: '4px',
                            fontSize: '12px',
                        }}
                        labelFormatter={(v) => `${v} min`}
                    />
                    <Area
                        type="monotone"
                        dataKey="team100"
                        stroke="#0AC8B9"
                        strokeWidth={2}
                        fill="url(#blueGrad)"
                        name="Blue Team"
                    />
                    <Area
                        type="monotone"
                        dataKey="team200"
                        stroke="#FF4654"
                        strokeWidth={2}
                        fill="url(#redGrad)"
                        name="Red Team"
                    />
                </AreaChart>
            </ResponsiveContainer>
        </div>
    );
}
