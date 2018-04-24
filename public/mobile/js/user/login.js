$(function () {
    /*1. 从别的需要登录的页面  跳转过来的*/
    /*1.1 登录完毕  回跳之前的页面 */
    /*1.2 必须根据地址回跳  之前的地址是多少？*/
    /*1.3 那些页面需要登录  加入购物车 购物车页面 个人中心 ...  */
    /*1.4 遇见以上情况 有一个同样的逻辑去处理 */
    /*1.5 逻辑：当已登录 去做你自己的业务 当未登录 跳转到登录页面  */
    /*1.6 登录拦截 */
    /*1.6.1 当你发起ajax,且当前请求需要登录,登录拦截,请求成功之后，根据数据去拦截*/
    /*2. 就是当前的登录页面*/
    /*2.1 登录完毕  跳转至个人中心*/
    $('.mui-btn-primary').on('tap',function () {
        var username = $.trim($('[type="text"]').val());
        var password = $.trim($('[type="password"]').val());
        if(!username){
            mui.toast('请输入用户名/手机号');
            return false;
        }
        if(!password){
            mui.toast('请输入密码');
            return false;
        }
        $.ajax({
            type:'post',
            url:'/user/login',
            data:{
                username:username,
                password:password
            },
            dataType:'json',
            success:function (data) {
                console.log(data.success);
                if(data.success){
                    var returnUrl = lt.getParamsByUrl().returnUrl;

                    if(returnUrl){
                        location.href = returnUrl;
                    }else{
                        location.href = '/mobile/user/index.html';
                    }
                }
            }
        });
    });
});
