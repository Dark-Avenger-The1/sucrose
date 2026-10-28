import type { Gender } from './input-rules';

/** What the person enters. Glucose is always sent in mg/dL; the unit is only for display. */
export interface CheckInput {
  glucoseMgDl: number;
  age: number;
  gender: Gender;
}

/** The four colours the UI uses for a reading. The data source maps its band names onto these. */
export type BandTone = 'low' | 'normal' | 'elevated' | 'high';

/** One step of the glucose scale drawn on the results screen. `null` max = no upper bound. */
export interface ScaleStep {
  label: string;
  minMgDl: number;
  maxMgDl: number | null;
  tone: BandTone;
}

export interface Notice {
  tone: 'warning' | 'info';
  message: string;
}

/** What a reading means: everything the results header shows. Comes from the data source. */
export interface GlucoseAssessment {
  /** Clinical band, e.g. "Prediabetes", with the tone to colour it. */
  band: { label: string; tone: BandTone };
  /** The model's glucose level for this reading; must match one of `scale` by label. */
  level: ScaleStep;
  /** All the model's glucose levels in order, for the scale. */
  scale: ScaleStep[];
  /** Safety notes for this reading, most urgent first. */
  notices: Notice[];
}

export type CheckField = keyof CheckInput;
export type CheckErrors = Partial<Record<CheckField, string>>;
