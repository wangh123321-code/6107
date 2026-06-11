import { useMemo } from 'react';
import {
  Radar,
  RadarChart as RechartsRadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
} from 'recharts';
import { useRacketStore } from '@/store/useRacketStore';

interface DataItem {
  subject: string;
  value: number;
  fullMark: number;
}

export default function RadarChart() {
  const params = useRacketStore((s) => s.params);

  const data = useMemo<DataItem[]>(() => [
    { subject: '速度', value: params.speed, fullMark: 100 },
    { subject: '旋转', value: params.spin, fullMark: 100 },
    { subject: '控制', value: params.control, fullMark: 100 },
    { subject: '弹性', value: params.elasticity, fullMark: 100 },
    { subject: '重量', value: Math.min(100, Math.max(0, (params.weight - 150) * 2 + 50)), fullMark: 100 },
    { subject: '硬度', value: Math.min(100, Math.max(0, ((params.hardness - 30) / 20) * 100)), fullMark: 100 },
  ], [params]);

  return (
    <div className="w-full h-64">
      <ResponsiveContainer width="100%" height="100%">
        <RechartsRadarChart
          cx="50%"
          cy="50%"
          outerRadius="75%"
          data={data}
          margin={{ top: 10, right: 10, bottom: 10, left: 10 }}
        >
          <defs>
            <linearGradient id="radarGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#ff6b35" stopOpacity={0.5} />
              <stop offset="100%" stopColor="#ff4500" stopOpacity={0.3} />
            </linearGradient>
            <filter id="glow">
              <feGaussianBlur stdDeviation="2" result="coloredBlur" />
              <feMerge>
                <feMergeNode in="coloredBlur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>
          <PolarGrid
            stroke="rgba(255,255,255,0.1)"
            strokeWidth={1}
          />
          <PolarAngleAxis
            dataKey="subject"
            tick={{
              fill: '#9ca3af',
              fontSize: 12,
              fontWeight: 500,
            }}
          />
          <PolarRadiusAxis
            angle={30}
            domain={[0, 100]}
            tick={{ fill: 'rgba(255,255,255,0.2)', fontSize: 10 }}
            tickCount={5}
            axisLine={false}
          />
          <Radar
            name="参数"
            dataKey="value"
            stroke="#ff6b35"
            strokeWidth={2}
            fill="url(#radarGradient)"
            fillOpacity={0.8}
            filter="url(#glow)"
            isAnimationActive={true}
            animationDuration={200}
            animationEasing="ease-out"
          />
        </RechartsRadarChart>
      </ResponsiveContainer>
    </div>
  );
}
