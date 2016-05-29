
XHR = {
	Get: function() {
		//发送Ajax查询请求并处理
		var request;
		if (window.XMLHttpRequest) { // all modern browsers
			request = new XMLHttpRequest();
		} else if (window.ActiveXObject) { // for IE5, IE6
			request = new ActiveXObject("Microsoft.XMLHTTP");
		}
		request.open("GET", "./php/server.php?number=test");
		request.send();
		//根据onreadystatechange事件触发请求的回应
		request.onreadystatechange = function() {
			//如果readyState=4请求已应答，响应已结束，status=200 处理OK
			if (request.readyState == 4) {
				//status=200 处理OK
				if (request.status == 200) {
					//更新页面中的标签内容
					var data = request.responseText;
					//...
					//...
				} else {
					alert("发生错误" + request.status);
				}
			}
		}
	},
	Post: function() {
		//发送Ajax查询请求并处理
		var request;
		if (window.XMLHttpRequest) { // all modern browsers
			request = new XMLHttpRequest();
		} else if (window.ActiveXObject) { // for IE5, IE6
			request = new ActiveXObject("Microsoft.XMLHTTP");
		}
		request.open("POST", "./php/server.php");
		var params = "name=" + $("#staffName").val() +
			"&number=" + $("#staffNumber").val() +
			"&sex=" + $("#staffSex").val() +
			"&job=" + $("#staffJob").val();
		request.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
		request.send(params);
		//根据onreadystatechange事件触发请求的回应
		request.onreadystatechange = function() {
			//如果readyState=4请求已应答，响应已结束
			if (request.readyState == 4) {
				//status=200 处理OK
				if (request.status == 200) {
					//將responseText字符串解析成Json對象，
					var data = JSON.parse(request.responseText);
					//...
					//...
				} else {
					alert("发生错误" + request.status);
				}
			}
		}
	}
}

