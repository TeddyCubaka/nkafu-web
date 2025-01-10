import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
} from "chart.js";

// Enregistrer les modules nécessaires
ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

export default function StatisticsChart() {
  const data = {
    labels: ["May", "Jun", "Jul", "Aug", "Sep"],
    datasets: [
      {
        label: "Income",
        data: [75, 75.2, 50, 65, 90],
        backgroundColor: "rgba(132, 255, 132, 0.7)",
        borderRadius: 4,
      },
      {
        label: "Spend",
        data: [40, 50, 35, 40, 60],
        backgroundColor: "rgba(54, 162, 235, 0.7)",
        borderRadius: 4,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top",
        labels: {
          color: "#333",
          font: {
            size: 12,
          },
        },
      },
      tooltip: {
        backgroundColor: "#000",
        bodyColor: "#fff",
        titleColor: "#fff",
      },
    },
    scales: {
      x: {
        ticks: {
        //   color: "#666",
        },
        grid: {
          display: false,
        },
      },
      y: {
        ticks: {
          color: "#666",
        },
        grid: {
          color: "#e5e5e5",
        },
      },
    },
  };

  return (
    <div className="bg-background rounded-lg p-6 shadow-md flex-1 h-full">
      <h2 className="text-lg font-semibold text-foreground mb-4">Statistics</h2>
      <div className=" h-full w-full p-8">
        <Bar data={data} options={options as any} />
      </div>
    </div>
  );
}
