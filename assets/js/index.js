$(function () {
    // 调用封装的获取用户信息
    grtUserInfo()


    var layer = layui.layer//引入layer变量
    //退出按钮点击事件
    $('#btnLogout').on('click', function () {
        //提示用户是否确认退出
        layer.confirm('是否确认退出?', {
            icon: 3,
            title: '提示'
        }, function (index) {
            //先关闭提示框
            layer.close(index);
            //再删除本地token
            localStorage.removeItem('token');
            //然后跳转页面
            location.href = '/login.html';
        });

    })


}) //入口函数

//此方法必须写在入口函数外面，成全局函数，方便其他页面调用此方法
// 获取用户的基本信息封装
function grtUserInfo() {
    $.ajax({
        method: 'GET',
        url: '/my/userinfo',
        // headers是jQuery中专门获取请求头信息的属性
        //headers属性区分大小写
        //所有的有权限的接口都需设置请求头，所以封装到baseAPI中
        // headers: {
        //     Authorization: localStorage.getItem('token') || ''
        // },
        success: function (res) {
            // token可能会失效，需重新登陆
            if (res.status !== 0) {
                return layui.layer.msg('获取用户信息失败')
            }
            //调用renderUser封装函数，渲染用户头像
            renderUser(res.data);
        }

        //不论成功还是失败都会调用complete回调函数，也封装到baseAPI中
        
    })

}


//渲染用户头像
function renderUser(user) {
    // 1.获取用户名称
    var name = user.nickname || user.username;

    //2.设置欢迎的文本
    $('#welcom').html('欢迎&nbsp;&nbsp;' + name)

    // 3.按需求渲染用户的头像
    if (user.user_pic !== null) {
        //渲染图片头像
        $('.layui-nav-img').attr('src', user.user_pic).show()
        $('.text-avatar').hide()
    } else {

        //渲染文本头像
        $(".layui-nav-img").hide()
        var first = name[0].toUpperCase();//获取的文本名字首字母大写
        $(".text-avatar").show().html(first);
        

    }
    


    //    //获取用户名称
    //    var name = user.nickname || user.username

    //    if (user.user_pic !== null) {
    //        //渲染用户头像
    //        $('.layui-nav-img').attr('src', user.user_pic).show()
    //        $('.text-avatar').hide()
    //    } else {
    //        //渲染文本头像
    //        $('.layui-nav-img').hide()
    //        var first = name[0].toUpperCase()
    //        $('.text-avatar').html(first).show()
    //    }
    //    //设置欢迎的文本
    //    $('#welcome').html('欢迎&nbsp;&nbsp;' + name)
    //    //按需渲染用户的头像
    

}