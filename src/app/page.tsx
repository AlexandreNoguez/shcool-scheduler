import Image from "next/image";
import ScheduleTable from "./components/ScheduleTable";

import logo from '@/app/assets/logo-alcebiades.jpg'

export default function Home() {
  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-evenly items-center">
        <Image className="rounded-lg" src={logo} alt="logo da escola" width={100} height={100} />
        <h1 className="text-3xl font-bold mb-8 text-center">
          Gerador de Grade Horária
        </h1>
      </div>
      <ScheduleTable />
    </div>
  );
}
