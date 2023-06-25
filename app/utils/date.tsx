export const formatDate = (date: Date) => {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(
    2,
    "0"
  )}-${date.getDate()}`;
};

export const weekStartEnd = (): { start: Date; end: Date } => {
  let end = new Date();
  let start = new Date();
  // Get the current day of the week (0 is Sunday, 1 is Monday, etc).
  let day = end.getDay();

  // Calculate the number of days to go back to the most recent Monday.
  let daysToSubtract = day === 0 ? 6 : day - 1;

  // Subtract the necessary number of days.
  end.setDate(end.getDate() - daysToSubtract);
  start.setDate(start.getDate() - (daysToSubtract + 7));

  return { end, start };
};

export const substractDays = (date: Date, days: number) => {
  date.setDate(date.getDate() - days);
  return date;
};
export const addDays = (date: Date, days: number) => {
  date.setDate(date.getDate() + days);
  return date;
};


export interface StartEndToDates { start: Date | string; end: Date | string };
export const startEndToDate = ({start,end}:StartEndToDates) => {
  if(typeof start === "string"){
    start = new Date(start)
  }
  if(typeof end === "string"){
    end = new Date(end)
  }
  return {start,end}
}
