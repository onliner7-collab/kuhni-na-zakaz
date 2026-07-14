export interface PilotMedia {
  id: string;
  avif?: string;
  webp?: string;
  alt: string;
  caption?: string;
  width: number;
  height: number;
}

export interface LabeledOption {
  id: string;
  label: string;
  description: string;
  media?: PilotMedia;
}
