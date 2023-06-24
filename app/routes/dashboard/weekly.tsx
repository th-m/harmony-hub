import { useAuth } from "@clerk/remix";
import { useKollaEvents } from "@kolla/react-sdk";
import { useFetcher } from "@remix-run/react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { useEffect, useMemo } from "react";
import { Bar } from "react-chartjs-2";
import type { AZM, AZMResponse, Sleep, SleepResponse } from "~/models/fitbit.server";
import type { WakatimeSummary } from "~/models/wakatime.server";
import { addDays, formatDate, weekStartEnd } from "~/utils/date";
import { msToHours } from "~/utils/time";
import { CheckBadgeIcon } from "@heroicons/react/24/outline";
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
  const wakaFetcher = useFetcher();
  const linearFetcher = useFetcher();
  const fitbitFetcher = useFetcher();
  const { userId } = useAuth();
  const { authenticated } = useKollaEvents();

  useEffect(() => {
    if (authenticated) {
      if (wakaFetcher.state === "idle" && wakaFetcher.data == null) {
        wakaFetcher.load(`/api/wakatime/${userId}/weekly`);
      }
      if (linearFetcher.state === "idle" && linearFetcher.data == null) {
        linearFetcher.load(`/api/linear/${userId}/weekly`);
      }
      if (fitbitFetcher.state === "idle" && fitbitFetcher.data == null) {
        fitbitFetcher.load(`/api/fitbit/${userId}/weekly`);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authenticated]);

  const [sleepData, azmData] = useMemo(() => {
    if (!fitbitFetcher?.data) {
      return [];
    }
    const resp = fitbitFetcher.data as {
      sleep: SleepResponse;
      "azm": AZMResponse;
    };
    const sleepData = resp.sleep.sleep;
    console.log(resp)
    const azm = resp['azm']["activities-active-zone-minutes"];
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

  const completedIssues = useMemo(() => {
    const issues = (linearFetcher?.data ?? []) as Issue[];
    return issues.filter((issue) => !!issue.completedAt);
  }, [linearFetcher.data]);

  console.log(fitbitFetcher.data);

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
            {completedIssues?.length ?? 0}
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
          <h4 className="text-title-md font-bold text-white text-4xl">
            {completedIssues?.length ?? 0}
          </h4>
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
            {completedIssues?.length ?? 0}
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
          <h4 className="text-title-md font-bold text-white text-4xl">
            {completedIssues?.length ?? 0}
          </h4>
          <dt className="flex items-center gap-x-3 text-base font-semibold leading-7 pt-4 px-4 text-white">
            <CheckBadgeIcon
              className="h-5 w-5 flex-none text-indigo-400"
              aria-hidden="true"
            />
            Productivity
          </dt>
        </div>
      </div>
      <Bar options={options} data={data} />;
    </>
  );
}
