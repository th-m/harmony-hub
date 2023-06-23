import { formatDate } from "~/utils/date";

interface Args {
  start: Date;
  end: Date;
  token: string;
}

const getSleepURL = (start: Date,end:Date) => {
  const intervalStart = formatDate(start);
  const intervalEnd = formatDate(end);

  return `https://api.fitbit.com/1.2/user/-/sleep/list.json?afterDate=${intervalStart}&sort=asc&offset=0&limit=7`;
};


  export interface SleepResponse {
    pagination: Pagination
    sleep: Sleep[]
  }
  
  export interface Pagination {
    afterDate: string
    limit: number
    next: string
    offset: number
    previous: string
    sort: string
  }
  
  export interface Sleep {
    dateOfSleep: string
    duration: number
    efficiency: number
    endTime: string
    infoCode: number
    isMainSleep: boolean
    levels: Levels
    logId: number
    logType: string
    minutesAfterWakeup: number
    minutesAsleep: number
    minutesAwake: number
    minutesToFallAsleep: number
    startTime: string
    timeInBed: number
    type: string
  }
  
  export interface Levels {
    data: Daum[]
    shortData: ShortDaum[]
    summary: Summary
  }
  
  export interface Daum {
    dateTime: string
    level: string
    seconds: number
  }
  
  export interface ShortDaum {
    dateTime: string
    level: string
    seconds: number
  }
  
  export interface Summary {
    deep: Deep
    light: Light
    rem: Rem
    wake: Wake
  }
  
  export interface Deep {
    count: number
    minutes: number
    thirtyDayAvgMinutes: number
  }
  
  export interface Light {
    count: number
    minutes: number
    thirtyDayAvgMinutes: number
  }
  
  export interface Rem {
    count: number
    minutes: number
    thirtyDayAvgMinutes: number
  }
  
  export interface Wake {
    count: number
    minutes: number
    thirtyDayAvgMinutes: number
  }
  
export async function sleepSummary({ start, end, token }: Args) {
  const myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");
  myHeaders.append("Authorization", `Bearer ${token}`);

  const requestOptions: RequestInit = {
    method: "GET",
    headers: myHeaders,
  };
  const url = getSleepURL(start,end);

  const fitbitSleep = await fetch(url, requestOptions);
  const data:SleepResponse = await fitbitSleep.json();
  
  return data;
}
