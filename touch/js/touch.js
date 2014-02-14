/**
 * touch.js
 *
 * @class TouchEvent
 * @version 1.0.0
 */
var TouchEvent = (function($, target){

    // ---------------------------------- privates method
    
    // Browser Support
    var spt = new (function(){
        this.touch = 'ontouchstart' in window;
        this.mspointer = window.navigator.msPointerEnabled;
    })();

    // Browser Type
    var br = new (function() {
        var ua = navigator.userAgent;
        this.IE = document.uniqueID ? true : false;
        this.ltIE6 = typeof window.addEventListener == 'undefined' && typeof document.documentElement.style.maxHeight == 'undefined';
        this.ltIE7 = typeof window.addEventListener == 'undefined' && typeof document.querySelectorAll == 'undefined';
        this.ltIE8 = typeof window.addEventListener == "undefined" && typeof document.getElementsByClassName == "undefined";
        this.SP = /iPad|iPhone|iPod|Android/i.test(ua);
        this.iOS = /iPad|iPhone|iPod/i.test(ua);
    })();

    // -------------------------------------------------

    function TouchEvent(){

        this.startHandler = {
            startaction:function(e){
                console.log(e);
            }
        };

        this.moveHandler = {
            moveaction:function(e){
                console.log(e);
            }
        };

        // mSwipeClass
        var BindTouchEvent = new (function(ehandler, mhandler) {

            // Attache Touch Event
            var onTouchStart = spt.mspointer ? 'MSPointerDown' : spt.touch ? 'touchstart' : 'mousedown';
            var onTouchMove = spt.mspointer ? 'MSPointerMove' : spt.touch ? 'touchmove' : 'mousemove';
            var onTouchEnd = spt.mspointer ? 'MSPointerUp' : spt.touch ? 'touchend' : 'mouseup';

            $(target).bind(onTouchStart, function(e) {
                $(this).unbind(ehandler).bind(ehandler);
                $(this).unbind(mhandler).bind(mhandler);

            }).bind(onTouchMove, function(e) {
                var _self = this;
                $.each(mhandler, function(key){
                    $(_self).trigger(key);
                });
            });

            $(target).bind(onTouchEnd, function(e) {
                var _self = this;
                $.each(ehandler, function(key){
                    $(_self).trigger(key);
                });
                
                $(this).unbind(mhandler, ehandler);
            });

        })(this.startHandler, this.moveHandler);
        
    }

    return TouchEvent;

})(jQuery, window);
