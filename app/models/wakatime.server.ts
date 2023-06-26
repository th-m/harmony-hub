import type { StartEndToDates} from "~/utils/date";
import { formatDate, startEndToDate, substractDays } from "~/utils/date";

interface Args {
  start: Date | string;
  end: Date | string;
  token: string;
}

const getSummaryURL = ({ start, end }: Args) => {
  const intervalStart = formatDate(start);
  if(typeof end === "string"){
    end = new Date(end);
  }
  const intervalEnd = formatDate(substractDays(end,1));

  return `https://wakatime.com/api/v1/users/current/summaries?start=${intervalStart}&end=${intervalEnd}`;
};

export interface WakatimeSummary {
  data: Daum[]
  start: string
  end: string
  cumulative_total: CumulativeTotal
  daily_average: DailyAverage
}

export interface Daum {
  languages: Language[]
  grand_total: GrandTotal
  editors: Editor[]
  operating_systems: OperatingSystem[]
  categories: Category[]
  dependencies: Dependency[]
  machines: Machine[]
  projects: Project[]
  range: Range
}

export interface Language {
  name: string
  total_seconds: number
  digital: string
  decimal: string
  text: string
  hours: number
  minutes: number
  seconds: number
  percent: number
}

export interface GrandTotal {
  hours: number
  minutes: number
  total_seconds: number
  digital: string
  decimal: string
  text: string
}

export interface Editor {
  name: string
  total_seconds: number
  digital: string
  decimal: string
  text: string
  hours: number
  minutes: number
  seconds: number
  percent: number
}

export interface OperatingSystem {
  name: string
  total_seconds: number
  digital: string
  decimal: string
  text: string
  hours: number
  minutes: number
  seconds: number
  percent: number
}

export interface Category {
  name: string
  total_seconds: number
  digital: string
  decimal: string
  text: string
  hours: number
  minutes: number
  seconds: number
  percent: number
}

export interface Dependency {
  name: string
  total_seconds: number
  digital: string
  decimal: string
  text: string
  hours: number
  minutes: number
  seconds: number
  percent: number
}

export interface Machine {
  name: string
  total_seconds: number
  machine_name_id: string
  digital: string
  decimal: string
  text: string
  hours: number
  minutes: number
  seconds: number
  percent: number
}

export interface Project {
  name: string
  total_seconds: number
  digital: string
  decimal: string
  text: string
  hours: number
  minutes: number
  seconds: number
  percent: number
  color: any
}

export interface Range {
  start: string
  end: string
  date: string
  text: string
  timezone: string
}

export interface CumulativeTotal {
  seconds: number
  text: string
  digital: string
  decimal: string
}

export interface DailyAverage {
  holidays: number
  days_minus_holidays: number
  days_including_holidays: number
  seconds: number
  seconds_including_other_language: number
  text: string
  text_including_other_language: string
}

export async function wakatimeSummary({ start, end, token }: Args) {
  const myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");
  myHeaders.append("Authorization", `Bearer ${token}`);

  const requestOptions: RequestInit = {
    method: "GET",
    headers: myHeaders,
  };
  const url = getSummaryURL({ start, end, token });

  const reqWakatime = await fetch(url, requestOptions);
  const wakaJson:WakatimeSummary = await reqWakatime.json();

  return wakaJson;
}

export const wakaWeekly = (token: string) => async ({start,end}:StartEndToDates) => {
    // const {start,end} = startEndToDate(args)
  
    const data = await wakatimeSummary({
      start,
      end,
      token,
    });
    return data;
  }