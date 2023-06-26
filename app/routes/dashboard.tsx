import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import {  useMemo } from "react";
import { Bar } from "react-chartjs-2";
import type {
  AZM,
  Sleep,
} from "~/models/fitbit.server";
import type { WakatimeSummary } from "~/models/wakatime.server";
import { addDays, formatDate, weekStartEnd } from "~/utils/date";
import { msToHours } from "~/utils/time";
import { useConnectorAutoFetcher } from "~/hooks/use.connector.fetcher";
import { CheckBadgeIcon, NewspaperIcon } from "@heroicons/react/24/outline";
import type { Issue } from "@linear/sdk";
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);
const labels = [
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
  "sunday",
];

const { start, end } = weekStartEnd();
const weekMap = {
  [formatDate(start)]: {},
  [formatDate(addDays(weekStartEnd().start, 1))]: {},
  [formatDate(addDays(weekStartEnd().start, 2))]: {},
  [formatDate(addDays(weekStartEnd().start, 3))]: {},
  [formatDate(addDays(weekStartEnd().start, 4))]: {},
  [formatDate(addDays(weekStartEnd().start, 5))]: {},
  [formatDate(addDays(weekStartEnd().start, 6))]: {},
};
export const options = {
  responsive: true,
  plugins: {
    legend: {
      position: "top" as const,
    },
    title: {
      display: true,
      text: ` ${start.toLocaleDateString()} - ${end.toLocaleDateString()}`,
    },
  },
  scales: {
    x: {
      stacked: true,
    },
    y: {
      stacked: true,
    },
  },
};

export default function Daily() {
  const args = useMemo(() => {
    return {
      start: start.toISOString(),
      end: end.toISOString(),
    };
  }, []);
  const wakaFetcher = useConnectorAutoFetcher("wakatime-2478", "summary", args);
  const linearFetcher = useConnectorAutoFetcher("linear-783", "summary", {
    start: start.toISOString(),
    end: end.toISOString(),
  });
  const fitbitFetcher = useConnectorAutoFetcher("fitbit-99562", "summary", {
    start: start.toISOString(),
    end: end.toISOString(),
  });

  const [sleepData, azmData] = useMemo(() => {
    if (!fitbitFetcher?.data) {
      return [];
    }
    // fitbitFetcher.data.
    const resp = fitbitFetcher.data;
    const sleepData = resp?.sleep?.sleep ?? [];
    const azm = resp?.azm?.["activities-active-zone-minutes"] ?? [];

    const mappedSleep: Record<string, Sleep> = sleepData.reduce((acc, prev) => {
      if (weekMap[prev.dateOfSleep]) {
        return { ...acc, [prev.dateOfSleep]: prev };
      }
      return acc;
    }, {});

    const mappedAZM: Record<string, AZM> = azm.reduce((acc, prev) => {
      if (weekMap[prev.dateTime]) {
        return { ...acc, [prev.dateTime]: prev };
      }
      return acc;
    }, {});
    const sleepArray: Sleep[] = Object.keys(weekMap).map(
      (key) => mappedSleep?.[key] ?? undefined
    );

    const azmArray: AZM[] = Object.keys(weekMap).map(
      (key) => mappedAZM?.[key] ?? undefined
    );

    // AZM
    return [sleepArray, azmArray];
  }, [fitbitFetcher]);

  const wakaData = useMemo(
    () => wakaFetcher.data,
    [wakaFetcher.data]
  ) as WakatimeSummary;

  const totalTimeCoding =
    wakaData?.data?.map((datum) => datum.grand_total.total_seconds / 60 / 60) ??
    [];

  const timeSleeping = sleepData?.map((sleep) =>
    msToHours(sleep?.duration ?? 0)
  );
  const timeExercising = azmData?.map((azm) => {
    return (azm?.value?.activeZoneMinutes ?? 0) / 60;
  });

  const issuesSorted = useMemo(() => {
    const issues = linearFetcher?.data ?? [];
    const completed = issues.filter((issue) => !!issue.completedAt);
    const pending = issues.filter((issue) => !issue.completedAt);
    return { completed, pending };
  }, [linearFetcher.data]);

  const data = {
    labels,
    datasets: [
      {
        label: "Sleep",
        data: timeSleeping,
        backgroundColor: "rgba(53, 162, 235, 0.7)",
      },
      {
        label: "Exercise",
        data: timeExercising,
        backgroundColor: "rgba(255, 99, 132, 0.7)",
      },
      {
        label: "Coding",
        data: totalTimeCoding,
        backgroundColor: "rgba(99, 253, 162, 0.7)",
      },
    ],
  };
  return (
    <>
      <div className="grid grid-cols-1 px-4 gap-4 md:grid-cols-2 md:gap-6 xl:grid-cols-4 2xl:gap-7.5">
        <div className="rounded-sm bg-slate-800 py-6 px-7.5 shadow-default flex flex-col justify-center items-center">
          <h4 className="text-title-md font-bold text-white text-4xl">
            {issuesSorted.completed?.length ?? 0}
          </h4>
          <dt className="flex items-center gap-x-3 text-base font-semibold leading-7 pt-4 px-4 text-white">
            <CheckBadgeIcon
              className="h-5 w-5 flex-none text-indigo-400"
              aria-hidden="true"
            />
            Completed Issues
          </dt>
        </div>

        <div className="rounded-sm bg-slate-800 py-6 px-7.5 shadow-default flex flex-col justify-center items-center">
          <h4 className="text-title-md font-bold text-white text-4xl">...</h4>
          <dt className="flex items-center gap-x-3 text-base font-semibold leading-7 pt-4 px-4 text-white">
            <CheckBadgeIcon
              className="h-5 w-5 flex-none text-indigo-400"
              aria-hidden="true"
            />
            Commits
          </dt>
        </div>

        <div className="rounded-sm bg-slate-800 py-6 px-7.5 shadow-default flex flex-col justify-center items-center">
          <h4 className="text-title-md font-bold text-white text-4xl">
            {issuesSorted.pending?.length ?? 0}
          </h4>
          <dt className="flex items-center gap-x-3 text-base font-semibold leading-7 pt-4 px-4 text-white">
            <CheckBadgeIcon
              className="h-5 w-5 flex-none text-indigo-400"
              aria-hidden="true"
            />
            Issues Pending
          </dt>
        </div>

        <div className="rounded-sm bg-slate-800 py-6 px-7.5 shadow-default flex flex-col justify-center items-center">
          <h4 className="text-title-md font-bold text-white text-4xl">...</h4>
          <dt className="flex items-center gap-x-3 text-base font-semibold leading-7 pt-4 px-4 text-white">
            <CheckBadgeIcon
              className="h-5 w-5 flex-none text-indigo-400"
              aria-hidden="true"
            />
            Productivity
          </dt>
        </div>
        <button className=" bg-slate-800 border-2 border-slate-700 hover:bg-slate-700 text-gray-800 font-bold py-2 px-4 rounded inline-flex items-center">
          <div className="flex items-center justify-center gap-x-3 text-base font-semibold leading-7 m-auto  text-white">
            <NewspaperIcon
              className="h-5 w-5 flex-none text-indigo-400"
              aria-hidden="true"
            />
            <span>Generate Report</span>
          </div>
        </button>
      </div>
      <Bar options={options} data={data} />;
    </>
  );
}
