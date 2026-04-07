import ForecastRow from "./ForecastRow";

export default function ForecastTable({ forecast }) {
  if (forecast.length === 0) {
    return <p className="status-text">No matching forecast data found.</p>;
  }

  return (
    <div className="table-wrap">
      <div className="forecast-header forecast-grid">
        <span>Date</span>
        <span>Temperature</span>
        <span>Moon Rise</span>
        <span>Moon Set</span>
        <span>Moon Phase</span>
      </div>

      {forecast.map((day, index) => (
        <ForecastRow key={`${day.valid_date}-${index}`} day={day} />
      ))}
    </div>
  );
}