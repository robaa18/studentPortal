import { useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";
import { getSchedule } from "../../services/studentservice";

export default function Schedule() {
  const [schedule, setSchedule] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getSchedule()
      .then(setSchedule)
      .catch((err) => toast.error(err?.response?.data?.message || err?.message || "Failed to load schedule"))
      .finally(() => setLoading(false));
  }, []);

  const byDay = useMemo(() => {
    return schedule.reduce((acc, item) => {
      const day = item.day || "Unscheduled";
      acc[day] = acc[day] || [];
      acc[day].push(item);
      return acc;
    }, {});
  }, [schedule]);

  if (loading) return <div className="h-96 rounded-2xl bg-[#EEEDF4] animate-pulse" />;

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <p className="text-sm text-gray-400 font-medium">Scheduled Classes</p>
          <p className="text-4xl font-extrabold text-gray-800 mt-3">{schedule.length}</p>
        </div>
        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <p className="text-sm text-gray-400 font-medium">Active Days</p>
          <p className="text-4xl font-extrabold text-gray-800 mt-3">{Object.keys(byDay).length}</p>
        </div>
        <div className="rounded-2xl p-6 shadow-sm bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
          <p className="text-sm text-white/70 font-medium">Source</p>
          <p className="text-3xl font-extrabold mt-3">Live API</p>
        </div>
      </div>

      <section className="bg-white rounded-2xl p-8 shadow-sm">
        <h3 className="text-xl font-bold text-gray-800 mb-6">Weekly Schedule</h3>
        <div className="space-y-8">
          {Object.entries(byDay).map(([day, items]) => (
            <div key={day}>
              <div className="flex items-center gap-3 mb-3">
                <div className="w-8 h-0.5 rounded-full bg-indigo-600" />
                <h4 className="text-xl font-bold text-gray-800">{day}</h4>
              </div>
              <div className="grid gap-3">
                {items.map((item) => (
                  <div key={item._id} className="rounded-2xl bg-[#F5F3FF] px-6 py-5 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                    <div>
                      <p className="font-bold text-gray-800">{item.course?.title}</p>
                      <p className="text-xs text-gray-400 mt-1">{item.course?.code} | {item.location}</p>
                    </div>
                    <span className="font-bold text-indigo-600">{item.time}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
          {!schedule.length && <div className="text-center py-16 text-gray-400">No schedule available for your enrolled courses.</div>}
        </div>
      </section>
    </div>
  );
}
