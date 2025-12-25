
export interface SensorData {
  timestamp: number;
  accelX: number;
  accelY: number;
  accelZ: number;
  flexIndex: number;
  flexMiddle: number;
  flexRing: number;
  flexLittle: number;
  flexThumb: number;
}

export interface GestureLog {
  id: string;
  time: string;
  gesture: string;
  confidence: number;
  action: string;
}

export enum SystemStatus {
  IDLE = 'IDLE',
  SCANNING = 'SCANNING',
  CALIBRATING = 'CALIBRATING',
  ACTIVE = 'ACTIVE',
  ERROR = 'ERROR'
}
