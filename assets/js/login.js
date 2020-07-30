$(function () {
    // 点击“去注册账号”的链接
    $('#link_reg').on('click', function () {
        $('.login-box').hide()
        $('.reg-box').show()
    })

    // 点击“去登录账号”的链接
    $('#link_login').on('click', function () {
        $('.reg-box').hide()
        $('.login-box').show()
    })

    //从layui中获取form/layer对象
    var form = layui.form
    var layer = layui.layer

    //通过form.veryfy()函数自定义校验规则
    form.verify({
        //自定义一个叫pwd的校验规则
        pwd: [
            /^[\S]{6,12}$/, '密码必须6到12位，且不能出现空格'
        ],
        repwd: function (value) {
            //通过形参拿到确认密码框的内容和输入密码框内容比较
            var pwd = $('#reg-pwd').val() //获取输入密码框的内容
            //如果比较不相同，则return一个提示消息
            if (pwd != value) {
                return '两次密码不一致'
            }

        }
    });


    //监听表单注册提交事件
    $('#form_reg').on('submit', function (e) {
        e.preventDefault() //阻止表单提交默认行为
        $.ajax({
            method: 'post',
            url: '/api/reguser',
            data: {
                username: $('#form_reg [name=username]').val(),
                password: $('#form_reg [name=password]').val()
            },
            success: function (res) {
                //注册失败校验
                if (res.status != 0) {
                    return layer.msg(res.message)
                }
                //   注册成功提示
                layer.msg('注册成功，请登录');

                // 模拟人为的点击行为，注册成功跳转到登录页面
                $('#link_login').click();
                //清空表单,reset是DOM方法
                $('#form_reg')[0].reset();
            }
        })

    })

    //监听登陆表单提交事件
    $('#form_login').on('submit',function (e) {
        e.preventDefault()
        $.ajax({
            method: 'POST',
            url: '/api/login',
            data: $(this).serialize(),//发送表单内容
            success: function (res) {
                if (res.status != 0) {
                    return layer.msg('登陆失败')
                }
                layer.msg('登录成功');//登陆成功提示

                //将登陆成功得到的 token 字符串保存到localStorage
                localStorage.setItem('token',res.token)
                //页面跳转
                location.href = '/index.html'
            }
        })
    })











}) //入口函数