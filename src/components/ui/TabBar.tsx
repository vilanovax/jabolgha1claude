"use client";
import { tabBarStyle, tabStyle } from "@/theme/tokens";

interface Tab<T extends string> {
  key: T;
  label: string;
}

interface TabBarProps<T extends string> {
  tabs: Tab<T>[];
  active: T;
  onChange: (key: T) => void;
  color?: string;  // active tab color (default: #22c55e)
}

export default function TabBar<T extends string>({
  tabs,
  active,
  onChange,
  color = "#22c55e",
}: TabBarProps<T>) {
  return (
    <div style={tabBarStyle}>
      {tabs.map((t) => (
        <button
          key={t.key}
          onClick={() => onChange(t.key)}
          style={tabStyle(active === t.key, color)}
        >
          {t.label}
        </button>
      ))}
    </div>
  );
}
