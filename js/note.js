$(function() {
	//滚动条发生滚动
	$(window).scroll(function() {
		//滚动条相对文档顶部的距离
		var scrollT = $(window).scrollTop(),
			docH = $(document).height(),
			clientH = $(window).height(),
			//获取content下面的所有item
			items = $("#content>li"),
			currentID = "";
		//遍历item，获取每个item相对文档顶部的距离
		$.each(items, function(index, value) {
			var item = $(value);
			//获取当前item相对顶部的距离
			var itemTop = item.offset().top;
			//如果滚动条相对文档顶部的距离大于当前item -200的距离，
			//说明当前item距离文档顶部200，
			//也就是当前item正处于顶部显示，
			//此时则更新当前的导航ID为当前的item
			if (scrollT > itemTop - clientH / 2) {
				currentID = "#" + item.attr("id");

			}
			//由于最后一个item的top值比较大，滚动条的top永远也不会大于这个数
			//所以单独做一个最后一个item的判定，来选中当前的item
			if (scrollT > docH - clientH - 10) {
				currentID = "#" + item.attr("id");
			}
			//				else { //对于itemTOP值大于滚动条的top的则不需要再做判定，直接返回，跳出循环
			//				return false;
			//			}
		});

		//遍历导航的每一个连接a，
		//增加hover时的样式。
		//判定文档滚动到了哪一个item下，
		//更新当前item的样式为选中状态。
		$.each($("#navig > li"), function(index, value) {
			var item = $(value),
				a = item.find("a");
			if (a.attr("href") == currentID) {
				item.addClass("active");
			} else if (currentID) { //判定currentID是否是空值，
				//空值说明滚动条并未滚动出第一个item范围
				//不等于空，则移除其样式
				item.removeClass("active");
			}

		});

	});

})