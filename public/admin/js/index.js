$(function () {
    initBar();
    initPie()
});
var initBar = function () {
    /*数据可视化  季度的注册用户的数量 */
    /*1. 找到需要初始化的容器  初始化成echarts对象*/
    var dom = document.querySelector('.picTable:first-child');
    var myeCharts = echarts.init(dom);
    /*2. 配置*/
    var options = {
        title: {
            text: '用户注册人数'
        },
        tooltip: {},
        legend: {
            data:['人数']
        },
        xAxis: {
            data: ["一季度","二季度","三季度","四季度"]
        },
        yAxis: {},
        series: [{
            name: '人数',
            type: 'bar',
            data: [550,250,1000,100]
        }]
    }
    /*3. 设置你的配置项*/
    myeCharts.setOption(options);
};
var initPie = function () {
    /*模拟一组后台数据*/
    var brandData = [
        {brandName:'耐克',num:100},
        {brandName:'阿迪',num:100},
        {brandName:'回力',num:100},
        {brandName:'双星',num:100},
        {brandName:'特步',num:100}
    ];
    var legendData = [];
    var seriesData = [];
    brandData.forEach(function (item,i) {
        legendData.push(item.brandName);
        seriesData.push({
            name:item.brandName,
            value:item.num
        })
    });

    var dom = document.querySelector('.picTable:last-child');
    var myeCharts = echarts.init(dom);
    var option = {
        title : {
            text: '热门品牌销售',
            subtext: '2018-01',
            x:'center'
        },
        tooltip : {
            trigger: 'item',
            formatter: "{b} : {c} ({d}%)"
        },
        legend: {
            orient: 'vertical',
            left: 'left',
            /*data: ['耐克','阿迪','回力','双星','特步']*/
            data:legendData
        },
        series : [
            {
                name: '销售情况',
                type: 'pie',
                radius : '55%',
                center: ['50%', '60%'],
                /*data:[
                    {value:335, name:'耐克'},
                    {value:310, name:'阿迪'},
                    {value:234, name:'回力'},
                    {value:135, name:'双星'},
                    {value:1548, name:'特步'}
                ],*/
                data:seriesData,
                itemStyle: {
                    emphasis: {
                        shadowBlur: 10,
                        shadowOffsetX: 0,
                        shadowColor: 'rgba(0, 0, 0, 0.5)'
                    }
                }
            }
        ]
    };
    myeCharts.setOption(option);
}