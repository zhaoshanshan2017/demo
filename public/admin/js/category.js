$(function () {
    /*1. 默认展示第一页*/
    window.page = 1;
    var render = function () {
        getSecondCategoryData(function (data) {
            $('tbody').html(template('list',data));
            /*2. 分页展示*/
            /*当响应成的时候  当前页 总页数*/
            $('.pagination').bootstrapPaginator({
                /*使用3版本的bootstrap*/
                bootstrapMajorVersion:3,
                /*按钮大小*/
                size:'small',
                /*显示按钮的个数*/
                numberOfPages:10,
                currentPage:data.page,
                totalPages: Math.ceil(data.total/data.size),
                onPageClicked:function (event, originalEvent, type,page) {
                    /*event jquery事件对象*/
                    /*originalEvent dom事件对象*/
                    /*type 按钮的类型 */
                    /*page 当前按钮的页码*/
                    window.page = page;
                    render();
                }
            });
        });
    }
    render();
    /*3. 添加分类*/
    /*3.1 初始化 一级分类下拉菜单*/
    $.ajax({
        type:'get',
        url:'/category/queryTopCategoryPaging',
        data:{
            page:1,
            pageSize:100
        },
        dataType:'json',
        success:function (data) {
            $('#addModal').find('.dropdown-menu')
                .html(template('downMenu',data)).on('click','a',function () {
                    $('.topCategory').html($(this).html());
                    $('[name="categoryId"]').val($(this).data('id'));
                    $('#addCategoryForm').data('bootstrapValidator').updateStatus('categoryId','VALID',null)
            });
        }
    });
    /*3.2 初始化 上传图片*/
    $('#fileUpload').fileupload({
        url:'/category/addSecondCategoryPic',
        dataType:'json',
        done:function (e,data) {
            $('.img_box img').attr('src',data.result.picAddr);
            $('[name="brandLogo"]').val(data.result.picAddr);
            $('#addCategoryForm').data('bootstrapValidator').updateStatus('brandLogo','VALID',null)
        }
    });

    $('#addCategoryForm').bootstrapValidator({
        excluded:[],
        feedbackIcons: {
            valid: 'glyphicon glyphicon-ok',
            invalid: 'glyphicon glyphicon-remove',
            validating: 'glyphicon glyphicon-refresh'
        },
        fields:{
            categoryId:{
                validators:{
                    notEmpty:{
                        message:'请选择分类'
                    }
                }
            },
            brandName:{
                validators:{
                    notEmpty:{
                        message:'请输入品牌名称'
                    }
                }
            },
            brandLogo:{
                validators:{
                    notEmpty:{
                        message:'请上传品牌LOGO'
                    }
                }
            }
        }
    }).on('success.form.bv',function (e) {
        e.preventDefault();
        var form = $(e.target);
        $.ajax({
            type:'post',
            url:'/category/addSecondCategory',
            data:form.serialize(),
            dataType:'json',
            success:function (data) {
                if(data.success){
                    window.page = 1;
                    render();
                    $('#addModal').modal('hide');
                }
            }
        })
    });
});
var getSecondCategoryData = function (callback) {
    $.ajax({
        type: 'get',
        url: '/category/querySecondCategoryPaging',
        data: {
            page: window.page || 1,
            pageSize: 2
        },
        dataType:'json',
        success:function (data) {
            callback && callback(data);
        }
    });
}