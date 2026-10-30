import { INPUT_RULES } from './input-rules';

/**
 * Who the suggestions are designed for. They come from eating patterns of adults without diagnosed
 * diabetes (NHANES 2017–2018), so anyone outside that group should follow their care team's plan.
 */
export const ELIGIBILITY_NOTICE = {
  title: 'Who these suggestions are for',
  intro: 'Sucrose’s food suggestions are based on the eating patterns of adults without diagnosed diabetes. They are designed for people who are:',
  criteria: [
    `${INPUT_RULES.minAge} years old or older`,
    'Not pregnant',
    'Not diagnosed with diabetes',
    'Not on insulin or other blood-sugar medication',
  ],
  outro: 'If any of these don’t apply to you, follow the plan from your doctor or dietitian instead.',
} as const;
