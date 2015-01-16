/**
 * @name    前端公共的js
 */
define('web/common', ['global/g'], function(core) {
    var exports = {};
    var doc = document,
        win = window;
        
    /* 2007-11-28 XuJian */  
    //截取字符串 包含中文处理  
    //(串,长度,增加...)  
    var _subString = function(str, len, hasDot)  
    {  
        var newLength = 0;  
        var newStr = "";  
        var chineseRegex = /[^\x00-\xff]/g;  
        var singleChar = "";  
        var strLength = str.replace(chineseRegex,"**").length;  
        for(var i = 0;i < strLength;i++) {
            singleChar = str.charAt(i).toString();  
            if(singleChar.match(chineseRegex) != null) newLength += 2;
            else newLength++;

            if(newLength > len) break;
            newStr += singleChar;  
        }
        if(hasDot && strLength > len) newStr += "...";
        return newStr;
    }

    function __measureDoc(){
        var doch = document.documentElement.clientHeight, docw = document.documentElement.clientWidth,
        docST = document.documentElement.scrollTop||document.body.scrollTop,
        docSL = document.documentElement.scrollLeft||document.body.scrollLeft;
        return {dw:docw,dh:doch,st:docST,sl:docSL};
    };

    /**
     * [shoppCartShow 头部购物车下拉]
     * @param  {[type]} obj       [当前目标点]
     * @param  {[type]} target    [下拉目标点]
     */
    exports.shoppCartShow = function(obj, target){
        var hTime = null;
        $(obj).mouseover(function(){
            targetShow();
        })
        $(obj).mouseout(function(){
            targetHide();
        })
        $(target).mouseover(function(){
            targetShow();
        })
        $(target).mouseout(function(){
            targetHide();
        })
        function targetShow(){
            clearTimeout(hTime);
            $(target).fadeIn();
        }
        function targetHide(){
            hTime = setTimeout(function(){
                $(target).hide();
            }, 400);
        }
    };

    /** 
    /* 2015-1-13 yc   
    /* url解析
    /* @url   http://abc.com:8080/dir/index.html?id=255&m=hello#top
    //SAMPLE
    // var myURL = parseURL('http://abc.com:8080/dir/index.html?id=255&m=hello#top'); 
    // alert(myURL.file); // = 'index.html' 
    // myURL.hash; // = 'top' 
    // myURL.host; // = 'abc.com' 
    // myURL.query; // = '?id=255&m=hello' 
    // myURL.params; // = Object = { id: 255, m: hello } 
    // myURL.path; // = '/dir/index.html' 
    // myURL.segments; // = Array = ['dir', 'index.html'] 
    // myURL.port; // = '8080' 
    // myURL.protocol; // = 'http' 
    // myURL.source; // = 'http://abc.com:8080/dir/index.html?id=255&m=hello#top' 
    */
    var urlparse = function (url) {
        var anchor = document.createElement('a'); 
        anchor.href = url; 
        return { 
            source: url, 
            protocol: anchor.protocol.replace(':',''), 
            host: anchor.hostname, 
            port: anchor.port, 
            query: anchor.search, 
            params: (function(){ 
                var ret = {}, 
                seg = anchor.search.replace(/^\?/,'').split('&'), 
                len = seg.length, i = 0, str; 
                for (;i<len;i++) { 
                    if (!seg[i]) { continue; } 
                    str = seg[i].split('='); 
                    ret[str[0]] = str[1]; 
                } 
                return ret; 
            })(), 
            file: (anchor.pathname.match(/\/([^\/?#]+)$/i) || [,''])[1], 
            hash: anchor.hash.replace('#',''), 
            path: anchor.pathname.replace(/^([^\/])/,'/$1'), 
            relative: (anchor.href.match(/tps?:\/\/[^\/]+(.+)/) || [,''])[1], 
            segments: anchor.pathname.replace(/^\//,'').split('/') 
        }; 
    };
    

    
    var setHeadAllUserBanner = function(){
        core.init(this,{
            headalluser: {url:'/',data:{'ctl':'ajax','act':'logininfo'}}
        },setbanner);

        function setbanner(){
            var userinfo_top_tmp_login = '<div class="userinfo-top"><span>欢迎您,</span><a data-interaction="global|tuserinfo|1|1" href="{{ve.uc_account}}" class="c-reg">{{ve.user_name}}</a>\
                            <a data-interaction="global|tuserinfo|1|2" href="{{ve.logout}}">退出</a><i class="i-line"></i>\
                            <a data-interaction="global|tuserinfo|1|3" href="{{ve.uc_order}}">我的唯一</a><i class="i-line"></i></div>';
            var userinfo_top_tmp = '<div class="webcome-ve"><span>欢迎来到唯一优品，请</span><a data-interaction="global|tuserinfo|1|1"  href="{{ve.login}}" title="登录">登录</a><i class="i-line"></i>\
                            <a data-interaction="global|tuserinfo|1|2"  href="{{ve.register}}" class="c-reg" title="注册">免费注册</a><i class="i-line"></i>\
                            <a data-interaction="global|tuserinfo|1|3"  href="{{ve.uc_order}}">我的唯一</a><i class="i-line"></i></div>';

            if(headalluser){
                var urls = window._VE_Cfg.urls;
                $.extend(headalluser,urls);

                userinfo = (headalluser&&headalluser.id>0) ? userinfo_top_tmp_login : userinfo_top_tmp;
            }
        }
    }

    /*
    * msgtips 消息弹出窗，为tipsbox抽象的实例
    * @msg 传入的消息
    * @stat 传入状态，目前支持normal,alert
    * @cb  动画结束后的回调函数
    */
    var msgtips = function(msg,stat,cb){
        var msg_left, msg_top;
        var docRect = __measureDoc();
        var scrollleft = docRect.sl;
        var scrolltop = docRect.st;
        var clientwidth = docRect.dw;
        var clientheight = docRect.dh;  

        var msgtip = new core.tipsbox();
        //新建消息实例，可定制
        msgtip.tipsItem =function(stat){
            var tip = document.createElement('div');
            var subtip = document.createElement('div');
            var bgcolor='background-color:#4ba2f9;';
            tip.className = 'showmsg';
            if(stat=='alert'){
                bgcolor='background-color:rgb(211, 13, 21);';
            }
            tip.style.cssText = 'display:none;width:100%;text-align:center; margin-top:10px;color:#fff;line-height:40px;font-size:16px;'+bgcolor;
            return tip;
        }

        //消息实例容器，可定制
        msgtip.tipsBox=function(stat){
            console.log(stat);
            msg_left = Math.round((parseInt(clientwidth)-300)/2);
            msg_top = 'top:0;';
            if(stat=='alert'){
                msg_top = Math.round((parseInt(clientheight)-150)/2);
                msg_top = 'top:'+msg_top+'px;height:200px;overflow:hidden;';
            }
            $('#msgcontainer').length ? '' : $('body').append('<div id="msgcontainer" style="z-Index:10030;width:300px;position:fixed;top:10px;'+msg_top+'left:'+msg_left+'px;"></div>');
            return $('#msgcontainer')[0];
        }

        msgtip.anim=function(item,container){
            clearTimeout(ggg);
            $(item).fadeIn('slow').delay(2000).animate({'height':0,'opacity':0,'margin':0},300);
            var ggg = setTimeout(function(){
                $(item).remove();
                if($('.showmsg').length==0) $(container).remove();
                core.do_action('do_tipsbox');
            }, 3000);
        }

        if(cb) msgtip.pop(msg,stat,cb);
        else
            msgtip.pop(msg,stat);
    }
    window.tips = msgtips;

    // function tanbox(msg,stat,cb){
    //     var docRect = __measureDoc();
    //     var scrollleft = docRect.sl;
    //     var scrolltop = docRect.st;
    //     var clientwidth = docRect.dw;
    //     var clientheight = docRect.dh;

    //     var tan = new core.tipsbox();
    //     tan.tipsBox = function(stat){
    //         // var tip = document.createElement('div');        
    //         var msg_left = Math.round((parseInt(clientwidth)-500)/2);
    //         var msg_top = Math.round((parseInt(clientheight)-500)/2);
    //         var tanboxhtml = '<div id="msgtan" style="display:none;background-color:#fff;z-Index:10000;width:500px;height:500px;position:fixed;top:'+msg_top+'px;left:'+msg_left+'px;"></div>';
    //         $('#msgtan').length ? 
    //         (function(){
    //             $('#msgtan').remove();
    //             $('body').append(tanboxhtml);
    //         })()
    //         : $('body').append(tanboxhtml);
    //         return $('#msgtan')[0];
    //     };
    //     tan.tipsItem = function(stat){
    //         var subtip = document.createElement('div');
    //         subtip.id = 'tancontent'
    //         subtip.style.cssText = 'width:100%;height:100%;text-align:center;display:'        
    //         return subtip;
    //     };
    //     tan.anim = function(item,container){
    //         $(container).fadeIn(1000).delay(2000).fadeOut('slow');
    //         setTimeout(function(){
    //             $(container).remove();
    //         }, 3000);
    //     };

    //     if(cb) tan.pop(msg,stat,cb);
    //     else
    //         tan.pop(msg,stat);
    // }
    // window.tanbox = tanbox;

    /**
     * [shoppCartShow 头部购物车下拉]
     * @param  {[type]} obj       [当前目标点]
     * @param  {[type]} target    [下拉目标点]
     */
    exports.shoppCartShow = function(obj, target){
        var hTime = null;
        $(obj).mouseover(function(){
            targetShow();
        })
        $(obj).mouseout(function(){
            targetHide();
        })
        $(target).mouseover(function(){
            targetShow();
        })
        $(target).mouseout(function(){
            targetHide();
        })
        function targetShow(){
            clearTimeout(hTime);
            $(target).fadeIn();
        }
        function targetHide(){
            hTime = setTimeout(function(){
                $(target).hide();
            }, 400);
        }
    };

    //网页顶部的关注、年龄段hover事件
    exports.hover_qr = function() {
        $("li.pull-down").each(function(){
            $(this).hover(function(){
                $(this).addClass('pull-down-h').find('.pull-down-box').stop().show();
            },function(){
                $(this).removeClass("pull-down-h").find('.pull-down-box').stop().hide();
            })
        })       
    };

    //导航上的四个图标hover事件
    exports.iconHover = function() {
        $("#nav-assure a.item").each(function(){
            $(this).hover(function(){
                $(this).stop().animate({width:"118px"},200);
            },function(){
                $(this).stop().animate({width:"26px"},200);
            })
        })
    };

    //网页footer部分的背景图加载函数
    exports.getFooterGg = function() {
        var doc_h = $(doc).height();
        var win_h = $(win).height();

        if (!window.bg_footer) {
            window.bg_footer = _VE_Cfg.staticPath + "css/img/ve_img/bg_footer.jpg?abc";
        }
        if (doc_h < win_h * 2) {
            setTimeout(function() {
                $('.footer').css({
                    "background-image": "url(" + bg_footer + ")"
                });
            }, 800)
        } else {
            $(win).scroll(function() {
                $('.footer').css({
                    "background-image": "url(" + bg_footer + ")"
                });
            });
        }
    };

    //顶部fix部分  
    exports.scrollNavFix = function() {
        $(window).scroll(function(e) {
            var scroll='';
            (window.scrollY)?scroll=window.scrollY:scroll=document.documentElement.scrollTop;
            function listen_scroll_handler(scroll){            
                if (scroll > (($('.main_nav').offset().top) + $('.main_nav').height())) {
                    $('.fast_nav').show();
                    $('.fast_nav').stop(false, false).animate({
                        'top': 0
                    });
                } else {
                    $('.fast_nav').hide();
                    $('.fast_nav').stop(false, false).animate({
                        'top': -50
                    });
                }
            }
            listen_scroll_handler(scroll);
        });
    };

    //顶部fix部分  
    exports.fastNavDropDown = function() {
        var al = $('.age-list');
        al.on('mouseover', function() {
            $(this).addClass('age-list-h');
            $('.sub-list').show();
        });
        al.on('mouseout', function() {
            $(this).removeClass('age-list-h');
            $('.sub-list').hide();
        });
        var alc = $('.age-list-copy');
        alc.on('mouseover', function() {
            $(this).addClass('age-list-h');
            $('.sub-list-copy').show();
        });
        alc.on('mouseout', function() {
            $(this).removeClass('age-list-h');
            $('.sub-list-copy').hide();
        });

        al.find("p.boy>a").each(function(){
            if($(this).html() == "孕妈"){
                $(this).remove();
            }    
        });
       
        alc.find("p.boy>a").each(function(){
            if($(this).html() == "孕妈"){
                $(this).remove();
            }    
        });

    };
    
    

    // 加入收藏
    window.addFavorite = function () {
        var url = window.location;
        var title = document.title;
        var ua = navigator.userAgent.toLowerCase();
        if (ua.indexOf("360se") > -1) {
            alert("由于360浏览器功能限制，请按 Ctrl+D 手动收藏！");
        }else if (ua.indexOf("msie 8") > -1) {
            window.external.AddToFavoritesBar(url, title); //IE8
        }else if (document.all) {
            try{
                window.external.addFavorite(url, title);
            }catch(e){
                alert('您的浏览器不支持,请按 Ctrl+D 手动收藏!');
            }
        }
        else if (window.sidebar) {
            window.sidebar.addPanel(title, url, "");
        }
        else {
            alert('您的浏览器不支持,请按 Ctrl+D 手动收藏!');
        }
    };



    //删除购物车内列表
    var AJAX_DELGOODS_URL = top.location.hostname.indexOf('local.ve')>-1 ? '/index.php?ctl=ajax&act=delcart' : '/ajax-delcart.html';            
    var thebtn = $('body');
    var delttt;
    var delgoods=function(item){
        $('body').off('click','.delgoods');
        $('body').on('click','.delgoods',foo);
            function foo(){
            $(this).toggle();
            clearInterval(delttt);
            var delid = $(this).attr('delid');
            var jid = $(this).attr('jid');
            var jnum = $(this).attr('jnum');
            var jprice = $(this).attr('jprice');
            
            jdata.cart_list.splice(jid,1);


            jdata.cart_total_num = parseInt(jdata.cart_total_num - jnum);
            // jdata.cart_total_price = (jdata.cart_total_price - jprice*jnum);
            jdata.cart_total_price = Math.round((jdata.cart_total_price - jprice*jnum)*100)/100;

            if(jdata.cart_total_num<0) jdata.cart_total_num = 0;
            if(jdata.cart_total_price<0) jdata.cart_total_price = 0;


            core.init(window,{
                cartsdel: {url:AJAX_DELGOODS_URL,data:{id:delid} }
            },del_cart_goods);

            function del_cart_goods(){

                $('.dd'+delid).animate({'height':0,'margin':0,'padding':0},300).remove();
                $('body').trigger('relevancyBehavior');                
            }
        }          
    }

    core.add_action('delgoods',delgoods);

    var jiesuanurl = 'http://www.ve.cn';
    if($('#jiesuan') && $('#jiesuan').length) jiesuanurl = $('#jiesuan').attr('href');
    //购物车
    function top_cart(){
        core.init(this,{
            jdata: {url:'/',data:{'ctl':'ajax','act':'logininfo'} }
        },cartnext);

        var goods_car;        
        function cartnext(){
            if($('.goods-all').length){
                // if($('.goods-foot').length) $('.goods-foot').remove();
                var tpl_goods = '<li class="dd{{ve.id}}">\
                            <div class="g-shopp-c">\
                                <a class="g-thumb" href="{{ve.url}}"><img src="{{ve.icon}}"></a>\
                                <div class="g-title-c">\
                                    <div class="g-title">\
                                        <span class="g-name"><a href="{{ve.url}}">{{ve.sub_name}}</a></span>\
                                        <span class="g-model">{{ve.model}}</span>\
                                    </div>\
                                </div>\
                                <div class="g-num-c">\
                                    <div class="g-top-r">\
                                        <span class="g-num">x {{ve.number}}</span>\
                                        <img class="delgoods" delid={{ve.id}} jid={{ve.jid}} jnum={{ve.number}} jprice={{ve.unit_price}} src="http://s1.ve.cn/statics/ve_2_1/css/img/sidebar/close1.png?_ve_201430">\
                                    </div>\
                                    <span class="g-price"><i>¥</i>{{ve.unit_price}}</span>\
                                </div>\
                            </div>\
                        </li>';

                var tpl_goods_foot = '<div class="goods-foot clear"><div class="min-count">小计：<strong>{{ve.cart_total_price}}</strong>元</div>\
                            <a href="'+jiesuanurl+'" class="btn-settlement">去结算</a></div>';
                
                tpl_goods_foot += '<div class="sidbar_car_foot clear none">\
                    <span class="fl">共<em class="red"> {{ve.cart_total_num}} </em>件商品</span>\
                    <span class="fr">￥{{ve.cart_total_price}}</span>\
                  </div>';
                

                var cartshtml='';  
                if(jdata.cart_total_num>0){                    
                    var carts = jdata.cart_list;
                    for(var i=0; i<carts.length; i++){
                        var cart = carts[i];
                        cart.jid = i;
                        cart.sub_name = _subString(cart.sub_name,20);
                        cart.icon = cart.icon.replace('\.\/','http://img.ve.cn/');
                        cart.unit_price = Math.round(cart.unit_price*100)/100;
                        cart.model = (cart.attr_str&&cart.attr_str!==0) ? '型号:'+_subString(cart.attr_str,10) : '';
                        cartshtml += core.tpl(tpl_goods,cart);
                    }
                }else{ 
                    $('.goods-content .goods-cart').css('height','auto');
                    cartshtml = '<li class="goods-no"><strong>快去挑选商品吧！</strong></li>';
                }
                goods_car = '<i class="icon-pull-up"></i>\n<div class="goods-content clear">\n<div class="goods-cart"><ul class="goods-cart-list">'+cartshtml+'</ul></div></div>'+core.tpl(tpl_goods_foot,jdata);
                
            }

            var renderCart = function(){                  
                $('.goods-all').html(goods_car);
                $('.fixbar-goods-all').html(goods_car);
                (function(){                    
                    if(jdata.cart_list.length>3) {
                        $('.goods-all .goods-cart').css('height','270px');
                    }
                    $('.fixbar-goods-all').find('.sidbar_car_foot').removeClass('none');
                    $('.fixbar-goods-all').find('.goods-foot').addClass('none');
                })();
                core.do_action('delgoods');
            }
            
            renderCart();
        }        

        window.topcart = cartnext;        
        core.add_action('topcart',topcart);
    };    

    var openPage=function(url){        
        var nform = window.document.createElement('form');
        nform.action='/index.php';
        nform.mathod='post';
        nform.id='gogogo';
        nform.target = '_blank';
        var ninput = window.document.createElement('input');
        ninput.type='hidden';
        ninput.name='ctl';
        ninput.value='cart';
        nform.appendChild(ninput);
        $(nform).submit();
    }

    var _directToCart = function(id,num){        
        var api_addtocart = $('.apis').find('#addtocart').attr('href');        
        var data = {act: "addcart", id: id, number: num};        
        core.init(this,{
            atocart: {"url":api_addtocart,"data":data}
        },tocart);

        function tocart(){
            // console.log(this.atocart);
            if(this.atocart){
            	var msg = this.atocart;
                if(msg.status == 1){
                //     $('body').trigger('addtocart',[eve]);
                	var cart_url = $('#jiesuan').attr('href');  
                	window.location.href =  cart_url;
                	// openPage(cart_url);   
                }else{
                	alert(msg.info)
                }
            }
        }
    }
    core.add_action('directToCart',_directToCart,_directToCart.length);
    
    top_cart();

    //执行一些公共的页面逻辑
    (function(){
        exports.core = core;    //核心函数
        exports.hover_qr();
        exports.shoppCartShow(".btn-shopp-Cart",".goods-all");
        exports.iconHover();
        exports.fastNavDropDown();
        exports.scrollNavFix();

        //公共方法
        exports.urlparse = urlparse;     //解析url地址
    })();   
    

    return exports;
})