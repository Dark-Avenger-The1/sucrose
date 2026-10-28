import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { createContext, useContext, useState, useSyncExternalStore, type ReactNode } from 'react';

import { createHistoryRepository, type HistoryRepository } from '@/services/history/history-repository';
import { createDeviceStore } from '@/services/storage/key-value-store';
import { createMockSucroseService } from '@/services/sucrose/mock/mock-sucrose.service';
import { createSucroseApiService, DEFAULT_API_URL } from '@/services/sucrose/sucrose-api.service';
import { ServiceError, type SucroseService } from '@/services/sucrose/sucrose-service';

export interface Services {
  /** Glucose check, foods, combos and meal plans. */
  sucrose: SucroseService;
  /** Past checks, saved on the device. */
  history: HistoryRepository;
}

const ServicesContext = createContext<Services | null>(null);

/**
 * Composition root: the only place that chooses implementations. The real API is the default;
 * set EXPO_PUBLIC_USE_MOCK=true in `.env.local` to build the UI against sample data instead.
 */
function createDefaultServices(): Services {
  return {
    sucrose:
      process.env.EXPO_PUBLIC_USE_MOCK === 'true'
        ? createMockSucroseService()
        : createSucroseApiService(process.env.EXPO_PUBLIC_API_URL ?? DEFAULT_API_URL),
    history: createHistoryRepository(createDeviceStore()),
  };
}

function createQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        // Answers only change when the inputs do; a meal plan changes only when asked.
        staleTime: Infinity,
        // Retry network hiccups once; a 4xx is the input's fault and will not fix itself.
        retry: (failureCount, error) =>
          failureCount < 1 && !(error instanceof ServiceError && error.status !== null && error.status < 500),
      },
    },
  });
}

/** Tests and previews pass `services` to inject fakes. */
export function ServicesProvider({ children, services }: { children: ReactNode; services?: Services }) {
  const [value] = useState(() => services ?? createDefaultServices());
  const [queryClient] = useState(createQueryClient);
  return (
    <ServicesContext.Provider value={value}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </ServicesContext.Provider>
  );
}

function useServices(): Services {
  const services = useContext(ServicesContext);
  if (!services) throw new Error('useServices must be used inside <ServicesProvider>.');
  return services;
}

export function useSucroseService(): SucroseService {
  return useServices().sucrose;
}

export function useHistory() {
  const { history } = useServices();
  const entries = useSyncExternalStore(history.subscribe, history.getSnapshot, history.getSnapshot);
  return { entries, add: history.add, remove: history.remove, clear: history.clear };
}
