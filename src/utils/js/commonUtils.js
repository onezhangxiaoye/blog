export function timeFormatting() {
    function dealNum(num) {
        return num < 10 ? ('0' + num) : num;
    }
    const time = new Date();
    return time.getFullYear() + '-' + dealNum(time.getMonth() + 1) + '-' + dealNum(time.getDate()) + ' ' + dealNum(time.getHours()) + ':' + dealNum(time.getMinutes()) + ':' + dealNum(time.getSeconds());
}