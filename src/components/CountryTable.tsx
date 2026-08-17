import { useState, useMemo } from "react";
import type { Country } from "../data/countries";
import { countryDetails } from "../data/countryDetails";

interface CountryTableProps {
  countries: Country[];
  onHover: (country: Country | null) => void;
  onClick: (country: Country) => void;
}

type SortDir = "asc" | "desc" | null;
type SortCol = "population" | "area";

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

function sortIndicator(col: SortCol, activeCol: SortCol | null, dir: SortDir): string {
  if (activeCol !== col || !dir) return " ⇅";
  return dir === "asc" ? " ▲" : " ▼";
}

export default function CountryTable({ countries, onHover, onClick }: CountryTableProps) {
  const [sortCol, setSortCol] = useState<SortCol | null>(null);
  const [sortDir, setSortDir] = useState<SortDir>(null);

  const sorted = useMemo(() => {
    if (!sortCol || !sortDir) return countries;

    return [...countries].sort((a, b) => {
      let va: number, vb: number;
      if (sortCol === "population") {
        va = a.population;
        vb = b.population;
      } else {
        va = countryDetails[a.name]?.areaSqKm ?? 0;
        vb = countryDetails[b.name]?.areaSqKm ?? 0;
      }
      return sortDir === "asc" ? va - vb : vb - va;
    });
  }, [countries, sortCol, sortDir]);

  const cycleSort = (col: SortCol) => {
    if (sortCol !== col) {
      setSortCol(col);
      setSortDir("desc");
    } else {
      setSortDir((prev) => {
        if (prev === "desc") return "asc";
        setSortCol(null);
        return null;
      });
    }
  };

  return (
    <div className="table-wrapper">
      <table className="country-table">
        <thead>
          <tr>
            <th>Flag</th>
            <th>Country</th>
            <th>Capital</th>
            <th className="sortable-th" onClick={() => cycleSort("population")}>
              Population{sortIndicator("population", sortCol, sortDir)}
            </th>
            <th className="sortable-th" onClick={() => cycleSort("area")}>
              Area{sortIndicator("area", sortCol, sortDir)}
            </th>
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
                  <td className="country-name">
                    {country.name}
                    {country.isTerritory && (
                      <span className="territory-badge" title={`Territory of ${country.sovereignState}`}>
                        {country.sovereignState}
                      </span>
                    )}
                  </td>
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
