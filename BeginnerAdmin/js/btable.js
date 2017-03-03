/** BTable.js By Beginner Emain:zheng_jinfan@126.com HomePage:http://www.zhengjinfan.cn */
layui.define(['element', 'common', 'paging', 'form'], function(exports) {
	"use strict";
	var $ = layui.jquery,
		layerTips = parent.layer === undefined ? layui.layer : parent.layer,
		layer = layui.layer,
		element = layui.element(),
		common = layui.common,
		paging = layui.paging(),
		form = layui.form();

	var BTable = function() {
		/**
		 *  默认配置 
		 */
		this.config = {
			elem: undefined, //容器
			data: undefined, //数据源
			url: undefined, //数据源地址
			type: 'GET', //读取方式
			even: false, //是否开启偶数行背景
			skin: undefined, //风格样式 ，可选参数 line/row/nob
			width: '100%', //宽
			height: '100%', //高
			paged: false, //是否显示分页组件
			singleSelect: false, //是否只能选择一行
		};
		this.v = '1.0.0';
	};
	/**
	 * 配置BTable
	 * @param {Object} options
	 */
	BTable.prototype.set = function(options) {
		var that = this;
		$.extend(true, that.config, options);
		return that;
	};
	/**
	 * 渲染table
	 */
	BTable.prototype.render = function() {
		var that = this;
		var _config = that.config;

		var columns = _config.columns;
		var th = '';
		for(var i = 0; i < columns.length; i++) {
			th += '<th>' + columns[i].fieldName + '</th>';
		}
		if(_config.checkbox) {
			th = '<th style="width:28px;"><input type="checkbox" name="allselector" lay-skin="primary" /></th>' + th;
		}
		var tpl = '<div class="btable">';
		tpl += '<table class="layui-table layui-form">';
		tpl += '<thead><tr>' + th + '</tr></thead>';
		tpl += '<tbody class="btable-content"></tbody>';
		tpl += '</table>';
		if(_config.paged) {
			tpl += '<div data-type="paged" class="btable-paged"></div>';
		}
		tpl += '</div>';

		$(_config.elem).html(tpl);
		
		paging.init({
			url: _config.url, //地址
			elem: '.btable-content', //内容容器
			type: _config.type,
			tempType: 1,
			tempElem: getTpl({
				columns: _config.columns,
				checkbox: _config.checkbox
			}), //模块容器
			paged: _config.paged,
			pageConfig: { //分页参数配置
				elem: $(_config.elem).find('div[data-type=paged]'),//'#paged', //分页容器
				pageSize: 3 //分页大小
			},
			success: function() { //完成的回调
				//重新渲染复选框
				form.render('checkbox');
				form.on('checkbox(allselector)', function(data) {
					var elem = data.elem;

					$(_config.elem).children('tr').each(function() {
						var $that = $(this);
						//全选或反选
						$that.children('td').eq(0).children('input[type=checkbox]')[0].checked = elem.checked;
						form.render('checkbox');
					});
				});
			}
		});
		return that;
	};
	/**
	 * 获取选择的行。
	 */
	BTable.prototype.getSelected = function(callback) {
		var that = this;
		var _config = that.config;
		if(!_config.singleSelect)
			return callback(null);
		var $tbody=$(_config.elem).find('tbody.btable-content');
		$tbody.children('tr').each(function(){
			var $that = $(this);
			if($that.children('td:first-child').children('input')[0].checked){
				callback($that);
			}			
		});
	};
	/**
	 * 获取选择的所有行数据
	 */
	BTable.prototype.getSelections = function() {
		
	};

	/**
	 * 获取模板
	 * @param {Object} options
	 */
	function getTpl(options) {
		var columns = options.columns;

		var tpl = '{{# if(d.list.length>0 && d.list!=undefined){ }}';
		tpl += '{{# layui.each(d.list, function(index, item){ }}';
		var tds = '';
		for(var i = 0; i < columns.length; i++) {
			tds += '<td>{{ item.' + columns[i].field + ' }}</td>';
		}
		if(options.checkbox) {
			tds = '<td><input type="checkbox" data-id="{{ item.id }}" lay-skin="primary" /></td>' + tds;
		}else{
			tds = '<td style="display:none;"><input type="hidden" data-id="{{ item.id }}" name="id" /></td>' + tds;
		}
		tpl += '<tr>' + tds + '</tr>'
		tpl += '{{# }); }}';
		tpl += '{{# }else{ }}';
		var colLength = options.checkbox ? columns.length + 1 : columns.length;
		tpl += '<tr col="' + colLength + '">暂无数据.</tr>';
		tpl += '{{# } }}'
		return tpl;
	}

	var btable = new BTable();

	exports('btable', function(options) {
		return btable.set(options);
	});
});