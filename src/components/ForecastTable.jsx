import ForecastRow from "./ForecastRow";

export default function ForecastTable({ forecast }) {
  if (forecast.length === 0) {
    return <p className="status-text">No matching forecast data found.</p>;
  }

  return (
    <div className="table-wrap">
      <div className="forecast-header forecast-grid">
        <span>Date</span>
        <span>Low</span>
        <span>High</span>
        <span>Moon Rise</span>
        <span>Details</span>
      </div>

      {forecast.map((day) => (
        <ForecastRow key={day.valid_date} day={day} />
      ))}
    </div>
  );
}