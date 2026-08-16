import type { Country } from "../data/countries";
import { countryDetails } from "../data/countryDetails";

interface CountryDetailProps {
  country: Country;
  onClose: () => void;
}

function formatArea(area: number): string {
  return area.toLocaleString("en-US") + " km²";
}

function formatGdp(gdp: number): string {
  if (gdp >= 1000) return `$${(gdp / 1000).toFixed(1)}T`;
  if (gdp >= 1) return `$${gdp.toFixed(1)}B`;
  return `$${(gdp * 1000).toFixed(0)}M`;
}

function hdiLevel(hdi: number): { label: string; color: string } {
  if (hdi >= 0.8) return { label: "Very High", color: "#22c55e" };
  if (hdi >= 0.7) return { label: "High", color: "#eab308" };
  if (hdi >= 0.55) return { label: "Medium", color: "#f97316" };
  return { label: "Low", color: "#ef4444" };
}

export default function CountryDetail({ country, onClose }: CountryDetailProps) {
  const details = countryDetails[country.name];

  return (
    <div className="detail-overlay" onClick={onClose}>
      <div className="detail-card" onClick={(e) => e.stopPropagation()}>
        <button className="detail-close" onClick={onClose}>✕</button>
        <div className="detail-header">
          <span className="detail-flag">{country.flag}</span>
          <div>
            <h2 className="detail-name">{country.name}</h2>
            <p className="detail-name-pt">{country.namePt}</p>
          </div>
        </div>

        <div className="detail-grid">
          <div className="detail-item">
            <span className="detail-label">Capital</span>
            <span className="detail-value">{country.capital}</span>
          </div>
          <div className="detail-item">
            <span className="detail-label">Continent</span>
            <span className="detail-value">{country.continent}</span>
          </div>
          <div className="detail-item">
            <span className="detail-label">Population</span>
            <span className="detail-value">{country.population.toLocaleString("en-US")}</span>
          </div>
          <div className="detail-item">
            <span className="detail-label">Languages</span>
            <span className="detail-value">
              <div className="language-tags">
                {country.languages.map((l) => (
                  <span key={l} className="tag">{l}</span>
                ))}
              </div>
            </span>
          </div>

          {details && (
            <>
              <div className="detail-item">
                <span className="detail-label">GDP (nominal)</span>
                <span className="detail-value">{formatGdp(details.gdpBillions)}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Area</span>
                <span className="detail-value">{formatArea(details.areaSqKm)}</span>
              </div>
              {details.hdi > 0 && (
                <div className="detail-item">
                  <span className="detail-label">HDI</span>
                  <span className="detail-value">
                    {details.hdi.toFixed(3)}{" "}
                    <span className="hdi-badge" style={{ color: hdiLevel(details.hdi).color }}>
                      ({hdiLevel(details.hdi).label})
                    </span>
                  </span>
                </div>
              )}
              <div className="detail-item">
                <span className="detail-label">Currency</span>
                <span className="detail-value">{details.currencyCode}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Calling Code</span>
                <span className="detail-value">{details.callingCode}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Driving Side</span>
                <span className="detail-value" style={{ textTransform: "capitalize" }}>{details.drivingSide}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Pop. Density</span>
                <span className="detail-value">
                  {(country.population / details.areaSqKm).toFixed(1)} /km²
                </span>
              </div>
              <div className="detail-item">
                <span className="detail-label">GDP per capita</span>
                <span className="detail-value">
                  ${((details.gdpBillions * 1e9) / country.population).toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                </span>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
