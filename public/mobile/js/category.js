$(function () {
    /*1. 默认渲染一级分类和第一个一级分类对应的二级分类*/
    /*1.1 获取一级分类数据*/
    /*1.2 渲染分类侧边栏*/
    /*1.3 获取一级分类的ID  通过它才能获取二级分类*/
    /*1.4 根据这个ID区获取数据*/
    /*1.5 渲染二级分类*/
    getTopCategoryData(function (data) {
        $('.cate_left ul').html(template('topCategoryTpl', data));
        var topCategoryId = data.rows[0].id;
        getSecondCategoryData({id: topCategoryId}, function (data) {
            $('.cate_right_box ul').html(template('secondCategoryTpl', data));
        });
    });

    /*2. 点击一级分类选中且加载渲染出对应的二级分类*/
    /* mui对tap进行了封装  zepto 也封装（touch） */
    /*2.1 点击的时候更换类名*/
    /*2.2 根据当前点击的分类的ID 去获取二级分类的数据*/
    /*2.3 渲染二级分类*/
    /*2.3.1 当有数据的时候回 正常渲染*/
    /*2.3.2 当没有数据的时候回 提示用户  没有数据*/
    /*2.3.3 当图片没有加载成功  需要一张默认图 */
    /*onerror="console.log(this)"  this 指向的当前图片*/
    $('.cate_left ul').on('tap', 'a', function () {
        $('.cate_left ul').find('li').removeClass('now');
        $(this).parent().addClass('now');
        var topCategoryId = $(this).data('id');
        getSecondCategoryData({id: topCategoryId}, function (data) {
            $('.cate_right_box ul').html(template('secondCategoryTpl', data));
        });
        return false;
    });
});
/*
* @callback 数据获取成功回调函数
* */
var getTopCategoryData = function (callback) {
    $.ajax({
        type: 'get',
        url: '/category/queryTopCategory',
        data: '',
        dataType: 'json',
        success: function (data) {
            callback && callback(data);
        }
    });
};
/*
* @params 传参对象  {id:1234}
* @callback 数据获取成功回调函数
* */
var getSecondCategoryData = function (params, callback) {
    $.ajax({
        type: 'get',
        url: '/category/querySecondCategory',
        data: params,
        dataType: 'json',
        success: function (data) {
            callback && callback(data);
        }
    });
};