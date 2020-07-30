//注意：每次发起$.get()/$.post()/$.ajax()之前，配置每次请求需要的参数

//设置测试路径（根路径）
var baseURL = 'http://ajax.frontend.itheima.net'

// 设置生产路径
// var baseURL = 'http://ajax.frontend.itheima.net';

// 封装ajaxPrefilter函数，每次发送请求前自动拼接路径
$.ajaxPrefilter(function (options) {

    options.url = baseURL + options.url  //根路径 + 请求路径

})