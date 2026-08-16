interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
}

export default function SearchBar({ value, onChange }: SearchBarProps) {
  return (
    <div className="search-bar">
      <span className="search-icon">🔍</span>
      <input
        type="text"
        placeholder="Search countries, capitals, or languages..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}
