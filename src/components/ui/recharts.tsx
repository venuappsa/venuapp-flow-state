
"use client"

import React from "react"
import {
  Bar,
  BarChart as RechartsBarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart as RechartsLineChart,
  Pie,
  PieChart as RechartsPieChart,
  ResponsiveContainer,
  Sector,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts"
import { cn } from "@/lib/utils"
import { ChartContainer, ChartTooltipContent, ChartLegendContent } from "./chart"

interface BaseChartProps {
  data: any[]
  index: string
  className?: string
  startEndOnly?: boolean
  tickGap?: number
  showXAxis?: boolean
  showYAxis?: boolean
  showGrid?: boolean
  showTooltip?: boolean
  showLegend?: boolean
  showGridLines?: boolean
  xAxisFormatter?: (value: string) => string
}

interface LineChartProps extends BaseChartProps {
  categories: string[]
  colors?: string[]
  valueFormatter?: (value: number) => string
  areaOpacity?: number
}

export function LineChart({
  data,
  index,
  categories,
  colors = ["#2563eb", "#f59e0b", "#10b981"],
  valueFormatter = (value: number) => String(value),
  className,
  showXAxis = false,
  showYAxis = false,
  showTooltip = true,
  showLegend = true,
  showGridLines = false,
  startEndOnly = false,
  tickGap = 10,
  xAxisFormatter = (value) => value,
  areaOpacity = 0.2,
}: LineChartProps) {
  const chartConfig = React.useMemo(() => {
    return categories.reduce<Record<string, { color: string }>>(
      (acc, category, idx) => {
        acc[category] = {
          color: colors[idx % colors.length],
        }
        return acc
      },
      {}
    )
  }, [categories, colors])

  return (
    <ChartContainer className={className} config={chartConfig}>
      <ResponsiveContainer width="100%" height="100%">
        <RechartsLineChart
          data={data}
          margin={{ top: 15, right: 15, left: 0, bottom: 5 }}
        >
          {showGridLines && (
            <CartesianGrid 
              strokeDasharray="3 3" 
              horizontal={true}
              vertical={false} 
              stroke="#ccc" 
            />
          )}
          {showXAxis && (
            <XAxis
              dataKey={index}
              tickLine={false}
              axisLine={false}
              tickMargin={10}
              tickFormatter={xAxisFormatter}
              tick={{ fontSize: 12 }}
              tickCount={startEndOnly ? 2 : undefined}
              minTickGap={tickGap}
            />
          )}
          {showYAxis && (
            <YAxis
              tickLine={false}
              axisLine={false}
              tickMargin={10}
              tickFormatter={valueFormatter}
              tick={{ fontSize: 12 }}
            />
          )}
          {showTooltip && (
            <Tooltip
              content={({ active, payload, label }) => (
                <ChartTooltipContent
                  active={active}
                  payload={payload}
                  label={label}
                  formatter={(value) => valueFormatter(Number(value))}
                />
              )}
            />
          )}
          {showLegend && (
            <Legend
              content={({ payload }) => (
                <ChartLegendContent payload={payload} />
              )}
            />
          )}
          {categories.map((category, i) => (
            <Line
              key={category}
              type="monotone"
              dataKey={category}
              stroke={colors[i % colors.length]}
              strokeWidth={2}
              dot={{ r: 0 }}
              activeDot={{ r: 4 }}
              fill={`url(#color-${category})`}
            />
          ))}
          <defs>
            {categories.map((category, i) => (
              <linearGradient
                key={category}
                id={`color-${category}`}
                x1="0"
                y1="0"
                x2="0"
                y2="1"
              >
                <stop
                  offset="5%"
                  stopColor={colors[i % colors.length]}
                  stopOpacity={areaOpacity}
                />
                <stop
                  offset="95%"
                  stopColor={colors[i % colors.length]}
                  stopOpacity={0}
                />
              </linearGradient>
            ))}
          </defs>
        </RechartsLineChart>
      </ResponsiveContainer>
    </ChartContainer>
  )
}

interface BarChartProps extends BaseChartProps {
  categories: string[]
  colors?: string[]
  valueFormatter?: (value: number) => string
}

export function BarChart({
  data,
  index,
  categories,
  colors = ["#2563eb", "#f59e0b", "#10b981"],
  valueFormatter = (value: number) => String(value),
  className,
  showXAxis = false,
  showYAxis = false,
  showTooltip = true,
  showLegend = true,
  showGridLines = false,
  startEndOnly = false,
  tickGap = 10,
  xAxisFormatter = (value) => value,
}: BarChartProps) {
  const chartConfig = React.useMemo(() => {
    return categories.reduce<Record<string, { color: string }>>(
      (acc, category, idx) => {
        acc[category] = {
          color: colors[idx % colors.length],
        }
        return acc
      },
      {}
    )
  }, [categories, colors])

  return (
    <ChartContainer className={className} config={chartConfig}>
      <ResponsiveContainer width="100%" height="100%">
        <RechartsBarChart
          data={data}
          margin={{ top: 15, right: 15, left: 0, bottom: 5 }}
        >
          {showGridLines && (
            <CartesianGrid 
              strokeDasharray="3 3" 
              horizontal={true}
              vertical={false} 
              stroke="#ccc" 
            />
          )}
          {showXAxis && (
            <XAxis
              dataKey={index}
              tickLine={false}
              axisLine={false}
              tickMargin={10}
              tickFormatter={xAxisFormatter}
              tick={{ fontSize: 12 }}
              tickCount={startEndOnly ? 2 : undefined}
              minTickGap={tickGap}
            />
          )}
          {showYAxis && (
            <YAxis
              tickLine={false}
              axisLine={false}
              tickMargin={10}
              tickFormatter={valueFormatter}
              tick={{ fontSize: 12 }}
            />
          )}
          {showTooltip && (
            <Tooltip
              content={({ active, payload, label }) => (
                <ChartTooltipContent
                  active={active}
                  payload={payload}
                  label={label}
                  formatter={(value) => valueFormatter(Number(value))}
                />
              )}
            />
          )}
          {showLegend && (
            <Legend
              content={({ payload }) => (
                <ChartLegendContent payload={payload} />
              )}
            />
          )}
          {categories.map((category, i) => (
            <Bar
              key={category}
              dataKey={category}
              fill={colors[i % colors.length]}
              radius={[4, 4, 0, 0]}
            />
          ))}
        </RechartsBarChart>
      </ResponsiveContainer>
    </ChartContainer>
  )
}

interface PieChartProps extends Omit<BaseChartProps, 'index'> {
  index: string
  category: string
  colors?: string[]
  valueFormatter?: (value: number) => string
  showLabel?: boolean
}

export function PieChart({
  data,
  index,
  category,
  colors = ["#2563eb", "#f59e0b", "#10b981", "#a855f7", "#ef4444"],
  valueFormatter = (value: number) => String(value),
  className,
  showTooltip = true,
  showLegend = true,
  children,
}: PieChartProps & { children?: React.ReactNode }) {
  const chartConfig = React.useMemo(() => {
    return data.reduce<Record<string, { color: string }>>(
      (acc, item, idx) => {
        const name = item[index];
        acc[name] = {
          color: colors[idx % colors.length],
        }
        return acc
      },
      {}
    )
  }, [data, index, colors])

  return (
    <ChartContainer className={className} config={chartConfig}>
      <ResponsiveContainer width="100%" height="100%">
        <RechartsPieChart margin={{ top: 5, right: 5, bottom: 5, left: 5 }}>
          {showTooltip && (
            <Tooltip
              content={({ active, payload }) => (
                <ChartTooltipContent
                  active={active}
                  payload={payload}
                  nameKey={index}
                  labelKey={category}
                  formatter={(value) => valueFormatter(Number(value))}
                />
              )}
            />
          )}
          {showLegend && (
            <Legend
              layout="horizontal"
              verticalAlign="bottom"
              align="center"
              content={({ payload }) => (
                <ChartLegendContent
                  payload={payload}
                  nameKey={index}
                />
              )}
            />
          )}
          {children || (
            <Pie
              data={data}
              dataKey={category}
              nameKey={index}
              cx="50%"
              cy="50%"
              outerRadius={80}
              stroke="transparent"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
              ))}
            </Pie>
          )}
        </RechartsPieChart>
      </ResponsiveContainer>
    </ChartContainer>
  )
}

