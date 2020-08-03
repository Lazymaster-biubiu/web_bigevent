$(function () {

    var layer = layui.layer
    var form = layui.form

    // 初始化富文本编辑器
    initEditor()
    //文章分类调用
    initCate()
    //定义加载在文章分类的方法
    function initCate() {
        $.ajax({
            method: 'GET',
            url: '/my/article/cates',
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('初始化文章分类失败')
                }
                //调用模板引擎，渲染分类的下拉菜单
                var htmlStr = template('tpl-cate', res)
                $('[name=cate_id]').html(htmlStr)
                //调用form.render( )  方法
                form.render()
            }
        })
    }




    // 1. 初始化图片裁剪器
    var $image = $('#image')

    // 2. 裁剪选项
    var options = {
        aspectRatio: 400 / 280,
        preview: '.img-preview'
    }

    // 3. 初始化裁剪区域
    $image.cropper(options)

    //为选择封面的按钮，绑定点击事件
    $('#btnChooseImage').on('click', function () {
        $('#coverFile').click()
    })

    //监听 coverFile 的change事件，获取用户选择的文件列表
    $('#coverFile').on('change', function (e) {
        //获取到文件的列表数组
        var files = e.target.files
        //判断用户是否选择了文件
        if (files.length === 0) {
            return
        }
        // 根据选择的文件，创建一个对应的 URL 地址：
        var newImgURL = URL.createObjectURL(files[0])
        // 为剪裁区域重新设置图片
        $image
            .cropper('destroy') // 销毁旧的裁剪区域
            .attr('src', newImgURL) // 重新设置图片路径
            .cropper(options) // 重新初始化裁剪区域
    })

    //确定发布状态
    var state = '已发布'

    $('#btnsave2').on('click', function () {
        state = '草稿'
    })

    //添加文章
    $('#form-pub').on('submit', function (e) {
        e.preventDefault()
        var fd = new FormData(this)
        fd.append('state', state)

        // 将裁剪后的图片，输出为文件(二进制图片)
        $image
            .cropper('getCroppedCanvas', { // 创建一个 Canvas 画布
                width: 400,
                height: 280
            })
            .toBlob(function (blob) { // 将 Canvas 画布上的内容，转化为文件对象
                // 得到文件对象后，进行后续的操作
                //将文件对象，存储到 fd 中
                fd.append('cover_img', blob)
                // console.log(...fd);
                //发起ajax请求
                publishArticle(fd)
                
            })
    })

    //定义一个发布文章的方法
    function publishArticle(fd) {
        $.ajax({
            method: 'POST',
            url: '/my/article/add',
            data: fd,
            // 注意：如果向服务器提交的是 FormData 格式的数据，
            // 必须添加以下两个配置项
            contentType: false,
            processData: false,
            success: function (res) {
                if(res.status !== 0) {
                    return layer.msg('文章发布失败')
                }
                layer.msg('文章发布成功')
                //发布成功，自动跳转到文章列表页面
                location.href = '/article/art_list.html'
                // 发布成功，跳转到列表页，对应的左侧导航栏也应变化
                window.parent.document.getElementById('a2').className = 'layui-this';
                window.parent.document.getElementById('a3').className = '';
            }
        })
    }





})