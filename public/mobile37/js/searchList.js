$(function () {
    /*区域滚动初始化*/
    /*mui('.mui-scroll-wrapper').scroll();*/
    /*1.页面初始化 关键字填输入框 根据关键字搜索展示商品列表*/
    $('.lt_search input').val(lt.getParamsByUrl().key);
    /*当配置自动加载的时候 没有必要去加载*/
    /*getProductListData(function (data) {
        $('.lt_product').html(template('productListTemplate',data));
    });*/
    /*2.下拉刷新*/
    mui.init({
        pullRefresh : {
            container:"#refreshContainer",//下拉刷新容器标识，querySelector能定位的css选择器均可，比如：id、.class等
            down : {
                auto: true,
                callback :function () {
                    var that = this;
                    /*setTimeout(function () {
                        /!*mui('#refreshContainer').pullRefresh().endPulldownToRefresh();*!/
                        /!*停止下拉刷新*!/
                        that.endPulldownToRefresh();
                    },2000);*/
                    getProductListData(function (data) {
                        $('.lt_product').html(template('productListTemplate',data));
                        that.endPulldownToRefresh();
                    });
                }
            }
        }
    });
});
var getProductListData = function (callback) {
    $.ajax({
        type: 'get',
        url: '/product/queryProduct',
        data: {
            proName: $('.lt_search input').val(),
            page: 1,
            pageSize: 4
        },
        dataType:'json',
        success:function (data) {
            /*增加一点加载时间*/
            setTimeout(function () {
                callback && callback(data);
            },1000);
        }
    });
}