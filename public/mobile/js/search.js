$(function () {
    $('.lt_search input').val('');
    /*1. 默认渲染当前历史记录*/
    var storageKey = 'leTaoSearchHistoryList';
    /*1.1 需要约定当前网站存历史记录的KEY和数据类型   leTaoSearchHistoryList = '["电脑","手机"]'*/
    var jsonString = localStorage.getItem(storageKey) || '[]';
    var historyList = JSON.parse(jsonString);
    $('.lt_history').html(template('list', historyList));
    //$('.lt_history').html(template('list', {list:historyList,encodeURIComponent:encodeURIComponent}));


    /*2. 点击搜索记录新的搜索历史  跳转去搜索列表页*/
    /*2.1 添加之后  追加在最前面*/
    /*2.2 如果遇见相同的关键字  删除之前的  追加在最前面*/
    /*2.3 当记录的条数超过10条  删除之前的后面的  追加在最前面*/
    $('.lt_search a').on('tap', function () {
        //去除输入的内容  去了两端空格
        var key = $.trim($('.lt_search input').val());
        // 判断是否输入
        if (!key) {
            mui.toast('请输入关键字');
            return false;
        }
        // 有关键字
        /*删除相同的*/
        $.each(historyList, function (i, item) {
            if (item == key) {
                historyList.splice(i, 1);
                /*中断循环*/
                return false;
            }
        });
        /*加载最后*/
        historyList.push(key);
        /*超过10条删掉*/
        if (historyList.length > 10) {
            historyList.splice(0, historyList.length - 10);
        }
        /*存起来*/
        localStorage.setItem(storageKey, JSON.stringify(historyList));
        /*渲染  会跳走 没有必要*/
        //$('.lt_history').html(template('list', historyList));
        /*跳转  传数据转成URL编码*/
        location.href = '/mobile/searchList.html?key='+encodeURIComponent(key);
    })

    /*3. 点击删除  删除当前的历史记录*/
    $('.lt_history').on('tap', 'li span', function () {
        var index = $(this).data('index');
        console.log(index);
        historyList.splice(index, 1);
        /*存起来*/
        localStorage.setItem(storageKey, JSON.stringify(historyList));
        /*渲染  会跳走 没有必要*/
        $('.lt_history').html(template('list', historyList));
    }).on('tap','.clear',function () {
        /*4. 点击清空  清空所有的历史记录*/
        historyList = [];
        localStorage.setItem(storageKey, '[]');
        /*渲染  会跳走 没有必要*/
        $('.lt_history').html(template('list', historyList));
    }).on('tap','li a',function () {
        var key = $(this).data('key');
        /*跳转  传数据转成URL编码*/
        location.href = '/mobile/searchList.html?key='+encodeURIComponent(key);
    });

});