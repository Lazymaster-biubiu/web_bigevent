$(function () {
    // 点击注册的链接
    $("#link_reg").on("click", function () {
        $(".login-box").hide();
        $(".reg-box").show();
    })
    // 点击去登录的链接
    $("#link_login").on("click", function () {
        $(".reg-box").hide();
        $(".login-box").show();
    })
    // 从layui 中获取form对象
    var form = layui.form
    // 注册提示功能
    var layer = layui.layer;
    // 通过form.verify() 自定义校验规则
    form.verify({
        pwd: [/^[\S]{6,12}$/, '密码必须6到12位，且不能出现空格'],
        repwd: function (value) {
            if ($("#reg-pwd").val() !== value) {
                return "两次密码输入不一致!"
            }
        }
    });

    // 监听注册表单的提交事件
    $("#form_reg").on("submit", function (e) {
        // 阻止表单默认提交
        e.preventDefault();
        // 发送ajax请求
        $.ajax({
            type: 'post',
            url: '/api/reguser',
            // data:$("$form_reg").serialize()
            data: {
                username: $('#form_reg [name=username]').val(),
                password: $('#form_reg [name=password]').val()
            },
            success: function (res) {
                // 注册失败校验
                if (res.status != 0) {
                    return layer.msg(res.message);
                }
                // 注册成功 提示
                layer.msg(res.message);
                // 触动切换到登录的a链接行为
                $("link_login").click();
                // 清空表单
                $("#form_reg")[0].reset();
            }
        })
    })


    // 监听登录表单的提交事件
    $("#form_login").on("submit", function (e) {
        // 阻止表单默认提交
        e.preventDefault();
        $.ajax({
            type: 'post',
            url: '/api/login',
            // 快速获取表单数据serialize
            data: $(this).serialize(),
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg("登录失败");
                }
                // 登录成功 提示
                layer.msg("登录成功");
                // 本地储存保存token
                localStorage.setItem("token", res.token)
                // 跳转到后台主页
                location.href = "/index.html"
            }
        })
    })
})