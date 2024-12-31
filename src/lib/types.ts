export type RatingOption = {
  value: number;
  kanji: string;
  color: string;
  label: string;
};

export type RatingConfig = {
  id: string;
  label: string;
  enLabel: string;
  options: RatingOption[];
};

export interface KiEntry {
  date: Date;
  genki: number;   // Energy
  suimin: number;  // Sleep
  kibun: number;   // Mood
  note?: string;
} 