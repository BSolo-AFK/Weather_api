export default function ForecastRow({ day }) {
  return (
    <div className="forecast-row forecast-grid">
      <span>{day.valid_date}</span>
      <span>{day.low_temp} °F</span>
      <span>{formatUnixTime(day.moonrise_ts)}</span>
      <span>{formatUnixTime(day.moonset_ts)}</span>
      <span className="moon-icon">{getMoonEmoji(day.moon_phase)}</span>
    </div>
  );
}

function formatUnixTime(unixSeconds) {
  if (!unixSeconds) return "--:--";

  const date = new Date(unixSeconds * 1000);
  return date.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
}

function getMoonEmoji(phase) {
  const value = Number(phase);

  if (value <= 0.03 || value >= 0.97) return "🌑";
  if (value < 0.25) return "🌒";
  if (value < 0.28) return "🌓";
  if (value < 0.47) return "🌔";
  if (value < 0.53) return "🌕";
  if (value < 0.72) return "🌖";
  if (value < 0.78) return "🌗";
  return "🌘";
}