
/**获取获取传入时间对象的 字符串表示
 * 
 * @param {Date} _time 时间对象 不传递默认未当前时间
 */
export function timeFormatting(_time) {
    function dealNum(num) {
        return num < 10 ? ('0' + num) : num;
    }
    const time = _time || new Date();
    return time.getFullYear() + '-' + dealNum(time.getMonth() + 1) + '-' + dealNum(time.getDate()) + ' ' + dealNum(time.getHours()) + ':' + dealNum(time.getMinutes()) + ':' + dealNum(time.getSeconds());
}

/** 是否为PC端
 * 
 */
export function isPC () {
    var userAgentInfo = navigator.userAgent;
    var Agents = ["Android", "iPhone", "SymbianOS", "Windows Phone", "iPad", "iPod", 'XiaoMi'];
    var flag = true;
    for (var v = 0; v < Agents.length; v++) {
        if (userAgentInfo.indexOf(Agents[v]) > 0) {
            flag = false;
            break;
        }
    }
    return flag;
}