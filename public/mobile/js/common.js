/*准备一个全局对象  用来挂载公用方法  lt.xxx去调用*/
window.lt = {};
/*封装获取地址栏数据的方法*/
/*
* ?key=value&key1=value1 ---->  {key:value,key1:value1}
* 返回的数据是对象
* 问题：特殊字符 & = 中文 ?  转码
* encodeURIComponent 编码URL decodeURIComponent 解码URL
* 约定：传 编码  获取  解码
* */
lt.getParamsByUrl = function (url) {
    var params = {};
    var search = url || location.search; //获取地址栏的get方式传递的数据
    if (search) {
        search = search.replace('?','');
        /*生成数据 拼接对象*/
        var arr = search.split('&');
        arr.forEach(function (item,i) {
            // item   key=value  key1=value1
            var arrItem = item.split('=');
            var key = arrItem[0];
            var value = arrItem[1];
            /*解析URL编码在存入对象*/
            params[key] = decodeURIComponent(value);
        });
    }
    return params;
};
/*会做登录拦截的ajax*/
/* $.ajax({一坨参数}); */
lt.ajax = function (options) {
    $.ajax({
        type:options.type || 'get',
        url:options.url || '#',
        data:options.data || '',
        dataType:options.dataType || 'json',
        success:function (data) {
            /*未登录*/
            /*登录拦截*/
            if(data.error == 400){
                location.href = '/mobile/user/login.html?returnUrl='+encodeURIComponent(location.href);
            }
            /*已登录*/
            else{
                options.success && options.success(data);
            }
        },
        error:function () {
            mui.toast('服务繁忙');
        }
    });
};