$(function () {
    /*1. 当页面初始化  默认下拉一次  展示购物车商品*/
    /*2. 下拉刷新功能*/
    /*3. 点击刷新按钮  触发下拉刷新功能*/
    mui.init({
        pullRefresh: {
            container: '.mui-scroll-wrapper',
            down: {
                auto: true,
                callback: function () {
                    var that = this;
                    getCartData(function (data) {
                        /*data 就是商品数组*/
                        $('.mui-table-view').html(template('cart',data));
                        that.endPulldownToRefresh();
                    })
                }
            }
        }
    });
    $('.fa-refresh').on('tap',function () {
        mui('.mui-scroll-wrapper').pullRefresh().pulldownLoading();
    });

    /*4. 滑动显示编辑按钮 点击编辑按钮 弹窗：当前商品所有的尺寸  且 显示当前的数量 */
    /*4.1 弹窗功能*/
    /*4.2 弹窗里面需要显示  所有的尺码和显示选择数量和库存  当前商品的*/
    /*4.3 选择尺码  选择数量*/
    /*4.4 确认修改  请求接口*/
    /*4.5 修改成功  重新渲染列表*/
    $('.mui-table-view').on('tap','.mui-icon-compose',function () {
        var $this = $(this);
        /*可以使用html格式的字符串*/
        /*模板就是返回的html格式的字符串*/
        /*返回的字符串和当前商品数据有关*/
        /* 获取当前点击的商品数据  从window.cartData  根据商品ID */
        var productId = $(this).data('id');
        var item = getProductDataById(productId);
        var html = template('edit',item);
        console.log(html);
        /*mui v3.0 版本(含)以上的dialog控件支持换行（\n）显示 换行会解析成<br/>*/
        /*把html格式的字符串 去掉换行*/
        mui.confirm(html.replace(/\n/g,''),'编辑商品',['取消','确认'],function (e) {
            if(e.index == 1){
                /*点击的确认*/
                /*当前页面已经登录  但是有情况  在其他页面做了退出 */
                /*在发送请求之前  校验数据*/
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
                    url:'/cart/updateCart',
                    data:{
                        id:productId,
                        size:size,
                        num:num
                    },
                    dataType:'json',
                    success:function (data) {
                        if(data.success){
                            /*修改列表中的数据 window.cartData的数据*/
                            item.size = size;
                            item.num = num;
                            /*重新渲染列表*/
                            $('.mui-table-view').html(template('cart',window.cartData));
                            /*计算价格*/
                            setAmount();
                        }
                    }
                });
            }
            else{
                /*点击取消  收起滑块  包裹滑块的大容器 dom元素*/
                var elem = $this.parent().parent()[0];
                mui.swipeoutClose(elem);
            }
        });
    });
    $('body').on('tap','.p_size span',function () {
        $(this).addClass('now').siblings().removeClass('now');
    }).on('tap','.changeNum span',function () {
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


    /*5. 滑动显示删除按钮 弹窗 温馨提示*/
    $('.mui-table-view').on('tap','.mui-icon-trash',function () {
        var $this = $(this);
        var productId = $this.data('id');
        mui.confirm('老铁，确认删除改商品吗？','删除商品',['取消','确认'],function (e) {
            if(e.index == 1){
                /*确定*/
                lt.ajax({
                    type:'get',
                    url:'/cart/deleteCart',
                    data:{
                        id:productId
                    },
                    dataType:'json',
                    success:function (data) {
                        if(data.success){
                            /*删除列表中的数据 window.cartData的数据*/
                            window.cartData.splice(getIndexById(productId),1);
                            /*重新渲染列表*/
                            $('.mui-table-view').html(template('cart',window.cartData));
                            /*计算价格*/
                            setAmount();
                        }
                    }
                });
            }else{
                /*取消*/
                /*点击取消  收起滑块  包裹滑块的大容器 dom元素*/
                var elem = $this.parent().parent()[0];
                mui.swipeoutClose(elem);
            }
        });
    });

    /*6. 实时计算 商品总额*/
    /*6.1 选择复选框的时候  计算*/
    $('.mui-table-view').on('change','input',function () {
        var id = $(this).data('id');
        var item = getProductDataById(id);
        /* this.checked  == .prop('checked')  判断是否选中*/
        item.checked = this.checked;
        setAmount();
    })
    /*6.2 编辑完商品的时候  计算*/
    /*6.3 删除完商品的时候  计算*/

});
var getCartData = function (callback) {
    lt.ajax({
        type: 'get',
        url: '/cart/queryCart',
        data: '',
        dataType:'json',
        success:function (data) {
            /*存所有购物车数据*/
            window.cartData = data;
            callback && callback(data);
        }
    });
};
/*根据商品ID获取数量列表上商品数据*/
var getProductDataById = function (id) {
    var product = {};
    window.cartData.forEach(function (item) {
        if(id == item.id ){
            product = item;
            return false;
        }
    });
    return product;
};
var getIndexById = function (id) {
    var index = null;
    window.cartData.forEach(function (item,i) {
        if(id == item.id ){
            index = i;
            return false;
        }
    });
    return index;
};
var setAmount = function () {
    /*1. 取到所有选中的商品*/
    /*2. 计算所有商品的价格  当个商品的价格 = 单价 * 数量 */
    /*3. 求和*/

    /*思考： 获取所有的选中复选框  元素上记录 data-id 根据这个id去获取商品数据*/
    /*实际：操作复选框的时候  给当前数据加 是否选中的标识 */
    /*只需 变量当前的列表数据 根据这个标识去计算  价格*/
    var amount = 0;
    window.cartData.forEach(function (item,i) {
        if(item.checked){
            amount += item.price * 100 * item.num;
        }
    });
    $('.amount span').html(amount/100);
    /*乘以100  最后除以100  防止 浮点数运算会有生成小数点 */
};