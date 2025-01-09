import React from "react";

interface WorkData {
  year: number;
  daysWorked: Set<string>; // Format des jours : "YYYY-MM-DD"
}

const months = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

const generateDaysInMonth = (year: number, month: number) => {
  const date = new Date(year, month, 1);
  const days = [];
  while (date.getMonth() === month) {
    days.push(new Date(date));
    date.setDate(date.getDate() + 1);
  }
  return days;
};

function generateRandomDates(year: number, count: number): string[] {
  const dates = new Set<string>();
  while (dates.size < count) {
    const month = Math.floor(Math.random() * 12); // 0 - 11
    const day = Math.floor(Math.random() * 28) + 1; // 1 - 28 (éviter les problèmes de mois)
    const date = new Date(year, month, day);
    dates.add(date.toISOString().split("T")[0]);
  }
  return Array.from(dates);
}

const AgentWorkHeatmap: React.FC<{ workData: WorkData }> = ({ workData }) => {
  const { year, daysWorked } = workData;

  const days = new Set(generateRandomDates(2025, 10));

  return (
    <div className="flex flex-col items-center space-y-4 bg-background p-4 sm:p-8 rounded-md">
      <h2 className="text-xl font-semibold">Calendrier de travail - {year}</h2>
      <div className="flex flex-wrap gap-4">
        {months.map((month, monthIndex) => (
          <div key={month} className="flex flex-col items-center space-y-2">
            <span className="font-medium">{month}</span>
            <div className="grid grid-cols-7 gap-1">
              {generateDaysInMonth(year, monthIndex).map((day) => {
                const dayString = day.toISOString().split("T")[0];
                const isWorked = days.has(dayString);

                return (
                  <div
                    key={dayString}
                    title={dayString}
                    className={`h-3 w-3 rounded-sm border ${
                      isWorked ? "bg-green-500" : "bg-gray-200"
                    }`}
                  ></div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AgentWorkHeatmap;
