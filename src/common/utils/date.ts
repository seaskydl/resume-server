const moment = require("moment");
// 获取当前时间
export const getNowDate = (value: string = '') => {
  if (value) {
    return moment(value).format("YYYY-MM-DD HH:mm:ss");
  } else {
    return moment().format("YYYY-MM-DD HH:mm:ss");
  }
};
