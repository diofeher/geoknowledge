import { useState, useMemo } from "react";
import { countries } from "./data/countries";
import type { Country } from "./data/countries";
import MapView from "./components/MapView";
import SearchBar from "./components/SearchBar";
import ContinentFilter from "./components/ContinentFilter";
import CountryTable from "./components/CountryTable";
import CountryDetail from "./components/CountryDetail";
import Quiz from "./components/Quiz";
import "./App.css";

export default function App() {
  const [search, setSearch] = useState("");
  const [selectedContinents, setSelectedContinents] = useState<string[]>([]);
  const [hoveredCountry, setHoveredCountry] = useState<Country | null>(null);
  const [selectedCountry, setSelectedCountry] = useState<Country | null>(null);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [quizOpen, setQuizOpen] = useState(false);

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

  const activeFilterCount = selectedContinents.length + (search ? 1 : 0);

  return (
    <div className="app">
      <header className="app-header">
        <div className="header-row">
          <div>
            <h1>🌍 GeoKnowledge</h1>
            <p className="subtitle">Explore countries of the world</p>
          </div>
          <div className="header-actions">
            <button className="quiz-launch-btn" onClick={() => setQuizOpen(true)}>
              🎮 Quiz
            </button>
            <button
              className="hamburger"
              onClick={() => setFiltersOpen((o) => !o)}
              aria-label="Toggle filters"
            >
              <span className="hamburger-icon">{filtersOpen ? "✕" : "☰"}</span>
              {!filtersOpen && activeFilterCount > 0 && (
                <span className="filter-badge">{activeFilterCount}</span>
              )}
            </button>
          </div>
        </div>
      </header>
      {/* Side drawer for mobile filters */}
      <div className={`drawer-backdrop ${filtersOpen ? "drawer-backdrop-open" : ""}`} onClick={() => setFiltersOpen(false)} />
      <aside className={`drawer ${filtersOpen ? "drawer-open" : ""}`}>
        <div className="drawer-header">
          <h2>Filters</h2>
          <button className="drawer-close" onClick={() => setFiltersOpen(false)}>✕</button>
        </div>
        <div className="drawer-body">
          <SearchBar value={search} onChange={setSearch} />
          <ContinentFilter selected={selectedContinents} onChange={setSelectedContinents} />
        </div>
      </aside>

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
      {quizOpen && <Quiz onClose={() => setQuizOpen(false)} />}
    </div>
  );
}
