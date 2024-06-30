import ScheduleTable from "./components/ScheduleTable";

export default function Home() {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-8 text-center">Gerador de Grade Horária</h1>
      <ScheduleTable />
    </div>
  );
}
