var EventUtil={
    addHandler:function(element,type,handler){//绑定监听事件
        if(element.addEventListener){ //DOM2级
            console.log('addEventListener')
            element.addEventListener(type,handler,false);//默认在冒泡阶段捕获
        }else if(element.attachEvent){ //IE
            console.log('attachEvent')
            element.attachEvent('on'+type,handler);
        }else{
            element['on'+type]=handler;
        }
    },
    removeHandler:function(element,type,handler){//移除监听事件
        if(element.removeEventListener){
            element.removeEventListener(type,handler,false);
        }else if(element.detachEvent){
            element.detachEvent('on'+type,handler);
        }else{
            element['on'+type]=null
        }
    },
    getEvent:function(event){//返回对event对象的引用
        return event ? event : window.event;
    },
    getTarget:function(event){//返回当前事件的实际目标
        return event.target || event.srcElement;
    },
    preventDefault:function(event){//阻止事件的默认行为
        if(event.preventDefault){
            event.preventDefault();
        }else{
            event.returnValue=false;
        }
    },
    stopPropagation:function(event){//阻止冒泡
        if(event.stopPropagation){
            event.stopPropagation();
        }else{
            event.cancelBubble=true;
        }
    },
    /**
     * 在发生mouseover和mouseout事件时，会涉及到从一个元素的边界之内移动到另一个元素的边界之内。例如：对mouseover事件，
     * 事件的主要目标是获得光标的元素，那么它的相关元素就是那个失去光标的元素。DOM通过event对象的relatedTarget属性提供
     * 了相关元素的信息（注：只有mouseover和mouseout有这个属性）。IE的相关元素保存在fromElement(mouseover)和
     * toElement（mouseout)。
     */
    getRelatedTarget:function(event){
        if(event.relatedTarget){
            return event.relatedTarget;
        }else if(event.fromElement){
            return event.fromElement;//IE的mouseover事件目标的相关元素
        }else if(event.toElement){
            return event.toElement;//IE的mouseout事件目标的相关元素
        }else{
            return null;
        }
    },
    /**
     * 鼠标按钮事件：event上的button属性，表示按下或释放地按钮
     * DOM有三个值：0表示主鼠标按钮，1表示中间的鼠标按钮（鼠标滚轮按钮），2表示次鼠标主键（常规设置中，左键是主鼠标按钮，
     * 右键是次鼠标按钮。
     * IE8之前也提供了button属性，但与DOM有很大的差别：
     * 0：表示没有按下鼠标按钮
     * 1：表示按下了主鼠标按钮
     * 2：表示按下了次鼠标按钮
     * 3：表示同时按下了主、次鼠标按钮
     * 4：表示按下了中间的鼠标按钮
     * 5：表示同时按下了主鼠标按钮和中间的鼠标按钮
     * 6：表示同时按下了次鼠标按钮和中间的鼠标按钮
     * 7：表示同时按下了三个鼠标按钮
     * 通过测试“MouseEvents”这个特性，可以确定event对象中存在的button属性是IE的还是DOM的，
     * 如果失败说明是IE，那么就对其进行相应的规范化
     */
    getButton:function(event){
        if(document.implememtation.hasFeature('MouseEvents','2.0')){//DOM则返回true
            return event.code
        }else{//IE规范化，制定优先级：主鼠标按钮>次鼠标按钮>中间鼠标按钮
            switch(event.button){
                case 0:
                case 1:
                case 3:
                case 5:
                case 7:
                    return 0;
                case 2:
                case 6:
                    return 2;
                case 4:
                    return 1;
            }
        }
    },
    /**
     * 鼠标滚轮事件：mousewheel
     * 火狐（Firefox）浏览器的滚轮时间和其他浏览器有所不同。
     * 火狐监听滚轮事件：Event.addHandler(document,'DOMMouseScroll',getWheelDelta)
     * 其他浏览器：Event.addHandler(document,'mousewheel',getWheelDelta)
     */
    getWheelDelta:function(event){//IE,Opera,chrome,safari
        if(event.wheelDelta){//wheelDelta表示鼠标向前或者向后滚动的值，但在opera9.5之前的版本，wheelDelta的正负号是颠倒的，所以要做早期Opera的兼容
            return (client.engine.opera && client.engine.opera<9.5 ? -event.wheelDelta :event.wheekDelta);
        }else{//Firefox
            return -event.detail*40
        }
    },
    /**
     * 字符编码：IE、Firefox、Chrome和Safari的event对象都支持一个charCode属性，这个属性只有在发生keypress事件时才包含值，
     * 而且这个值是按下的那个键所代表字符的ASCII编码。
     * keypress：用户按下键盘上的字符键时触发，如果按住不放的话，会重复触发此事件。（按Esc也会触发）
     * keyCode返回的是键码，eg：左箭头，上箭头，有箭头，下箭头的键码分别是37、38、39、40
     * charCode返回的的ASCII编码
     * 在取得了实际的字符编码后，可以使用String.fromCharCode()将其转换成实际的编码
     */
    getCharCode:function(event){
        if(typeof event.charCode==='number'){
            return event.charCode
        }else{//如果不支持charCode属性则返键码
            return event.keyCode
        }
    }
}