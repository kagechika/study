/**
 * SwipeEvent
 *
 * @class mainVisual
 * @version 1.0.0
 * @memberOf jQuery.fn
 */
var SwipeEvent = (function ($) {

    function SwipeEvent() {

        // Browser Support Class
        var spt = new(function () {
            this.touch = 'ontouchstart' in window;
            this.mspointer = window.navigator.msPointerEnabled;
        })();

        // Browser Type Class
        var br = new(function () {
            var ua = navigator.userAgent;
            this.IE = document.uniqueID ? true : false;
            this.ltIE6 = typeof window.addEventListener == 'undefined' && typeof document.documentElement.style.maxHeight == 'undefined';
            this.ltIE7 = typeof window.addEventListener == 'undefined' && typeof document.querySelectorAll == 'undefined';
            this.ltIE8 = typeof window.addEventListener == "undefined" && typeof document.getElementsByClassName == "undefined";
            this.SP = /iPad|iPhone|iPod|Android/i.test(ua);
            this.iOS = /iPad|iPhone|iPod/i.test(ua);
        })();

        // mSwipeClass
        var mSwipeClass = function () {
            var self = this;
            var clone;
            var originalLength;
            var scrolling;
            var moveReady;
            var startPageX;
            var startPageY;
            var basePageX;
            var startTime;
            var distance;
            var maxX;
            var mainView;
            //var signalList;
            var isRepeat;

            // Attache Touch Event
            var onTouchStart = spt.mspointer ? 'MSPointerDown' : spt.touch ? 'touchstart' : 'mousedown';
            var onTouchMove = spt.mspointer ? 'MSPointerMove' : spt.touch ? 'touchmove' : 'mousemove';
            var onTouchEnd = spt.mspointer ? 'MSPointerUp' : spt.touch ? 'touchend' : 'mouseup';

            this.disableTouch = false;
            this.directionX;
            this.currentPoint = 0;
            this.currentX = 0;
            this.maxPoint;
            this.lastPoint;
            this.newX;

            // Attache Swipe Event
            this.setSwipeEvent = function () {
                mainView.bind(onTouchStart, function (e) {
                    if (self.disableTouch) return false;
                    if (!spt.touch) e.preventDefault();
                    scrolling = true;
                    moveReady = false;
                    startPageX = getPage(e, 'pageX');
                    startPageY = getPage(e, 'pageY');
                    basePageX = startPageX;
                    self.directionX = 0;
                    startTime = e.timeStamp;

                }).bind(onTouchMove, function (e) {
                    if (!scrolling) return;
                    var pageX = getPage(e, 'pageX');
                    var pageY = getPage(e, 'pageY');
                    var distX;
                    var newX;
                    var deltaX;
                    var deltaY;
                    if (moveReady) {
                        e.preventDefault();
                        e.stopPropagation();
                        distX = pageX - basePageX;
                        newX = self.currentX + distX;
                        if (newX >= 0 || newX < maxX) newX = Math.round(self.currentX + distX / 3);
                        self.currentX = newX;
                        self.moveToDirectPosition($(this), newX);
                        self.directionX = distX === 0 ? self.directionX : distX > 0 ? -1 : 1;
                    } else {
                        deltaX = Math.abs(pageX - startPageX);
                        deltaY = Math.abs(pageY - startPageY);
                        if (deltaX > 2) {
                            e.preventDefault();
                            e.stopPropagation();
                            moveReady = true;
                        } else if (deltaY > 5) {
                            scrolling = false;
                        } else {
                            e.preventDefault();
                            e.stopPropagation();
                        }
                    }
                    basePageX = pageX;
                });
                $(document).bind(onTouchEnd, function (e) {
                    //e.preventDefault();
                    if (!scrolling) return;
                    scrolling = false;
                    var newPoint = -self.currentX / distance;
                    newPoint = (self.directionX > 0) ? Math.ceil(newPoint) : (self.directionX < 0) ? Math.floor(newPoint) : Math.round(newPoint);
                    self.moveToAnimation(newPoint, true);
                });
            };
            // get page info
            function getPage(e, page) {
                return spt.touch ? event.changedTouches[0][page] : e[page];
            }
            // Call at transition end
            function transitionend(swipe) {
                console.log("action");
            }
        }

        this.init = function init() {
            mSwipeClass();
        };
    }

    return SwipeEvent;

})(jQuery);

/**
 * mainVisual
 *
 * @class mainVisual
 * @version 1.0.0
 * @memberOf jQuery.fn
 */
