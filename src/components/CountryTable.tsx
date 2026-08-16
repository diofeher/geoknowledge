import { useState, useMemo } from "react";
import type { Country } from "../data/countries";
import { countryDetails } from "../data/countryDetails";

interface CountryTableProps {
  countries: Country[];
  onHover: (country: Country | null) => void;
  onClick: (country: Country) => void;
}

type SortDir = "asc" | "desc" | null;

function formatPopulation(pop: number): string {
  if (pop >= 1_000_000_000) return `${(pop / 1_000_000_000).toFixed(2)}B`;
  if (pop >= 1_000_000) return `${(pop / 1_000_000).toFixed(1)}M`;
  if (pop >= 1_000) return `${(pop / 1_000).toFixed(1)}K`;
  return pop.toString();
}

function formatArea(area: number): string {
  if (area >= 1_000_000) return `${(area / 1_000_000).toFixed(2)}M km²`;
  if (area >= 1_000) return `${(area / 1_000).toFixed(1)}K km²`;
  return `${area} km²`;
}

function sortIndicator(dir: SortDir): string {
  if (dir === "asc") return " ▲";
  if (dir === "desc") return " ▼";
  return " ⇅";
}

export default function CountryTable({ countries, onHover, onClick }: CountryTableProps) {
  const [popSort, setPopSort] = useState<SortDir>(null);

  const sorted = useMemo(() => {
    if (!popSort) return countries;
    return [...countries].sort((a, b) =>
      popSort === "asc" ? a.population - b.population : b.population - a.population
    );
  }, [countries, popSort]);

  const cycleSort = () => {
    setPopSort((prev) => {
      if (prev === null) return "desc";
      if (prev === "desc") return "asc";
      return null;
    });
  };

  return (
    <div className="table-wrapper">
      <table className="country-table">
        <thead>
          <tr>
            <th>Flag</th>
            <th>Country</th>
            <th>Capital</th>
            <th className="sortable-th" onClick={cycleSort}>
              Population{sortIndicator(popSort)}
            </th>
            <th>Area</th>
            <th>Languages</th>
            <th>Continent</th>
          </tr>
        </thead>
        <tbody>
          {sorted.length === 0 ? (
            <tr>
              <td colSpan={7} className="no-results">
                No countries match your filters.
              </td>
            </tr>
          ) : (
            sorted.map((country) => {
              const details = countryDetails[country.name];
              return (
                <tr
                  key={country.name}
                  onMouseEnter={() => onHover(country)}
                  onMouseLeave={() => {}}
                  onClick={() => onClick(country)}
                >
                  <td className="flag-cell">{country.flag}</td>
                  <td className="country-name">{country.name}</td>
                  <td>{country.capital}</td>
                  <td className="population">{formatPopulation(country.population)}</td>
                  <td className="area">{details ? formatArea(details.areaSqKm) : "—"}</td>
                  <td>
                    <div className="language-tags">
                      {country.languages.map((lang) => (
                        <span key={lang} className="tag">
                          {lang}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td>
                    <span className="continent-badge">{country.continent}</span>
                  </td>
                </tr>
              );
            })
          )}
        </tbody>
      </table>
    </div>
  );
}
