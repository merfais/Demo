(function() {

	function addAniClass() {
		setTimeout(function() {
			$("#page-1 h2").addClass("title-ani");
			setTimeout(function() {
				$("#page-1 img").eq(1).addClass("img-ani");
				var arr = $("#page-1 .self-info p");
				$.each(arr, function(index, item) {
					setTimeout(function() {
						$(item).addClass("self-ani");
					}, 500 * index + 1000);
				});

			}, 1000);
		}, 0);

	}

	function addAni() {
		$("#page-1 h2").css({
			"transform": "translateX(100px)"
		})

	}

	function page1E() {
		$("#page-1").on("mouseover", "img", function(event) {
			$(this).css({
				"transform": "opacity .6s",
				"opacity": 0
			});
			console.log($(this));
		})
	}

	addAniClass();
	addAni();
	page1E();
	
	setTimeout(function() {
		$(".p3-box .title").addClass("anit");
	}, 1000);
	
})()