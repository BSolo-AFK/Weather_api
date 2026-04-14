import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";

export default function TemperatureChart({ forecast }) {
  return (
    <div className="chart-card">
      <h3>Temperature Trend</h3>
      <p>Compare daily high and low temperatures across the forecast period.</p>

      <ResponsiveContainer width="100%" height={260}>
        <LineChart data={forecast}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="valid_date" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="max_temp" name="High Temp" stroke="#8884d8" />
          <Line type="monotone" dataKey="low_temp" name="Low Temp" stroke="#82ca9d" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}