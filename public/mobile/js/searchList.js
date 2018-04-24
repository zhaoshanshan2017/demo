$(function () {
    /*初始化区域滚动插件*/
    //mui('.mui-scroll-wrapper').scroll();
    /*需求*/
    /*1. 当页面初始化的时候根据地址栏数据KEY去后台加载数据渲染商品列表*/
    /*1.1 拿地址栏数据*/
    var key = lt.getParamsByUrl().key;
    window.params = {
        proName: key,
        page: 1,
        pageSize: 4
    };
    /*默认是第一页 4条数据*/
    /*1.2 关键字设置在搜索框*/
    var $searchInput = $('.lt_search input');
    $searchInput.val(key);
    /*1.3 在请求后台数据的同时 需要加载效果  加载完成之后再取消这个效果*/
    /*1.4 请求后台获取商品数据且渲染*/
    mui.init({
        /*初始拉组件*/
        pullRefresh: {
            /*容器*/
            container: '.mui-scroll-wrapper',
            /*不需要滚动条*/
            indicators: false,
            /*下拉刷新*/
            down: {
                /*自动拉一次*/
                auto: true,
                callback: function () {
                    // this 组件对象  endPulldownToRefresh()
                    var that = this;
                    //console.log(this);
                    /*是拉完之后的回调函数*/
                    window.params.page = 1;
                    getProductData(function (data) {
                        /*1.3 进行渲染*/
                        $('.lt_product ul').html(template('list', data));
                        /*1.4 结束下拉刷新*/
                        that.endPulldownToRefresh();
                        /*只有下拉刷新  重置上拉加载效果  必须在下拉刷新结束之后去重置*/
                        that.refresh(true);
                    });
                }
            },
            /*上拉加载*/
            up: {
                callback: function () {
                    var that = this;
                    /*上拉操作之后的回调函数*/
                    /*2. 下一页数据加载和渲染*/
                    window.params.page++;
                    getProductData(function (data) {
                        /*2.1 进行渲染*/
                        $('.lt_product ul').append(template('list', data));
                        /*2.2 结束上拉加载*/
                        /*判断是否有数据*/
                        if (data.data && data.data.length) {
                            /*有就默认调用*/
                            that.endPullupToRefresh();
                        } else {
                            /*没有就调用传递true*/
                            that.endPullupToRefresh(true);
                        }
                        //that.endPullupToRefresh(!data.data.length);
                    });
                }
            }
        }
    });
    /*3. 点击搜索商品展示*/
    $('.lt_search a').on('tap', function () {
        var key = $.trim($searchInput.val());
        if (!key) {
            mui.toast('请输入关键字');
            return false;
        }
        if (window.params.proName == key) {
            mui.toast('亲，改下再搜');
            return false;
        }
        window.params.proName = key;
        /*主动触发下拉刷新  执行它的回调函数  重新发起请求  */
        mui('.mui-scroll-wrapper').pullRefresh().pulldownLoading();
    });

    /*4. 点击排序根据同的排序进行商品的展示*/
    $('.lt_order a').on('tap', function () {
        var $this = $(this);
        var $all = $('.lt_order a');
        var isChange = $this.hasClass('now');
        /*1. 当前元素没有now*/
        if (!isChange) {
            $all.removeClass('now');
            $this.addClass('now');
            /*重置箭头*/
            $all.find('span:last-child').addClass('fa-angle-down').removeClass('fa-angle-up');
        }
        /*2. 当前元素有now*/
        else {
            /*改变箭头*/
            var $span = $this.find('span:last-child');
            if ($span.hasClass('fa-angle-down')) {
                $span.removeClass('fa-angle-down').addClass('fa-angle-up');
            } else {
                $span.addClass('fa-angle-down').removeClass('fa-angle-up');
            }
        }
        /*排序*/
        /*
        * price   |否|使用价格排序（1升序，2降序）
          num     |否|产品库存排序（1升序，2降序）
        * */
        var key = $this.data('orderType');
        var value = $this.find('span:last-child').hasClass('fa-angle-down') ? 2 : 1;
        /* window.params[key] = value;  加上排序的类型和类型对应的值*/
        /* 只传递一种排序  不能保留之前的排序*/
        //window.params.price = null;
        //window.params.num = null;
        /* delete object.num  删除属性*/
        /* 但是有很多排序  数组存排序方式 进行删除 */
        ['price','num'].forEach(function (item) {
            delete  window.params[item];
        });
        window.params[key] = value;
        /*主动触发下拉刷新  执行它的回调函数  重新发起请求  */
        mui('.mui-scroll-wrapper').pullRefresh().pulldownLoading();
    });
});
var getProductData = function (callback) {
    $.ajax({
        type: 'get',
        url: '/product/queryProduct',
        data: window.params,
        dataType: 'json',
        success: function (data) {
            /*注意：测试下拉效果加的延迟*/
            setTimeout(function () {
                callback && callback(data);
            }, 1000);
        }
    })
};