layui.config({
	base: 'js/'
}).define(['element', 'layer', 'common'], function(exports) {
	"use strict";
	var $ = layui.jquery,
		layer = parent.layer === undefined ? layui.layer : parent.layer,
		element = layui.element(),
		common = layui.common;

	var Navbar = function() {
		/**
		 *  默认配置 
		 */
		this.config = {
			elem: undefined,
			data: undefined,
			href: undefined,
			type: 'GET'
		}
	};
	Navbar.prototype.render = function() {
		var _that = this;

		var _config = _that.config;

		if(typeof(_config.elem) !== 'string' && typeof(_config.elem) !== 'object') {
			common.throwError('Navbar error: elem参数未定义或设置出错，具体设置格式请参考文档API.');
		}
		var $container;
		if(typeof(_config.elem) === 'string') {
			$container = $(_config.elem);
		}
		if(typeof(_config.elem) === 'object') {
			$container = _config.elem;
		}
		if($container.length === 0) {
			common.throwError('Navbar error:找不到elem参数配置的容器，请检查.');
		}
		if(_config.data === undefined && _config.href === undefined) {
			common.throwError('Navbar error:请为Navbar配置数据源.')
		}
		if(_config.data !== undefined && typeof(_config.data) === 'object') {
			var html = getHtml(_config.data);
			$container.html(html);
			element.init();
		}
		//渲染nav
		/*$.getJSON('datas/nav.json', null, function(data) {
			var li = '';
			for(var i = 0; i < data.length; i++) {
				li += '<li class="layui-nav-item"><a href="javascript:;">' + data[i].title + '</a>'
				if(data[i].children !== undefined && data[i].children.length > 0) {
					li += '<dl class="layui-nav-child">'
					for(var j = 0; j < data[i].child.length; j++) {
						li += '<dd>' +
							'<a href="javascript:;" data-url="' + data[i].children[j].href + '">' +
							'<i class="fa ' + data[i].children[j].icon + '" aria-hidden="true"></i>' +
							'<cite>' + data[i].children[j].title + '</cite>' +
							'</a>' +
							'</dd>';
					}
					li += '</dl>';
				}
				li += '</li>';
			}
			$('#dynamic').html(li);
			element.init();
		});*/
	};
	/**
	 * 配置Navbar
	 * @param {Object} options
	 */
	Navbar.prototype.set = function(options) {
		var that = this;
		$.extend(true, that.config, options);
		return that;
	};

	function getHtml(data) {
		console.log(data.length);
		var ulHtml = '<ul class="layui-nav layui-nav-tree">';
		for(var i = 0; i < data.length; i++) {
			ulHtml += '<li class="layui-nav-item">';
			if(data[i].children !== undefined && data[i].children.length > 0) {
				ulHtml += '<a href="javascript:;">';
				if(data[i].icon !== undefined && data[i].icon !== '') {
					if(data[i].icon.indexOf('fa-') !== -1) {
						ulHtml += '<i class="fa ' + data[i].icon + '" aria-hidden="true"></i>';
					} else {
						ulHtml += '<i class="layui-icon">' + data[i].icon + '</i>';
					}
				}
				ulHtml += '<cite>' + data[i].title + '</cite>'
				ulHtml += '</a>';
				ulHtml += '<dl class="layui-nav-child">'
				for(var j = 0; j < data[i].children.length; j++) {
					ulHtml += '<dd>';
					ulHtml += '<a href="javascript:;" data-url="' + data[i].children[j].href + '">';
					if(data[i].children[j].icon !== undefined && data[i].children[j].icon !== '') {
						if(data[i].children[j].icon.indexOf('fa-') !== -1) {
							ulHtml += '<i class="fa ' + data[i].children[j].icon + '" aria-hidden="true"></i>';
						} else {
							ulHtml += '<i class="layui-icon">' + data[i].children[j].icon + '</i>';
						}
					}
					ulHtml += '<cite>' + data[i].children[j].title + '</cite>';
					ulHtml += '</a>';
					ulHtml += '</dd>';
				}
				ulHtml += '</dl>';
			} else {
				var dataUrl = (data[i].href !== undefined && data[i].href !== '') ? 'data-url="' + data[i].href + '"' : '';
				ulHtml += '<a href="javascript:;" ' + dataUrl + '>';
				if(data[i].icon !== undefined && data[i].icon !== '') {
					if(data[i].icon.indexOf('fa-') !== -1) {
						ulHtml += '<i class="fa ' + data[i].icon + '" aria-hidden="true"></i>';
					} else {
						ulHtml += '<i class="layui-icon">' + data[i].icon + '</i>';
					}
				}
				ulHtml += '<cite>' + data[i].title + '</cite>'
				ulHtml += '</a>';
			}
			ulHtml += '</li>';
		}
		ulHtml += '</ul>';

		return ulHtml;
	}

	var navbar = new Navbar();

	exports('navbar', function(options) {
		return navbar.set(options);
	});
});