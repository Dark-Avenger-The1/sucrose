import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react';

interface EligibilityNotice {
  visible: boolean;
  show(): void;
  hide(): void;
}

const EligibilityNoticeContext = createContext<EligibilityNotice | null>(null);

/** Owns whether the eligibility notice is on screen. Open at launch; the About screen can reopen it. */
export function EligibilityNoticeProvider({ children }: { children: ReactNode }) {
  const [visible, setVisible] = useState(true);
  const show = useCallback(() => setVisible(true), []);
  const hide = useCallback(() => setVisible(false), []);
  const value = useMemo(() => ({ visible, show, hide }), [visible, show, hide]);
  return <EligibilityNoticeContext.Provider value={value}>{children}</EligibilityNoticeContext.Provider>;
}

export function useEligibilityNotice(): EligibilityNotice {
  const notice = useContext(EligibilityNoticeContext);
  if (!notice) throw new Error('useEligibilityNotice must be used inside <EligibilityNoticeProvider>.');
  return notice;
}
