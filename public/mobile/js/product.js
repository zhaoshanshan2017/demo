$(function () {
    /*1. 根据地址栏商品ID获取商品数据渲染*/
    /*1.1 需要下拉刷新效果  下拉的时候去加载数据*/
    var productId = lt.getParamsByUrl().productId;
    console.log(productId);
    /*初始下拉组件之后内容不能点击click 只能tap */
    mui.init({
        pullRefresh:{
            container:'.mui-scroll-wrapper',
            indicators:false,
            down:{
                auto:true,
                callback:function () {
                    var that = this;
                    getProductData({id:productId},function (data) {
                        /*1.2 当加载数据成功  把商品展示出来*/
                        $('.mui-scroll').html(template('detail',data));
                        /*当你是动态渲染的时候 轮播图需要重新初始化一次*/
                        mui('.mui-slider').slider({
                            interval:2000
                        });
                        that.endPulldownToRefresh();
                    });
                }
            }
        }
    });
    /*2. 加入购物车功能*/
    $('.mui-scroll').on('tap','.p_size span',function () {
        $(this).addClass('now').siblings().removeClass('now');
    }).on('tap','.p_num span',function () {
        /*判断点的是加还是减*/
        var type = $(this).data('type');
        var $input = $('.p_num input');
        var value = $input.val();
        var max = $input.data('max');
        if(type == 0){
            /*减*/
            if(value <= 0){
                mui.toast('数量至少为1');
                return false;
            }
            value --;
            $input.val(value);
        }else{
            /*加*/
            if(value >= max){
                mui.toast('亲没货了');
                return false;
            }
            value ++;
            $input.val(value);
        }
    });
    /*2.1 验证是否选择尺码  如果没选择 提示：亲，请选择尺码 */
    /*2.2 验证是否选择数量  如果没选择 提示：亲，请至少选择一件 */
    /*2.3 请求加入购物车接口  商品ID 尺码  数量 */
    /*2.4 请求成功 */
    /*2.5 请求成功  已登录  加入成功*/
    /*2.6 加入成功 弹出提示框*/
    /*2.7 请求成功  未登录  数据有提示  例如 { error:400 } 去登录 */
    /*2.8 登录完成  回跳 商品详情页*/
    $('.btn_cart').on('tap',function () {
        var size = $('.p_size span.now').data('size');
        if(!size){
            mui.toast('亲，请选择尺码');
            return false;
        }
        var num = $('.p_num input').val();
        var max = $('.p_num input').data('max');
        if(num <= 0 || num > max ){
            /*不合法的数量*/
            mui.toast('亲，数量不对');
            return false;
        }
        lt.ajax({
            type:'post',
            url:'/cart/addCart',
            data:{
                productId:productId,
                size:size,
                num:num
            },
            dataType:'json',
            success:function (data) {
                /*已登录*/
                if(data.success){
                    /*弹窗*/
                    /*message 提示信息 title 弹窗标题 btnValue ['否','是'] callback 点击按钮的回调 type*/
                    mui.confirm('亲添加成功，去购物车看看？','温馨提示',['否','是'],function (e) {
                        /*e 是按钮信息*/
                        /*默认就是关闭效果*/
                        /*不想关闭 return false*/
                        if(e.index == 1){
                            location.href = '/mobile/user/cart.html';
                            return false;
                        }
                    });
                }
            }
        });
    });

});
var getProductData = function (params,callback) {
    $.ajax({
        type:'get',
        url:'/product/queryProductDetail',
        data:params,
        dataType:'json',
        success:function (data) {
            setTimeout(function () {
                callback && callback(data);
            },1000);
        }
    });
}