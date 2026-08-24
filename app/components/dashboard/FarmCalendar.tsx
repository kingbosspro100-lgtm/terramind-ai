"use client";

import {
  CalendarDays,
  Sprout,
  Droplets,
  Tractor,
  Scissors,
  Bell,
} from "lucide-react";

const events = [
  {
    id: 1,
    title: "Semis du maïs",
    date: "15 Juil. 2026",
    icon: <Sprout className="text-green-600" />,
    color: "bg-green-100",
  },
  {
    id: 2,
    title: "Irrigation",
    date: "18 Juil. 2026",
    icon: <Droplets className="text-blue-600" />,
    color: "bg-blue-100",
  },
  {
    id: 3,
    title: "Fertilisation",
    date: "22 Juil. 2026",
    icon: <Tractor className="text-orange-600" />,
    color: "bg-orange-100",
  },
  {
    id: 4,
    title: "Récolte prévue",
    date: "12 Sept. 2026",
    icon: <Scissors className="text-emerald-600" />,
    color: "bg-emerald-100",
  },
];

export default function FarmCalendar() {
  return (
    <div className="rounded-3xl bg-white p-8 shadow-xl">

      <div className="flex items-center justify-between">

        <div className="flex items-center gap-3">

          <CalendarDays className="h-8 w-8 text-emerald-600" />

          <h2 className="text-3xl font-bold">

            Calendrier agricole

          </h2>

        </div>

        <button className="rounded-xl bg-emerald-600 px-5 py-2 text-white hover:bg-emerald-700">

          Voir tout

        </button>

      </div>

      <div className="mt-8 space-y-5">

        {events.map((event) => (

          <div
            key={event.id}
            className="flex items-center justify-between rounded-2xl border border-gray-100 p-5 transition hover:shadow-lg"
          >

            <div className="flex items-center gap-5">

              <div className={`${event.color} rounded-2xl p-4`}>

                {event.icon}

              </div>

              <div>

                <h3 className="font-bold text-lg">

                  {event.title}

                </h3>

                <p className="text-gray-500">

                  {event.date}

                </p>

              </div>

            </div>

            <Bell className="text-gray-400" />

          </div>

        ))}

      </div>

    </div>
  );
}