$(function () {
    var layer = layui.layer
    var form = layui.form

    //定义美化时间的过滤器
    template.defaults.imports.dataFormat = function (date) {
        const dt = new Date(date)
        var y = dt.getFullYear()
    }

    // 定义一个查询的参数对象，将来请求数据的时候，
    // 需要将请求参数对象提交到服务器
    var q = {
        pagenum: 1, // 页码值，默认请求第一页的数据
        pagesize: 2, // 每页显示几条数据，默认每页显示2条
        cate_id: '', // 文章分类的 Id
        state: '' // 文章的发布状态
    }


    initTable()

    // 获取文章列表数据的方法
    function initTable() {
        $.ajax({
            method: 'GET',
            url: '/my/article/list',
            data: q,
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('获取文章列表失败！')
                }

                // 使用模板引擎渲染页面的数据
                var htmlStr = template('tpl-table', res)
                $('tbody').html(htmlStr)

                //文章分页渲染
                renderPage(res.total)
            }
        })
    }

    initCate() //调用文章分类

    //初始化文章分类的方法
    function initCate() {
        $.ajax({
            method: 'GET',
            url: '/my/article/cates',
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('获取分类数据失败！')
                }
                // 调用模板引擎渲染分类的可选项
                var htmlStr = template('tpl-cate', res)
                $('[name=cate_id]').html(htmlStr)
                // 通过 layui 重新渲染表单区域的UI结构
                form.render()

            }
        })
    }

    //为筛选表单绑定 submit事件
    $('#form-search').on('submit', function (e) {
        e.preventDefault()

        //获取表单中选项中的值
        var cate_id = $('[name=cate_id]').val()
        var state = $('[name=state]').val()

        //将获取的值赋值给 上面“q”对象对应的属性
        q.cate_id = cate_id
        q.state = state

        //根据最新的筛选条件，重新渲染表格的数据
        initTable()
    })


    //定义渲染分页方法
    function renderPage(total) {

        var laypage = layui.laypage;
        // 调用 laypage.render() 方法来渲染分页的结构
        laypage.render({
            elem: 'pageBox', // 分页容器的 Id
            count: total, // 总数据条数
            limit: q.pagesize, // 每页显示几条数据
            curr: q.pagenum, // 设置默认被选中的分页
            layout: ['count', 'limit', 'prev', 'page', 'next', 'skip'],
            limits: [2, 3, 5, 10], //修改分页条，可选择显示条数
            //分页发生切换的时候，触发jump 回调
            jump: function (obj, first) {

                //把最新的页码值和条目数，赋值给 q 这个查询参数对象中
                q.pagenum = obj.curr
                q.pagesize = obj.limit

                //根据最新的'q'，重新渲染表格的数据
                //通过first的值判断触发方式，如果值为true，则调用render方法就回触发jump
                if (!first) {
                    initTable()
                }
            }
        })
    }


    //通过代理的方式，给删除按钮绑定点击事件
    $('tbody').on('click', '.btn-delete', function () {
        //获取当前页面上删除按钮的个数，判断是否还有数据
        var len = $('.btn-delete').length
        var id = $(this).attr('data-id')
        // 询问用户是否删除
        layer.confirm('确认删除?', {
            icon: 3,
            title: '提示'
        }, function (index) {

            $.ajax({
                method: 'GET',
                url: '/my/article/delete/' + id,
                success: function (res) {
                    if (res.status !== 0) {
                        return layer.msg('删除文章失败！')
                    }
                    layer.msg('删除文章成功！')
                    //当数据删除完成后，先判断当前页是否为空，
                    // 如果为空，则页码值减一，即跳转到前一页
                    if (len == 1 && q.pagenum > 1) { //页面值为“1”，则删除完成后为空
                        q.pagenum--
                    }
                    //根据最新的筛选条件，重新渲染表格的数据
                    initTable()
                }
            })
            layer.close(index)
        });


    })




}) //入口函数