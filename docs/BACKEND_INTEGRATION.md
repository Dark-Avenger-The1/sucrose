# Connecting the backend

This app is the **frontend only**. Every screen gets its data through one interface,
`SucroseService`. Until the backend is connected, the app uses a **mock** that answers from
sample responses recorded from the ECLAT model, so every screen, loading state and error state
can be built and tested.

To connect the backend you write **one file** that implements `SucroseService`, then switch
**one line** in the provider. No screen or component needs to change.

## 1. Where things are

| File | What it is |
|---|---|
| `src/services/sucrose/sucrose-service.ts` | The interface to implement, and `ServiceError` |
| `src/domain/check.types.ts` | `CheckInput`, `GlucoseAssessment`, `ScaleStep`, `Notice`, `BandTone` |
| `src/domain/food.types.ts` | `FoodItem`, `FoodVariant`, `FoodCombo`, `MealPlan` |
| `src/services/sucrose/mock/` | The mock and its sample data (keep for UI work, or delete when done) |
| `src/providers/services-provider.tsx` | `createDefaultServices()`: the one line to switch |
| `src/domain/glucose.ts` | `toneForBandName()`: maps "Normal", "Prediabetes"… to a UI colour |

## 2. The interface

```ts
interface SucroseService {
  checkGlucose(input: CheckInput, signal?: AbortSignal): Promise<GlucoseAssessment>;
  getFoods(input: CheckInput, signal?: AbortSignal): Promise<FoodItem[]>;
  getCombos(input: CheckInput, signal?: AbortSignal): Promise<FoodCombo[]>;
  getMealPlan(input: CheckInput, signal?: AbortSignal): Promise<MealPlan>;
}

// what the user entered (glucose is always in mg/dL; the app converts mmol/L)
interface CheckInput { glucoseMgDl: number; age: number; gender: 'female' | 'male' }
```

Pass `signal` to `fetch` so a request is cancelled when the user leaves the screen.

## 3. What each method must return

### `checkGlucose` → `GlucoseAssessment` (results header and glucose scale)

```ts
{
  band: { label: 'Prediabetes', tone: 'elevated' },        // tone: 'low' | 'normal' | 'elevated' | 'high'
  level: { label: '100–119', minMgDl: 100, maxMgDl: 120, tone: 'elevated' },
  scale: [                                                  // every glucose level, in order
    { label: 'Under 80', minMgDl: 0,   maxMgDl: 80,   tone: 'low' },
    { label: '80–99',    minMgDl: 80,  maxMgDl: 100,  tone: 'normal' },
    // ...
    { label: '200+',     minMgDl: 200, maxMgDl: null, tone: 'high' },
  ],
  notices: [{ tone: 'info', message: 'A fasting glucose of 100 mg/dL or more should be confirmed…' }],
}
```

- `level` must be one of the `scale` steps (matched by `label`).
- `scale` can come straight from the model JSON's `glucose_levels`; the tone of each step is the
  clinical band at its `min_mg_dl`. Use `toneForBandName(band)` to get a tone from a band name.
- `notices`: `warning` for low glucose (shown highlighted), `info` otherwise; `[]` for none.

### `getFoods` → `FoodItem[]` (Foods view, and net carbs in the meal plan)

```ts
[{
  id: 'Fresh fruit',              // unique in the list (food name, or barcode for products)
  name: 'Fresh fruit',
  netCarbsPer100g: 13.4,          // or null if unknown (shows "—")
  source: 'model',                // 'open-food-facts' for products
  variants: [                     // optional: the specific foods inside the group → shows the dropdown
    { code: 63101000, name: 'Apple, raw', netCarbsPer100g: 11.4 },
    { code: 63105010, name: 'Avocado, raw', netCarbsPer100g: 1.8 },
  ],
  brand: 'Fage',                  // optional, Open Food Facts products
  imageUrl: 'https://…',          // optional, Open Food Facts products (shows a thumbnail)
}]
```

