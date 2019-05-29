
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