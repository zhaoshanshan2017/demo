$(function () {
    /*1. 登录*/
    /*1.1 登录前做数据格式检验  前端做*/
    /*1.2 发送请求*/
    /*1.3 响应成功*/
    /*1.4 响应成功  后台逻辑处理成功*/
    /*1.5 响应成功  后台逻辑处理失败 告诉用户失败的原因*/


    /*http://blog.csdn.net/jewely/article/details/77810472*/
    /*http://blog.csdn.net/u013938465/article/details/53507109*/
    /*表单校验插件使用*/
    /*1. https://github.com/nghuuphuoc/bootstrapvalidator/  注意下载 v0.5.3 */
    /*2. 引入 css 文件  js  文件 */
    /*3. 按照bootstrap的表单组件  构建html代码  */
    /*4. 找到需要做校验的表单  初始化校验插件方法 */
    $('#loginForm').bootstrapValidator({
        /*根据验证结果显示的各种图标*/
        feedbackIcons: {
            valid: 'glyphicon glyphicon-ok',
            invalid: 'glyphicon glyphicon-remove',
            validating: 'glyphicon glyphicon-refresh'
        },
        /*去校验表单元素  用户名  密码*/
        /*校验状态：未校验 NOT_VALIDATED 正在校验 VALIDATING  校验成功 VALID 校验失败 INVALID */
        /*校验规则：是需要去配置*/
        /* fields 字段 --->  表单内的元素*/
        fields:{
            /*指定需要校验的元素  通过name数据去指定*/
            username:{
                /*配置校验规则  规则不止一个*/
                validators:{
                    /*配置具体的规则*/
                    notEmpty:{
                        /*校验不成功的提示信息*/
                        message:'请您输入用户名'
                    },
                    /*自定义规则*/
                    callback:{
                        message:'用户名错误'
                    }
                }
            },
            password:{
                validators:{
                    notEmpty:{
                        message:'请您输入密码'
                    },
                    stringLength:{
                        min:6,
                        max:18,
                        message:'密码6-18个字符'
                    },
                    /*自定义规则*/
                    callback:{
                        message:'密码错误'
                    }
                }
            }
        }
        /*当校验失败  默认阻止了提交*/
        /*当校验成功  默认就提交了*/
        /*阻止默认的提交方式  改用ajax提交方式*/
    }).on('success.form.bv',function (e) {
        /*阻止浏览器默认行为*/
        e.preventDefault();
        var $form = $(e.target);
        /*发登录请求*/
        $.ajax({
            type:'post',
            url:'/employee/employeeLogin',
            /*可传递的数据格式  对象  序列化后的数据  key=value的字符串  [{name:'',value},...] */
            data:$form.serialize(),
            dataType:'json',
            success:function (data) {
                /*响应成功后的逻辑*/
                if(data.success){
                    location.href = '/admin/index.html';
                }else{
                    if(data.error == 1000){
                        /*调用校验插件  让该选项置为 校验失败状态 提示校验失败的信息*/
                        /*updateStatus(‘哪个元素’，‘修改为什么状态’，‘校验规则’)*/
                        $form.data('bootstrapValidator').updateStatus('username','INVALID','callback')
                    }else if(data.error == 1001){
                        $form.data('bootstrapValidator').updateStatus('password','INVALID','callback')
                    }
                }
            }
        });
    });
});