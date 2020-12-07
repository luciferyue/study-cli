export const setCookie = (key, val, time) => {
  const date = new Date(); //获取当前时间
  const expiresDays = time; //将date设置为n天以后的时间
  date.setTime(date.getTime() + expiresDays * 24 * 3600 * 1000); //格式化为cookie识别的时间
  document.cookie = key + "=" + val + ";expires=" + date.toGMTString() + ";path=/"; //设置cookie
};

/**
 * isBrowser
 * @returns {boolean}
 */
export const isBrowser = () => {
  return typeof window != "undefined";
};
