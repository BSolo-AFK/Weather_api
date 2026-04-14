export default function FilterBar({
  city,
  setCity,
  selectedDate,
  setSelectedDate,
  moonPhaseLimit,
  setMoonPhaseLimit,
  showCharts,
  setShowCharts,
}) {
  const cities = [
    "New York",
    "Los Angeles",
    "Chicago",
    "Houston",
    "Miami",
    "Seattle",
    "Denver",
    "Boston",
    "San Francisco",
    "Atlanta",
  ];

  return (
    <div className="filter-bar">
      <select
        value={city}
        onChange={(e) => setCity(e.target.value)}
        className="city-input"
      >
        {cities.map((cityOption) => (
          <option key={cityOption} value={cityOption}>
            {cityOption}
          </option>
        ))}
      </select>

      <input
        type="date"
        value={selectedDate}
        onChange={(e) => setSelectedDate(e.target.value)}
        className="date-input"
      />

      <label className="slider-group">
        <span>Moon Phase:</span>
        <input
          type="range"
          min="0"
          max="1"
          step="0.01"
          value={moonPhaseLimit}
          onChange={(e) => setMoonPhaseLimit(e.target.value)}
        />
        <span>{moonPhaseLimit}</span>
      </label>

      <button
        className="toggle-button"
        onClick={() => setShowCharts(!showCharts)}
      >
        {showCharts ? "Hide Charts" : "Show Charts"}
      </button>
    </div>
  );
}