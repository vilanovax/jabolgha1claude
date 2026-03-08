"use client";
import { toastStyle } from "@/theme/tokens";

interface ToastProps {
  message: string | null;
}

export default function Toast({ message }: ToastProps) {
  if (!message) return null;
  return <div style={toastStyle}>{message}</div>;
}
