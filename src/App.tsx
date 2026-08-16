import { useState, useMemo } from "react";
import { countries } from "./data/countries";
import type { Country } from "./data/countries";
import MapView from "./components/MapView";
import SearchBar from "./components/SearchBar";
import ContinentFilter from "./components/ContinentFilter";
import CountryTable from "./components/CountryTable";
import CountryDetail from "./components/CountryDetail";
import "./App.css";

export default function App() {
  const [search, setSearch] = useState("");
  const [selectedContinents, setSelectedContinents] = useState<string[]>([]);
  const [hoveredCountry, setHoveredCountry] = useState<Country | null>(null);
  const [selectedCountry, setSelectedCountry] = useState<Country | null>(null);

  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim();
    return countries.filter((c) => {
      if (selectedContinents.length > 0 && !selectedContinents.includes(c.continent)) {
        return false;
      }
      if (q) {
        return (
          c.name.toLowerCase().includes(q) ||
          c.namePt.toLowerCase().includes(q) ||
          c.capital.toLowerCase().includes(q) ||
          c.languages.some((l) => l.toLowerCase().includes(q))
        );
      }
      return true;
    });
  }, [search, selectedContinents]);

  return (
    <div className="app">
      <header className="app-header">
        <h1>🌍 GeoKnowledge</h1>
        <p className="subtitle">Explore countries of the world</p>
      </header>
      <div className="app-body">
        <aside className="map-panel">
          <MapView hoveredCountry={hoveredCountry} />
          {hoveredCountry && (
            <div className="map-info">
              <span className="map-info-flag">{hoveredCountry.flag}</span>
              <span className="map-info-name">{hoveredCountry.namePt}</span>
            </div>
          )}
        </aside>
        <main className="list-panel">
          <div className="controls">
            <SearchBar value={search} onChange={setSearch} />
            <ContinentFilter selected={selectedContinents} onChange={setSelectedContinents} />
          </div>
          <div className="results-count">{filtered.length} countries</div>
          <CountryTable
            countries={filtered}
            onHover={setHoveredCountry}
            onClick={setSelectedCountry}
          />
        </main>
      </div>
      {selectedCountry && (
        <CountryDetail
          country={selectedCountry}
          onClose={() => setSelectedCountry(null)}
        />
      )}
    </div>
  );
}
