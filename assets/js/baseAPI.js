// 设置路径(测试)
var baseURL = "http://ajax.frontend.itheima.net";

// 设置路径(生产)
// var baseURL = "http://ajax.frontend.itheima.net";

// 拦截/过滤每一次ajax请求，配置每次请求所需的参数
$.ajaxPrefilter(function (options) {
    //发送请请求前先拼接路径
    options.url = baseURL + options.url;// 根路径 + 请求路径


    //统一为有权限的接口设置请求头
    //路径有my的即为有权限接口
    if(options.url.indexOf('/my/') !== -1) {

        options.headers = {
            Authorization: localStorage.getItem('token') || ''
        }
    }


    // 全局统一挂载 complete 回调函数
    options.complete = function(res) {
        var data = res.responseJSON;
        if(data.status == 1 && data.message == '身份验证失败!') {
            //验证失败删除token
            localStorage.removeItem('token');
            //页面跳转
            location.href = '/login.html';
        }
    }

    
})