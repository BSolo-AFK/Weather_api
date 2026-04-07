import { useEffect, useMemo, useState } from "react";
import Sidebar from "./components/Sidebar";
import SummaryCard from "./components/SummaryCard";
import FilterBar from "./components/FilterBar";
import ForecastTable from "./components/ForecastTable";

export default function App() {
  const [forecast, setForecast] = useState([]);
  const [city, setCity] = useState("New York");
  const [selectedDate, setSelectedDate] = useState(getTodayDate());
  const [moonPhaseLimit, setMoonPhaseLimit] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const apiKey = import.meta.env.VITE_WEATHERBIT_API_KEY;

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
        setForecast(result.data || []);
      } catch (err) {
        console.error(err);
        setError("Could not load weather data. Check your API key and city.");
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
  }, [city, apiKey]);

  const filteredForecast = useMemo(() => {
    return forecast.filter((day) => {
      const matchesDate =
        selectedDate === "" || day.valid_date === selectedDate;

      const matchesMoon = Number(day.moon_phase) <= Number(moonPhaseLimit);

      return matchesDate && matchesMoon;
    });
  }, [forecast, selectedDate, moonPhaseLimit]);

  const firstDay = filteredForecast[0] || forecast[0];

  const lowTemp = firstDay ? `${firstDay.low_temp}°F` : "--";
  const moonRise = firstDay ? formatUnixTime(firstDay.moonrise_ts) : "--:--";
  const moonPhase = firstDay ? getMoonPhaseLabel(firstDay.moon_phase) : "--";

  return (
<div className="dashboard-layout">
  <Sidebar />

  <main className="main-panel">
    <div className="cards-row">
      <SummaryCard title="Low Temp" value={lowTemp} />
      <SummaryCard title="Moon Rise" value={moonRise} />
      <SummaryCard title="Moon Phase" value={moonPhase} />
    </div>

    <div className="content-glass">
      <FilterBar
        city={city}
        setCity={setCity}
        selectedDate={selectedDate}
        setSelectedDate={setSelectedDate}
        moonPhaseLimit={moonPhaseLimit}
        setMoonPhaseLimit={setMoonPhaseLimit}
      />

      {loading && <p className="status-text">Loading forecast...</p>}
      {error && <p className="status-text error-text">{error}</p>}

      {!loading && !error && (
        <ForecastTable forecast={filteredForecast.length ? filteredForecast : forecast} />
      )}
    </div>
  </main>
</div>
  );
}

function getTodayDate() {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
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

function getMoonPhaseLabel(value) {
  const phase = Number(value);

  if (phase <= 0.03 || phase >= 0.97) return "New Moon";
  if (phase < 0.25) return "Waxing Crescent";
  if (phase < 0.28) return "First Quarter";
  if (phase < 0.47) return "Waxing Gibbous";
  if (phase < 0.53) return "Full Moon";
  if (phase < 0.72) return "Waning Gibbous";
  if (phase < 0.78) return "Last Quarter";
  return "Waning Crescent";
}