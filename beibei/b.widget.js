/*
 * @note 组件基类
 * @author early
 * @version 0.0.1
 * @date NaN
 * @warning 此基类将被重构
 */
 
// 组件
B.Widget = B.Object.extend({

    // -----------------------------------------------------------------------
    // 初始化
    // -----------------------------------------------------------------------
    init : function(){

        var self = this;
        self._super();

        // 转换view
        if ( self.templateMain && self.templateMain.length === 1 ) {

            // copy template
            self.templateMain = self.templateMain.clone();

            for( var k in self ) {
                if ( k.search(/view\w+/g) === 0 ) {

                    var name = self[k];

                    self[k] = self.templateMain.find('[wg-view="'+name+'"]');

                    if ( self[k].length === 0 ) {
                        self[k] = self.templateMain.filter('[wg-view="'+name+'"]');
                    }

                }
            }

        }

        // 绑定事件
        self.onEvent();

        // 启动观察
        self.onWatch();

    },

    // -----------------------------------------------------------------------
    // 组件默认配置
    // -----------------------------------------------------------------------
    conf : {},

    // -----------------------------------------------------------------------
    // 组件属性
    // -----------------------------------------------------------------------
    // 组件名称
    stName : '',

    // 组件识别码
    stId : '',

    // -----------------------------------------------------------------------
    // 组件方法
    // -----------------------------------------------------------------------

    // -----------------------------------------------------------------------
    // 视图
    // -----------------------------------------------------------------------

    // -----------------------------------------------------------------------
    // 观察
    // -----------------------------------------------------------------------
    onWatch : function(){},


    // -----------------------------------------------------------------------
    // 事件
    // -----------------------------------------------------------------------
    onEvent : function(){},

    // -----------------------------------------------------------------------
    // API
    // -----------------------------------------------------------------------
    api : {},

    // -----------------------------------------------------------------------
    // VIEW
    // -----------------------------------------------------------------------
    view : {},

    // -----------------------------------------------------------------------
    // FUNCTION
    // -----------------------------------------------------------------------
    fn : {}

});

// 重写实例创建方法
B.Widget.reopenClass({

    create : function( conf ){

        conf = conf || {};

        var self = this,
            Instance = self._super({
                conf : conf,
                stId : self.prototype.stName + String(_.random(1e8,9.9e8)) + new Date().getTime()
            });

        // 自动绑定组件实例至page 组建多实例 内存开销问题   
        // window.Page[Instance.stId] = Instance;

        return Instance;

    }

});
