window.onload = function() {

};
(function() {

	var colArr = [], //列数组
		screenHeight = $(window).height(), //屏幕可视高度
		colWidth, //列宽
		colNum; //列数

	//初始化页面
	function init() {
		//注册滚动事件
		$(window).on("scroll", function(event) {
			var lastBox = $(".box").last(), //最后一个box
				//获取最后一个box的距离顶部的偏移
				lastBoxHeight = lastBox.offset().top,
				//获取滚动条滚动出的距离
				scrollH = $(document).scrollTop(),
				//上方需要释放图片距离文档顶端的距离, =  卷上去的距离 - 一个屏幕的高=向长超出一个屏幕的距离
				scrollT = scrollH - screenHeight * 1,
				//下方需要释放图片的距离, = 卷上去的距离 + 两个屏幕的高 =向下超出一个屏幕的距离
				scrollB = scrollH + screenHeight * 2;
			//动态加载图片的策略，
			//如果滚动到最后一个box的距离底部偏移  < 下方需要释放图片的距离，加载新的图片
			if (lastBoxHeight < scrollB) {
				//根据服务器返回的JSon数据，动态创建box
				getData();
			}
			//动态释放图片的策略
			//遍历colArr数组，动态更新页面的img数据，
			//当加载图片过时会随着屏幕的滚动释放img，和加载img
			//img的信息在colArr.boxArr.img中读取并生成html添加到页面中
			$.each(colArr, function(col, item) {
				$.each(item.boxArr, function(row, box) {
					//如果当前box的距离文档顶部的偏移 < 释放上方图片的边界，
					//或者当前box的距离文档顶部的偏移 - box的高度  > 释放下方图片的边界，则释放img
					var boxDom = $("#box-" + col + "-" + row + " .img");
					if (box.offsetH < scrollT ||
						box.offsetH - box.height > scrollB) {
						//释放.img div下的元素（img）
						boxDom.empty();
					} else { //其他情况则加载img
						img = "<img src='" + box.img.src + "' alt='" + box.img.alt +
							"' width='" + box.img.width + "' data-src='" + box.img.src +
							"' data-width='" + box.img.width + "' data-height='" + box.img.height + "' />";
						//如果没有img元素，则添加，避免重复
						if (boxDom.find("img").length == 0) {
							boxDom.append(img)
						}
					}
				});

			})
		});

		var $boxs = $(".box"); //获取所有box
		colWidth = $($boxs[0]).outerWidth(true); //列宽
		colNum = Math.floor($("#flow").width() / colWidth); //总列数
		//动态调整外层盒子的宽度，居中	
		$("#flow").css({
			"width": colWidth * colNum
		});
		//刷新页面
		updeteView($boxs, true);
	}

	/**
	 * 请求数据
	 */
	function getData() {
		$.ajax({
			type: "get",
			url: "json/pubuliu.json",
			async: true,
			dataType: "json",
			success: function(dataJson) {
				//随机一个标识，用于选择器刷选dom
				var rand = new Date().getTime() + "",
					html = formateHtml(dataJson.dataRand, rand);
				$("#flow ul").append(html); //加载数据
				//根据rand值，筛选出当次添加的dom，进行页面布局
				updeteView($("." + rand), false);
			},
			error: function(data) {}
		});
	}

	/**
	 * 载入数据
	 */
	function loadData() {
		$.ajax({
			type: "get",
			url: "json/pubuliu.json",
			async: true,
			dataType: "json",
			success: function(dataJson) {
				var html = formateHtml(dataJson.dataArray);
				$("#flow ul").empty().html(html); //加载数据
				init(); //初始化页面		
			},
			error: function(data) {}
		});
	}

	/**
	 * 格式化Html，根据服务器返回的JSon，生成Html
	 * @param {String} dataArray =[] json数据
	 * @param {String} classTag=[] 唯一的标识，用来刷选这组元素
	 */
	function formateHtml(dataArray, classTag) {
		classTag = classTag || "";
		var html = "";
		$.each(dataArray, function(index, data) {
			var img = "<div class='img'><img src='" + data.img.src + "' alt='" + data.img.alt +
				"' data-src='" + data.img.src + "' data-width='" + data.img.width +
				"' data-height='" + data.img.height + "' /></div>",
				h2 = "<h2 class='title'>" + data.title + "</h2>",
				pcontent = "<p class='content'>" + data.content + "</p>",
				pspan = "<p><span class='uid'>用户名@: " + data.username + "</span><span class='hot'>关注:" + data.hot + "</span></p>",
				spantips = "<span class='tips'>" + data.date + "" + data.position + "</span>",
				htmltmp = "<li><a class='box " + classTag + "' href='" + data.detail_src + "' target='_blank'>" + img + h2 + pcontent + pspan + spantips + "</a></li>";
			html += htmltmp;
		});
		return html;
	}

	/**
	 * 刷新页面，更细页面元素的布局
	 * @param {Object} $boxs 页面中元素
	 * @param {Boolean} first=[true|false] 是否是首次刷新页面
	 */
	function updeteView($boxs, first) {
		var colNumTmp = first ? 0 : colNum; //第一次时，需要初始化 colArr
		//通过定义box的高度数组。并选择出高度最矮的那一列，
		//将下一个box放置其下面，同时更细此列的高度，
		//依次填充完毕
		$.each($boxs, function(index, item) {
			var img = $(item).find("img").first(); //获取当前box下的img元素
			//设置图片的高度，在页面加载的时候留出图片的占位，否则动态获取图片的高度，由于加载问题会出现闪屏和错位
			img.css({
				//设置图片的高度，根据原图的高，和实际的宽度，缩放至需要的高度
				"height": parseInt(img.attr("data-height")) * parseInt(img.css("width")) / parseInt(img.attr("data-width"))
			});
			var box = { //当前的box对象，用于存储box的关键信息
				height: $(item).outerHeight(true), //box高度
				offsetH: 0, //box 当前列最顶端的偏移
				img: { //img信息
					src: img.attr("src"),
					alt: img.attr("alt"),
					width: img.css("width"),
					height: img.css("height")
				}
			};
			//当colNumTmp < colNum 时，初始化colArr的数据，
			//依次压入列数据，作为起始行，colNumTmp++
			if (colNumTmp < colNum) {
				var col = { //当前列对象
					height: 0, //列高
					boxArr: [] //列内box数组
				};
				//当前列的高度= 当前box的高度
				col.height = box.height;
				//将当前box压入当前列boxArr
				col.boxArr.push(box);
				//将当前列数据压入列数组
				colArr.push(col);
				//更新界面，增加box的id = colindex + rowindex
				$(item).attr("id", "box-" + colNumTmp + "-0");
				//列序号++ ，下一列
				colNumTmp++;
			} else { //当大于总列数，即第二行开始，
				//计算列高数组中的最矮高度，作为下一个box的top值，此列的left作为box的left.
				//定义列高度临时数组，并将每列的高度压入数组
				var colHeightArr = [];
				for (var i = 0; i < colArr.length; i++) {
					colHeightArr.push(colArr[i].height);
				}
				//计算列高数组中最矮的高度。
				var nextTop = Math.min.apply(null, colHeightArr),
					//计算列高数组中最矮列的列号index，做为下一个box的插入列
					nextIndex = colHeightArr.indexOf(nextTop),
					//计算最矮列的左偏移，可以用列宽*列数，
					nextLeft = colWidth * nextIndex;
				//更新此列的高度值
				colArr[nextIndex].height += box.height;
				//更新当前box底部距离文档顶部的距离，包含box的高度
				box.offsetH = colArr[nextIndex].height;
				//将当前box压入此列的boxArr中
				colArr[nextIndex].boxArr.push(box);
				//跟新box的样式，在特定的位置显示
				$(item).css({
					"position": "absolute",
					"top": nextTop,
					"left": nextLeft
				}).attr("id", "box-" + nextIndex + "-" + (colArr[nextIndex].boxArr.length - 1));
			}
		});
	}
	loadData();
})();