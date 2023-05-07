export const FormatData=(ms: string)=>{
    let date = new Date(Number(ms)),
      year = date.getFullYear(),
      month = date.getMonth() + 1,
      day = date.getDate(),
      hour = date.getHours(),
      min = date.getMinutes(),
      sec = date.getSeconds();
    return year + '-' + addZero(month) + '-' + addZero(day) + " " + addZero(hour) + ":" + addZero(min) + ":" + addZero(sec)
  
  }
  function addZero(nu: number) {
    return nu < 10 ? "0" + nu : nu
  }