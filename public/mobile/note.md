### 静态页面  index.html

#### 架子
1. 全屏容器（定位容器，如果父容器没有定位，基于浏览器窗口走的）    是没有滚动条的，内容使用的是mui的区域滚动插件
2. 头部  内容  底部  （头部和底部  绝对定位） 内容容器的内容占满剩余的高度（padding-top:45px;padding-bottom:55px）
3. lt_wrapper 承载内容的容器  固定内容的位置 

#### mui组件

1. 区域滚动组件  mui-scroll 
```html
<div class="mui-scroll-wrapper">
	<div class="mui-scroll">
		<!--这里放置真实显示的DOM内容-->
	</div>
</div>
<!--初始化-->
<script>
mui('.mui-scroll-wrapper').scroll({
    // 配置参数  不要滚动条
    indicators:false
});
</script>
```

2. 轮播图
```html
    <div class="mui-slider">
        <!--图片容器 加一个类-->
        <div class="mui-slider-group mui-slider-loop">
        <!--支持循环，需要重复图片节点-->
        <div class="mui-slider-item mui-slider-item-duplicate"><a href="#"><img src="4.jpg" /></a></div>
        <div class="mui-slider-item"><a href="#"><img src="1.jpg" /></a></div>
        <div class="mui-slider-item"><a href="#"><img src="2.jpg" /></a></div>
        <div class="mui-slider-item"><a href="#"><img src="3.jpg" /></a></div>
        <div class="mui-slider-item"><a href="#"><img src="4.jpg" /></a></div>
        <!--支持循环，需要重复图片节点-->
        <div class="mui-slider-item mui-slider-item-duplicate"><a href="#"><img src="1.jpg" /></a></div>
      </div>
      <!--点容器-->
      <div class="mui-slider-indicator">
        <div class="mui-indicator mui-active"></div>
        <div class="mui-indicator"></div>
        <div class="mui-indicator"></div>
        <div class="mui-indicator"></div>
      </div>
    </div>
    <script>
        mui('.mui-slider').slider({
            //配置参数  自动播放
            interval:2000
        });
    </script>
```

3. 导航 &  产品列表

```html
    <div class="lt_product mui-clearfix">
        <ul>
            <li>
                <a href="#">
                    <img src="images/detail.jpg" alt="">
                    <p class="name mui-ellipsis-2">adidas阿迪达斯阿迪达斯 男式 场下休闲篮球鞋S83700 </p>
                    <p class="price"><span class="old">&yen;1000.00</span> <span class="new">&yen;9.99</span></p>
                    <button>立即购买</button>
                </a>
            </li>
            <li>
                <a href="#">
                    <img src="images/detail.jpg" alt="">
                    <p class="name mui-ellipsis-2">adidas阿迪达斯阿迪达斯 男式 场下休闲篮球鞋S83700 </p>
                    <p class="price"><span class="old">&yen;1000.00</span> <span class="new">&yen;9.99</span></p>
                    <button>立即购买</button>
                </a>
            </li>
        </ul>
    </div>
```

### 静态页面  category.html

#### 修改顶部通栏

1. 加了两个按钮  返回（javascript:history.back();）  搜索 (search.html)

2. 左侧分类 和  右侧分类

### 前端处理业务  

### 开发模式  前后端分离

### 图片加载失败事件

1. 事件的绑定方式
```html
    <button onclick="say()"></button>
    <img src="" alt="" onerror="this.src = 'xxx';">
    <script>
        var say = function() {
          console.log(this);
        }
        var btn = document.querySelector('button');
        btn.onclick = function () {  };
        btn.attachEvent();
        btn.addEventListener();
        /*jquery zepto*/
        $('button').on('click',function(){});
        $('button').bind('click',function(){});
        $('button').click(function());
        $('button').delegate('click');
    </script>
```

