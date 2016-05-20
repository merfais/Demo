function Cell() {
	this.x = 0;
	this.y = 0;
	this.value = 0;
}
Cell.prototype.getPositionTop = function() {
	return x * 120 + 20;
}

Cell.prototype.getPositionLeft = function() {
	return y * 120 + 20;
}

Cell.prototype.getBackground = function() {
	var color = "black";
	switch (value) {
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
		case 4096:
			color = "#93e";
			break;
		default:
			break;
	}
	return color;
}

Cell.prototype.getColor = function() {
	var color = "white";
	if (value < 4) {
		color = "#776a65";
	}
	return color;
}

function getPositionTop(row) {
	return row * 120 + 20;
}

function getPositionLeft(col) {
	return col * 120 + 20;
}

function getBackground(number) {
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
		case 4096:
			color = "#93e";
			break;
		default:
			break;
	}
	return color;
}

function getColor(number) {
	var color = "white";
	if (number < 4) {
		color = "#776a65";
	}
	return color;
}

function nospace(board) {
	for (var i = 0; i < 4; i++) {
		for (var j = 0; j < 4; j++) {
			if (0 == board[i][j]) {
				return false;
			}
		}
	}
	return true;
}

function getSpaceBoard(board) {
	var spaceBoard = [];
	for (var i = 0; i < board.length; i++) {
		for (var j = 0; j < 4; j++) {
			if (0 == board[i][j]) {
				spaceBoard.push({
					"x": i,
					"y": j
				});
			}
		}
	}
	return spaceBoard;
}

function canMoveLeft(board) {
	for (var i = 0; i < 4; i++) {
		for (var j = 1; j < 4; j++) {
			if (board[i][j] != 0) {
				for (var k = 0; k < j; k++) {
					if (board[i][k] == 0) {

					} else if (board[i][k] == board[i][j]) {

					}
				}
				if (board[i][j - 1] == 0 || board[i][j] == board[i][j - 1]) {
					return true;
				}
			}
		}
	}
	return false;
}

function tryMoveLeft(board, row, col) {
	var destination = col,
		value = board[row][col];
	for (var i = col - 1; i >= 0; i--) {
		if (board[row][i] == 0) {
			//如果前一个位置没有值，向前移动一个位置。
			//继续下一次循环
			destination = i;
			continue;
		} else if (value == board[row][i]) {
			//如果前一个位置的值等于目标值,向前移动一个位置.
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

function moveToLeft(board, row, colF, colD) {
	if (board[row][colD] == 0) {
		//如果目标位置值 == 0 ，
		board[row][colD] = board[row][colF];
	} else {
		//否则是第二种情况，两个值相同
		board[row][colD] += board[row][colF];
	}
	board[row][colF] = 0; //清空原来位置的值
}

function tryMove(dataArr, indexFrom) {
	var destination = indexFrom,
		value = dataArr[indexFrom];
	for (var i = indexFrom - 1; i >=0; i--) {
		if (dataArr[i] == 0) {
			//如果前一个位置没有值，向前移动一个位置。
			//继续下一次循环
			destination = i;
			continue;
		} else if (value == dataArr[i]) {
			//如果前一个位置的值等于目标值,向前移动一个位置.
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
function moveTo(board, rowF, colF, rowD,colD) {
	if (board[rowD][colD] == 0) {
		//如果目标位置值 == 0 ，替换目标的值
		board[rowD][colD] = board[rowF][colF];
	} else {
		//否则是第二种情况，两个值相同，目标值与开始值相加
		board[rowD][colD] += board[rowF][colF];
	}
	board[rowF][colF] = 0; //清空开始位置的值
}