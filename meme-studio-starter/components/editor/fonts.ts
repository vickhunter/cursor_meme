export const FONT_FAMILIES = [
  "Impact",
  "Anton",
  "Bebas Neue",
  "Inter",
  "Comic Sans MS",
  "Arial Black",
  "Georgia",
  "Courier New",
] as const

export type FontFamily = (typeof FONT_FAMILIES)[number]

export const PRESET_COLORS = [
  "#ffffff",
  "#000000",
  "#ff3b30",
  "#ff9500",
  "#ffcc00",
  "#34c759",
  "#00c7be",
  "#007aff",
  "#5856d6",
  "#af52de",
  "#ff2d55",
  "#a2845e",
] as const
