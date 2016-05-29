/*
 * addHandler中 handler 不能使用匿名函数，
 * 否则removeHandler 将无法移除绑定的事件handler
 * 
 * */
var eventUtil = {
	/**
	 * 注册事件
	 * @param {Object} elementer	Dom元素
	 * @param {Object} typer		不使用on前缀的事件名
	 * @param {Object} handler		事件处理函数
	 */
	addHandler: function(elementer, typer, handler) {
		if (elementer.addEventListener) { //DOM2级事件处理
			elementer.addEventListener(typer, handler, false);
		} else if (elementer.attachEvent) { //IE事件处理
			elementer.attachEvent("on" + typer, handler);
		} else { //DOM0级事件处理
			elementer["on" + typer] = handler;
			// element[“onclick”] === element.onclick
		}
	},
	/**
	 * 注销事件
	 * @param {Object} elementer	Dom元素
	 * @param {Object} typer		不使用on前缀的事件名
	 * @param {Object} handler		事件处理函数
	 */
	removeHandler: function(elementer, typer, handler) {
		if (elementer.removeEventListener) { //DOM2级事件处理
			elementer.removeEventListener(typer, handler, false);
		} else if (elementer.detachEvent) { //IE事件处理
			elementer.detachEvent("on" + typer, handler);
		} else { //DOM0级事件处理
			elementer["on" + typer] = null;
		}
	},
	/**
	 * 获取event对象，兼容的event
	 * @param {Object} e	event对象
	 */
	getEvent: function(e) {
		//标准的||兼容IE
		return e ? e : window.event;
	},
	/**
	 * 获取触发event的元素
	 * @param {Object} e	event对象
	 */
	getElement: function(e) {
		//标准的||兼容IE
		return e.target || e.srcElement;
	},
	/**
	 * 获取event事件的类型
	 * @param {Object} e	event对象
	 */
	getType: function(e) {
		return e.type; //IE和标准一样
	},
	/**
	 * 阻止event事件的默认行为
	 * @param {Object} e	event对象
	 */
	preventDefault: function(e) {
		if (e.preventDefault) { //标准的
			e.preventDefault();
		} else {
			e.returnValue = false; //兼容IE
		}
	},
	/**
	 * 阻止event事件的冒泡
	 * @param {Object} e	event对象
	 */
	stopPropagation: function(e) {
		if (e.stopPropagation) { //标准的
			e.stopPropagation();
		} else {
			e.cancelBubble = true; //兼容IE
		}
	}
}