interface PieArcSeriesProps {
  innerRadius?: number;
  outerRadius?: number;
  paddingAngle?: number;
  cornerRadius?: number;
  startAngle?: number;
  endAngle?: number;
  children?: React.ReactNode;
}

export function PieArcSeries({
  innerRadius = 0,
  outerRadius = 80,
  paddingAngle = 0,
  cornerRadius = 0,
  startAngle = 0,
  endAngle = 360,
  children,
}: PieArcSeriesProps) {
  return (
    <Pie
      dataKey="value"
      nameKey="name"
      cx="50%"
      cy="50%"
      innerRadius={innerRadius}
      outerRadius={outerRadius}
      paddingAngle={paddingAngle}
      cornerRadius={cornerRadius}
      startAngle={startAngle}
      endAngle={endAngle}
    >
      {children}
    </Pie>
  )
}

interface PieArcProps {
  color?: string;
  strokeWidth?: number;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
  tooltip?: boolean;
  // Make arcPath optional since it gets provided by the parent Pie component
  arcPath?: string;
}

export function PieArc({
  color = "#2563eb",
  strokeWidth = 2,
  onMouseEnter,
  onMouseLeave,
  tooltip = false,
}: PieArcProps) {
  // This is now a simplified version that works with the recharts Cell component
  // The actual path rendering is handled by the Cell component
  return <Cell fill={color} stroke="white" strokeWidth={strokeWidth} />;
}

