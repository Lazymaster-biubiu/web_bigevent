$(function () {

    var layer = layui.layer
    // 1.1 获取裁剪区域的 DOM 元素
    var $image = $('#image')
    // 1.2 配置选项
    const options = {
        // 纵横比
        aspectRatio: 1,
        // 指定预览区域
        preview: '.img-preview'
    }

    // 1.3 创建裁剪区域
    $image.cropper(options)

    //为上传按钮绑定点击事件
    $('#btnChooseImage').on('click', function () {
        $('#file').click()
    })



    //更换裁剪区图片
    //为文件选择框绑定change事件
    $('#file').on('change', function (e) {

        //获取用户选择的文件
        var file = e.target.files[0]
        //将文件转化为路径
        var newImgURL = URL.createObjectURL(file)
        //先`销毁`旧的裁剪区域，再`重新设置图片路径`，之后再`创建新的裁剪区域`
        $image
            .cropper('destroy') // 销毁旧的裁剪区域
            .attr('src', newImgURL) // 重新设置图片路径
            .cropper(options) // 重新初始化裁剪区域

    })

    //点击确定按钮，确定更换头像
    $('#btnUpload').on('click', function () {
        // 将裁剪后的图片，输出为 base64 格式的字符串
        var dataURL = $image
            .cropper('getCroppedCanvas', { // 创建一个 Canvas 画布
                width: 100,
                height: 100
            })
            .toDataURL('image/png') // 将 Canvas 画布上的内容，转化为 base64 格式的字符串

            //发送ajaxq请求
            $.ajax({
                method:'POST',
                url:'/my/update/avatar',
                avatar: { dataURL },
                success:function(res){
                    if(res.status !== 0) {
                        return layui.layer.msg('头像上传失败')
                    }
                    layui.layer.msg('头像上传成功')
                    // 刷新父框架中的个人资料
                    window.parent.grtUserInfo();
                }
            })
    })






}) //入口函数