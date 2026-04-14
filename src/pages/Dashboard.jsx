import { useEffect, useMemo, useState } from "react";
import SummaryCard from "../components/SummaryCard";
import FilterBar from "../components/FilterBar";
import ForecastTable from "../components/ForecastTable";
import TemperatureChart from "../components/TemperatureChart";
import MoonPhaseChart from "../components/MoonPhaseChart";
import { formatUnixTime, getMoonPhaseLabel, getTodayDate } from "../utils/helpers";

export default function Dashboard() {
  const [forecast, setForecast] = useState([]);
  const [city, setCity] = useState("New York");
  const [selectedDate, setSelectedDate] = useState(getTodayDate());
  const [moonPhaseLimit, setMoonPhaseLimit] = useState(1);
  const [showCharts, setShowCharts] = useState(true);
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
          throw new Error(`Weather request failed: ${response.status}`);
        }

        const result = await response.json();
        setForecast(result.data || []);
      } catch (err) {
        console.error(err);
        setError("Could not load weather data.");
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
      const matchesDate = selectedDate === "" || day.valid_date === selectedDate;
      const matchesMoon = Number(day.moon_phase) <= Number(moonPhaseLimit);
      return matchesDate && matchesMoon;
    });
  }, [forecast, selectedDate, moonPhaseLimit]);

  const tableData = filteredForecast.length ? filteredForecast : forecast;
  const firstDay = tableData[0];

  const lowTemp = firstDay ? `${firstDay.low_temp}°F` : "--";
  const moonRise = firstDay ? formatUnixTime(firstDay.moonrise_ts) : "--:--";
  const moonPhase = firstDay ? getMoonPhaseLabel(firstDay.moon_phase) : "--";

  return (
    <div>
      <div className="page-header">
        <h1>AstroDash</h1>
        <p>
          Explore daily forecast patterns, moon phases, and day-by-day details
          for the selected city.
        </p>
      </div>

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
          showCharts={showCharts}
          setShowCharts={setShowCharts}
        />

        {loading && <p className="status-text">Loading forecast...</p>}
        {error && <p className="status-text error-text">{error}</p>}

        {!loading && !error && (
          <>
            {showCharts && (
              <div className="charts-grid">
                <TemperatureChart forecast={forecast} />
                <MoonPhaseChart forecast={forecast} />
              </div>
            )}

            <div className="chart-note">
              <p>
                The first chart compares daily high and low temperatures across
                the full forecast window. The second shows how the moon phase
                changes over the same period, which gives the dashboard a second
                story beyond temperature alone.
              </p>
            </div>

            <ForecastTable forecast={tableData} />
          </>
        )}
      </div>
    </div>
  );
}