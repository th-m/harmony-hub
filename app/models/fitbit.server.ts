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

const getAZMURL = (end:Date, p:typeof period[number]) => {
  
  const intervalEnd = formatDate(end);
  return `https://api.fitbit.com/1/user/-/activities/active-zone-minutes/date/${intervalEnd}/${p}.json`;
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

  export interface AZMResponse {
    'activities-active-zone-minutes': AZM[]
  }
  export interface AZM {
    dateTime: string
    value: Value
  }
  
  export interface Value {
    fatBurnActiveZoneMinutes: number
    cardioActiveZoneMinutes: number
    activeZoneMinutes: number
  }
  
  
export async function sleepSummary({ start, end, token }: Args) {
  const myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");
  myHeaders.append("Authorization", `Bearer ${token}`);

  const requestOptions: RequestInit = {
    method: "GET",
    headers: myHeaders,
  };
  const sleepURL = getSleepURL(start,end);

  const fitbitSleep = await fetch(sleepURL, requestOptions);
  const data:SleepResponse = await fitbitSleep.json();
  
  
  return data;
}
const period = ['1d', '7d', '30d', '1w', '1m', '3m', '6m', '1y'] as const;
interface azmArgs {
  period: typeof period[number];
  end: Date;
  token: string;
}

export async function azmSummary({ end, token, period }: azmArgs) {
  const myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");
  myHeaders.append("Authorization", `Bearer ${token}`);

  const requestOptions: RequestInit = {
    method: "GET",
    headers: myHeaders,
  };
  
  const azmURL = getAZMURL(end,period);


  const fitbitAZM = await fetch(azmURL, requestOptions);
  const data:AZM[] = await fitbitAZM.json();
  
  return data;
}
