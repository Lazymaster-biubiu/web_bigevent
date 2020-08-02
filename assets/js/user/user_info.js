$(function () {

    var form = layui.form;
    var layer = layui.layer

    // 定义校验规则
    form.verify({
        nickname: function (value) {
            if (value.length > 6) {
                return "昵称应该输入1~6位之间"
            }
        }
    })

    // 初始化用户的基本信息
    initUserInfo();

    function initUserInfo() {
        //发送Ajax请求
        $.ajax({
            method: 'get',
            url: '/my/userinfo',
            success: function (res) {
                //获取用户信息校验
                if (res.status !== 0) {
                    return layer.msg('获取用户基本信息失败')
                }
                //调用 form.val 方法 把获取的data赋给form表单
                form.val('formUserInfo', res.data)
            }
        })
    }


    // 重置表单数据
    $('#btnReset').on('click',function(e) {
        //阻止表单默认行为
        e.preventDefault()

        // 点击重置按钮，重新调用initUserInfo函数，重新获取表单
        initUserInfo();
    })

    // 监听表单提交事件
    $('.layui-form').on('submit',function(e) {
        //阻止表单默认行为
        e.preventDefault()
        $.ajax({
            method:'POST',
            url:'/my/userinfo',
            data: $(this).serialize(),//获取当前表单所有信息
            success:function(res){
                // 判断请求是否成功，返回0为成功
                if(res.status !== 0) {
                    return layer.msg('修改用户基本信息失败！')
                }
                layer.msg('恭喜您，信息修改成功！')
                //调用父页面中的方法，重新渲染用户的头像和用户名
                window.parent.grtUserInfo();
            }
        })


    })


}) //入口函数