- **The list is shown in the order you return it.**
- `variants` must already be **filtered and ordered** for this reading: only the specific foods
  within the reading's level limits, best first. The model JSON (v2.1) has everything needed:
  `group_items`, `fiber_exception` and `item_ranking` (the rule, in words). Omit `variants` or
  return `[]` when a food has none; the row then shows no dropdown.

### `getCombos` → `FoodCombo[]`

```ts
[{ foods: ['Milk', 'Fresh fruit'] }]
```

### `getMealPlan` → `MealPlan`

```ts
{ meals: [
  { name: 'breakfast', items: ['Salad vegetables', 'Raw tomatoes', 'Eggs boiled or fried'], combo: ['Salad vegetables', 'Raw tomatoes'] },
  { name: 'lunch',     items: [...], combo: null },
  { name: 'dinner',    items: [...], combo: null },
] }
```

- Item names must match `FoodItem.name` from `getFoods`: the meal plan looks up net carbs and the
  dropdown by name.
- "New meal plan" simply calls `getMealPlan` again, so a backend that shuffles returns a new plan.

## 4. Errors

Throw `ServiceError(message, status)` to show `message` to the user inside the block that failed
(with a Try again button):

```ts
throw new ServiceError('Age must be 18 or older.', 400);      // 4xx: shown, not retried
throw new ServiceError('The server is busy. Try again.', 503); // 5xx: retried once, then shown
throw new ServiceError('Can’t reach the server.', null);       // network: retried once, then shown
```

Any other thrown error shows a generic "Something went wrong" message.

## 5. Plug it in

```ts
// src/services/sucrose/api/sucrose-api.service.ts (your file)
import type { SucroseService } from '../sucrose-service';
import { ServiceError } from '../sucrose-service';

export function createSucroseApiService(baseUrl: string): SucroseService {
  async function get(path: string, input: CheckInput, signal?: AbortSignal) {
    const query = new URLSearchParams({ glucose: String(input.glucoseMgDl), age: String(input.age), gender: input.gender });
    const res = await fetch(`${baseUrl}${path}?${query}`, { signal }).catch(() => {
      throw new ServiceError('Can’t reach the server. Check your connection.', null);
    });
    const body = await res.json().catch(() => null);
    if (!res.ok) throw new ServiceError(body?.error ?? 'Something went wrong on the server.', res.status);
    return body;
  }
  return {
    checkGlucose: async (input, signal) => /* map */ (await get('/your/endpoint', input, signal)),
    getFoods:     async (input, signal) => /* map */ (await get('/your/endpoint', input, signal)),
    getCombos:    async (input, signal) => /* map */ (await get('/your/endpoint', input, signal)),
    getMealPlan:  async (input, signal) => /* map */ (await get('/your/endpoint', input, signal)),
  };
}
```

```ts
// src/providers/services-provider.tsx
function createDefaultServices(): Services {
  return {
    sucrose: createSucroseApiService(process.env.EXPO_PUBLIC_API_URL!),   // was: createMockSucroseService()
    history: createHistoryRepository(createDeviceStore()),
  };
}
```

`EXPO_PUBLIC_*` variables are read from `.env.local` at build time. On a phone, use the computer's
LAN IP, not `localhost`.

## 6. Already handled by the app

- **Form validation** (`src/domain/input-rules.ts`): adults 18+, glucose 20–600 mg/dL, female/male.
  Keep it in sync with the model's `input_rules`; the backend should still validate.
- **mmol/L input**: converted to mg/dL before any call.
- **History**: saved on the device (`expo-sqlite` key-value store, `localStorage` on web).
  Reopening a check calls the service again.
- **Loading, empty and error states, caching and retries** (TanStack Query).

## 7. Testing the UI without a backend

`createMockSucroseService({ latencyMs: 2000 })` makes loading states easy to see;
`createMockSucroseService({ fail: true })` shows every error state.
