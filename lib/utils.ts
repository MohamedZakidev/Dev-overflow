import { clsx, type ClassValue } from "clsx";
import qs from "query-string";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const getTimestamp = (createdAt: Date): string => {
  const now = new Date();
  const timeDifference = now.getTime() - createdAt.getTime();

  // Define time intervals in milliseconds
  const minute = 60 * 1000;
  const hour = 60 * minute;
  const day = 24 * hour;
  const week = 7 * day;
  const month = 30 * day;
  const year = 365 * day;

  if (timeDifference < minute) {
    // eslint-disable-next-line no-unused-vars, @typescript-eslint/no-unused-vars
    const seconds = Math.floor(timeDifference / 1000);
    return `Just now`
  } else if (timeDifference < hour) {
    const minutes = Math.floor(timeDifference / minute);
    return `${minutes} ${minutes === 1 ? 'minute' : 'minutes'} ago`;
  } else if (timeDifference < day) {
    const hours = Math.floor(timeDifference / hour);
    return `${hours} ${hours === 1 ? 'hour' : 'hours'} ago`;
  } else if (timeDifference < week) {
    const days = Math.floor(timeDifference / day);
    return `${days} ${days === 1 ? 'day' : 'days'} ago`;
  } else if (timeDifference < month) {
    const weeks = Math.floor(timeDifference / week);
    return `${weeks} ${weeks === 1 ? 'week' : 'weeks'} ago`;
  } else if (timeDifference < year) {
    const months = Math.floor(timeDifference / month);
    return `${months} ${months === 1 ? 'month' : 'months'} ago`;
  } else {
    const years = Math.floor(timeDifference / year);
    return `${years} ${years === 1 ? 'year' : 'years'} ago`;
  }
};

export const formatAndDivideNumber = (num: number): string => {
  if (num >= 1000000) {
    const formattedNum = (num / 1000000).toFixed(1);
    return `${formattedNum}M`;
  } else if (num >= 1000) {
    const formattedNum = (num / 1000).toFixed(1);
    return `${formattedNum}K`;
  } else {
    return num.toString();
  }
};

export const getJoinedDate = (date: Date): string => {
  // Extract the month and year from the Date object
  const month = date.toLocaleString('default', { month: 'long' });
  const year = date.getFullYear();

  // Create the joined date string (e.g., "September 2023")
  const joinedDate = `${month} ${year}`;

  return joinedDate;
}

interface URLQueryParams {
  queryParamaters: string
  key: string
  value: string | null
}

export const formURLQuery = ({ queryParamaters, key, value }: URLQueryParams) => {
  const currentQueryParamatersObj = qs.parse(queryParamaters)
  currentQueryParamatersObj[key] = value

  return qs.stringifyUrl({
    url: window.location.pathname,
    query: currentQueryParamatersObj
  }, { skipNull: true }
  )
}

interface RemoveURLQueryParams {
  queryParamaters: string
  keysToRemove: string[]
}


export const removeQueryParamater = ({ queryParamaters, keysToRemove }: RemoveURLQueryParams) => {
  const currentQueryParamatersObj = qs.parse(queryParamaters)

  keysToRemove.forEach(key => {
    delete currentQueryParamatersObj[key]
  })

  return qs.stringifyUrl({
    url: window.location.pathname,
    query: currentQueryParamatersObj
  }, { skipNull: true }
  )
}