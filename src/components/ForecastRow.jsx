import { Link } from "react-router-dom";
import { formatUnixTime } from "../utils/helpers";

export default function ForecastRow({ day }) {
  return (
    <div className="forecast-row forecast-grid">
      <span>{day.valid_date}</span>
      <span>{day.low_temp}°F</span>
      <span>{day.max_temp}°F</span>
      <span>{formatUnixTime(day.moonrise_ts)}</span>
      <Link to={`/forecast/${day.valid_date}`} className="detail-link">
        View Details
      </Link>
    </div>
  );
}