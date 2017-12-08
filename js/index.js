
;(function($) {
	$.fn.carousel = function(opts) {
		var len = this.length;
		if (len < 1 ) {
			throw new Error('没有找到匹配的对象！');
		} else if (len > 1){
			throw new Error('匹配的对象不能为多个！');
		}
		return new Carousel(this.get(), opts);
	};

function Carousel(ele, opts) {		//参数类型：selector-目标元素选择器，opt-包含一个图片信息数组的对象
	this.wrap = ele;
	this.options = $.extend({}, this.defaults, opts);  //复制对象
	this.init();	
}

Carousel.prototype = {
	defaults: {			//默认参数
		imgData: [],
		timeout: 3000,		//轮播器切换的间隔时间
		direction: true,	//轮播器的运动方向 true-正方向，false-反方向
		speed: 800			//过渡动画的时长
	},

	init: function() {		//初始化
		this.createNode();
		this.addEvent();
		this.showCurrentImg(0);	//初始状态跳转至第一张
		this.autoPlay();
	},

	createNode: function() {
		var _this = this;
		var oWrapper = $(this.wrap);
		var thisImgData = this.options.imgData;		//获取图片细心
		this.oImgUl = $('<ul></ul').addClass('slide_main');	//图片存放的ul
		this.dotUl = $('<ul></ul').addClass('slide_tab');	//指示器
		this.wrapWidth = oWrapper.width();		//获取容器宽度
		var oLi, oLink, oImg;

		oWrapper.addClass('slide_wrap');			//容器添加class

		$.each(thisImgData, function(index) {
			oImg = $('<img/>').attr({				//创建img
						src:thisImgData[index].src,
						alt:thisImgData[index].alt
					}).css('width', _this.wrapWidth);

			oLink = $('<a></a>').attr({				//创建a
					href:thisImgData[index].href,
					title:thisImgData[index].title
					});

			oLi = $('<li></li>');					//创建指示器

			oLink.append(oImg);						//添加DOM元素
			oLi.append(oLink);
			_this.oImgUl.append(oLi);
			_this.dotUl.append($('<li></li>'));
		});

		oWrapper.append(this.oImgUl).append(this.dotUl);	//添加页面
		this.oImgUl.first().clone(true).appendTo(this.oImgUl); //添加辅助图片

		var aLi = this.oImgUl.find('li');
		aLi.each(function(index) {
			$(this).css({					//定位图片
				position: 'absolute',
				left: index * _this.wrapWidth + 'px'
				});
		});
	
	},

	addEvent: function() {		//绑定事件
		var _this = this;	
		var aDot = this.dotUl.children();
		this.oImgUl.hover(function() {		//鼠标悬浮图片上暂停轮播器
				_this.paused();
			}, function() {
				_this.autoPlay();
			});
		aDot.each(function(index) {	//指示器事件
			$(this).hover(function() {
				_this.paused();
				_this.showCurrentImg(index);
			}, function() {
				_this.autoPlay();
			});
		});
	},

	showCurrentImg: function(index) {
		var _this = this;
	 	var len = this.dotUl.children().length;
	 	var oImg = this.oImgUl;

	 	this.cur = index;

 		if (this.cur > len) {		//当图片到最后一张的时候，将oImgUl的left值设为0重新开始
 			oImg.css('left', 0);
 			this.cur = 1;
 		} else if (this.cur == -1) {	//当图片到第一张的时候，将oImgUl的left值设为最后一张重新开始
 			oImg.css('left',-this.wrapWidth * len);
 			this.cur = len - 1;
 		}
	 	this.dotUl.find('li').eq(this.cur % len).addClass('active')	//当前图片指示器显示
	 		.siblings().removeClass('active');

	 	oImg.stop().animate({	//切换图片动画
	 		left: -_this.wrapWidth * _this.cur
	 	}, _this.options.speed);
	},

	autoPlay: function() {		//自动播放函数
		var _this = this;
		clearInterval(this.timer);
		this.timer = setInterval(function() {
			_this.showCurrentImg(_this.cur + 1);
		}, _this.options.timeout);
	},

	paused: function() {	//暂停函数
		clearInterval(this.timer);
	},

	go: function(n) {		//切换函数
		this.paused;
		this.showCurrentImg(this.cur + n);
		this.autoPlay();
	},
	reSize: function(newWidth) {
		var oImgarr = this.oImgUl;
		var _this = this
		clearInterval(this.timer);
		this.wrapWidth = newWidth;
		oImgarr.find('img').each(function() {
			$(this).css({
				width: newWidth,
			});
		});
		oImgarr.find('li').each(function(index) {
			$(this).css({
				left: index * newWidth,
			});
		});
		this.showCurrentImg(this.cur);
		this.autoPlay();
	}
};

})(jQuery);


$(document).ready(function() {
	var imgGroup = {
	imgData: [
		{title: '', alt:'', href: 'javascipt:void(0);', src: 'image/banner1.jpg'},
		{title: '', alt:'', href: 'javascipt:void(0);', src: 'image/banner2.jpg'},
		{title: '', alt:'', href: 'javascipt:void(0);', src: 'image/banner4.jpg'},
		{title: '', alt:'', href: 'javascipt:void(0);', src: 'image/banner5.jpg'},
		{title: '', alt:'', href: 'javascipt:void(0);', src: 'image/banner6.jpg'},
	],
	timeout: 2500,
	};
	
	
	var slider = $('.banner').carousel(imgGroup);
	$('.prev').eq(0).click(function() {
		slider.go(-1);
	});
	$('.next').eq(0).click(function() {
		slider.go(1);
	});
	$(window).resize(function() {
		slider.reSize($('.banner').width());
	});

});





