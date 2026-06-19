export interface ExplorerLevel {
  level: number;
  label: string;
}

export function getExplorerLevel(count: number): ExplorerLevel {
  if (count === 0) return { level: 0, label: 'START' };
  if (count <= 6) return { level: 1, label: 'LV.1' };
  if (count <= 12) return { level: 2, label: 'LV.2' };
  return { level: 3, label: 'LV.3' };
}
