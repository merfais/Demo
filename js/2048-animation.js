function showNumberWithAnimation(row, col, value) {
	var numberCell = $("#numberCell-" + row + "-" + col);
	numberCell.css({
		"background": getBackground(value),
		"color": getColor(value)
	}).text(value).animate({
		"width": "100px",
		"height": "100px",
		"opacity": 1,
		"top": getPositionTop(row),
		"left": getPositionLeft(col)
	}, 200, "swing");
}

function showMoveWithAnimation (rowF, colF, rowD, colD) {
	var numberCell = $("#numberCell-" + rowF + "-" + colF);
	numberCell.animate({
		"top": getPositionTop(rowD),
		"left": getPositionLeft(colD)
	}, 200, "swing");
}