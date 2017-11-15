/**
 * Created by Administrator on 2017/10/16.
 */
import Axios from '../../util/fetch';
// export function Clock(clock){
//   var week = ['星期天', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'];
//   var timerID = setInterval(updateTime, 1000);
//   updateTime();
//   function updateTime() {
//     var cd = new Date();
//     clock= zeroPadding(cd.getFullYear(), 4) + '-' + zeroPadding(cd.getMonth()+1, 2) + '-' + zeroPadding(cd.getDate(), 2)+' ';
//     clock+= zeroPadding(cd.getHours(), 2) + ':' + zeroPadding(cd.getMinutes(), 2) + ':' + zeroPadding(cd.getSeconds(), 2)+' , ' + week[cd.getDay()];
//   }
//   function zeroPadding(num, digit) {
//     var zero = '';
//     for(var i = 0; i < digit; i++) {
//       zero += '0';
//     }
//     return (zero + num).slice(-digit);
//   }
//   return clock;
// }
// 获取所有加油站及加油站下的信息
export function GetAllMessage(data,value) {
    Axios.get('selectUserHas.do', {
        params: {
            uid: value
        },
    })
        .then((res) => {
            data = res.data;
        })
}

