/**
 * @name    首页的js代码
 */
define('web/product', ['web/common', 'jquery.layer', 'jquery.slide', 'common/easy_login', 'lib/etalage', 'lib/pin'], function(common, layer, slide, login) {
    var doc = document,
        win = window;   

    // 初始化倒计时的对象和数据
    var idx_time_detail = null;
    var __obj = $(".time-countdown");
    var serverTimeLong = parseInt(__obj.attr('data-servtime').substring(0,13)),
        beginTime = parseInt(__obj.attr('data-begintime')), //开始时间
        endTime = parseInt(__obj.attr('data-endtime')), //结束时间
        stat = false;

    // 时间戳格式化 返回剩余时间的 天、时、分、秒、毫秒
    var _formatTime = function (time) {
        var _step = 10;
        var _time = time % _step + "";
        var _time = _time.substring(0, 1);
        var _D, _H, _M, _S, _MS;

        _D = parseInt(time / (60 * 60 * 24 * _step));
        _H = parseInt(time % (60 * 60 * 24 * _step) / (60 * 60 * _step));
        _M = parseInt(time % (60 * 60 * _step) / (60 * _step)); //分钟
        _S = parseInt(time % (60 * _step) / _step);
        _MS = parseInt(_time); //毫秒

        _D < 10 ? (_D = "0" + _D) : _D;
        _H < 10 ? (_H = "0" + _H) : _H;
        _M < 10 ? (_M = "0" + _M) : _M;
        _S < 10 ? (_S = "0" + _S) : _S;
        _MS < 10 ? (_MS = "" + _MS) : _MS;
        return {
            D: _D,
            H: _H,
            M: _M,
            S: _S,
            MS: _MS
        }
    };

    //时间碎片化处理
    var _showNumber = function(obj,ms,s,r) {
        str = obj.D + "" + obj.H + "" + obj.M + "" + obj.S + "" + obj.MS;
        var __str = str.split("");
        __obj.find('em').each(function(i){
            $(this).text(__str[i]);
        });
        if(ms==0){
            stat = true;            
            if(r){
                _detailStatus(s);
                return false;
            }else{
                _detailStatus(s,1);
            }
            
        }
    }

    // 倒计时与订单的状态逻辑处理 [0未开始，1已开始，2已结束]
    var _detailStatus = function(gs, n){
        if(stat){
            // 初始化数据 数组 
            var cartCount = parseInt($('.cart-count').text());
            var getCartUrl = $('#setCartUrl').attr('carturl');
            var orderStatus = ["距特卖开始时间","距特卖结束时间","已结束"],
                orderBtnHtml = ['<a class="btn-cart-no" id="sold_out" href="javascript:;"><em>还没开始</em></a>',
                    '<a class="btn-cart" id="shop_btn" href="javascript:;"><em>加入购物车</em></a><a class="go-settlement" id="settlement_btn" href='+ getCartUrl +' style="display:none">去结算</a>',
                    '<a class="btn-cart-no" id="sold_out" href="javascript:;"><em>已经结束</em></a>'];
            if(gs==0){
                $(".discount").html("?折起");
                $(".price_now").html("?")
                $(".price_save").html("?"); //节省金钱
            }else if(gs==1){
                if(n){
                    location.reload();
                }
                var _ze = $(".discount").attr("data");
                var _price_now = $(".price_now").attr("data");
                var _price_save = $(".price_save").attr("data");
                _ze ? $(".discount").html(_ze+"折起") : $(".discount").hide();//修复则扣显示undefined错误 by pjg
                $(".price_now").html(_price_now);
                $(".price_save").html(_price_save);
                $(".buyer").show();
            }else if(gs==2){
                var _ze = $(".discount").attr("data");
                var _price_now = $(".price_now").attr("data");
                var _price_save = $(".price_save").attr("data");
                _ze ? $(".discount").html(_ze+"折起") : $(".discount").hide();//修复则扣显示undefined错误 by pjg
                $(".price_now").html(_price_now);
                $(".price_save").html(_price_save);
                $(".buyer").show();
                $(".amount-choose").remove();
                $(".quick-cart").remove();
            }
            
            $(".time-s").html(orderStatus[gs]); //倒计时提示
            $(".buy-btn").html(orderBtnHtml[gs]);
            if(cartCount > 0){
                $('#settlement_btn').show();
            }
            $(".quick-cart").show();
            stat = false;
        }
    };

    //时间逻辑运算
    var _change_detail_time = function() {
        clearTimeout(idx_time_detail);
        //如果开始时间大于当前时间，即未开始
        var mms = parseInt((beginTime - serverTimeLong)/100); 
        var nms = parseInt((endTime - serverTimeLong)/100);
        var start = _formatTime(mms); //离开始的时间
        var end = _formatTime(nms); //离结束的时间
        var str = "";
        if (mms >= 0) {// 如果开始时间大于当前时间
            _showNumber(start,mms,1,0);
        } else if (nms >= 0) { // 如果结束时间大于当前时间
            _showNumber(end,nms,2,1);
        }
        serverTimeLong = serverTimeLong + 100;
        idx_time_detail = setTimeout(_change_detail_time, 100);
    }

    //时间事件初始化
    var _time_init = function(){
        var goodStatus = $(".goodStatus").val();
        if(goodStatus < 3){
            stat = true;
            _detailStatus(goodStatus);
        }else if(goodStatus == 3){
            $(".amount-choose").remove();
            $(".quick-cart").remove();
        }
        if(goodStatus!=2){
            _change_detail_time();
        }        
    };

    //=============以上是时间逻辑处理==============

    //产品图片的轮播效果
    var _preview_slider = function() {
        $('#etalage').etalage({
            thumb_image_width: 425,
            thumb_image_height: 425,
            source_image_width: 800,
            source_image_height: 800,
            autoplay: false,
            show_hint: true,
            zoom_area_width: 455,
            zoom_area_height: 455,
            show_descriptions: false,
            small_thumbs: 5,
            show_begin_end_smallthumb: false,
            click_callback: function(image_anchor, instance_id) {
                console.log('Callback example:\nYou clicked on an image with the anchor: "' + image_anchor + '"\n(in Etalage instance: "' + instance_id + '")');
            }
        });
    };

    //尺码联动选择
    var _change_size = function() {
        $(".good-size a:not(.no-size)").on('click',function() {
            layer.closeTips();
            var _size = $(this);
            _size.addClass('selected').siblings('a').removeClass('selected');
            $('li.size-choice').removeClass('no-choice');
            $(".size-choice").attr("data-size",_size.attr("attr_id"));
            $(".size-choice").attr("data-pcode",_size.attr("pcode"));
            var priceNow = _size.attr("deal_price");
            var priceOrigin = _size.attr("data_oldprice");
            var priceSave = _size.attr("data_save");
            var discount = _size.attr("data_dis");
            $(".price_now").text(priceNow);
            $(".small-price em.sum").text(priceNow);
            $(".price_save").text(priceSave);
            $(".price_origin").text(priceOrigin);
            $(".zk").text(discount + "折起");
            //手机专享价格
            $(".sale-phone-save").text(_size.attr("data_savep"));
            $(".price-phone em.sum").text(_size.attr("data_phone"));
        });
    };

    //选购goods数量
    var _buy_num = function() {
        /*添加商品数量*/
        $("#minus").click(function() {
            var n = $("#buy-num").val() || 1;
            var num = parseInt(n) - 1;
            if (num <= 0) {
                $("#buy-num").val(1);
            } else $("#buy-num").val(num);
        });

        $("#add").click(function() {
            var n = $("#buy-num").val() || 1;
            var num = parseInt(n) + 1;
            /*if(num>4){
                  alert("对不起，最多选择4件商品！");
            }*/
            $("#buy-num").val(num);
        });

        $("#buy-num").blur(function() {
            var num = parseInt($("#buy-num").val());
            if (num <= 0) {
                $("#buy-num").val(1);
            }
            /*if(num>4){alert("对不起，最多选择4件商品！");$("#buy-num").val(4);}*/
        });
    };

    //关闭所有的layer
    var pDialog;
    window.keep_buy = function() {
        layer.close(pDialog);
    };

    //添加到购物车按钮限制狂点
    window.allow_add_to_cart=0;
    window.add_to_cart_anim=0;
    window.AjaxResault;


    //加入购物车
    var _add_to_cart = function(obj, cb) {
        var callback = cb || function() {};
        var $shop_btn = $(obj);
        // console.log($('.size-choice').find('.good-size a.selected').length);

        var size_c =  $('.size-choice').find('.good-size a.selected').attr('pcode');
        $('.size-choice').attr("data-size",size_c);        
        
        $shop_btn.click(function(eve) {  
            if(allow_add_to_cart==0){                          
                allow_add_to_cart=1;
                setTimeout(function(){shopBtnClick(eve)}, 300);
            }else{
                if(AjaxResault)
                    dealWidthAjaxSuccessOther(AjaxResault);
            }
        });

        function dealWidthAjaxSuccessOther(data){
            if(!data) return;
            if (data.status == 2) { //未登录
                try {
                    layer.close(pDialog);
                } catch (e) {}
                login.ajax_login();
            } else {
                if (data.open_win == 1) {                    
                    // layer.msg(data.info,2,{type:-1});
                } else {
                    try {
                        layer.msg(data.info,1,{type:-1});
                    } catch (e) {}
                }
            }            
        }

        function dealWidthAjaxErro(data){
            if(!data) return;
            if (data.responseText != '')
            try {
                layer.msg(data, responseText);
            } catch (e) {}
        }

        function shopBtnClick(eve){
            var $size_choice = $('.size-choice');  

            // $size_choice.attr('data-size','');
            var size_id = $size_choice.attr("data-size");
            if (size_id != undefined) {
                if (size_id == 0) {
                    callback();
                    pDialog = layer.tips('请选择规格！', $size_choice, {
                        style: ['background-color:#fcb700; color:#fff', '#fcb700'],
                        maxWidth: 185,
                        time: 1
                    });
                    $size_choice.addClass('no-choice');
                    allow_add_to_cart = 0;
                    return false;
                }
            } else {
                size_id = 0;
            }
            var ajaxurl = AJAX_URL;
            var query = {};
            query.act = "addcart";
            query.id = $('ul.summary').attr("data-goodsid");
            //    attrs = $("select[name='attr[]']");
            //    query.attr= new Array();
            //    for(i=0;i<attrs.length;i++)
            //    {
            //        query['attr['+i+']'] = $(attrs[i]).val();
            //    }
            //query.size = size_id;
            query['attr[0]'] = size_id;
            query.pcode = $(".size-choice").attr("data-pcode");

            var _number = $("input[name='number']").val();
            if (_number) query.number = _number;
            
            function AsynaddCart(){
                $.ajax({
                    url: ajaxurl,
                    dataType: "json",
                    data: query,
                    type: "POST",
                    async: false, //木有这一行，你会很麻烦
                    success: function(data) {
                        //允许再次购物
                        allow_add_to_cart=0;

                        //后续处理
                        window.AjaxResault = data;
                        if (data.status == 1) {                         
                             if (data.open_win == 1) {
                                //购物车投篮动画及联动操作
                                if(window.sbstat==1) {
                                    if(add_to_cart_anim==0){
                                        add_to_cart_anim=1;
                                        $('body').trigger('addtocart',[eve]);
                                    }
                                }else{
                                    layer.msg('成功加入购物车',2,{type:'9'});
                                    $("em.cart-count").text(parseInt(data.number));
                                }
                                // pDialog = layer.msg('成功加入购物车',2,{type:'9',shade : false});
                                $('#settlement_btn').show();
                                /*$('.choose-btns').hide();
                                $('.gobuy-btn').show();
                                //加入购物车后，快捷加入购物车隐藏
                                var oTop = $('.con-nav').offset().top;
                                $(window).scroll(function(){
                                   $('.quick-cart').hide();
                                });*/

                               /* pDialog = $.layer({
                                    type: 1,
                                    title: '成功加入购物车',
                                    area: ['530px', '175px'],
                                    border: [0], //去掉默认边框
                                    shade: [0.5, '#222'], //去掉遮罩
                                    closeBtn: [0, true], //去掉默认关闭按钮
                                    //shift: 'top', //从左动画弹出
                                    page: {
                                        html: data.info
                                    }
                                });*/
                                // $('.cart_flag_all.right').addClass('cart_flag_have');
                                // 头部购物车信息更新
                                // var cartNumber = parseInt(data.number);
                                // if(cartNumber==1){
                                //     $(".cart_flag_all .cart-count").text('1');
                                // }else{
                                //     $(".cart_flag_all em.cart-count").text(cartNumber);
                                // }

                                // //侧边栏刷新接口
                                // if(typeof getJdata === "function"){
                                //     getJdata();
                                // }
                                
                                window._paq = _paq || [];
                                _paq.push(['setEcommerceView', query.id, _number]);
                                _paq.push(['trackPageView']);
                                _genzs();
                            } else {
                                layer.msg(data.info);
                                $(".cart_flag_all em").text(parseInt(data.number));
                            }
                        } else{
                            dealWidthAjaxSuccessOther(data);
                        }

                        // else if (data.status == 2) { //未登录
                        //     try {
                        //         layer.close(pDialog);
                        //     } catch (e) {}
                        //     login.ajax_login();
                        // } else {
                        //     if (data.open_win == 1) {
                        //         layer.msg(data.info,2,{type:-1});
                        //     } else {
                        //         try {
                        //             layer.msg(data.info,1,{type:-1});
                        //         } catch (e) {}
                        //     }
                        // }
                    },
                    error: function(ajaxobj) {
                        //后续处理
                        AjaxResault = ajaxobj;
                        dealWidthAjaxErro(ajaxobj);
                    }
                });
                //alert("22");
                return false; ////木有这一行，你会很麻烦
            }
            setTimeout(AsynaddCart, 17);
        }//shopBtnClick end

    };

    /**
     * @name    ScrollBtnCart
     * @desc    小导航快捷加入购物车显示隐藏
     */
    var _ScrollBtnCart = function(){
        var oTop = $('.con-nav').offset().top
        $('.quick-cart').hide();
        $(window).scroll(function(){
            if(oTop < $('.con-nav').offset().top){
              $('.quick-cart').show(); 
            }else{
               $('.quick-cart').hide(); 
            }
        })
    }

    var _showCat = function(){
        $(".go-shopping").on('click',function(){
            $('.choose-btns').show();
            $('.gobuy-btn').hide();
            //加入购物车后，快捷加入购物车隐藏
            _ScrollBtnCart();
        })
    };
    /**
     * @name    ScrollSubNav
     * @desc    滑动式定位的固定次导航
     */
    var _ScrollSubNav = function(selector) {
        if ($.browser.version == 6.0) return false;
        var defaults = {
            offsetNum: 1,
            fixToTopClass: '.con-nav' //固定导航的类
        };
        var opts = $.extend({}, defaults);
        var This = $(selector);
        var bScroll = false;
        var $start_goods = $('#start_goods');

        $(win).scroll(function() {
            if ($(this).scrollTop() > $("#main-con").offset().top) {
                $(opts.fixToTopClass).addClass("fixToTop");

                if (!bScroll) {
                    if ($(win).scrollTop() < $('.scroll').eq(1).offset().top - 80) {
                        This.find('dd').removeClass('current');
                        This.find('dd').eq(0).addClass('current');
                    } else if ($(win).scrollTop() < $('.scroll').eq(2).offset().top - 60) {
                        This.find('dd').removeClass('current');
                        This.find('dd').eq(1).addClass('current');
                    } else if ($(win).scrollTop() < $('.scroll').eq(3).offset().top - 60) {
                        This.find('dd').removeClass('current');
                        This.find('dd').eq(2).addClass('current');
                    } else {
                        This.find('dd').removeClass('current');
                        This.find('dd').eq(3).addClass('current');
                    }
                };
            } else {

                $(opts.fixToTopClass).removeClass("fixToTop");
            }

        });
        $(doc).on('DOMMouseScroll, mousedown', bingFn);
        $(doc).on('mousewheel', bingFn);
        $(doc).on('mouseup', function() {
            bScroll = true
        });
        This.find('dd').each(function(i) {
            $(this).click(function() {
                bScroll = true
                if (bScroll) {
                    This.find('dd').removeClass('current');
                    This.find('dd').eq(i).addClass('current')
                    if (i === 0) {
                        $('html, body').animate({
                            scrollTop: $("#main-con").offset().top + 20
                        })
                    } else if (i === 1) {
                        $('html, body').animate({
                            scrollTop: $('.scroll').eq(i).offset().top - 60
                        })
                    } else if (i === 2) {
                        $('html, body').animate({
                            scrollTop: $('.scroll').eq(i).offset().top - 60
                        })
                    } else if (i === 3) {
                        $('html, body').animate({
                            scrollTop: $('.scroll').eq(i).offset().top - 60
                        })
                    } else {
                        // $('html, body').animate({
                        //     scrollTop: 0
                        // })                        
                        This.find('dd').eq(0).addClass('current').siblings('dd').removeClass('current');
                    };
                };
            });
        });

        function bingFn() {
            bScroll = false
        };
    };

    //唯一优势切换
    var _ve_edge = function() {
        $('.ve-edge a').on('mousemove', function() {
            var _index = $(this).index();
            $(this).addClass('selected')
                .siblings('a').removeClass('selected');
            $('.edge-content li').eq(_index).addClass('on')
                .siblings('li').removeClass('on');
        });
    };

    //猜你喜欢
    var _guess_slide = function() {
        $(".Scroll").slide({
            mainCell: ".bd ul",
            autoPage: !1,
            effect: "leftLoop",
            autoPlay: !0,
            scroll: 1,
            vis: 5
        });
    };

    //明星单品滑动固定
    var _sidebar_fix = function() {
        setTimeout(function(){
            var _height = $('#main-con').height() - $('.sidebar-item:eq(0)').height() - 20;
            $('.pinbox').css({
                height: _height
            });
            $('#pinItem').pin({
                containerSelector: ".pinbox"
            });
        },10000)
        
    };



    //用户评价相关的两个函数
    var _get_ajaxpage = function(){
        $('.pages a').on('click',function(){
            $(this).addClass('current').siblings('a.item').removeClass('current');
            var _page = $(this).attr('data-page');
            var _did  = $(this).attr('data-did');
            _ajaxpage(_page,_did);
        });
        //ajax分页
        function _ajaxpage(page, did) {
            var _html = '';
            $.ajax({
                type: "post",
                url: "/index.php?ctl=goods&act=ajaxpage&json=1&page=" + page + "&id=" + did,
                dataType:'json',
                success: function(_data) {   
                    if (_data == 'error'){
                        alert('非法操作！');
                    }else{
                        var __data = _data.data;
                        var count = __data.count;
                        var list = __data.list;
                        var len = list.length;
                        for(var i=0;i<len;i++){
                            var _html_img = ''; 
                            var user_img = list[i].user_pic || _VE_Cfg.staticPath+"/css/img/member/tou.gif?_v2.011"; 
                            var _imgs = list[i].imgs;
                            var _imgs_len = _imgs.length;
                            if(_imgs_len>0){
                                for(j=0;j<_imgs_len;j++){
                                    _html_img += '<a><img src="'+_imgs[j]+'"></a>';
                                }
                            }
                            _html += '<li class="fl item">'+
                                    '<div class="user">'+
                                        '<div class="u-icon">'+
                                            '<a href="javascript:;" title="'+list[i].user_name+'">'+
                                                '<img src="'+user_img+'">'+
                                            '</a>'+
                                        '</div>'+
                                        '<div class="u-name"><a href="javascript:;" title="'+list[i].user_name+'">'+list[i].user_name+'</a>'+
                                        '</div>'+
                                    '</div>'+
                                    '<div class="fl i-item">'+
                                       '<h4 class="i-item-title">'+list[i].title+'</h4>'+
                                        '<div class="group-img">'+_html_img+'</div>'+
                                        '<p class="comment-text">"'+list[i].content+'"</p>'+
                                        '<div class="user-ful">'+
                                            '<a href="javascript:;" class="up" data-id="'+list[i].id+'"><i class="icon">&nbsp;</i>&nbsp;<span>'+list[i].like_num+'</span></a>'+
                                            //'<a href="javascript:;" class="fav"><i class="icon">&nbsp;</i>&nbsp;1999999</a>'+
                                         '</div>'+                                  
                                    '</div>'+
                                    '</li>';
                        }
                        $('.comments-list').html(_html);
                    }
                }
            });
            return false;
        };
    };
    //点赞
    var _ajax_like = function() {
        $('.comment-detail').on('click','.user-ful .up',function(){
            var _id = $(this).attr('data-id');
            var _this = $(this);
            $.ajax({
                type: "get",
                url: "/index.php?ctl=koubei&act=ajaxlike&id=" + _id,
                success: function(data) {
                    if (data == 'error') {
                        layer.msg('非法操作！',8);
                    } else {
                        if (data == "has_liked") {
                            layer.msg('您已经赞过了！', 1, 9);
                        } else {
                            _this.find('span').text(data);
                        }
                    }
                },
                error: function() {
                    layer.msg('非法操作！',8);
                }
            });
        })
        
    };
    //两个统计代码相关的函数
    var _hostfilter = function() {
        var host = doc.location.hostname;
        var domain = "ve.cn";
        var accessList = ['test', 'release', 'test.m', 'mob', 'rc', 'rc.m','local']; //排除列表，不跟踪的加入数组
        if (host.indexOf(domain) != -1) {
            var str = host.slice(0, -(domain.length + 1));
            for (var k in accessList) {
                if (str == accessList[k]) {
                    return false;
                }
            }
            return true;
        } else {
            return false;
        }
    };
    var _genzs = function() {
        if (_hostfilter()) {
            var u = (("https:" == doc.location.protocol) ? "https" : "http") + "://stat.ve.cn/";
        } else {
            var u = (("https:" == doc.location.protocol) ? "https" : "http") + "://test.piwik.ve.cn/";
        }
        _paq.push(['setTrackerUrl', u + 'piwik.php']);
        _paq.push(['setSiteId', 1]);
        var g = doc.createElement('script'),
            s = doc.getElementsByTagName('script')[0];
        g.type = 'text/javascript';
        g.defer = true;
        g.async = true;
        g.src = u + 'piwik.js';
        s.parentNode.insertBefore(g, s);
    };

    //页面逻辑
    $(doc).ready(function() {
        common.hover_qr(); //关注hover
        common.getFooterGg();
        _time_init();
        _preview_slider();
        _change_size();
        _buy_num();
        _add_to_cart("#shop_btn");
        _add_to_cart("#shop_btn2", function() {
            $('html, body').animate({
                scrollTop: 0
            })
            $('#subNavCon').find('dd').eq(0).addClass('current').siblings('dd').removeClass('current');
        });
        _ScrollBtnCart();
        _showCat();
        _ScrollSubNav('#subNavCon');
        _ve_edge();
        _guess_slide();
        _sidebar_fix();
        _get_ajaxpage();
        _ajax_like();
    });

});
