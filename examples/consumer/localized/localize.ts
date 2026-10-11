/* Builds a translated content object from the English one and a partial patch.
 * Objects merge key by key; arrays, functions and strings are replaced whole, so a
 * translation lists only what differs and still type-checks against the shape. */
type Leaf = string | number | boolean | null | undefined | ((...args: any[]) => unknown);
export type DeepPartial<T> = T extends Leaf ? T : T extends readonly unknown[] ? T : { [K in keyof T]?: DeepPartial<T[K]> };

const isPlain = (value: unknown): value is Record<string, unknown> => Boolean(value) && typeof value === "object" && !Array.isArray(value);

export function localize<T>(base: T, patch: DeepPartial<T>): T {
  if (!isPlain(base) || !isPlain(patch)) return (patch === undefined ? base : patch) as T;
  const merged: Record<string, unknown> = { ...base };
  for (const [key, value] of Object.entries(patch)) merged[key] = key in base ? localize((base as Record<string, unknown>)[key], value as never) : value;
  return merged as T;
}