var MainVisual = (function ($) {

    function MainVisual() {

        /**
         * private object 
         */
        var _this, _json;

        _this = this;

        /**
         * public object
         */
        // jquery element
        this.targetView = $("#mainView");
        this.paginationView = $("#pagination");

        // template View html
        this.templateViewHTML = '<div class="jumbotron" style="position:absolute; width:100%;">';
        this.templateViewHTML += '<h1>Banner.0{$id}</h1>';
        this.templateViewHTML += '<p>This is an example to show the potential of an offcanvas layout pattern in Bootstrap. Try some responsive-range viewport sizes to see it in action.</p>';
        this.templateViewHTML += '</div>';

        // template Pager html
        this.templatePaginationHTML = '<li><a href="#" class="navi">{$id}</a></li>';

        /**
         * loadXML:xmlファイルを読み込む
         */
        this.loadXML = function loadXML(filePass) {

            try {
                $.ajax({
                    url: filePass,
                    type: 'GET',
                    dataType: 'xml',
                    cache: false,
                    async: false,
                    timeout: 5000,
                    success: function (xml) {
                        _json = _this.transJson(xml);
                        // debug code
                        _this.model = _json;
                    },
                    error: function (XMLHttpRequest, textStatus, errorThrown) {
                        throw "XML_LOAD_ERROR";
                    }
                });

                return true;

            } catch (err) {

                return false;
            }

        };

        /**
         * transJson:xmlデータをjson形式に変換
         * @param xml {object} : xmlデータ
         * @return json {array} : jsonデータ
         */
        this.transJson = function transJson(xml) {
            var json = [];

            $(xml).find("visual").each(function (i) {
                json[i] = {
                    id: i,
                    mainSrc: $(this).find("mainVisual").attr("src"),
                    mainAlt: $(this).find("mainVisual").attr("alt"),
                    anchorHref: $(this).find("anchor").attr("href"),
                    anchorTarget: $(this).find("anchor").attr("target"),
                    arrowLeft: $(this).find("arrow").attr("src1"),
                    arrowRight: $(this).find("arrow").attr("src2")
                };
            });

            return json;
        }

        /**
         * renderViewHTML:メインビジュアルのHTMLを書き出す
         * @param model {object} データモデル
         */
        this.renderViewHTML = function renderViewHTML(model) {
            var htmlTag = "";
            for (var i = 0, len = model.length; i < len; i++) {
                htmlTag += _this.templateViewHTML.replace(/{\$href}/g, model[i].anchorHref || "javascript:void(0);")
                    .replace(/{\$target}/g, model[i].anchorTarget)
                    .replace(/{\$src}/g, model[i].mainSrc)
                    .replace(/{\$alt}/g, model[i].mainAlt)
                    .replace(/{\$id}/g, model[i].id);
            }

            _this.targetView.html(htmlTag).children("li:not(:first)").hide();
        };

        /**
         * renderPaginationHTML:ペジネーションのHTMLを書き出す
         * @param model {object} データモデル
         */
        this.renderPaginationHTML = function renderPaginationHTML(model) {
            var htmlTag = "";
            for (var i = 0, len = model.length; i < len; i++) {
                htmlTag += _this.templatePaginationHTML.replace(/{\$id}/g, model[i].id);
            }
            _this.paginationView.html(htmlTag);
        };

        //------------------------------------------------------------- Model
        /**
         * VisualModel
         * @constractor
         */
        var VisualModel = function VisualModel() {
            this.viewIndex = 0;
            this.prevIndex = 0;
            this.rbtn = null;
            this.lbtn = null;
            this.len = 0;
        };
        /**
         * createModel
         * @memberOf VisualModel
         * @param data {object} ビジュアルデータ
         */
        VisualModel.prototype.createModel = function (data) {
            this.viewIndex = 0;
            this.prevIndex = 0;
            this.rbtn = "#right";
            this.lbtn = "#left";
            this.len = data.length - 1;
            this.pageView = "#pagination";
            this.navi = ".pager";
            this.pagination = ".navi";
        };

        //------------------------------------------------------------- Controller
        /**
         * VisualController
         * @constractor
         * @param model {object} ビジュアルモデルオブジェクト
         * @param view {object} ビジュアル描画オブジェクト
         */
        var VisualController = function VisualController(model, view) {
            this.model = model;
            this.view = view;
            this.isAnimation = false;
            this.timer = null;
        };
        /**
         * viewControlle
         * @memberOf VisualController
         */
        VisualController.prototype.viewControlle = function () {

            /*
             * parentView set hover event
             */
            $(this.view.parentView).find(this.view.views).each(function () {
                $(this).hover(function () {
                    $(this).trigger("stopAnimation");

                }, function () {
                    $(this).trigger("startAnimation");

                });
            });

        };
        /**
         * pagerBtnControlle
         * @memberOf VisualController
         */
        VisualController.prototype.pagerBtnControlle = function () {

            // controller scope
            var _self = this;

            /*
             * next btn & prev btn click event
             */
            $(this.model.rbtn).unbind("click").bind("click", function (e) {
                e.preventDefault();

                if (_self.isAnimation) {
                    return false;
                }

                if (_self.model.len <= _self.model.viewIndex) {
                    _self.model.prevIndex = _self.model.viewIndex;
                    _self.model.viewIndex = 0;
                } else {
                    _self.model.prevIndex = _self.model.viewIndex;
                    _self.model.viewIndex++;
                }

                _self.effectAnimation();

            });

            $(this.model.lbtn).unbind("click").bind("click", function (e) {
                e.preventDefault();

                if (_self.isAnimation) {
                    return false;
                }

                if (_self.model.viewIndex == 0) {
                    _self.model.prevIndex = _self.model.viewIndex;
                    _self.model.viewIndex = _self.model.len;
                } else {
                    _self.model.prevIndex = _self.model.viewIndex;
                    _self.model.viewIndex--;
                }

                _self.effectAnimation();

            });

            /*
             * next btn & prev btn hover event
             */
            $(this.model.rbtn).hover(function () {
                $(this).trigger("stopAnimation");

            }, function () {
                $(this).trigger("startAnimation");

            });
            $(this.model.lbtn).hover(function () {
                $(this).trigger("stopAnimation");

            }, function () {
                $(this).trigger("startAnimation");

            });

        };
        /**
         * paginationBtnControlle
         * @memberOf VisualController
         */
        VisualController.prototype.paginationBtnControlle = function () {
            // controller scope
            var _self = this;

            var $naviElem = $(this.model.pageView).find(this.model.pagination);

            /*
             * pagination event
             */
            $naviElem.each(function () {

                /*
                 * click event
                 */
                $(this).unbind("click").bind("click", function (e) {
                    e.preventDefault();

                    if (_self.isAnimation) {
                        return false;
                    }

                    var index = $naviElem.index(this);
                    _self.model.prevIndex = _self.model.viewIndex;
                    _self.model.viewIndex = index;

                    _self.effectAnimation();
                });

                /*
                 * hover event
                 */
                $(this).hover(function () {
                    $(this).trigger("stopAnimation");

                }, function () {
                    $(this).trigger("startAnimation");

                });

            });

        };
        /**
         * RoopIndexControlle
         * @memberOf VisualController
         */
        VisualController.prototype.RoopIndexControlle = function () {

            if (this.isAnimation) {
                return false;
            }

            if (this.model.len <= this.model.viewIndex) {
                this.model.prevIndex = this.model.viewIndex;
                this.model.viewIndex = 0;

            } else {
                this.model.prevIndex = this.model.viewIndex;
                this.model.viewIndex++;
            }

        };
        /**
         * animationControlle
         * @memberOf VisualController
         */
        VisualController.prototype.animationControlle = function () {
            var _self = this;

            // complete effect animation
            $(this.view.views).each(function () {
                $(this).unbind("effectComplete").bind("effectComplete", function () {
                    _self.isAnimation = false;
                });
            });

            // mainvisual set hover action
            $(this.view.parentView).find(this.view.views).each(function () {
                $(this).unbind("stopAnimation").bind("stopAnimation", _self.stopAnimation.bind(_self));
                $(this).unbind("startAnimation").bind("startAnimation", _self.startAnimation.bind(_self));
            });

            // navigation set hover action
            $(this.model.pageView).find(this.model.pagination).each(function () {
                $(this).unbind("stopAnimation").bind("stopAnimation", _self.stopAnimation.bind(_self));
                $(this).unbind("startAnimation").bind("startAnimation", _self.startAnimation.bind(_self));
            });

            // next btn & prev btn set hover action
            $(this.model.rbtn).unbind("stopAnimation").bind("stopAnimation", this.stopAnimation.bind(this));
            $(this.model.rbtn).unbind("startAnimation").bind("startAnimation", this.startAnimation.bind(this));
            $(this.model.lbtn).unbind("stopAnimation").bind("stopAnimation", this.stopAnimation.bind(this));
            $(this.model.lbtn).unbind("startAnimation").bind("startAnimation", this.startAnimation.bind(this));

        };
        /**
         * stopAnimation:setIntervalのクリア
         * @memberOf VisualController
         */
        VisualController.prototype.stopAnimation = function () {
            clearInterval(this.timer);
            this.timer = null;
        };
        /**
         * startAnimation:メインビジュアルの自動切換え(setInterval)
         * @memberOf VisualController
         */
        VisualController.prototype.startAnimation = function () {
            var _self = this;
            this.timer = setInterval(function () {
                _self.RoopIndexControlle();
                _self.view.fadeEffect(_self.model.prevIndex, _self.model.viewIndex, 500);
            }, 2000);
        };
        /**
         * fadeAnimation:メインビジュアルのfade切換え
         * @memberOf VisualController
         */
        VisualController.prototype.fadeAnimation = function () {
            this.isAnimation = true;
            this.view.fadeEffect(this.model.prevIndex, this.model.viewIndex, 500);
        };

        /**
         * effectAnimation:ビジュアル切り替えのアニメーション設定
         * @memberOf VisualController
         */
        VisualController.prototype.effectAnimation = function () {};

        //------------------------------------------------------------- View
        /**
         * VisualView
         * @constractor
         */
        var VisualView = function VisualView() {
            this.parentView = "#mainView";
            this.views = ".jumbotron";
        };
        /**
         * initFade
         * @memberOf VisualView
         */
        VisualView.prototype.initFade = function () {
            $(this.views).css({
                "opacity": 0
            });
            $(this.views).eq(0).css({
                "opacity": 1
            });
            $("#pagination").children("li").eq(0).addClass("active");
        };
        /**
         * initSlide
         * @memberOf VisualView
         */
        VisualView.prototype.initSlide = function () {
            var _self = this;
            var lval = 0;
            $(this.parentView).css({
                position: "relative"
            });
            $(this.parentView).find(this.views).each(function () {
                $(this).css({
                    position: "absolute",
                    left: lval
                });
                lval += $(_self.parentView).width();
            });
        };
        /**
         * slideEffect
         * @memberOf VisualView
         */
        VisualView.prototype.slideEffect = function () {

        };
        /**
         * fadeEffect
         * @memberOf VisualView
         * @param prev {object} ビジュアル前要素
         * @param target {object} ビジュアル切り替え要素
         * @param speed {integer} フェード演出秒数間隔
         */
        VisualView.prototype.fadeEffect = function (prev, target, speed) {
            var _self = this;
            $(this.views).eq(prev).stop(false, true).animate({
                opacity: 0
            }, speed, "linear", function () {
                $(_self.views).eq(target).stop(false, true).animate({
                    opacity: 1
                }, speed, "linear", function () {
                    $(this).trigger("effectComplete");
                });
            });

            $("#pagination").children("li").eq(prev).removeClass("active");
            $("#pagination").children("li").eq(target).addClass("active");
        };

        //---------------------- test
        this.modelTest = VisualModel;
        this.ctrlTest = VisualController;
        this.viewTest = VisualView;
        //---------------------------

        /**
         * init:初期処理
         */
        this.initFade = function init() {
            var mdl, ctrl, view;
            mdl = new VisualModel();
            view = new VisualView();
            ctrl = new VisualController(mdl, view);

            // fade切り替えの設定
            ctrl.effectAnimation = ctrl.fadeAnimation;

            mdl.viewData = _this.model;
            mdl.createModel(mdl.viewData);
            ctrl.viewControlle(); // メインビジュアル表示切り替え
            ctrl.pagerBtnControlle(); // next, prevボタン切り替え
            ctrl.paginationBtnControlle(); // ナビボタン切り替え
            ctrl.animationControlle(); // アニメーション制御

            // case fade
            view.initFade();

            // roop
            ctrl.timer = setInterval(function () {
                ctrl.RoopIndexControlle();
                view.fadeEffect(mdl.prevIndex, mdl.viewIndex, 500);
            }, 2000);

        };

        this.initSlide = function init() {
            var mdl, ctrl, view;
            mdl = new VisualModel();
            view = new VisualView();
            ctrl = new VisualController(mdl, view);

            mdl.viewData = _this.model;
            mdl.createModel(mdl.viewData);
            // ctrl.viewControlle();
            // ctrl.pagerBtnControlle();
            // ctrl.paginationBtnControlle();
            // ctrl.animationControlle();

            // case fade
            view.initSlide();

            // roop
            // ctrl.timer = setInterval(function(){
            // 	ctrl.RoopIndexControlle();
            // 	view.fadeEffect(mdl.prevIndex, mdl.viewIndex, 500);
            // }, 2000);

        };

    }

    return MainVisual;

})(jQuery);