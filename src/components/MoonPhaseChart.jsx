import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";

export default function MoonPhaseChart({ forecast }) {
  return (
    <div className="chart-card">
      <h3>Moon Phase Progression</h3>
      <p>Track how the moon phase shifts over the upcoming forecast days.</p>

      <ResponsiveContainer width="100%" height={260}>
        <BarChart data={forecast}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="valid_date" />
          <YAxis domain={[0, 1]} />
          <Tooltip />
          <Bar dataKey="moon_phase" name="Moon Phase" fill="#ffc658" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}