import { useRef } from "react";

const FormatData = (ms: string) => {
  function addZero(nu: number) {
    return nu < 10 ? "0" + nu : nu
  }
  let date = new Date(Number(ms)),
    year = date.getFullYear(),
    month = date.getMonth() + 1,
    day = date.getDate(),
    hour = date.getHours(),
    min = date.getMinutes(),
    sec = date.getSeconds();
  return year + '-' + addZero(month) + '-' + addZero(day) + " " + addZero(hour) + ":" + addZero(min) + ":" + addZero(sec)

}
interface ICurrent {
  fn: Function,
  timer: null | NodeJS.Timeout
}
const useThrottle = (fn: () => Promise<void>, wait: number) => {
  let timer = useRef<NodeJS.Timeout>()
  return () => {
      clearTimeout(timer.current)
      timer.current = setTimeout(fn, wait)
  }
}

interface elmentType {
  FormatData: (ms: string) => string,
  useThrottle:(fn: () => Promise<void>, wait: number)=>Function
}
export const utilFunc: elmentType = {
  FormatData: FormatData,
  useThrottle:useThrottle
}