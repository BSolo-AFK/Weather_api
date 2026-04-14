import { Link, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { formatUnixTime, getMoonPhaseLabel } from "../utils/helpers";

export default function ForecastDetail() {
  const { date } = useParams();
  const [forecastDay, setForecastDay] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const apiKey = import.meta.env.VITE_WEATHERBIT_API_KEY;
  const city = "New York";

  useEffect(() => {
    const fetchForecast = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(
          `https://api.weatherbit.io/v2.0/forecast/daily?city=${encodeURIComponent(
            city
          )}&key=${apiKey}&days=16&units=I`
        );

        if (!response.ok) {
          throw new Error("Weather request failed");
        }

        const result = await response.json();
        const foundDay = (result.data || []).find((day) => day.valid_date === date);

        if (!foundDay) {
          throw new Error("Forecast day not found.");
        }

        setForecastDay(foundDay);
      } catch (err) {
        console.error(err);
        setError("Could not load forecast detail.");
      } finally {
        setLoading(false);
      }
    };

    if (apiKey) {
      fetchForecast();
    } else {
      setLoading(false);
      setError("Missing Weatherbit API key in .env");
    }
  }, [date, apiKey]);

  if (loading) return <p className="status-text">Loading detail...</p>;
  if (error) return <p className="status-text error-text">{error}</p>;
  if (!forecastDay) return <p className="status-text">No data found.</p>;

  return (
    <div>
      <div className="detail-header">
        <div>
          <h1>{forecastDay.valid_date}</h1>
          <p>Detailed weather and moon information for this forecast day.</p>
        </div>

        <Link to="/" className="back-link">
          ← Back to Dashboard
        </Link>
      </div>

      <div className="detail-grid">
        <div className="detail-card">
          <h3>Temperature</h3>
          <p>Low: {forecastDay.low_temp}°F</p>
          <p>High: {forecastDay.max_temp}°F</p>
          <p>Feels like max: {forecastDay.app_max_temp}°F</p>
          <p>Feels like min: {forecastDay.app_min_temp}°F</p>
        </div>

        <div className="detail-card">
          <h3>Moon Data</h3>
          <p>Moonrise: {formatUnixTime(forecastDay.moonrise_ts)}</p>
          <p>Moonset: {formatUnixTime(forecastDay.moonset_ts)}</p>
          <p>Moon phase: {getMoonPhaseLabel(forecastDay.moon_phase)}</p>
          <p>Phase value: {forecastDay.moon_phase}</p>
        </div>

        <div className="detail-card">
          <h3>Conditions</h3>
          <p>Description: {forecastDay.weather?.description || "N/A"}</p>
          <p>Humidity: {forecastDay.rh}%</p>
          <p>Cloud cover: {forecastDay.clouds}%</p>
          <p>Visibility: {forecastDay.vis} mi</p>
        </div>

        <div className="detail-card">
          <h3>Wind and Rain</h3>
          <p>Wind speed: {forecastDay.wind_spd} mph</p>
          <p>Wind direction: {forecastDay.wind_cdir_full}</p>
          <p>Precipitation: {forecastDay.precip} in</p>
          <p>Snow: {forecastDay.snow} in</p>
        </div>
      </div>
    </div>
  );
}