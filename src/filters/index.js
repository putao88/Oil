/**
 * Created by Administrator on 2017/12/7.
 */
// 过滤器

// 日期插件时间格式转换
export function UTCTime (UTCDateString) {
    if(!UTCDateString){
        return '';
    }
    function formatFunc(str) {    //格式化显示
        return str > 9 ? str : '0' + str
    }
    const date2 = new Date(UTCDateString);     //这步是关键
    const year = date2.getFullYear();
    const mon = formatFunc(date2.getMonth() + 1);
    const day = formatFunc(date2.getDate());
    const hour = formatFunc(date2.getHours());
    const min = formatFunc(date2.getMinutes());
    const sec = formatFunc(date2.getSeconds());
    const dateStr = year+'-'+mon+'-'+day+' '+hour+':'+min+':'+sec;
    return dateStr;
}
