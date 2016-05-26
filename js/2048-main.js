(function() {
	var data = {
			board: [],
			boardMerge: [],
			score: 0
		},

		//更新view的一些参数，动态计算
		viewUtil = {

			documentWidth: window.screen.availWidth,
			gridWidth: window.screen.availWidth > 500 ? 500 : (0.8 * window.screen.availWidth),
			cellWidth: window.screen.availWidth > 500 ? 100 : (0.15 * window.screen.availWidth),
			cellPadding: window.screen.availWidth > 500 ? 20 : (0.04 * window.screen.availWidth),

			//gridWidth: this.documentWidth > 500 ? 500 : (0.8 * this.documentWidth),

			getPositionTop: function(row) {
				return this.documentWidth > 500 ? (row * 120 + 20) : (row * (this.cellWidth + this.cellPadding) + this.cellPadding);
			},

			getPositionLeft: function(col) {
				return this.documentWidth > 500 ? (col * 120 + 20) : (col * (this.cellWidth + this.cellPadding) + this.cellPadding);
			},

			getBackground: function(number) {
				var color = "black";
				switch (number) {
					case 2:
						color = "#eee4da";
						break;
					case 4:
						color = "#ede0c8";
						break;
					case 8:
						color = "#f2b179";
						break;
					case 16:
						color = "#f59563";
						break;
					case 32:
						color = "#f67e5f";
						break;
					case 64:
						color = "#f65e3b";
						break;
					case 128:
						color = "#edcf72";
						break;
					case 256:
						color = "#edee61";
						break;
					case 512:
						color = "#9c0";
						break;
					case 1024:
						color = "#33b5e5";
						break;
					case 2048:
						color = "#09c";
						break;
					case 4096:
						color = "#a6e";
						break;
					case 8192:
						color = "#93e";
						break;
					default:
						break;
				}
				return color;
			},

			getFontsize: function(number) {
				var size = "3em";
				if (this.documentWidth > 500) {
					if (number < 10) {
						size = "4em";
					} else if (number < 100) {
						size = "3em";
					} else if (number < 1000) {
						size = "3em";
					} else if (number < 10000) {
						size = "2.5em";
					} else {
						size = "1.5em";
					}
				} else {
					if (number < 10) {
						size = "2em";
					} else if (number < 100) {
						size = "1.5em";
					} else if (number < 1000) {
						size = "1.5em";
					} else if (number < 10000) {
						size = "1em";
					} else {
						size = "0.8em";
					}
				}
				return size;
			},

			getColor: function(number) {
				var color = "white";
				if (number < 4) {
					color = "#776a65";
				}
				return color;
			},

		},

		//动画的一些方法
		aniUtil = {
			//生成数字时动画
			showNumberWithAnimation: function(row, col, value) {
				var numberCell = $("#numberCell-" + row + "-" + col);
				numberCell.css({
					"background": viewUtil.getBackground(value),
					"font-size": viewUtil.getFontsize(data.board[row][col]),
					"line-height": viewUtil.cellWidth + "px",
					"color": viewUtil.getColor(value)
				}).text(value).animate({
					"width": viewUtil.cellWidth,
					"height": viewUtil.cellWidth,
					"opacity": 1,
					"top": viewUtil.getPositionTop(row),
					"left": viewUtil.getPositionLeft(col)
				}, 200, "swing");
			},
			//移动时动画
			showMoveWithAnimation: function(rowF, colF, rowD, colD) {
				var numberCell = $("#numberCell-" + rowF + "-" + colF);
				numberCell.animate({
					"top": viewUtil.getPositionTop(rowD),
					"left": viewUtil.getPositionLeft(colD)
				}, 200, "swing");
			}
		};

	bootGame(data);
	newGame(data);

	//启动游戏，加载时间循环，适应浏览器配置
	function bootGame(data) {
		//适配设备，根据设备的大小调整界面
		var grid = $("#gridContainer"),
			cell = $(".grid-cell");
		grid.css({
			"width": viewUtil.gridWidth - 2 * viewUtil.cellPadding,
			"height": viewUtil.gridWidth - 2 * viewUtil.cellPadding,
			"padding": viewUtil.cellPadding,
		});
		cell.css({
			"width": viewUtil.cellWidth,
			"height": viewUtil.cellWidth
		});

		//清空事件循环，避免多次注册
		//	$(document).off("keydown");
		//开始键盘事件循环
		$(document).on("keydown", function(event) {
			var moveFlag = false,
				keyLegal = true;
			switch (event.keyCode) {
				case 37: //左
					event.preventDefault();
					keyLegal = true;
					moveFlag = moveHorizontal(data, 0, true);
					break;
				case 38: //上
					event.preventDefault();
					keyLegal = true;
					moveFlag = moveVertical(data, 0, true);
					break;
				case 39: //右
					event.preventDefault();
					keyLegal = true;
					moveFlag = moveHorizontal(data, 3, true);
					break;
				case 40: //下
					event.preventDefault();
					keyLegal = true;
					moveFlag = moveVertical(data, 3, true);
					break;
				default:
					keyLegal = false;
					break;
			}

			//如果在可接受按键字符范围内
			if (keyLegal) {
				//发生移动，刷新页面继续游戏循环
				if (moveFlag) {
					//定时刷新页面，定时间隔要长于动画
					setTimeout(function() {
						updateBoardView(data);
						//每次移动随机生成两个数字2|4
						generateOneNumber(data.board);
						generateOneNumber(data.board);
					}, 200);
				}
				//检测是否结束游戏
				setTimeout(function() {
					//当没有发生移动时检测是否结束游戏
					if (isGameOver(data)) {
						alert("Game Over");
					}
				}, 400); //动画延时，200移动延时，200刷新页面延时
			}

		});

		var startX, startY, endX, endY;
		//绑定触摸事件
		$("#gridContainer").on("touchstart", function(event) {
			startX = event.originalEvent.touches[0].pageX;
			startY = event.originalEvent.touches[0].pageY;
		});

		//	document.getElementById("gridContainer").addEventListener("touchstart",function (event) {
		//		startX = event.touches[0].pageX;
		//		startY = event.touches[0].pageY;
		//	});

		$("#gridContainer").on("touchmove", function(event) {
			event.preventDefault();
		});

		//绑定触摸离开事件
		$("#gridContainer").on("touchend", function(event) {
			endX = event.originalEvent.changedTouches[0].pageX;
			endY = event.originalEvent.changedTouches[0].pageY;
			var offsetX = Math.abs(startX - endX),
				offsetY = Math.abs(startY - endY),
				moveFlag = false;
			//规避只是手指点击屏幕的bug， 当手指移动超过一定的距离，触发滑动的事件
			if (offsetX > viewUtil.cellWidth * 0.2 || offsetY > viewUtil.cellWidth * 0.2) {
				if (offsetX > offsetY) {
					// 水平移动距离大于垂直距离，==》水平滑动
					moveFlag = moveHorizontal(data, startX - endX > 0 ? 0 : 3, true);
				} else {
					//垂直滑动
					moveFlag = moveVertical(data, startY - endY > 0 ? 0 : 3, true);
				}
			}
			//发生移动，刷新页面继续游戏循环
			if (moveFlag) {
				//定时刷新页面，定时间隔要长于动画
				setTimeout(function() {
					updateBoardView(data);
					//每次移动随机生成两个数字2|4
					generateOneNumber(data.board);
					generateOneNumber(data.board);
				}, 200);
			}
			//检测是否结束游戏
			setTimeout(function() {
				//当没有发生移动时检测是否结束游戏
				if (isGameOver(data)) {
					alert("Game Over");
				}
			}, 400); //动画延时，200移动延时，200新生成数延时
		});

		//绑定 开始游戏的事件
		$("#btnNewGame").on("click", function(event) {
			newGame(data);
		});
	}

	//开始游戏
	function newGame(data) {
		//初始化游戏数据
		init(data);
		//刷新页面
		updateBoardView(data);
		//随机生成两个数字2|4
		generateOneNumber(data.board);
		generateOneNumber(data.board);
	}

	//初始化游戏数据
	function init(data) {
		//初始化UI
		for (var row = 0; row < 4; row++) {
			for (var col = 0; col < 4; col++) {
				var cellDiv = $("#cell-" + row + "-" + col);
				cellDiv.css({
					"top": viewUtil.getPositionTop(row),
					"left": viewUtil.getPositionLeft(col)
				});
			}
		}
		//初始化数据
		for (var row = 0; row < 4; row++) {
			data.board[row] = [];
			data.boardMerge[row] = [];
			for (var col = 0; col < 4; col++) {
				data.board[row][col] = 0;
				data.boardMerge[row][col] = true;
			}
		}
		// 初始化成绩
		data.score = 0;

	}

	/*
	 * 刷新页面
	 * 程序开始，数据移动均触发页面的刷新，
	 * 每次页面刷新，随机生成两个数，更新成绩，更新可合并标识
	 */
	function updateBoardView(data) {

		//遍历View矩阵，先移出所有cell元素，
		//再根据board数组的值,生成响应样式的cell添加入view。
		var grid = $("#gridContainer");
		$(".number-cell").remove(); //清空cell
		for (var row = 0; row < 4; row++) {
			for (var col = 0; col < 4; col++) {
				//添加cell
				grid.append('<div class="number-cell" id="numberCell-' + row + '-' + col + '"></div>');
				var numberCell = $("#numberCell-" + row + "-" + col);
				//根据board的值，生成对应的样式
				if (data.board[row][col] == 0) {
					numberCell.css({ //缩小，居中，隐藏，随机出新的值后，动画放大出现
						"width": viewUtil.cellWidth * 0.2, //缩小
						"height": viewUtil.cellWidth * 0.2, //缩小
						"opacity": 0, //没有值的隐藏
						"top": viewUtil.getPositionTop(row) + viewUtil.cellWidth * 0.4, //居中
						"left": viewUtil.getPositionLeft(col) + viewUtil.cellWidth * 0.4 //居中
					});

				} else {
					numberCell.css({
						"width": viewUtil.cellWidth,
						"height": viewUtil.cellWidth,
						"line-height": viewUtil.cellWidth + "px",
						"font-size": viewUtil.getFontsize(data.board[row][col]),
						"opacity": 1,
						"top": viewUtil.getPositionTop(row),
						"left": viewUtil.getPositionLeft(col),
						"background": viewUtil.getBackground(data.board[row][col]),
						"color": viewUtil.getColor(data.board[row][col])
					}).text(data.board[row][col]);
				}
				//更新标识是否可以合并的矩阵
				data.boardMerge[row][col] = true;
			}
		}
		//更新成绩
		$("#score").text(data.score);

	}

	/*
	 * 在随机的位置生成随机的数
	 */
	function generateOneNumber(board) {
		var spaceBoard = []; //获取没有数值的位置，组成一维数组
		//遍历矩阵
		for (var i = 0; i < board.length; i++) {
			for (var j = 0; j < 4; j++) {
				//值为0，压入临数组，记录x.y下标
				if (0 == board[i][j]) {
					spaceBoard.push({
						"x": i,
						"y": j
					});
				}
			}
		}
		if (spaceBoard.length == 0) { //数组为0，表示没有空白位置，返回false
			return false;
		} else { //数组不为0，生成随机位置，随机数字2或者4
			//随机一个位置，根据空白位置坐标数组的长度计算随机数的最大值
			var randPos = parseInt(Math.floor(Math.random() * spaceBoard.length)),
				//随机一个数字，2或者4，概率可调
				randNum = Math.random() < 0.8 ? 2 : 4,
				//计算得出随机的位置坐标
				randCell = spaceBoard[randPos];
			//更新数据
			board[randCell.x][randCell.y] = randNum;
			//更新动画
			aniUtil.showNumberWithAnimation(randCell.x, randCell.y, randNum);
		}
		return true;
	}

	//水平移动
	function moveHorizontal(data, direction, move) {
		var colD,
			colF,
			rtn = false;
		// 水平遍历矩阵
		for (var row = 0; row < 4; row++) {
			for (var col = 1; col < 4; col++) {
				//计算需要位移的列，根据（左|右）方向转换开始的坐标，
				//当向右需要反转数组的下标，得到新的初始位置colF，进行遍历
				colF = Math.abs(direction - col);
				//如果开始的cell有值，则尝试移动，成功返回true，否则为false
				if (data.board[row][colF] != 0) {
					//构建当前row的一维数组，方向为左，构建0~3，方向为右，构建3~0，反转数组
					//由于每次数据都有更新，所以需要重新缓存新的数组
					var tempArr = [];
					for (var i = 0; i <= 3; i++) {
						//direction的值为0或者3，通过减法-绝对值，判定是否反转数组，当向右需要反转数组
						tempArr.push({
							value: data.board[row][Math.abs(direction - i)],
							canMerge: data.boardMerge[row][Math.abs(direction - i)]
						});
					}
					//根据转化好的数组，下标值依旧使用col，从小到大进行遍历，
					//计算是否可以移动,并返回目的标的下标，
					//目标的下标需要根据方向值（左|右）再转换回来
					colD = Math.abs(direction - caclMovePosition(tempArr, col));
					//如果目标位置 != 初始位置，表示可以移动
					if (colD != colF) {
						if (move) {
							//更新board值
							moveTo(data, row, colF, row, colD);
							//刷新动画
							aniUtil.showMoveWithAnimation(row, colF, row, colD);
						}
						rtn = true;
					}
				}
			}
		}
		return rtn;
	}

	//垂直移动
	function moveVertical(data, direction, move) {
		var rowD,
			rowF,
			rtn = false;
		// 垂直遍历矩阵
		for (var col = 0; col < 4; col++) {
			for (var row = 1; row < 4; row++) {
				//计算需要位移的行，根据（上|下）方向转换开始的坐标，
				//当向右需要反转数组的下标，得到新的初始位置rowF，进行遍历
				rowF = Math.abs(direction - row);
				//如果开始的cell有值，则尝试移动，成功返回true，否则为false
				if (data.board[rowF][col] != 0) {
					//构建当前col的一维数组，方向为上，构建0~3，方向为下，构建3~0，反转数组
					//由于每次数据都有更新，所以需要重新缓存新的数组
					var tempArr = [];
					for (var i = 0; i <= 3; i++) {
						//direction的值为0或者3，通过减法-绝对值，反转数组
						tempArr.push({
							value: data.board[Math.abs(direction - i)][col],
							canMerge: data.boardMerge[Math.abs(direction - i)][col]
						});
					}
					//根据转化好的数组，下标值依旧使用row，从小到大进行遍历，
					//计算是否可以移动,并返回目的标的下标，
					//目标的下标需要根据方向值（上|下）再转换回来
					rowD = Math.abs(direction - caclMovePosition(tempArr, row));
					//如果目标位置 != 初始位置，表示可以移动
					if (rowD != rowF) {
						if (move) { //当不是测试是否能够移动时，则移动
							//更新board值
							moveTo(data, rowF, col, rowD, col);
							//更新动画
							aniUtil.showMoveWithAnimation(rowF, col, rowD, col);
						}
						rtn = true;
					}
				}
			}
		}
		return rtn;
	}

	/*
	 * 计算cell可移动到的位置 
	 */
	function caclMovePosition(dataArr, indexFrom) {
		var destination = indexFrom, //目的地值
			value = dataArr[indexFrom].value;
		for (var i = indexFrom - 1; i >= 0; i--) {
			if (dataArr[i].value == 0) {
				//如果前一个位置没有值，向前移动一个位置。
				//继续下一次循环
				destination = i;
				continue;
			} else if (value == dataArr[i].value && dataArr[i].canMerge) {
				//如果前一个位置的值等于目标值并且前一个位置是可以合并的（合并过一次的不能再次合并）,向前移动一个位置.
				//继续下一次循环
				destination = i;
				continue;
			} else {
				//以上两种情况都不满足，则判定为不能再向前移动，
				//跳出循环，返回结果。
				break;
			}
		}
		return destination;
	}

	//开始坐标 移动到 目的坐标 的board中值的计算
	function moveTo(data, rowF, colF, rowD, colD) {
		if (data.board[rowD][colD] == 0) {
			//如果目标位置值 == 0 ，替换目标的值
			data.board[rowD][colD] = data.board[rowF][colF];
		} else {
			//否则是第二种情况，两个值相同，目标值与开始值相加
			data.board[rowD][colD] += data.board[rowF][colF];
			//更新是否可以合并cell的标识
			data.boardMerge[rowD][colD] = false;
			//更新分数
			data.score += data.board[rowD][colD];

		}
		data.board[rowF][colF] = 0; //清空开始位置的值
	}

	/*
	 * 判定游戏是否结束
	 * 四个方向均不能移动
	 */
	function isGameOver(data) {
		return !(moveHorizontal(data, 0, false) || moveHorizontal(data, 3, false) ||
			moveVertical(data, 0, false) || moveVertical(data, 3, false));
	}

})();