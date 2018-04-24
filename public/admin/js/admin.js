/*加载进度显示功能  提供给所有ajax请求*/
/*1. 加载进度插件  nprogress*/
/*1.1 https://github.com/rstacruz/nprogress 下载*/
/*1.2 引入 js css */
/*1.3 当ajax请求开始  进度开始  当ajax结束  进度结束*/
/*1.4 监听所有ajax发送前的时候*/
/*1.5 监听所有ajax结束后的时候*/
$(window).ajaxStart(function () {
    /*发送开始*/
    NProgress.start();
});
$(window).ajaxStop(function () {
    /*发送开始*/
   NProgress.done();
});
NProgress.configure({ showSpinner: false });

/*2. 左菜单的显示隐藏*/
$('[data-menu]').on('click',function () {
    $('.ad_aside').toggle();
    $('.ad_section').toggleClass('menu');
});
/*3. 二级菜单的显示隐藏*/
$('.menu').on('click','li a[href="javascript:;"]',function () {
    $(this).next('.child').slideToggle();
});
/*4. 退出管理系统*/
var html = '<div class="modal fade" id="myModal">\n' +
        '    <div class="modal-dialog modal-sm">\n' +
        '        <div class="modal-content">\n' +
        '            <div class="modal-header">\n' +
        '                <button type="button" class="close" data-dismiss="modal" ><span>&times;</span></button>\n' +
        '                <h4 class="modal-title">温馨提示</h4>\n' +
        '            </div>\n' +
        '            <div class="modal-body">\n' +
        '                <p class="text-danger">\n' +
        '                    <span class="glyphicon glyphicon-alert"></span>\n' +
        '                    您确定要退出后台管理系统吗？\n' +
        '                </p>\n' +
        '            </div>\n' +
        '            <div class="modal-footer">\n' +
        '                <button type="button" class="btn btn-default" data-dismiss="modal">取消</button>\n' +
        '                <button type="button" class="btn btn-primary">确认</button>\n' +
        '            </div>\n' +
        '        </div>\n' +
        '    </div>\n' +
        '</div>';
$('body').append(html).on('click','#myModal .btn-primary',function () {
    $.ajax({
        type:'get',
        url:'/employee/employeeLogout',
        data:'',
        dataType:'json',
        success:function (data) {
            if(data.success){
                location.href = '/admin/login.html';
            }
        }
    });
});

