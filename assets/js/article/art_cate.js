$(function () {

    var layer = layui.layer
    var form = layui.form

    // 先把文章分类列表渲染
    initArtCateList()

    // 封装get获取后台数据,渲染页面
    function initArtCateList() {
        $.ajax({
            method: 'GET',
            url: '/my/article/cates',
            success: function (res) {
                // 把获取模板引擎遍历的数据
                var htmlStr = template('tpl-table', res)
                //渲染到页面
                $('tbody').html(htmlStr)
            }
        })
    }

    //单击添加添加类别按钮，显示弹出框
    $('#btnAddCate').on('click', function () {
        // 使用layui方法
        index = layer.open({
            type: 1,
            area: ['500px', '250px'],
            title: '添加文章分类',
            content: $('#dialog-add').html()
        });
    })

    // 添加文章分类部分
    //通过事件代理，给form-add 添加提交事件
    var index = null;
    $('body').on('submit', '#form-add', function (e) {
        e.preventDefault()
        $.ajax({
            method: 'POST',
            url: '/my/article/addcates',
            data: $(this).serialize(),
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('新增分类失败！')
                }
                initArtCateList() //重新调用，刷新页面
                layer.msg('新增分类成功！')
                // 关闭添加区域
                layui.layer.close(index)
            }
        })
    })

    //通过代理形式，为btn-edit 绑定点击事件
    var indexEdit = null
    $('tbody').on('click', '.btn-edit', function () {
        // 使用layui方法,弹出修改框
        indexEdit = layer.open({
            type: 1,
            area: ['500px', '250px'],
            title: '修改文章分类',
            content: $('#dialog-edit').html()
        })
        var id = $(this).attr('data-id')
        //发起请求，获取对应的分类数据
        $.ajax({
            method: 'GET',
            url: '/my/article/cates/' + id,
            success: function (res) {
                form.val('form-edit', res.data)
            }
        })
    })

    //修改文章分类请求，通过代理方式，为表单绑定submit提交事件
    $('body').on('submit','#form-edit',function (e) {
        e.preventDefault()
        $.ajax({
            method: 'POST',
            url: '/my/article/updatecate',
            data: $(this).serialize(),
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('更新分类失败！')
                }
                layer.msg('更新分类成功！')
                layer.close(indexEdit)
                initArtCateList() //重新调用，刷新页面
            }
        })
    })


    $('tbody').on('click', '.btn-delete', function () {
        var id = $(this).attr('data-id')
        // 提示用户是否删除
        layer.confirm('确认删除?', { icon: 3, title: '提示' },function(index) {
            $.ajax({
                method:'GET',
                url:'/my/article/deletecate/' + id,
                success:function(res){
                    if (res.status !== 0) {
                        return layer.msg('删除分类失败！')
                    }
                    layer.msg('删除分类成功！')
                    layer.close(index)
                    initArtCateList() //重新调用，刷新页面
                }
            })
        })
    })



}) //入口函数