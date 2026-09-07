// Exact routes with content/metadata changes, not an automatic freshness bump.
import { regionalLocations } from "./locations";

export const SEO_OWNERSHIP_LAST_MODIFIED = new Date("2026-09-06T00:00:00.000Z");
export const SEO_OWNERSHIP_UPDATED_PATHS = new Set([
  "/", "/about", "/catalog", "/prices", "/materials/shpon",
  ...["uglovye-kuhni", "pryamye-kuhni", "p-obraznye-kuhni", "kuhni-s-ostrovom", "malenkie-kuhni", "kuhni-do-potolka", "kuhni-bez-ruchek"].map(slug => `/catalog/${slug}`),
  ...["neoklassika", "hay-tek", "provans", "loft", "sovremennye", "skandinavskie", "klassicheskie", "minimalizm"].map(slug => `/styles/${slug}`),
  ...regionalLocations.map(city => `/locations/${city.slug}`),
]);
