
export enum ProcessingState {
  IDLE = 'IDLE',
  TRANSCRIBING = 'TRANSCRIBING',
  TRANSLATING = 'TRANSLATING',
  DONE = 'DONE',
  ERROR = 'ERROR',
}

export type InputMode = 'url' | 'file';
