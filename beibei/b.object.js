/*
 * @note 基类
 * @author early
 * @version 0.0.2
 * @date 2014-5-22
 */
// 扩展默认function方法 标记此属性为合成属性
// 传入参数为计算属性依赖的其他属性
// 若不传参将会注册为全局计算属性（低效）
window.Function.prototype.mix = function(){

    var fun = this,
        re = function(){
            return fun.apply(this);
        };

    // 标记此属性需要计算
    re.needCalculate = true;
    return re;

};

// Beibei 底层对象
B.Object = B.Core.makeClass();
B.Object.reopenClass({

});

B.Object.reopen({

    // 观察器堆栈
    _self__watchStack : [],

    // 合成属性堆栈
    _self__mixStack : {},

    // 自身观察器函数堆栈
    _self__watchSelfStack : [],

    init : function(){

        this._super();

        var self = this;

        // 将包管理挂到缓存中
        self.cache._system.package = self.package;

        // 挂载合成属性
        self.mountMixValue();

        // 挂载所有绑定属性
        self.mountBindValue();

        // 注册全局观察器
        self.watch('this', function( newValue, oldValue, self ){

            // 更新所有合成属性
            self.makeMix();

            _.each( self._watchSelfStack, function( fn ){
                fn( newValue, oldValue, self );
            });

        }, true);

        // 第一次计算合成属性
        self.makeMix();

        // 将初始化完成的对象记录下来
        self._watchStack[0].last = $.extend( true, {}, self );

        // 调用指令
        self.callIns();

    },

    use : function( name ){
        var arg = _.rest(arguments),
            fun = B.Core.getObject( this, name );

        if ( _.isUndefined(fun) ) {
            return undefined;
        }else{
            return fun.apply(this,arg);
        }
    },

    // 设置属性
    set : function( name, value ){
        
        B.Core.setObject( this, name, value );
        
        // 进行脏值检测
        this.digest();
        return this;

    },

    // 获取属性的值
    get : function( name ){

        var value = B.Core.getObject( this, name );
        return value;

    },

    // 将合成属性挂载到对象上
    mountMixValue : function(){

        var self = this,
            mixMain = function(){
                self[this.mixKey] = this.mixFun.apply( self );
                // self.set( this.mixKey, this.mixFun( self ) );
            };

        if ( B.Core.isPlainObject(self) ) {

            // 需要做深度遍历
            for ( var k in self ) {

                var v = self[k];

                // 是函数并且需要计算
                if ( _.isFunction(v) && v.needCalculate === true ) {

                    // 设置计算并赋值函数
                    var mix = {
                        mixFun : v,
                        mixKey : k,
                        main : mixMain
                    };

                    // 注册到计算队列
                    self._mixStack[mix.mixKey] = mix;

                }

            }

        }

    },

    // 将绑定属性挂载到对象上
    mountBindValue : function(){

        var self = this;
        
        // 需要做深度遍历
        for ( var k in self ) {

            var fun = self[k];

            // 是函数并且需要绑定
            if ( _.isFunction(fun) && fun.needBind === true ) {
                self.set(k, fun( self, k ));
            }

        }

    },

    // 计算合成属性
    makeMix : function(){

        var self = this;

        _.each( self._mixStack, function( mix ){

            // 防止一个错误的计算函数导致程序中止
            try{
                mix.main();
            }catch(e){}
            
        });

    },

    // 较晚设置合成属性
    setMix : function( name, fun ){

        var self = this,

        mixMain = function(){
            self[this.mixKey] = this.mixFun( self );
            // self.set( this.mixKey, this.mixFun( self ) );
        },

        // 设置计算并赋值函数
        mix = {
            mixFun : function( self ){
                return fun.apply(self);
            },
            mixKey : name,
            main : mixMain
        };

        // 注册到计算队列
        self._mixStack[mix.mixKey] = mix;

        // 更新所有的合成属性
        // todo #4
        self.makeMix( self );

        return this;

    },

    // 注册对象自身监听器 可以监听对象的任何变化
    // 使用此方法而不使用watch 主要是效率差距
    watchSelf : function( fn ){

        this._watchSelfStack.push( fn ); 

    },

    // 注册监听器
    watch : function( watchFn, listenerFn, valueEq ){

        var watchValue, self = this;

        // 如果监视器是一个字符串 则获取作用域下的对应属性
        if ( _.isString(watchFn) ){

            var index = watchFn;
            watchFn = function( self ){

                var value = B.Core.getObject( self, index );

                // 判断数值的类型 并生成一个新引用
                return value;

            };

        }

        
        var watcher = {

            // 监视方法
            watchFn: watchFn,

            // 响应方法
            listenerFn: listenerFn || function(){},

            // 基于值的脏值检测
            valueEq : !!valueEq,

            last : valueEq ? B.Core.newQuote( watchFn( self ) ) : watchFn( self )

        };

        this._watchStack.push( watcher );

    },

    // 脏值检测
    digest : function(){
        var dirty, next, self = this, endDigest = [], keyStack = [],

            // short for time to live
            ttl = 10,

            // 相等检测
            areEqual = function(newValue, oldValue, valueEq){

                if (valueEq) {
                    return _.isEqual( newValue, oldValue );
                } else {
                    return newValue === oldValue || 
                            ( typeof newValue === 'number' &&
                                typeof oldValue === 'number' &&
                                isNaN(newValue) &&
                                isNaN(oldValue) );
                }

            },

            // 进行一次脏值检测
            digestOnce = function(){

                var watchList = self._watchStack, contrastNewValue, contrastOldValue,
                    dirty = false;

                _.each(watchList, function( watcher, k ) {

                    var newValue = watcher.watchFn(self),
                        oldValue = watcher.last;

                    // 如果是基于值得对比 则生成新的对象引用
                    if ( watcher.valueEq ) {
                        newValue = B.Core.newQuote( newValue, true );
                    }

                    // 如果value为对象 则检测keyStack中的key值
                    if ( B.Core.isPlainObject(newValue) &&
                         B.Core.isPlainObject(oldValue) &&
                         watcher.valueEq ) {

                        contrastNewValue = _.pick( newValue, B.Core.getObjectKeyList(newValue) );
                        contrastOldValue = _.pick( oldValue, B.Core.getObjectKeyList(oldValue) );

                    } else {
                        contrastNewValue = newValue;
                        contrastOldValue = oldValue;
                    }

                    // 脏值检测
                    // 只比较keyStack中的值
                    if ( !areEqual( contrastNewValue, contrastOldValue, watcher.valueEq ) ) {

                        // 触发响应方法
                        // 在digest的最后执行
                        endDigest.push(function(){
                            return watcher.listenerFn( newValue, oldValue, self );
                        });

                        // 以下实现暂时弃用
                        // var reFn = watcher.listenerFn( newValue, oldValue, self );
                        // if ( _.isFunction(reFn) ) {
                        //     endDigest.push(reFn);
                        // }
                        // dirty = true;

                        // 使用jquery的深度拷贝 对嵌套的对象或数组进行复制 而不是复制引用
                        if ( watcher.valueEq ) {
                            watcher.last = B.Core.newQuote( newValue );  
                        } else {
                            watcher.last = newValue;
                        }

                        dirty = true;

                    }

                });

                return dirty;

            };

        // 生成keyStack
        // keyStack = B.Core.getObjectKeyList(self);

        // 循环进行脏值检测
        do{

            dirty = digestOnce();
            next = dirty && !!( ttl-- );

            if ( dirty && ttl === -1 ) {
                // todo #5
            }

        } while ( next );

        // 在数据稳定后执行
        _.each( endDigest, function( fn ){
            fn();
        });

        return this;

    },

    // 调用指令
    callIns : function( context ){

        var self = this,
            insEvent = '',
            insStr = '',
            insArg = [],
            insName = '',
            $ins = $('[ba-ins]', context).not('.isTemplate [ba-ins],[template] [ba-ins]'),
            $insget = $('[ba-ins-get]', context).not('.isTemplate [ba-ins],[template] [ba-ins]'),
            analysisArg = function($t,arg){

                var varname;

                // 参数注入
                _.each(arg, function(v,k){
                    if ( v.search(/^@.+/g) !== -1 ) {
                        varname = v.replace(/^@/g,'');
                        arg[k] = self._instruction.variable[varname];
                    }
                });

                // 传入dom jq对象
                insArg.unshift($t);

                // 分析是否在ins对象下
                if ( insName.search(/\./) === -1 ) {
                    arg.unshift('ins.'+insName);
                } else {
                    arg.unshift(insName);
                }

                return arg;

            };

        // 创建记录指令的对象
        if ( _.isUndefined( self._instruction ) ) {
            self._instruction = {};
        }

        // TODO 临时修复 在有context的情况下 不清除之前指令绑定的事件
        if ( !context ) {

            // 清除之前的指令
            _.each( self._instruction, function( v, k ){
                
                if ( !_.isEmpty(v.handler) ) {
                    // 去除之前绑定的事件
                    v.dom.off(v.event, v.handler);
                }

                delete self._instruction[k];

            });
            
        }

        // 获取insget变量
        $insget.each(function(){
            
            var $t = $(this),
                insget = $t.attr('ba-ins-get'),
                varname,
                varval;

            // 分离多组变量
            insget = insget.split(',');

            _.each( insget, function(v){

                v = v.split(':');

                if ( v.length === 2 ) {

                    varname = v[0].replace(/^@/g,'');

                    if ( v[1] === '*' ) {
                        varval = $t.html();
                    } else if ( v[1] === 'val' ){
                        varval = $t.val();
                    }else{
                        varval = $t.attr(v[1]);
                    }

                    if ( _.isUndefined( self._instruction.variable ) ) {
                        self._instruction.variable = {};
                    }

                    self._instruction.variable[varname] = varval;

                }

            });

        });

        // 生成指令
        $ins.each(function(index){
            
            var $t = $(this),
                insInited = false,
                id = Math.random(0,1);

            self._instruction[index+id] = {
                dom : $t
            };

            insStr = $t.attr('ba-ins');

            insStr = insStr.split(':');
            insName = insStr.shift();
            insArg = insStr;

            // 分析指令名是否包含事件
            insEvent = insName.split('~');
            if ( insEvent.length === 2 ) {

                insName = insEvent[1];
                insEvent = insEvent[0];

                insArg = analysisArg($t,insArg);

                // 绑定事件
                (function(){

                    var arg = insArg,
                        handler = function(){
                            self.use.apply(self, arg);
                        };

                    self._instruction[index+id].handler = handler;

                    $t.on(insEvent, handler);

                }());

            } else {

                insEvent = null;

                insArg = analysisArg($t,insArg);

                // 使用指令
                self.use.apply(self, insArg);

            }

            self._instruction[index+id].ins = insStr;
            self._instruction[index+id].call = insName;
            self._instruction[index+id].arg = insArg;
            self._instruction[index+id].event = insEvent;
            self._instruction[index+id].dom = $t;

        });
        
    },


    // -----------------------------------------------------------------------
    // 应用程序配置
    // -----------------------------------------------------------------------

    // 是否是开发模式
    confDev : window.devMode,

    // 全站是使用不带尾缀的图片
    // TODO 恢复正常值window.devMode
    confUseNoSuffixImg : false,

    // 网站根目录
    confProRootUrl : 'http://www.beibei.com/',
    confDevRootUrl : 'http://dev.beibei.com/',

    // 网站图片地址
    confProImgUrl : 'http://www.beibei.com/upload/',
    confDevImgUrl : 'http://dev.beibei.com/upload/',

    // 授时地址
    confProGetTimeUrl : 'http://d.beibei.com/ts.json',
    confDevGetTimeUrl : 'http://d.beibei.com/ts.json',

    // TODO 网站二级域名管理

    // 提示信息
    confMsg : {
        netError : '网络繁忙，请稍后重试',
        apiError : '网络繁忙，请稍后重试',
        apiCode404 : '请求未找到，请联系客服或稍后重试',
        apiCode500 : '请求发生错误，请联系客服或稍后重试'
    },

    // -----------------------------------------------------------------------
    // 包管理
    // -----------------------------------------------------------------------
    package : {

        // 已经载入的包 name : version
        loaded : {}

    },

    // -----------------------------------------------------------------------
    // 应用程序状态
    // -----------------------------------------------------------------------
    // 包管理
   

    // -----------------------------------------------------------------------
    // 公用仓库
    // -----------------------------------------------------------------------
    store : {

        // 与服务器的时差
        timeDifference : 0,

        // 服务器时间
        serviceTime : 0

    },

    // -----------------------------------------------------------------------
    // 应用程序缓存
    // -----------------------------------------------------------------------
    // TODO 开发缓存相关方法
    cache : {

        // 系统使用的缓存
        _system : {

            // 包管理缓存
            package : {}

        }

    },

    // -----------------------------------------------------------------------
    // INSTRUCTION
    // -----------------------------------------------------------------------
    ins : {

        /* 
         * @note 刷新页面指令
         * @author early
         */
        reloadPage : function(){
            window.location.reload();
        }

    },

    // -----------------------------------------------------------------------
    // 助手方法
    // -----------------------------------------------------------------------
    /*
     * @note 向视图输出数据
     * @author early
     * @param view 视图的jq选择器
     * @param data 数据包
     */
    renderView : function( view, data ){

        var self = this,
            output = function( dom, outData ){

                var valueDom = dom.find('[op-value]').add( dom.filter('[op-value]') );

                valueDom.each(function(){

                    var $t = $(this),
                        key = $t.attr('op-value');

                    if ( !_.isUndefined( $t.attr('op-attr') ) ) {

                        var attr = $t.attr('op-attr').split(',');
                        key = key.split(',');

                        _.each( attr, function( v, k ){

                            if ( v === '*' ) {
                                $t.html( B.Core.getObject( outData, key[k] ) );
                                return;
                            }

                            if ( v !== 'value' || !$t.is('input') ) {
                                var value = B.Core.getObject( outData, key[k] );

                                if ( _.isBoolean(value) ) {
                                    if ( value === true ) {
                                        $t.prop( v, v );
                                    }
                                } else {
                                    $t.attr( v, value );
                                }
                            } else {
                                $t.val( B.Core.getObject( outData, key[k] ) );
                            }

                        });

                    } else {
                        $t.html( B.Core.getObject( outData, key ) );
                    }

                });

                valueDom.find('[op-select]').each(function(){

                    var $t = $(this),
                        key = $t.attr('op-select'),
                        val = B.Core.getObject( outData, key );

                    $t.find('option[value="'+val+'"]').attr('selected','selected');

                });

                dom.find('[op-each]').add( dom.filter('[op-each]') ).each(function(){

                    var $t = $(this),
                        thisData = B.Core.getObject( outData, $t.attr('op-each') ),
                        template = $t.attr('op-each-item');

                    $t.html('');

                    if ( _.isArray(thisData) || _.isObject(thisData) ) {
                        _.each( thisData, function( v, k ){
                            var clone = self.getTemplate(template);

                            $t.append(clone);

                            output( clone, v );
                        });
                    }

                    // $t.find('[each-item]').remove();

                });

            };

        output( view, data );  

    },

    /* 
     * @note 获取模板的jq对象
     * @author early
     * @param name 模板的名字
     */
    getTemplate : function( name ){

        var clone = null;

        if ( _.isUndefined( this['template'+name.firstUpperCase()] ) ) {

            clone = $('[template="'+name+'"]').clone();

        } else {

            clone = this['template'+name.firstUpperCase()].clone();

        }

        if ( clone.attr('template-display') ) {
            clone.css('display', clone.attr('template-display') );
        } else {
            clone.show();
        }
        
        // 先判断attr是否存在再移除属性(for ie6/7)
        if ( clone.attr('template') ) {
            clone.removeAttr('template');
        }

        if ( clone.attr('template-display') ) {
            clone.removeAttr('template-display');
        }

        return clone;

    },

    // -----------------------------------------------------------------------
    // 被弃用的助手方法 避免使用
    // -----------------------------------------------------------------------
    /* !注意此方法被弃用 请使用renderView代替
     * @note 向视图输出数据
     * @author early
     * @param view 视图的jq选择器
     * @param data 数据包
     */
    useView : function(){

        return this.renderView;

    }.mix(),

    // -----------------------------------------------------------------------
    // 全局函数
    // -----------------------------------------------------------------------
    fn : {

        /* 
         * @note 解析错误信息并返回
         * @author early
         * @param msg 错误信息对象由data.message提供，接受字符串数组和对象
         */
        analyzeErrorMessage : function( msg ){

            var self = this,
                message = '<p>';
            
            if( _.isString(msg) ) {
                message = msg;
            } else {
                _.each( msg, function( v, k ){
                    message += v + '<br/>';
                });
                message = message.replace(/<br\/>$/g, '');
            }

            message += '</p>';

            return message;

        },

        /* 
         * @note 获取格式化后的价格
         * @author early
         * @param price 数据库取出的原始价格
         */
        getFormatPrice : function( price ){

            price = ( _.isUndefined(price) ) ? 0 : price;

            var decimal = price % 100;
            price = price / 100;

            if ( decimal === 0 ) {
                price += '.00';
            } else if ( decimal % 10 === 0 ) {
                price += '0';
            }

            return String(price);
            
        },

        /* 
         * @note 获取格式化后的剩余时间
         * @author early
         * @param time 时间戳
         */
        getFormatTimeleft : function( time ){

            if ( time > 60*60*24*365*1000 ) {
                return Math.ceil(time/(60*60*24*365*1000)) + '年';
            } else if ( time > 60*60*24*1000 ) {
                return Math.ceil(time/(60*60*24*1000)) + '天';
            } else if ( time > 60*60*1000 ) {
                return Math.ceil(time/(60*60*1000)) + '小时';
            } else if ( time > 60*1000 ) {
                return Math.ceil(time/(60*1000)) + '分钟';
            } else if ( time > 0 ) {
                return Math.ceil(time) + '秒';
            }
            
        },

        /* 
         * @note 获取格式化后的折扣
         * @author early
         * @param price 现价
         * @param originPrice 原价价
         */
        getFormatDiscount : function( price, originPrice ){
            
            var discount = price/originPrice;

            if ( discount >= 1 ) {
                return false;
            } else if ( discount <= 0.1 ) {
                return 1;
            } else {
                return Math.floor(discount*100)/10;
            }

        },

        /*
         * @note    获取URL中get请求相应参数的值   function接受的参数如括号中所示
         * @param   无参数     一个参数string || function(obj)  两个参数：string, function (obj[name])
         * @return  obj        obj[name]         obj            obj[name]
         * @author  Xaber
         */
        getUrlParam : function () {

            var queryString = window.location.search,

                helper = function (queryString) {
 
                    var obj = {},
                        arr = queryString.substr(1).split('&'),
                        i = arr.length,
                        each = [];

                    for (; i--; ) {
                        each = arr[i].split('=');
                        obj[ each[0] ] = each[1];
                    }

                    return obj;
                    
                },

                get = queryString.indexOf('?') !== -1 ? helper(queryString) : {},
                param,
                callback;

            switch (arguments.length) {
                case 0 :
                    break;
                case 1 :
                    param = arguments[0];
                    if ( _.isString(param) ) {
                        return get[param];
                    } else if ( _.isFunction(param) ) {
                        callback = param;
                        callback(get);
                        return get;
                    }
                    break;
                case 2 :
                    param = arguments[0];
                    callback = arguments[1];

                    if ( _.isString(param) && _.isFunction(callback) ) {
                        callback( get[param] );
                        return get[param];
                    }
                    break;
            }
            return get;

        },

        /* 
         * @note 获取服务器授时
         * @author early
         * @param done 获取时间后的回调 传递一个参数 服务器的时间单位ms
         */
        getServerTime : function(done){

            var self = this;

            $.ajax({
                url: window.devMode ? self.confDevGetTimeUrl : self.confProGetTimeUrl,
                type: 'GET',
                dataType: 'jsonp',
                crossDomain : true
            })
            .done(function(data) {
                done(data.ts*1000);
            });

        },

        /*
         * @note 指定日期运行函数
         * @author early
         * @param start 开始时间
         * @param end 结束时间 '2010-05-23' 为null不指定开始时间
         * @param fn 运行函数 '2010-6-1' 为null不指定结束时间
         * @param efn 时间不满足时的函数
         */
        specifiedDateFn : function( start, end, fn, efn ){

            var now = new Date().getTime();
            
            start = ( start !== null ) ? moment(start)._d.getTime() : false;
            end = ( end !== null ) ? moment(end)._d.getTime() : false;

            if ( ( start !== false && end !== false ) && ( now >= start ) && ( now < end ) ||
                 ( start !== false && end === false ) && ( now >= start ) ||
                 ( start === false && end !== false ) && ( now < end ) ||
                 ( start === false && end === false ) ){
                // console.log(4);
                fn.apply(this);
            } else {
                // console.log(2);
                efn.apply(this);
            }

        }

    }

});