// 设置路径(测试)
var baseURL = "http://ajax.frontend.itheima.net";
// 设置路径(生产)
var baseURL = "http://ajax.frontend.itheima.net";
// 拦截/过滤每一次ajax请求，配置每次请求所需的参数
$.ajaxPrefilter(function (options) {
    // console.log(options); 未拼接前路径
    options.url = baseURL + options.url;
    // console.log(options); 拼接后路径

})