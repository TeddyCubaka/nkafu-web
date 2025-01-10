import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
} from "chart.js";

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
      {
        label: "pemnding",
        data: [70, 51, 15, 60, 80],
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
        titleColor: "#black",
      },
    },
    scales: {
      x: {
        ticks: {
          color: "#666",
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
    <div className="bg-background rounded-lg p-6 flex-1 h-fit flex flex-col gap-5">
      <h2 className="text-lg font-semibold text-foreground">Statistics</h2>
      <div className="flex gap-5">
        <div className="flex-1 rounded-lg flex flex-col bg-bg-secondary p-5">
          <span className="">entrées</span>
          <h2 className="text-4xl font-bold">23 000 fc</h2>
          <span>par mois</span>
        </div>
        <div className="flex-1 rounded-lg flex flex-col bg-bg-secondary p-5">
          <span className="">sortie</span>
          <h2 className="text-4xl font-bold">400$</h2>
          <span>par mois</span>
        </div>
      </div>
      <div className="relative h-full w-full max-h-96">
        <Bar data={data} options={options as any} />
      </div>
    </div>
  );
}
