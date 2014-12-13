/*
 * @note 控制器基类
 * @author early
 * @version 0.0.1
 * @date NaN
 */
// 所有的页面js需要继承B.Page
B.Page = B.Object.extend({

    // -----------------------------------------------------------------------
    // 初始化
    // -----------------------------------------------------------------------
    init : function(){

        var self = this;

        self._super();

        // 初始化$.cookie
        $.cookie.defaults = {path: '/', domain: 'beibei.com'};

        // 查询视图
        self.queryView();

        // 查询所有模板
        self.queryTemplate();

        // 绑定事件
        self.onEvent(); 
        // 启动观察
        self.onWatch();

        self.use('fn.environmentTip');

        self.use('fn.avoidDblClick');

        // 如果是开发模式 运行开发模式脚本
        if ( self.confDev ) {
            self.devAutoScript();
        } else {
            delete self.devAutoScript;
        }

        // 初始化注册组件
        // 组件将被废弃
        _.each( self.widget, function(v,k){

            if ( _.isUndefined( B['widget'+k.firstUpperCase()] ) ) {
                self['widget'+k.firstUpperCase()] = B['widget'+v.use.firstUpperCase()].create(v.conf);
            }

        });

        // 广告控制
        self.use('fn.getResources');

        // 修复定位
        B.Core.positionFooter();

        // 头部登录状态
        self.use('fn.initLoginStatus');

        // 自动登录
        self.use('fn.autoLogin');
        
        if ( !self.holdImgLazyLoad ) {
            // 图片延迟加载
            self.use('fn.setImgLazyLoad');
        }
        

    },
    
    viewActionBackLink : $('.action-back,.view-ActionBack'),

    viewAvoidDoubleClick : null,
    confDelayClickTime : 500,

    // -----------------------------------------------------------------------
    // 开发模式自动脚本
    // -----------------------------------------------------------------------
    devAutoScript : function(){},

    // -----------------------------------------------------------------------
    // 视图
    // -----------------------------------------------------------------------
    viewLoginStatus : null,

    // -----------------------------------------------------------------------
    // 应用程序状态
    // -----------------------------------------------------------------------
    // 页面数据
    pageData : {},

    // 页面id
    pageId : null,

    // 数据仓库 用于组件间数据共享
    store : {},

    // 页面上的广告资源
    resources : {},

    // 暂缓图片延迟加载
    holdImgLazyLoad : false,

    // -----------------------------------------------------------------------
    // 应用程序组件
    // -----------------------------------------------------------------------
    widget : {

        publicMessageNotification : {
            use : 'messageNotification',
            conf : {}
        }

    },

    // -----------------------------------------------------------------------
    // 包管理
    // -----------------------------------------------------------------------
    // 包实例及载入信息
    package : {},

    // 依赖的包
    relyPackage : [],

    // -----------------------------------------------------------------------
    // 视图
    // -----------------------------------------------------------------------

    // -----------------------------------------------------------------------
    // 观察
    // -----------------------------------------------------------------------
    onWatch : function(){
        
    },

    // -----------------------------------------------------------------------
    // 事件
    // -----------------------------------------------------------------------
    onEvent : function(){
        
        var self = this;

        $(window).on('resize', B.Core.positionFooter);
        
        $(document).on('mousedown', self.viewActionBackLink.selector, function(){
            var $t = $(this);
            var target = window.location.href;
            if (target.indexOf('member/') !== -1) {
                return;
            }
            var base = $t.attr('href');
            if (base.indexOf('done=') !== -1) {
                return;
            }
            
            if (base.indexOf('?') === -1) {
                base += '?done=';
            } else {
                base += '&done=';
            }
            $t.attr('href', base + encodeURIComponent(target));
        });

        // 修复ie hover
        $('.dropdown, .nav-cart')
        .on('mouseover', function(){
            $(this).addClass('hover');
        })
        .on('mouseout', function(){
            $(this).removeClass('hover');
        });

    },

    // -----------------------------------------------------------------------
    // API
    // -----------------------------------------------------------------------
    api : {},

    // -----------------------------------------------------------------------
    // VIEW
    // -----------------------------------------------------------------------
    view : {


        /*
         * note 目录选择器，根据当前pageid来匹配
         * author early
         * param directory 目录的配置 like...
         * [
         *   { selector : '.ui-nav-item', current : 'ui-nav-item-current' },
         *   { selector : '.ui-nav-subitem', current : 'ui-nav-subitem-current' }
         * ]
         */
        directoryPicker : function( directory ){

            var self = this,
                patt = new RegExp('[A-Z][a-z0-9]+','g'),
                pageId = self.pageId,
                queryPageId = 'page',
                queryItem,
                result,
                pageArray = [],
                queryMenu = function( dir, k ){

                    queryItem = $(dir.selector+'[data-pageid~="'+queryPageId+'"]');

                    if ( queryItem.length > 0 ){
                        queryItem.addClass(dir.current);
                    }

                };

            while ( (result = patt.exec(pageId)) !== null ) {
                pageArray.push(result[0]);
            }

            while ( pageArray.length !== 0 ) {

                queryPageId += pageArray.shift();

                _.each( directory, queryMenu);

            }

        },

        /* 此方法已被弃用！！！请勿使用！
         * @note 创建小提示
         * @author early
         * @config msg 提示的信息可以是字符串和jq对象
         * @config type 提示类型（danger/success/warning/info） 默认：info
         * @config box 存放小提示的容器 jq对象或选择器
         * @config closeTime 多久之后关闭，默认3000ms，0为永不关闭
         * @return $tip 小提示jq对象
         * @return close 关闭并移除小提示
         */
        alertTip : function( config ){

            var cf = $.extend( true, {
                msg: '',
                type: 'info',
                box: $('#alert-tip'),
                closeTime: 3000
            }, config ),

            self = this,
            $box = $(cf.box),
            $tip = $('<div></div>').addClass('alert alert-dismissable alert-'+cf.type);

            // 添加关闭按钮
            $tip.append('<button type="button" class="close" data-dismiss="alert" aria-hidden="true">&times;</button>');

            if ( _.isString( cf.msg ) ) {
                $tip.append(cf.msg);
            } else {
                $tip.append( cf.msg.clone() );
            }

            if ( _.isUndefined(self.store.alertTip) ) {
                self.store.alertTip = {};
            }

            $box.append($tip);

            // 设置自动关闭
            if ( cf.closeTime > 0 ) {
                setTimeout(function(){
                    $tip.slideUp( 400, function(){
                        $tip.remove();
                    });
                }, cf.closeTime);
            }

            return {

                $tip : $tip,

                close : function(){
                    $tip.remove();
                }

            };

        }

    },


    // -----------------------------------------------------------------------
    // INSTRUCTION
    // -----------------------------------------------------------------------
    ins : {

        /*
         * note 加入收藏夹
         * author early
         */
        addFavorite : function(){
            
            try{
                window.external.addFavorite('http://www.beibei.com', '贝贝网-妈妈宝贝专属的母婴特卖网站,孕婴童正品购物商城');
            }
            catch(e1){
                try{
                    window.sidebar.addPanel('贝贝网-妈妈宝贝专属的母婴特卖网站,孕婴童正品购物商城', 'http://www.beibei.com', '');
                }
                catch(e2){
                    alert('加入收藏失败，请使用Ctrl+D进行添加');
                }
            }

        }
        
    },
    // -----------------------------------------------------------------------
    // FUNCTION
    // -----------------------------------------------------------------------
    fn : {

        /*
         * note 设置图片延迟加载
         * author early
         * param $t 需要绑定延迟加载的图片对象
         */
        setImgLazyLoad : function( $t ){
            $t = $t || $('img.lazy');
            $t.lazyload({
                threshold : 200,
                data_attribute : 'src',
                failure_limit : 5
            });
        },

        /*
         * note 初始化头部登录状态
         * author early
         */
        initLoginStatus : function(){
            
            var self = this,
                status = self.viewLoginStatus.attr('data-status'),
                ulv = $.cookie('_m_gd_') || 1;

            if ( status === '0' && B.H.isLogin() === true ) {
                
                self.viewLoginStatus.html('<a class="lv-icon lv'+ulv+'" href="'+( self.confDev ? 'http://i-dev.beibei.com/member/grade.html' : 'http://i.beibei.com/member/grade.html' ) +
                '">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</a><a class="striking-link" href="'+
                ( self.confDev ? 'http://i-dev.beibei.com/' : 'http://i.beibei.com' ) +
                '">'+B.H.lastLoginId()+'</a> &nbsp; <a href="'+( window.devMode ? 'http://dev.beibei.com/member/logout.html' : 'http://www.beibei.com/member/logout.html' )+'" rel="nofollow">[退出]</a>');

                self.viewLoginStatus.after( '<li class="seg"></li>'+
                                            '<li><a href="'+(window.devMode?'http://i-dev.beibei.com/trade/order/lists.html':'http://i.beibei.com/trade/order/lists.html')+'">我的订单</a>' +
                                                '</li><li class="seg"></li><li><a href="'+(window.devMode?'http://i-dev.beibei.com/':'http://i.beibei.com/')+'">我的贝贝</a></li>');

            }
        },

        /*
         * note 自动登录
         * author lsave
         */
        autoLogin : function(){
        
            var self = this,
                cookie = window.document.cookie,
                remember = 0,
                passport, stau,

            ajax = {

                login : function(){
                    $.ajax({
                        url: self.confDev ? 'http://dev.beibei.com/member/boot' : 'http://d.beibei.com/member/boot',
                        type: 'GET',
                        dataType: 'jsonp'
                    })
                    .done(function() {
                        self.use('fn.initLoginStatus');
                    });
                    
                }

            };
            
            remember = $.cookie('_remember_me_');
            passport = $.cookie('_passport_');
            stau = $.cookie('st_au');
            if ( remember === '1' && passport && stau === null ) {
                ajax.login();
            }

        }, 

        /*
         * note 
         * author lsave
         */
        tracelog : function($t){
            var clickData = $t.attr('data-params');
            if (clickData === undefined || clickData === '') {
                return;
            }
            var au = $.cookie('st_au');
            if (!au) {
                au = 0;
            }
            clickData = 'log=' + $t.attr('data-log') + '&au=' + au + '&' + clickData;
            var img = new Image();
            img.src = 'http://b.husor.cn/click.html?' + clickData + '&_t=' + new Date().getTime();
                
        },

        /*
         * note 广告控制 获取广告
         * author early
         * param id 指定获取广告的id 默认自动从pageData.resources 获取
         */
        getResources : function(id){
            
            var self = this,
                hasAds = pageData.resources,
                getString;

            if ( !_.isUndefined(id) ) {
                getString = id;
            } else if ( hasAds && hasAds.length > 0 ) {
                getString = hasAds.join('_');
            }

            // 如果没有广告 不获取
            if ( getString === undefined ) {
                return;
            } 

            $.ajax({
                url: window.devMode ? 'http://dev.beibei.com/resource/get-'+getString+'.html' : 'http://www.beibei.com/resource/get-'+getString+'.html',
                type: 'GET',
                dataType: 'jsonp',
                jsonpCallback: 'fun',
                cache : true
            })
            .done(function(data) {

                self.resources = $.extend(self.resources, data);
                self.use('fn.resourcesControl');

            });
            
        },

        

        /*
         * note 广告控制
         * author early
         */
        resourcesControl : function(){
            
            var self = this, banner, time, viewData, all, random, nowTime = _.now(), needLogin;

            // 判断是否是预览状态
            if ( /^\#bannerReview/g.test(window.location.hash) ){
                nowTime = window.location.hash.split(',')[1];
            }

            _.each( self.resources.spaces, function(v){

                banner = {};
                viewData = false;

                // 判断投放平台是否准确
                if ( v.platform !== 'web' ) {
                    return;
                }

                // 先选出智能投放广告
                _.each( self.resources.banner, function(bv){

                    // 广告位相符合
                    if ( bv.pid !== v.id || bv.use === false ) {
                        return;
                    }

                    if ( bv.auto !== true ) {
                        return;
                    }

                    // login check
                    needLogin = true;

                    if ( bv.abTest === true && bv.ads.length > 1 ) {
                        _.each( bv.ads, function(av){
                            needLogin = needLogin && av.needLogin;
                        });
                    } else {
                        needLogin = bv.ads[0].needLogin;
                    }

                    if ( !needLogin || (needLogin && B.H.isLogin()) ) {

                        banner = bv;
                    }

                });

                // 查找广告
                _.each( self.resources.banner, function(bv){
                    
                    // 广告位相符合
                    if ( bv.pid !== v.id || bv.use === false ) {
                        return;
                    }

                    if ( bv.auto === true ) {
                        return;
                    }

                    // 时间是否符合
                    time = false;

                    _.find( bv.date, function(tv){
                        
                        if ( tv.start <= nowTime && nowTime <= tv.end ){
                            time = true;
                            return true;
                        }

                    });

                    if ( time === false ) {
                        return;
                    }

                    // login check
                    needLogin = true;

                    if ( bv.abTest === true && bv.ads.length > 1 ) {
                        _.each( bv.ads, function(av){
                            needLogin = needLogin && av.needLogin;
                        });
                    } else {
                        needLogin = bv.ads[0].needLogin;
                    }

                    if ( !needLogin || (needLogin && B.H.isLogin()) ) {

                        banner = bv;
                    }

                });

                // AB TEST
                if ( banner.abTest === true && banner.ads.length > 1 ) {

                    all = 0;

                    _.each( banner.ads, function(av){

                        // 登录广告检测
                        if ( (av.needLogin && B.H.isLogin()) || av.needLogin === false ) {
                            all += Number(av.probability);
                        }
                        
                    });

                    random = _.random( 0, all );

                    _.find( banner.ads, function(av){

                        // 登录广告检测
                        if ( (av.needLogin && B.H.isLogin()) || av.needLogin === false ) {

                            random = random - Number(av.probability);

                            if ( random <= 0 ) {
                                viewData = av;
                                return true;
                            }

                        }

                    });

                } else if ( banner.ads && banner.ads.length === 1 ){

                    viewData = banner.ads[0];

                }

                // 如果没有找到符合条件的广告
                if ( viewData === false ) {

                    // 如果没有发现广告 则移除广告位
                    if ( _.isEmpty(banner) && v.use === 'auto' && !(/^\#(singleReview)/g.test(window.location.hash)) ) {
                        $( v.location.view ).eq(v.location.index).remove();
                    }

                    return;
                }

                // 如果有ga
                if ( viewData.showAnalysis.category !== false ) {
                    ga('send', 'event', viewData.showAnalysis.category, viewData.showAnalysis.category);
                }

                if ( viewData.clickAnalysis.category !== false ) {

                    $( v.location.view ).eq(v.location.index).on('click', function(e){

                        var $t = $(this),
                            url = $t.attr('href');

                        ga('send', 'event', viewData.clickAnalysis.category, viewData.clickAnalysis.category);

                        if ( $t.attr('target') !== '_blank' ) {

                            e.preventDefault();
                            e.stopPropagation();

                            setTimeout(function(){
                                window.location.href = url;
                            }, 180);

                        }

                    });
                    
                }

                self.use('fn.setResources', $( v.location.view ).eq(v.location.index), viewData, v);

            });

            // 判断是否进入单banner预览状态
            if( /^\#singleReview/g.test(window.location.hash) ) {

                var param = window.location.hash.split(','),
                    view = $(param[1]).eq(param[2]),
                    data = {
                        img : {
                            fullSrc : param[3]
                        },
                        title : param[5],
                        link : (param[4] === 'false') ? false : param[4],
                        autoClose : param[8]
                    },
                    bn = {
                        type : param[9],
                        size : {
                            height : param[6],
                            width : param[7]
                        }
                    };

                if ( param[10] === 'false' ) {
                    data.background = false;
                } else {
                    data.background = {};
                    data.background.type = param[10];
                    data.background.data = param[11];
                    data.background.color = param[12];
                    data.background.img = param[13];
                    data.background.position = param[14];
                }

                self.use('fn.setResources', view, data, bn, true);

            }

        },

        /*
         * note 投放广告
         * author early
         * param $view 广告视图
         * param data 广告数据
         * param banner banner数据
         * param mark 是否要显眼的显示广告位置
         */
        setResources : function($view,data,banner,mark){

            mark = mark || false;

            var self = this;

            // 广告数据预处理
            data.height = banner.size.height;
            data.width = banner.size.width;

            if ( banner.type === 'banner' ) {

                var bgcolor = '';

                if ( data.background ) {

                    if ( data.background.type === 'color' ) {
                        bgcolor = 'background:'+data.background.color;
                    } else if ( data.background.type === 'img' ) {
                        bgcolor = 'background-image:url('+data.background.img+');';
                        if ( data.background.position ) {
                            bgcolor += 'background-position:'+ data.background.position;
                        }
                    } else if ( data.background.type.search('preset') > -1 ) {
                        bgcolor = 'background:'+data.background.data;
                    }

                }

                data.styleText = $view.attr('data-style') + ';'+bgcolor+';';

            } else {
                data.styleText = $view.attr('data-style') + ';';
            }

            if ( data.link === false ) {

                data.href = 'javascript:;';
                data.target = '_self';
                data.styleText += 'cursor: default;';

            } else {

                data.href = data.link;
                data.target = $view.attr('target');
                data.styleText += 'cursor: pointer;';

            }

            data.imgStyle = 'zoom:1;';

            // 开始投放广告
            self.renderView( $view, data, false);

            // for ie 广告图片切换 不展示
            setTimeout(function(){
                $view.find('img').css('zoom', 1); 
            });

            // 如果设置了自动关闭
            if ( data.autoClose !== 'false' && 
                 ( 
                    ( /^\#singleReview/g.test(window.location.hash) && mark === true ) ||
                    ( !/^\#singleReview/g.test(window.location.hash) )
                 ) ) {

                if ( Number(data.autoClose) ) {

                    setTimeout(function(){
                        $view.slideUp(320, function(){
                            $view.remove();
                        });
                    }, Number(data.autoClose) );

                }
                
            }

            if( /^\#(singleReview|bannerReview)/g.test(window.location.hash) && mark ) {

                // 显眼的显示广告位置
                var $mark = $('<div>HERE</div>');

                $mark.css({
                    'position' : 'fixed',
                    'left' : $view.offset().left,
                    'top' : $view.offset().top,
                    'width' : Number(data.width) || $view.outerWidth(),
                    'height' : Number(data.height) || $view.outerHeight(),
                    'background' : '#f26060',
                    'line-height' : (Number(data.height) || $view.outerHeight()) + 'px',
                    'text-align' : 'center',
                    'font-size' : '22px',
                    'opacity' : 1,
                    'color' : '#fff'
                });
                $view.append($mark);

                $mark.animate({
                    'opacity' : 0
                }, 3000, 'swing', function(){
                    $mark.remove(); 
                });
            }

        },
        environmentTip : function() {
            if(!window.devMode || !window.showEnvironmentLogo) {
                return;
            }
            $(document).on('mouseover', '#environmentTip', function (e) {
                e.preventDefault();
                var $t = $(this),
                    offsetLeft = $t.offset().left;
                if(offsetLeft === 0) {
                    $t.css('border', '1px solid #FF5482')
                        .css('border-right', 'none')
                        .css('border-top', 'none')
                        .css('left', 'auto')
                        .css('right', 0);
                } else {
                    $t.css('border', '1px solid #FF5482')
                        .css('border-left', 'none')
                        .css('border-top', 'none')
                        .css('right', 'auto')
                        .css('left', 0);
                }
            });
            var dom = '<img id="environmentTip" src="' + window.mainLogo + '" width="250" height="50" style="position: fixed;top: 0;z-index: 110;border: 1px solid #FF5482;border-left: none;border-top: none;" />';
            $('body').append(dom);
        },

        /**
         * @note   针对一些特殊按钮(类名添加view-AvoidDoubleClick) 点击 创建两个订单等各类事件
         *         将原有JQuery绑定在元素的事件函数做一个保存 然后解除绑定
         *         最后绑定一个事件  先做时间延迟调用的处理  再将原有函数依次执行
         *         《Pro JavaScript Technique》&& Dean Edwards Events && JQuery
         * @author Xaber
         */
        avoidDblClick : function () {
            var self = this,
                viewAvoidDoubleClick = self.viewAvoidDoubleClick,
                confDelayClickTime = self.confDelayClickTime;

            if (viewAvoidDoubleClick.length) {

                // 原来绑定的所有事件函数的散列表
                var oriBinds = [],
                    temp;

                // 有绑定过click事件
                if ( (temp = $._data(viewAvoidDoubleClick[0]).events) &&
                        (temp = temp.click) ) {

                    // 获得 绑定事件的函数数组
                    // 不可再循环中使用off  因off中会将 $._data(viewAvoidDoubleClick[0]).events.click 中的事件绑定函数移除
                    // 也就类似 循环的过程中改变循环的数组
                    $.each( temp, function (key, handle) {
                        if (handle.handler) {
                            oriBinds.push(handle.handler);
                        }
                    });

                    // 解除绑定
                    $.each(oriBinds, function (key, handler) {
                        viewAvoidDoubleClick.off('click', handler);
                    });
                }

                viewAvoidDoubleClick.each(function () {

                    var thisDom = this;

                    thisDom.isDblClick = false;
                    $(thisDom).on('click', function () {
                        var args = arguments,
                            // 初始返回值即为undefined
                            result;

                        // 双击 只针对单个的DOM
                        // 不对还未双击过的其他元素影响
                        if (thisDom.isDblClick) {
                            // 顺便禁掉默认事件
                            return false;
                        }

                        thisDom.isDblClick = true;
                        // 设置定时
                        setTimeout(function () {
                            thisDom.isDblClick = false;
                        }, confDelayClickTime);

                        $.each(oriBinds, function (key, handler) {

                            // 原来绑定的所有事件函数 调用
                            result = handler.apply(thisDom, args);
                        });

                        return result;

                    });
                });
            }
        }

    },

    // -----------------------------------------------------------------------
    // 助手方法
    // -----------------------------------------------------------------------
    /* 
     * @note 使用api的快捷方法
     * @author early
     * @param name api的名字
     * @param data 发送的数据 自动加上hxcsrf
     * @param callback 请求完成回调函数
     */
    useApi : function( name, data, callback ){

        var self = this,
            cb = {},
            cf = $.extend( true, {
                
                noHxcsrf : false,
                devUrl : null,
                proUrl : null,
                type : 'POST',
                dataType: 'json',
                async : true,
                done : function(){},
                fail : function(){},
                always : function(){}

            }, self.api[name]),
            errorCatch = false;

        $.extend( cb, {
            done : function(){},
            fail : function(){},
            always : function(){}
        }, callback);

        if ( cf.noHxcsrf === false ) {
            data = $.extend( true, {
                hxcsrf : g.__t__
            }, data );
        }
        cf.url = self.confDev ? cf.devUrl : cf.proUrl;
        cf.data = data;
        cf.statusCode = {
            500 : function(){
                if ( !errorCatch ) {
                    self.widgetPublicMessageNotification.methodSend( self.use('fn.analyzeErrorMessage',self.confMsg.apiCode500 || self.confMsg.netError ), {type:'danger'});
                    errorCatch = true;
                }
            },
            404 : function(){
                if ( !errorCatch ) {
                    self.widgetPublicMessageNotification.methodSend( self.use('fn.analyzeErrorMessage',self.confMsg.apiCode404 || self.confMsg.netError ), {type:'danger'});
                    errorCatch = true;
                }
                
            }
        };

        $.ajax(cf)
        .done(function(){
            cf.done.apply( self, arguments );
            cb.done.apply( self, arguments );
            self.catchAjaxError.apply( self, arguments );
        })
        .fail(function(data){

            cf.fail.apply( self, arguments );
            cb.fail.apply( self, arguments );

            if ( !errorCatch ) {

                if ( data.status === 500 ) {
                    self.widgetPublicMessageNotification.methodSend( self.use('fn.analyzeErrorMessage',self.confMsg.apiCode500 || self.confMsg.netError ), {type:'danger'});
                } else if ( data.status === 404 ) {
                    self.widgetPublicMessageNotification.methodSend( self.use('fn.analyzeErrorMessage',self.confMsg.apiCode404 || self.confMsg.netError ), {type:'danger'});
                } else {
                    self.widgetPublicMessageNotification.methodSend( self.use('fn.analyzeErrorMessage',self.confMsg.apiFail || self.confMsg.netError ), {type:'danger'});
                }

                errorCatch = true;

            }

        })
        .always(function(data){

            cf.always.apply( self, arguments );
            cb.always.apply( self, arguments );

            if ( Number(data.success) === 302 ) {
                window.location.href = data.url || ( self.confDev ? self.confDevRootUrl : self.confProRootUrl );
            } else if ( (Number(data.success) === 500) && (data.ignore !== true) ) {

                self.widgetPublicMessageNotification.methodSend( self.use('fn.analyzeErrorMessage',data.message || self.confMsg.netError), {type:'danger'});

            }

        });

    },

    /* 
     * @note 捕获ajax请求done后 非500 302的错误
     * @author early
     * @param data ajax返回的data对象
     */
    catchAjaxError : function( data ){

        var self = this;

        if ( data.success === false && Number(data.success) !== 302 && Number(data.success) !== 500 && data.ignore !== true ) {

            self.widgetPublicMessageNotification.methodSend(self.use('fn.analyzeErrorMessage',data.message || self.confMsg.netError),{type:'danger'});

        }

    },

    /* 
     * @note 查询视图 将实例中view开头的属性进行jq对象化
     * @author early
     * @param view 指定需要查询视图的名称（一个数组）
     */
    queryView : function( view ){

        // 若没有设置view或view为空数组 则设为false
        if ( _.isUndefined(view) ||
             !_.isArray(view) ||
             view.length === 0 ) {
            view = false;
        }
        
        var self = this,
            viewQueryCache = self._viewQueryCache,
            selector,
            viewName,

            getSelector = function( view ){
                
                if ( view && view.selector ) {
                    return view.selector;
                }

                return '';

            };

        // 如果未找到视图查询缓存 则为第一次
        if ( _.isUndefined(viewQueryCache) ) {

            viewQueryCache = {};

            // 第一次查询对象中的所有view
            for( var k in self ) {

                if ( k.search(/view\w+/g) === 0 ) {

                    // 获取完整视图名称
                    viewName = k.replace(/^view/,'');

                    // 第一次需要获取选择器
                    if ( _.isString(self[k]) ) {

                        selector = self[k];

                    } else if ( _.isNull(self[k]) ) {

                        // 如果选择器为null 自动识别
                        selector = '.view-' + viewName;

                    } else {

                        // 将jq对象转换成选择器
                        selector = getSelector(self[k]);

                    }

                    if ( !(!_.isString(self[k]) && !_.isNull(self[k]) && !_.isUndefined(self[k]) && self[k].length > 0 ) ) { 

                        // 将选择器放入缓存
                        viewQueryCache[viewName] = selector;

                        // 重新查询 排除父元素有模板的
                        self[k] = $(selector+':not(.isTemplate '+selector+')');

                    } else {

                        // 如果是jq对象 并且长度大于0 则不再查询 直接忽略
                       
                    }

                }

            }

        } else {


            // 如果含有view参数 则只查找view中的视图
            if ( view !== false ) {

                var viewSelector;
                _.each( view, function(v,k){
                    
                    viewName = v.replace(/^view/,'');
                    viewSelector = viewQueryCache[viewName];
                    if ( viewSelector ) {
                        self['view'+viewName] = $(viewSelector+':not(.isTemplate '+viewSelector+')');
                    }

                });

            } else {

                // 否者查询所有视图
                _.each( viewQueryCache, function(v,k){
                    
                    // 重新查询 排除父元素有模板的
                    // TODO 添加template-display判断 为了暂时解决ie6/7 jquery clone及查询的问题
                    self['view'+k] = $(v+':not(.isTemplate '+v+')');

                });

            }

        }

        // 设置视图查询选择器缓存
        self._viewQueryCache = viewQueryCache;

    },

    /* 
     * @note 查询所有模板
     *       为了解决 ie6/7 下clone后元素使用removeAttr会导致原dom对象的attr实效 导致template无法第二次被查询到
     * @author early
     */
    queryTemplate : function(){
        
        var self = this;

        // TODO template为空可能出现问题
        $('[template]').each(function(){
            
            var $t = $(this),
                name = $t.attr('template');

            self[ 'template'+name.firstUpperCase() ] = $t;

        });

    },

    /*
     * @note 重写 向视图输出数据
     * @author early
     * @param view 视图的jq选择器
     * @param data 数据包
     * @param requeryView 渲染完成后是否要重新查询视图 默认为true 可传入需要requery的视图名称数组
     */
    renderView : function(){
        
        var self = this,
            requeryView = arguments[2];

        if ( _.isUndefined(requeryView) ) {

            requeryView = true;
            self._super.apply( self, arguments );

        } else {

            var arg = _.initial(arguments);
            self._super.apply( self, arg );

        }

        if ( requeryView === true ) {
            self.queryView();
        } else if ( _.isArray(requeryView) ) {
            self.queryView( requeryView );
        }

    }

});

// 重写实例创建方法
B.Page.reopenClass({

    create : function(prop){
        
        this._super(prop, function(Instance){

            window.Page = Instance;

            // 初始化lib类型的包
            _.each( B, function(v,k){
                
                if ( /^package/g.test(k) ) {

                    Page.package.loaded[v.prototype.pkName] = v;
                    B.Page.initLibPackage(v);

                }

            });

        });

        return window.Page;
        
    },

    // 需要载入的依赖列表
    needLoadPackageList : [],

    // 初始化包列表（库类型）
    initLibPackageList : [],

    // 初始化库类型的包
    initLibPackage : function( package, rely ){

        rely = rely || false;

        if ( package.prototype.pkType === 'lib' || package.prototype.pkType === 'widget' ) {

            var needLoad = [],
                index = 0,
                len = 0,
                loadJs = function(name){
                    
                    var url = ( Page.confDev ? Page.confDevRootUrl : Page.confProRootUrl ) + 'script/src/package/' + name + '.js';

                    $.getScript( url, function(){

                        Page.package.loaded[name] = B[name];
                        B.Page.initLibPackage( B[name], true );

                    });

                };

            // check package rely
            _.each( package.prototype.pkRely, function(v){
                
                if ( _.isUndefined(Page.package.loaded[v]) ) {
                    needLoad.push(v);
                }

            });

            B.Page.needLoadPackageList = needLoad.concat(B.Page.needLoadPackageList);

            if ( rely === true ) {
                B.Page.initLibPackageList = needLoad.concat(B.Page.initLibPackageList);
            } else {
                B.Page.initLibPackageList.push( 'package'+package.prototype.pkName.firstUpperCase() );
            }

            if ( B.Page.needLoadPackageList.length > 0 ) {

                loadJs( B.Page.needLoadPackageList.shift() );

            } else {

                 // run package source function
                _.each( B.Page.initLibPackageList, function(v){
                    B[v].prototype.source();
                });
               
            }

        }

    },

    /*
     * @note 载入依赖包
     * @author early
     */
    loadRelyPackage : function( callback ){
        
        var self = this,
            rely = B.Core.newQuote(self.prototype.relyPackage),
            loadJs = function(){

                if ( rely.length !== 0 ) {

                    var name = rely.shift(),
                        url = ( self.prototype.confDev ? self.prototype.confDevRootUrl : self.prototype.confProRootUrl ) + 'script/src/package/' + name + '.js';

                    if ( !_.isUndefined(B[name]) ) {
                        loadJs();
                    } else {
                        $.getScript( url, function(){                        
                            loadJs();
                        });
                    }

                } else {
                    callback();
                }
                
            };

        // 载入包
        loadJs();

    }

});

// 初始化页面js
B.initPage = function(){

    var beforeCreate = function(){
        console.log('aaaaaaaaaa');

        // 载入依赖包
        B[key].loadRelyPackage(function(){
            B[key].create();
        });

    };

    // 保留原始的pageId
    window.originPageId = window.pageId;

    if ( !_.isUndefined(pageData) && !_.isUndefined(pageId) ) {

        var pi = pageId,
            end = false,
            key;

        pi = pi.replace(/\_/g, '');
        // 过滤.后缀
        pi = pi.replace(/\.\w+$/g, '');
        pi = pi.split('/');
        pi = _.map( pi, function( name ){
            return name.substring(0,1).toUpperCase()+name.substring(1);
        });
        pageId = key = 'page' + pi.join('');

        while( !end && key !== 'page' ) {

            if ( _.isUndefined(B[key]) ) {
                key = key.replace(/[A-Z][a-z0-9]*?$/g, '');
            }else{
                end = true;
            }

        }

        if ( key === 'page' ) {
            key = 'Page';
        }

        try{

            B[key].reopen({
                pageData : pageData,
                pageId : pageId
            });

            // 单独提前载入js
            // TODO js文件载入失败 是否需要容错
            if ( B[key].prototype.beforeLoadFile && B[key].prototype.beforeLoadFile.length > 0 ) {

                var maxNum = B[key].prototype.beforeLoadFile.length,
                    loadIndex = 0,
                    loadJs = function( file ){

                        var url = ( B[key].prototype.confDev ? B[key].prototype.confDevRootUrl : B[key].prototype.confProRootUrl ) + file;
                        $.getScript( url, function(){
                            loadIndex++;
                            if ( maxNum > loadIndex ) {
                                loadJs( B[key].prototype.beforeLoadFile[loadIndex] );
                            } else {
                                beforeCreate();
                            }
                        });
                    };

                loadJs( B[key].prototype.beforeLoadFile[loadIndex] );

            } else {
                beforeCreate(); 
            }

        }catch(e){
            if(window.devMode){
                throw e;
            }
        }

    }
};

$(function(){
    B.initPage();
});