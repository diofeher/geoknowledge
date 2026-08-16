import { continents } from "../data/countries";

interface ContinentFilterProps {
  selected: string[];
  onChange: (selected: string[]) => void;
}

export default function ContinentFilter({ selected, onChange }: ContinentFilterProps) {
  const toggle = (continent: string) => {
    if (selected.includes(continent)) {
      onChange(selected.filter((c) => c !== continent));
    } else {
      onChange([...selected, continent]);
    }
  };

  const allSelected = selected.length === 0;

  return (
    <div className="continent-filter">
      <label className="filter-label">Filter by Continent</label>
      <div className="continent-chips">
        <button
          className={`chip ${allSelected ? "chip-active" : ""}`}
          onClick={() => onChange([])}
        >
          All
        </button>
        {continents.map((c) => (
          <button
            key={c}
            className={`chip ${selected.includes(c) ? "chip-active" : ""}`}
            onClick={() => toggle(c)}
          >
            {c}
          </button>
        ))}
      </div>
    </div>
  );
}
