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
import { Sleep, SleepResponse } from "~/models/fitbit.server";
import { WakatimeSummary } from "~/models/wakatime.server";
import { addDays, formatDate, weekStartEnd } from "~/utils/date";
import { msToHours } from "~/utils/time";

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

  const sleepData: Sleep[] = useMemo(() => {
    if (!fitbitFetcher?.data) {
      return [];
    }
    const sleepResponse = fitbitFetcher.data as { sleep: SleepResponse };
    const sleepData = sleepResponse.sleep.sleep;
    const mappedSleep: Record<string, Sleep> = sleepData.reduce((acc, prev) => {
      if (weekMap[prev.dateOfSleep]) {
        return { ...acc, [prev.dateOfSleep]: prev };
      }
      return acc;
    }, {});
    const array = Object.keys(weekMap).map(
      (key) => mappedSleep?.[key] ?? undefined
    );
    return array;
  }, [fitbitFetcher]);

  const wakaData = useMemo(
    () => wakaFetcher.data,
    [wakaFetcher.data]
  ) as WakatimeSummary;

  const totalTimeCoding =
    wakaData?.data?.map((datum) => datum.grand_total.total_seconds / 60 / 60) ??
    [];

  const timeSleeping = sleepData.map((sleep) =>
    msToHours(sleep?.duration ?? 0)
  );

  const data = {
    labels,
    datasets: [
      {
        label: "Sleep",
        data: timeSleeping,
        backgroundColor: "rgba(53, 162, 235, 0.7)",
      },
      // {
      //   label: "Exercise",
      //   data: labels.map(() => Math.random() * 24),
      //   backgroundColor: "rgba(255, 99, 132, 0.7)",
      // },
      {
        label: "Coding",
        data: totalTimeCoding,
        backgroundColor: "rgba(99, 253, 162, 0.7)",
      },
    ],
  };
  return <Bar options={options} data={data} />;
}
