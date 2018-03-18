//ajax
/**
 * 
 * @param {*} info 提交信息
 * @param {*} type get/post
 * @param {*} url 地址
 * @param {*} dateType  数据类型 
 * @param {*} callSuccess 成功
 * @param {*} callError 失败
 */
function req_ajax(info, type, url, dateType, callSuccess, callError) {
    $.ajax({
        data: {info: info},
        type: type,
        url: url,
        dateType: dateType,
        cache: false,
        timeout: 5000,
        success: callSuccess,
        error: callError
    });
};