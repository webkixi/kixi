/*
 * @note 底层核心
 * @author early
 * @version 0.0.1
 * @date NaN
 */

// Beibei namespace
var B = {};

// 核心函数
B.Core = {

    // 修复footer定位
    positionFooter : function(){
        var $footer = $('#footer');
        if ($footer.hasClass('fix') && document.documentElement.clientHeight - $footer.outerHeight() < document.documentElement.offsetHeight) {
            $footer.removeClass('fix');
        } else if (document.documentElement.clientHeight > document.documentElement.offsetHeight) {
            $footer.addClass('fix');
        }  
    },

    // 判断是否是一个真对象
    isPlainObject : function( value ){
        
        if ( _.isObject(value) &&
             !_.isArray(value) &&
             !_.isFunction(value) &&
             !_.isElement(value) &&
             !_.isArguments(value) &&
             !_.isDate(value)&&
             !_.isRegExp(value) ) {
            return true;
        } else {
            return false;
        }

    },

    // 对于任何引用对象会生成一个新的引用
    // TODO 新的深度拷贝方案
    newQuote : function( value ){

        if ( B.Core.isPlainObject( value ) ){
            return $.extend( true, {}, value );
        } else if ( _.isArray( value ) ){
            return $.extend( true, [], value );
        } else {
            return value;
        }

    },

    // 根据字符串索引 设置对象 
    setObject : function( obj, index, value ){
        
        var now = obj;

        if ( index === 'this' ) {
            obj = value;
            return obj;
        }

        // 将索引字符串拆分成数组
        index = index.split('.');

        _.each( index, function( v, i){

            if ( i < index.length - 1 ) {

                // 若now不是对象 则转换成空对象
                if ( !_.isObject(now[v]) ) {
                    now[v] = {};
                }

                now = now[v];

            } else if( i === index.length - 1 ){
                now[v] = value;
            }

        });

        return obj;

    },

    // 根据字符串索引 获取对象属性
    getObject : function( obj, index ){
        
        var now = obj, value;

        if ( index === 'this' ) {
            value = now;
            return value;
        }

        // 将索引字符串拆分成数组
        index = index.split('.');

        _.each( index, function( v, i){

            if ( i < index.length - 1 ) {

                try{
                    now = now[v];
                }catch(e){}

            } else if( i === index.length - 1 ){

                try{
                    value = now[v];
                }catch(e){}

            }

        });

        return value;

    },

    // 对比版本大小
    contrastVersion : function( v1, v2 ){

        v1 = v1.split('.');
        v2 = v2.split('.');

        var len = v1.length - v2.length,
            i, max = 0;

        // 补位
        if ( len > 0 ) {
            for ( i=0; i < len; i++ ) {
                v2.push('0'); 
            }
        } else {
            for ( i=0; i < -len; i++ ) {
                v1.push('0'); 
            }
        }

        for ( i=v1.length-1; i>-1; i-- ) {

            if ( v1[i] === v2[i] ) {
                continue;
            }

            max = v1[i] - v2[i];

        }

        return ( max === 0 ) ? 0 : ( ( max > 0 ) ? 1 : -1 );

    },

    // 判断数值是否是某一个类型
    isType : function( value, type ){

        type = type.split(',');

        var result = false;

        var contrastType = function( ty ){

            var re = false;

            if ( ty === 'string' ) {
                re = _.isString(value);
            } else if ( ty === 'number' ) {
                re = _.isNumber(value);
            } else if ( ty === 'element' ) {
                re = _.isElement(value);
            } else if ( ty === 'array' ) {
                re = _.isArray(value);
            } else if ( ty === 'object' ) {
                re = _.isObject(value);
            } else if ( ty === 'arguments' ) {
                re = _.isArguments(value);
            } else if ( ty === 'function' ) {
                re = _.isFunction(value);
            } else if ( ty === 'finite' ) {
                re = _.isFinite(value);
            } else if ( ty === 'boolean' ) {
                re = _.isBoolean(value);
            } else if ( ty === 'date' ) {
                re = _.isDate(value);
            } else if ( ty === 'regexp' ) {
                re = _.isRegExp(value);
            } else if ( ty === 'nan' ) {
                re = _.isNull(value);
            } else if ( ty === 'null' ) {
                re = _.isNull(value);
            } else if ( ty === 'undefined' ) {
                re = _.isUndefined(value);
            } else if ( ty === 'plainobject' ) {
                re = B.Core.isPlainObject(value);
            }

            return re;

        };

        _.each( type, function( v, i ){
            result = result || contrastType(v);
        });

        return result;

    },

    // 强制类型转换 仅支持部分类型
    toType : function( value, type ){

        var targetType = '',
            re = value;

        type = type.split(',');

        _.find( type, function(t){

            if ( t === 'number' || 
                 t === 'string' || 
                 t === 'boolean' ) {
                targetType = t;
            }

        });

        switch( targetType ) {

            case 'number' :
                re = Number(value);
                break;

            case 'string' : 
                re = String(value);
                break;

            case 'boolean' :
                re = Boolean(value);
                break;

        }

        return re;

    },

    // 获取对象的key列表
    // key列表不会包含prototype中的属性和前缀为下划线的属性
    getObjectKeyList : function( obj ){

        var keyList = [];

        _.each( obj, function( v, k ){

            if ( !/^_/g.test(k) ) {
                keyList.push(k);
            }

        });

        return keyList;

    },

    // 创建一个class类型
    makeClass : function(){
        
        // 创建一个新的构造函数
        var Class = function(){};

        // 类属性
        Class.needMixinProperty = {

            isClass : true,

            toString : function(){
                return 'B Class';
            },

            // 混入类属性
            mixinProperty : function(){

                // 是否有父类
                var self = this,
                    hasSuperClass = self.superClass ? true : false;

                // 若无property 则生成新的property
                if( _.isUndefined( self.property ) ) {
                    self.property = {};
                }

                _.each( self.needMixinProperty, function( v, k ){
                    
                    if ( self.needMixinProperty.hasOwnProperty(k) ) {

                        // 若存在父类且新旧两个属性都是函数
                        if ( hasSuperClass &&
                             _.isFunction( v ) &&
                             _.isFunction( self.superClass[k] ) &&
                             /(this|self)\._super/.test( v ) ) {

                            self.property[k] = (function( name, fn ){

                                var tmpSuperFn = self.superClass[name];

                                return function(){
                                    this._super = tmpSuperFn;
                                    return fn.apply(this, arguments);
                                };

                            })( k, v );

                        } else if ( hasSuperClass &&
                                    B.Core.isPlainObject( v ) &&
                                    B.Core.isPlainObject( self.superClass[k] ) ) {

                            // 若是对象 深度合并
                            $.extend( true, self.property[k], self.superClass[k], v );

                        } else {

                            self.property[k] = v;
                            
                        }

                        self[k] = self.property[k];

                    }

                });

                // 清除需要混入的类属性
                delete self.needMixinProperty;

                return self;

            },

            // 混入实例属性
            mixinPrototype : function(){

                // 是否有父实例属性
                var self = this,
                    hasSuperProto = self.superProto ? true : false;
                
                _.each( self.needMixinPrototype, function( v, k ){
                    
                    if ( self.needMixinPrototype.hasOwnProperty(k) ) {

                        // 若存在父类且新旧两个属性都是函数
                        if ( hasSuperProto &&
                             _.isFunction( v ) &&
                             _.isFunction( self.superProto[k] ) &&
                             /(this|self)\._super/.test( v ) ) {

                            self.prototype[k] = (function( name, fn ){
                                var tmpSuperFn = self.superProto[name];
                                return function(){
                                    this._super = tmpSuperFn;
                                    return fn.apply(this, arguments);
                                };

                            })( k, v );

                        } else if ( hasSuperProto &&
                                    B.Core.isPlainObject( v ) &&
                                    B.Core.isPlainObject( self.superProto[k] ) ) {

                            // 若是对象 深度合并
                            self.prototype[k] = $.extend( true, {}, self.superProto[k], v );

                        } else {

                            self.prototype[k] = v;
                            
                        }

                    }

                });

                // 清除需要混入的类属性
                delete self.needMixinPrototype;

                return self;

            },

            // 重新打开类属性
            reopenClass : function( prop, parent ){
                
                prop = prop || {};
                parent = parent || Class;

                // 保存类的上一个版本
                this.superClass = B.Core.newQuote( parent.property );
                this.needMixinProperty = prop;
                this.mixinProperty();

                return this;

            },

            // 重新打开实例属性
            reopen :  function( prop, parent ){

                prop = prop || {};
                parent = parent || Class;

                // 保存实例属性的上一个版本
                this.superProto = B.Core.newQuote( parent.prototype );
                this.needMixinPrototype = prop;
                this.mixinPrototype();

                return this;

            },

            // 继承类
            extend : function( prop ){

                var self = this;
                prop = prop || {};
                
                // 生成一个新的class对象
                var newClass = B.Core.makeClass();

                // 挂载实例属性及类属性
                newClass.reopenClass( self.property, self );

                newClass.reopen( self.prototype, self )
                        .reopen( prop, self );

                return newClass;

            },

            // 创建实例
            create : function( prop, beforeInitHook ){

                var Instance = new this();

                // 如果实例原始属性是一个真对象 则采用深度遍历覆盖
                _.each( prop, function( v, k ){
                    if ( B.Core.isPlainObject( Instance[k] ) ) {
                        Instance[k] = $.extend( true, {}, Instance[k], v );
                    }else{
                        Instance[k] = v;
                    }
                });

                // 挂载非共用属性
                for ( var k in Instance ) {

                    if ( /^\_self\_/g.test(k) ) {
                        Instance[ k.replace( /^\_self\_/g, '' ) ] = B.Core.newQuote( Instance[k] );
                    }

                }

                if ( _.isFunction(beforeInitHook) ) {
                    beforeInitHook(Instance);
                }

                // 初始化实例
                Instance.init();

                return Instance;

            }

        };

        // 实例属性
        Class.needMixinPrototype = {

            constructor : Class,

            // 实例初始化函数
            init : function(){}

        };

        // 混入类属性
        Class.needMixinProperty.mixinProperty.apply( Class, arguments );

        // 混入实例属性
        Class.mixinPrototype();

        return Class;

    }

};

// 扩展默认string方法 首字母大写
window.String.prototype.firstUpperCase = function(){

    var str = this.toString().replace(/^\w+/g, function(word){
        return word.substring(0,1).toUpperCase()+word.substring(1);
    });

    return str;

};