"use client";
import { chipStyle } from "@/theme/tokens";

interface Chip {
  key: string;
  label: string;
  emoji: string;
}

interface ChipFilterProps {
  chips: Chip[];
  active: string;
  onChange: (key: string) => void;
  color?: string;   // active chip color (default: #22c55e)
}

export default function ChipFilter({
  chips,
  active,
  onChange,
  color = "#22c55e",
}: ChipFilterProps) {
  return (
    <div style={{
      display: "flex",
      gap: 6,
      marginBottom: 12,
      overflowX: "auto",
      paddingBottom: 4,
    }}>
      {chips.map((chip) => (
        <button
          key={chip.key}
          onClick={() => onChange(chip.key)}
          style={chipStyle(active === chip.key, color)}
        >
          {chip.emoji} {chip.label}
        </button>
      ))}
    </div>
  );
}
