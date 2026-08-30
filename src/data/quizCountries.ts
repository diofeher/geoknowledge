import { countries } from "./countries";

/** Countries eligible for quiz play — sovereign states with population > 100k */
export const quizCountries = countries.filter(
  (c) => !c.isTerritory && c.population > 100000,
);

/** O(1) country lookup by name */
export const quizCountryByName = new Map(
  quizCountries.map((c) => [c.name, c]),
);
