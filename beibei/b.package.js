/*
 * @note 包基类
 * @author early
 * @version 0.0.1
 * @date 2014-5-22
 */

// 一个包实例化后
// Page.package[self.conf.pkName]
// Page.package[self.stId]
// 已经载入的包
// Page.package.loaded

B.Package = B.Object.extend({

    // -----------------------------------------------------------------------
    // 包配置
    // -----------------------------------------------------------------------
    conf : {

        // 包实例的名称
        name : ''

    },

    // -----------------------------------------------------------------------
    // 包属性
    // -----------------------------------------------------------------------
    // 包类型
    // lib 和 widget
    // lib包被载入后只会运行source函数中的内容
    pkType : 'lib',

    // 包名称
    pkName : '',

    // 包依赖
    pkRely : [],

    // 包识别码
    pkId : '',

    // 包版本
    pkVersion : '0.0.1',

    // 包信息
    pkInfo : {

        // 最后更新于
        lastupdate : '',

        // 包源自
        source : '',

        // 包来源版本
        sourceVersion : '',

        // 包来源作者
        sourceAuthor : '',

        // 包作者
        author : '',

        // 版权
        copyright : '',

        // 许可
        license : '',

        // 网站
        website : '',

        // 文档地址
        documentation : '',

        // 电邮
        email : '',

        // 浏览器兼容
        workin : '',

        // 备注
        note : ''

    },

    init : function(){
        
        var self = this;
        self._super();

        // 绑定事件
        self.onEvent();

        // 启动观察
        self.onWatch();

    },

    // -----------------------------------------------------------------------
    // 包方法
    // -----------------------------------------------------------------------
    // 删除此包的方法 在子类中实现
    methodDelete : function(){},

    // 重载包的方法 在子类中实现
    methodReload : function(){},

    // -----------------------------------------------------------------------
    // 源函数 将会在包被载入的时候运行（只适用于lib类型的包）
    // -----------------------------------------------------------------------
    source : function(){}

});

// 重写实例创建方法
B.Package.reopenClass({

    create : function( conf ){

        conf = conf || {};

        var self = this,
            Instance = self._super({
                conf : conf,
                stId : self.prototype.pkName + String(_.random(1e8,9.9e8)) + new Date().getTime()
            }, function(){

            });

        // 将包挂载到page
        window.Page.package[Instance.conf.name] = Instance;
        window.Page.package[Instance.stId] = Instance;

        return Instance;

    }

});