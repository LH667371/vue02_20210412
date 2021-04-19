export function formatDate(params ) {
    let defalutParams = {
        date: new Date(),
        formatStr: 'yyyy-MM-dd HH:mm:ss'
    }
    params = { ...defalutParams, ...params };
    let date = params.date;
    let formatStr = params.formatStr;
    // 传入日期字符串 - 转成时间戳 - 转成标准时间
    let timeStamp = new Date(date).getTime();
    date = new Date(timeStamp);
    formatStr = formatStr.replace(new RegExp('yyyy'), `${date.getFullYear()}`);
    const month = date.getMonth() + 1;
    formatStr = formatStr.replace(new RegExp('MM'), `${month > 9 ? month : '0' + month}`);
    const day = date.getDate();
    formatStr = formatStr.replace(new RegExp('dd'), `${day > 9 ? day : '0' + day}`);
    const hour = date.getHours();
    formatStr = formatStr.replace(new RegExp('HH'), `${hour > 9 ? hour : '0' + hour}`);
    const min = date.getMinutes();
    formatStr = formatStr.replace(new RegExp('mm'), `${min > 9 ? min : '0' + min}`);
    const sec = date.getSeconds();
    formatStr = formatStr.replace(new RegExp('ss'), `${sec > 9 ? sec : '0' + sec}`);
    return formatStr;
}
