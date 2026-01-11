export type PortalType = 'weather' | 'clock' | 'calendar' | 'countdown' | 'quicksave' | 'unitconverter' | 'passwordgen' | 'news' | 'radio' | 'crypto' | 'ai' | 'voice';

export interface PortalState {
  id: string;
  type: PortalType;
  title: string;
  position: { x: number; y: number };
  size: { width: number; height: number };
  zIndex: number;
  minimized: boolean;
  isOpen: boolean;
}

export interface PortalConfig {
  type: PortalType;
  title: string;
  defaultSize: { width: number; height: number };
  icon?: string;
}
