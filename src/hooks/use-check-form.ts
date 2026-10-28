import { useMemo, useState } from 'react';

import type { CheckErrors, CheckField, CheckInput } from '@/domain/check.types';
import type { GlucoseUnit } from '@/domain/glucose';
import type { InputRules } from '@/domain/input-rules';
import { validateDraft, type CheckDraft } from '@/domain/validation';

const EMPTY: CheckDraft = { glucose: '', unit: 'mg/dL', age: '', gender: null };

/**
 * Form state for a check. Errors appear for a field once it has been left (blur) or after a
 * submit attempt, so nobody is scolded while still typing.
 */
export function useCheckForm(rules: InputRules) {
  const [draft, setDraft] = useState<CheckDraft>(EMPTY);
  const [touched, setTouched] = useState<Partial<Record<CheckField, boolean>>>({});
  const [submitted, setSubmitted] = useState(false);

  const validation = useMemo(() => validateDraft(draft, rules), [draft, rules]);
  const allErrors: CheckErrors = validation.ok ? {} : validation.errors;
  const visibleErrors: CheckErrors = Object.fromEntries(
    Object.entries(allErrors).filter(([field]) => submitted || touched[field as CheckField]),
  );

  return {
    draft,
    errors: visibleErrors,
    setGlucose: (glucose: string) => setDraft((d) => ({ ...d, glucose })),
    setUnit: (unit: GlucoseUnit) => setDraft((d) => ({ ...d, unit })),
    setAge: (age: string) => setDraft((d) => ({ ...d, age })),
    setGender: (gender: CheckDraft['gender']) => {
      setDraft((d) => ({ ...d, gender }));
      setTouched((t) => ({ ...t, gender: true }));
    },
    touch: (field: CheckField) => setTouched((t) => ({ ...t, [field]: true })),
    /** Returns the validated input, or `null` and reveals every error. */
    submit(): CheckInput | null {
      setSubmitted(true);
      return validation.ok ? validation.value : null;
    },
    reset: () => {
      setDraft(EMPTY);
      setTouched({});
      setSubmitted(false);
    },
  };
}
