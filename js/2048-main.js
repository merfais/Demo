var board = [],
	boardOO = [],
	score = 0;

$(function() {
	newGame();

	//generateOneNumber();
})

function newGame() {
	//初始化棋盘
	init();
	//随机生成数字和位置
}

function init() {
	//初始化UI
	var boardIndex = 0;
	for (var row = 0; row < 4; row++) {
		for (var col = 0; col < 4; col++) {
			var cellDiv = $("#cell-" + row + "-" + col);
			cellDiv.css({
				"top": getPositionTop(row),
				"left": getPositionLeft(col)
			});
			var cellDate = new Cell();
			cellDate.x = row;
			cellDate.y = col;
			cellDate.value = 0;
			boardOO[boardIndex++] = cellDate;
		}
	}
	//初始化数据
	for (var row = 0; row < 4; row++) {
		board[row] = [];
		for (var col = 0; col < 4; col++) {
			board[row][col] = 0;
		}
	}
	//开始事件循环
	$(document).on("keydown", function(event) {
		var moveFlag = false;

		switch (event.keyCode) {
			case 37:
				moveFlag = moveHorizontal(0);
				break;
			case 38:
				moveFlag = moveVertical(0);
				break;
			case 39:
				moveFlag = moveHorizontal(3);
				break;
			case 40:
				moveFlag = moveVertical(3);
				break;
			default:
				break;
		}
		//发生移动
		if (moveFlag) {
			//定时刷新页面，定时间隔要长于动画
			setTimeout(updateBoardView, 200);
			isGameOver();
		}
	});
	//刷新页面
	updateBoardView();
}

function updateBoardView() {
	var grid = $("#gridContainer");
	$(".number-cell").remove();
	for (var row = 0; row < 4; row++) {
		for (var col = 0; col < 4; col++) {
			grid.append('<div class="number-cell" id="numberCell-' + row + '-' + col + '"></div>');
			var numberCell = $("#numberCell-" + row + "-" + col);
			if (board[row][col] == 0) {
				numberCell.css({
					"width": "20px",
					"height": "20px",
					"opacity": 0,
					"top": getPositionTop(row) + 40,
					"left": getPositionLeft(col) + 40
				});

			} else {
				numberCell.css({
					"width": "100px",
					"height": "100px",
					"opacity": 1,
					"top": getPositionTop(row),
					"left": getPositionLeft(col),
					"background": getBackground(board[row][col]),
					"color": getColor(board[row][col])
				}).text(board[row][col]);
			}
		}
	}
	//每次刷新页面随机生成两个数字2|4
	generateOneNumber();
	generateOneNumber();
}

function generateOneNumber() {
	var spaceBoard = getSpaceBoard(board); //获取空白位置，返回一个包含空白位置坐标的一维数组
	if (spaceBoard.length == 0) { //数组为0，表示没有空白位置，返回false
		return false;
	} else { //数组不为0，生成随机位置，随机数字2或者4
		//随机一个位置，根据空白位置坐标数组的长度计算随机数的最大值
		var randPos = parseInt(Math.floor(Math.random() * spaceBoard.length)),
			//随机一个数字，2或者4各50%的概率
			randNum = Math.random() < 0.5 ? 2 : 4,
			//计算得出随机的位置坐标
			randCell = spaceBoard[randPos];
		//更新数据
		board[randCell.x][randCell.y] = randNum;
		//更新动画
		showNumberWithAnimation(randCell.x, randCell.y, randNum);
	}
	return true;
}

//水平移动
function moveHorizontal(direction) {
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
			if (board[row][colF] != 0) {
				//构建当前row的一维数组，方向为左，构建0~3，方向为右，构建3~0，反转数组
				//由于每次数据都有更新，所以需要重新缓存新的数组
				var tempArr = [];
				for (var i = 0; i <= 3; i++) {
					//direction的值为0或者3，通过减法-绝对值，判定是否反转数组，当向右需要反转数组
					tempArr.push(board[row][Math.abs(direction - i)]);
				}
				//根据转化好的数组，下标值依旧使用col，从小到大进行遍历，
				//计算是否可以移动,并返回目的标的下标，
				//目标的下标需要根据方向值（左|右）再转换回来
				colD = Math.abs(direction - tryMove(tempArr, col));
				//如果目标位置 != 初始位置，表示可以移动
				if (colD != colF) {
					//更新board值
					moveTo(board, row, colF, row, colD);
					//刷新动画
					showMoveWithAnimation(row, colF, row, colD);
					rtn = true;
				}
			}
		}
	}
	return rtn;
}

//垂直移动
function moveVertical(direction) {
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
			if (board[rowF][col] != 0) {
				//构建当前col的一维数组，方向为上，构建0~3，方向为下，构建3~0，反转数组
				//由于每次数据都有更新，所以需要重新缓存新的数组
				var tempArr = [];
				for (var i = 0; i <= 3; i++) {
					//direction的值为0或者3，通过减法-绝对值，反转数组
					tempArr.push(board[Math.abs(direction - i)][col]);
				}
				//根据转化好的数组，下标值依旧使用row，从小到大进行遍历，
				//计算是否可以移动,并返回目的标的下标，
				//目标的下标需要根据方向值（上|下）再转换回来
				rowD = Math.abs(direction - tryMove(tempArr, row));
				//如果目标位置 != 初始位置，表示可以移动
				if (rowD != rowF) {
					//更新board值
					moveTo(board, rowF, col, rowD, col);
					//更新动画
					showMoveWithAnimation(rowF, col, rowD, col);
					rtn = true;
				}
			}
		}
	}
	return rtn;
}

function isGameOver() {
	return false;
}