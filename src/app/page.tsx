'use client'
import { useState } from "react";
import ScheduleTable from "./components/ScheduleTable"

export default function Home() {
  const [schedule, setSchedule] = useState([]);

  const generateSchedule = async () => {
    const response = await fetch("/api/schedule", {
      method: "POST",
    });
    const data = await response.json();
    if (data.success) {
      setSchedule(data.schedule);
    } else {
      console.error("Error generating schedule:", data.message);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-8">Horário das Salas</h1>
      <ScheduleTable />
    </div>
  );
}
