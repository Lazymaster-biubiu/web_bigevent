$(function () {
    // 获取 layui 提供的成员
    var form = layui.form

    // 自定义 form 校验规则
    form.verify({
        // 密码长度校验
        pwd: [/^[\S]{6,12}$/, '密码必须6到12位，且不能出现空格'],
        //新密码与原密码校验
        samePwd: function (value) {
            if (value == $('[name=oldPwd]').val()) {
                return "新密码不能与原密码相同"
            }
        },
        // 再次确认密码校验
        rePwd: function (value) {
            if (value !== $('[name=newPwd]').val()) {
                return "两次密码不一致"
            }
        }
    })

    //POST方式，向服务器提交修改的密码
    $('.layui-form').on('submit', function (e) {
        e.preventDefault();//阻止表单默认样式
        $.ajax({
            method: 'POST',
            url: '/my/updatepwd',
            data: $(this).serialize(),
            success: function (res) {
                if (res.status !== 0) {
                    return layui.layer.msg('修改密码失败')
                }
                layui.layer.msg('修改密码成功')

                //重置表单  reset是DOM方法，JQ对象需转换成DOM对象
                $('.layui-form')[0].reset()
            }
        })
    })




})//入口函数