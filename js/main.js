var username; //用户名
var passwd; //密码
// 推荐订单列表信息 用来替换的变量
var recommand_info = '<li class="ui-first-child ui-last-child" ><a href="#" class="ui-btn">\
				<p class="order_header"><span class="order_classify">[分类订单]</span><span class="order_title">\
				订单标题</span><span class="order_reward">订单赏金</span></p>\
				<div class="address_top"><h3>从哪里取货？</h3>\
				<p>取货联系人信息</p></div><div class="address_bottom">\
				<h3>要送到哪里？</h3><p>收货联系人信息</p></div>\
				<div class="order_footer"><p class="order_user">下单用户</p>\
				<button type="button" class=" ui-btn ui-shadow ui-corner-all">\
				接单</button></div></a></li>';
				
// 用户订单列表信息 用来替换的变量				
var user_order_info = '<li class="ui-first-child ui-last-child"><a href="#" class="ui-btn">\
						<p class="order_top">订单编号：<span  class="order_number">订单号</span>\
						<span class="order_statement">订单状态</span></p><p class="order_header">\
						<span class="order_classify">[分类订单]</span>  <span class="order_title">订单标题</span><span class="order_reward">订单赏金</span>\
						</p><div class="address_top"><h3>从哪里取货？</h3><p>取货联系人信息</p>\
						</div><div class="address_bottom"><h3>要送到哪里？</h3><p>收货联系人信息</p>\
						</div><p class="order_remarks">订单备注：<span>订单备注信息</span>\
						</p><div class="order_footer"><p class="order_user">下单用户</p>\
						<button type="button" class=" ui-btn ui-shadow ui-corner-all">确认送达</button>\
						</div></a></li>';
// 分类订单列表信息 用来替换的变量				
var classify_order_info = '<li style="margin-top: 3%;" class="ui-first-child ui-last-child">\
						<a href="#" style=" padding: 0 0; border-radius: 5%;" class="ui-btn">\
						<p class="order_header"><span class="order_classify">[分类订单]</span>  <span class="order_title">订单标题</span>\
						</p><div class="address_top" style="padding-left: 20%;"><h3>从哪里取货？</h3>\
						<p>取货联系人信息</p></div><div class="address_bottom" style="padding-left: 20%;">\
						<h3>要送到哪里？</h3><p>收货联系人信息</p></div>\
						<div class="order_footer" style="background-image: none; padding: 0 0 0 0; ">\
						<button type="button" style="width: 100%;" class=" ui-btn ui-shadow ui-corner-all">接单</button>\
						</div></a></li>';
// 保存每次遍历localStorage得到的用户信息
var user_info_arr = [];
// 保存每次遍历localStorage得到的订单信息
var order_info_arr = [];
// 用来判断分类订单中的订单列表是否能够显示 以便于拆分列表
var classify_order_juge = [];

$(function() {
	navChange();	//导航捆版页面切换
	loginExit(); //登录和退出登录
	get_user(); //获取用户信息
	clickToPage();	//判断登录状态 页面点击跳转 
	placeOrder();	// 下单页面信息填写
	setHideModal();	// 点击遮罩层隐藏模态框
	clickPlaceOrder();	// 点击提交下单页面信息
	add_recommand_order();	// 添加推荐订单信息
	pickUpOrder();	// 推荐订单的信息提交和修改以及分类订单的信息提交和修改
	clickOrderInfo();	// 点击通过模态框查看订单状态信息
	getUserOrder(); // 获取用户的订单信息
	jugeOrderList();//判断各订单列表是否为空 空则显示logo图片
	classifyUserOrder(); // 对用户订单进行分类
	takeApartClassfiy();  // 分隔分类导航订单列表 使其与导航对应
	finishOrder();	// 完成送单任务
});

//	导航捆版页面切换
function navChange() {
	changePage("#page>div", "#nav a"); //底部导航切换
	changePage("#main_content>div", "#main_nav a"); //主页导航切换
	changePage("#place_order_content>div", "#place_order a"); //主页下单导航切换
	changeImage("#main_img>img", "#spot span"); //主页轮播图切换
}

//封装好的导航链接页面切换函数
//page为页面div数组 nav为导航a数组
function changePage(page, nav) {
	$(page).hide();
	$(page).eq(0).show();
	for (let i = 0; i < $(nav).length; i++) {
		$(nav).eq(i).click(function() {
			$(page).hide();
			$(page).eq(i).show();
		})
	}
}

//	轮播图切换
function changeImage(page, nav) {
	var i = 0;
	$(page).hide();
	$(page).eq(i).show();
	$(nav).eq(i).css("background-color", "rgb(51, 136, 204)");
	setInterval(function() {
		i = (i + 1) % 4;
		$(page).hide();
		$(page).eq(i).show();
		$(nav).css("background-color", "#d5d5d5");
		$(nav).eq(i).css("background-color", "rgb(51, 136, 204)");
	}, 2000);
}

//	判断登录状态 登录为True 未登录False
function jugeLogin() {
	if (localStorage.getItem($("#info>p")[0].innerText)) {
		return true;
	}
	return false;
}

//	登录和退出登录
function loginExit() {
	$("#info").click(function() {
		if (!jugeLogin()) {
			window.location.href = "login.html";
		}
	});
	$("#cancel").click(function() {
		window.location.href = "main.html";
	});
}


//获取用户信息
function get_user() {
	var url = decodeURI(location.href);
	var getval = url.split('?')[1];
	$("#tool #cancel").eq(0).css("display", "none");	//退出登录按钮隐藏
	if (getval && getval.split('&').length >= 2) {
		var user = getval.split('&')[0].split('=')[1];
		var pwd = getval.split('&')[1].split('=')[1];
		var operate = getval.split('&')[2].split('=')[1];	//判断回到首页后停留在哪个页面
		var school = getval.split('school=')[1];	//判断学校
		if (JSON.parse(localStorage.getItem(user)).passwd == pwd) {	//判断用户名密码 防止绕过密码
			username = user;
			passwd = pwd;
			$("#tool #cancel").eq(0).css("display", "block");	// 显示退出登录按钮
			$("#tx img").attr("src", "img/tx.jpg");		//头像修改
			$("#info p")[0].innerText = user;	//用户名修改
			$("#money p")[1].innerText = returnFloat(JSON.parse(localStorage.getItem(user)).money);	//钱包数值修改
		}
		if (operate == "meBack") {
			$("#nav a").eq(3).click();
		} else if (operate == "homeBack") {
			$("#nav a").eq(0).click();
		}
		if (school) {
			$("#school")[0].innerText = school;
		}
	}
}

// 取两位小数 不四舍五入
function returnFloat(value) {
	value = value.toString();
	var num = value.split(".").length;
	if (num == 1) {
		value = value.toString() + ".00";
		return value;
	} else if (num == 2) {
		if (value.split(".")[1].length == 1) value = value.toString() + "0";
		else value = value.split(".")[0] + "." + value.split(".")[1].substring(0, 2);
		return value;
	}
}

//	页面点击跳转
function clickToPage() {
	orderClick();
	pageClick("#money_buy", "top_up.html");
	pageClick("#money_cash", "draw_cash.html");
	pageClick("#chat", "chat.html");
	pageClick("#school", "school.html");
}

//	判断登录状态后再跳转
function pageClick(but, link) {
	$(but).click(function() {
		if (jugeLogin()) {
			window.location.href = link + "?" + "username=" + username + "&password=" + passwd;
		} else {
			alert("请先登录！");
		}
	})
}

// 下单页面信息填写
function placeOrder() {
		var juge = 0;	//用来判断填写的是上面的信息还是下面的信息 因为提交按钮是一样的
		$(".delivery_header>p").click(function() {
			$(".modal>div").hide();
			$(".modal>div").eq(0).show();
			juge = 0;
			//让遮罩层先淡入
			$(".mask").fadeIn();
			//使用setTimeout来延时是防止，白框比遮罩层先淡入
			setTimeout(function() {
				$(".modal").animate({
					height: '370px',
				}, 300);
			}, 100);
			$(".pick_up>h2")[0].innerText = "取件信息";
			$(".address").attr("placeholder", "取件地址(请填写校内地址,例如:菜鸟驿站)");
		});


		$(".delivery_footer>p").click(function() {
			$(".modal>div").hide();
			$(".modal>div").eq(0).show();
			juge = 1;
			//让遮罩层先淡入
			$(".mask").fadeIn();
			//使用setTimeout来延时是防止，白框比遮罩层先淡入
			setTimeout(function() {
				$(".modal").animate({
					height: '370px',
				}, 300);
			}, 100);
			$(".pick_up>h2")[0].innerText = "收件信息";
			$(".address").attr("placeholder", "收件地址(请填写校内地址,例如:宁庐A栋5楼)");
		});

	$(".pick_up button").click(function() {
		var name = $(".name")[0].value;
		var phone = $(".phone")[0].value;
		var address = $(".address")[0].value;
		if (name && phone && address) {
			for (let i = 0; i < $(".delivery_header").length; i++) {
				if ($("#place_order_content>div")[i].style.display == "block") {
					if (juge) {
						$(".delivery_footer>h3")[i].innerText = address;
						$(".delivery_footer>p")[i].innerText = name + " " + phone;
					} else {
						$(".delivery_header>h3")[i].innerText = address;
						$(".delivery_header>p")[i].innerText = name + " " + phone;
					}
				}
			}
			$(".mask").click();
			$(".name").val("");
			$(".phone").val("");
			$(".address").val("");
		} else {
			alert("请将信息填写完整");
		}
	});
}

// 点击提交下单页面信息
function clickPlaceOrder() {
	for (let i = 0; i < $(".delivery_but").length; i++) {
		$(".delivery_but button").eq(i).click(function() {
			var arr = [0, 0, 0, 0, 0];
			var info1 = $(".delivery_input").eq(i).val();
			var info2 = $(".delivery_header>h3")[i].innerText;
			var info3 = $(".delivery_footer>h3")[i].innerText;
			var info4 = $(".delivery_header>p")[i].innerText;
			var info5 = $(".delivery_footer>p")[i].innerText;
			
			switch (i) {
				case 0:
					if (info1 && info2 != "从哪里取货？" && info3 != "要送到哪里？") {
						arr[0] = 1;
					}
					break;
				case 1:
					if (info1 && info2 != "在哪个食堂饭店打饭？" && info3 != "要送到哪里？") {
						arr[1] = 1;
					}
					break;
				case 2:
					if (info1 && info2 != "在哪个商店买东西？" && info3 != "要送到哪里？") {
						arr[2] = 1;
					}
					break;
				case 3:
					if (info1 && info2 != "在哪个图书馆借书？" && info3 != "要把书送到哪？") {
						arr[3] = 1;
					}
					break;
				case 4:
					if (info1 && info2 != "在哪里取书？" && info3 != "把书还在哪个图书馆？") {
						arr[4] = 1;
					}
					break;
			}
			if (jugeLogin()) {
				if (arr[i]) {
					window.location.href = "confirm_order.html?username=" + username + "&password=" + passwd +
						"&confirmCase=" + i + "&confirmInfo1=" + info1 + "&confirmInfo2=" + info2 +
						"&confirmInfo3=" + info3 + "&confirmInfo4=" + info4 + "&confirmInfo5=" + info5;
				} else {
					alert("请将信息填写完整");
				}
			} else {
				alert("请先登录");
			}
		})
	}
}

// 点击遮罩层隐藏模态框
function setHideModal() {
	$(".mask").click(function() {
		$(".modal").animate({
			height: '0px',
		}, 300);
		setTimeout(function() {
			$(".mask").fadeOut();
		}, 300);
	});
}

// 添加推荐订单信息
function add_recommand_order() {
	if(jugeLogin()){
		for (let i = 0; i < localStorage.length; i++) {
			var key = localStorage.key(i); //获取本地存储的Key
			var user_info = JSON.parse(localStorage.getItem(key));
			var order_list = user_info.orderlist;
			if(key != username){
				for (let j = 0; j < order_list.length; j++) {
					if(order_list[j].order_statement=="待接单"){
						classify_order_juge.push(true);
						user_info_arr.push(user_info);
						order_info_arr.push(order_list[j]);
						// 分别添加到首页推荐和分类订单列表中
						$("#recommand_order_list>ul").prepend(recommandTransform(order_list[j]));
						$("#classify_content>ul").prepend(classifyTransform(order_list[j]));
					}
				}
			}
		}
	}
}

// 通过正则表达式将localStorage数据替换列表相应数据
function recommandTransform(order_info){
	var temp_arr = [];
	temp_arr.push(order_info.order_classify,order_info.order_title,"￥"+order_info.reward,order_info.pick_up.pick_up_address,order_info.pick_up.pick_up_man+" "+order_info.pick_up.pick_up_phone,order_info.receive.receive_address,order_info.receive.receive_man+" "+order_info.receive.receive_phone,order_info.order_initiator);
	var order_reg = /(\w*)分类订单(.*)订单标题(.*)订单赏金(.*)从哪里取货？(.*)取货联系人信息(.*)要送到哪里？(.*)收货联系人信息(.*)下单用户(.*)/g;
	var str = "$1"+temp_arr[0]+"$2"+temp_arr[1]+"$3"+temp_arr[2]+"$4"+temp_arr[3]+"$5"+temp_arr[4]+"$6"+temp_arr[5]+"$7"+temp_arr[6]+"$8"+temp_arr[7]+"$9";
	return recommand_info.replace(order_reg,str);
}

// 推荐订单的信息提交和修改以及分类订单的信息提交和修改
function pickUpOrder(){
	for (let i = 0; i < $("#recommand_order_list>ul>li").length; i++) {
		$("#recommand_order_list>ul>li>a .order_footer>button").eq(i).click(function(e){
			e.stopPropagation();	//点击后停止冒泡
			if(jugeLogin()){
				for(let j=0; j<user_info_arr[i].orderlist.length; j++){
					if(user_info_arr[i].orderlist[j]==order_info_arr[i]){
						user_info_arr[i].orderlist[j].order_receiver = username;
						user_info_arr[i].orderlist[j].order_statement = "待送单";
						localStorage.setItem(user_info_arr[i].orderlist[j].order_initiator, JSON.stringify(user_info_arr[i]));
						
						alert("接单成功，请尽快送达");
						$("#order_list>ul").prepend(userTransform(user_info_arr[i].orderlist[j]));
						$("#recommand_order_list>ul>li").eq(i).hide();
						$("#order_page>div").eq(2).hide();
						classify_order_juge[i] = false;
					}
				}
			}
		});
	}
	
	for (let i = 0; i < $("#classify_content>ul>li").length; i++) {
		$("#classify_content>ul>li>a .order_footer>button").eq(i).click(function(e){
			e.stopPropagation();	//点击后停止冒泡
			if(jugeLogin()){
				for(let j=0; j<user_info_arr[i].orderlist.length; j++){
					if(user_info_arr[i].orderlist[j]==order_info_arr[i]){
						user_info_arr[i].orderlist[j].order_receiver = username;
						user_info_arr[i].orderlist[j].order_statement = "待送单";
						localStorage.setItem(user_info_arr[i].orderlist[j].order_initiator, JSON.stringify(user_info_arr[i]));
						alert("接单成功，请尽快送达");
						$("#order_list>ul").prepend(userTransform(user_info_arr[i].orderlist[j]));
						$("#classify_content>ul>li").eq(i).hide();
						$("#recommand_order_list>ul>li").eq(i).hide();
						classify_order_juge[i] = false;
					}
				}
			}
		});
	}
}

// 获取用户的订单信息 并判断分类订单和用户订单列表是否为空
function classifyTransform(order_info){
	var temp_arr = [];
	temp_arr.push(order_info.order_classify,order_info.order_title,order_info.pick_up.pick_up_address,order_info.pick_up.pick_up_man+" "+order_info.pick_up.pick_up_phone,order_info.receive.receive_address,order_info.receive.receive_man+" "+order_info.receive.receive_phone);
	var order_reg = /(\w*)分类订单(.*)订单标题(.*)从哪里取货？(.*)取货联系人信息(.*)要送到哪里？(.*)收货联系人信息(.*)/g;
	var str = "$1"+temp_arr[0]+"$2"+temp_arr[1]+"$3"+temp_arr[2]+"$4"+temp_arr[3]+"$5"+temp_arr[4]+"$6"+temp_arr[5] + "$7";
	return classify_order_info.replace(order_reg,str);
}

// 点击通过模态框查看订单状态信息
function clickOrderInfo(){
	
	for (let i = 0; i < $("#recommand_order_list>ul>li").length; i++) {
		$("#recommand_order_list>ul>li>a").eq(i).click(function(){
			
			if(jugeLogin()){
				$(".recommand_order_info_content>ul>li>p>span")[0].innerText = order_info_arr[i].order_number;
				$(".recommand_order_info_content>ul>li>p>span")[1].innerText = order_info_arr[i].pick_up_time;
				$(".recommand_order_info_content>ul>li>p>span")[2].innerText = order_info_arr[i].remarks;
				
				$(".modal>div").hide();
				$(".modal>div").eq(1).show();
				//让遮罩层先淡入
				$(".mask").fadeIn();
				//使用setTimeout来延时是防止，白框比遮罩层先淡入
				setTimeout(function() {
					$(".modal").animate({
						height: '320px',
					}, 300);
				}, 100);
				$(".recommand_order_info_content>button").click(function(){
					$(".mask").click();
				});
			}
			else{
				alert("请登录后再查看订单");
			}
		});
	}
}

// 获取用户的订单信息
function getUserOrder(){
	if(jugeLogin()){
		var order_list = JSON.parse(localStorage.getItem(username)).orderlist;
		for (let i = 0; i < localStorage.length; i++) {
			var key = localStorage.key(i); //获取本地存储的Key
			var user_info = JSON.parse(localStorage.getItem(key));
			var order_list = user_info.orderlist;
			for (let j = 0; j < order_list.length; j++) {
				if(order_list[j].order_initiator==username || order_list[j].order_receiver==username){
					$("#order_list>ul").prepend(userTransform(order_list[j]));
				}
			}
		}
	}
}

// 判断各订单列表是否为空 空则显示logo图片
function jugeOrderList(){
	if($("#order_list>ul>li").length){
		$("#order_page>div").eq(2).hide();
	}
	else{
		$("#order_page>div").eq(2).show();
	}
	if($("#classify_content>ul>li").length){
		$("#classify_content>span").eq(0).hide();
	}
	else{
		$("#classify_content>span").eq(0).show();
	}
	if($("#recommand_order_list>ul>li").length){
		$("#recommand_order_list>span").eq(0).hide();
	}
	else{
		$("#recommand_order_list>span").eq(0).show();
	}
}

// 对用户订单进行分类
function classifyUserOrder(){
	for (let i = 0; i < $("#order_list>ul>li").length; i++) {
		var statement = $("#order_list>ul>li>a .order_top .order_statement")[i].innerText;
		if(statement=="待接单" || statement=="已完成"){
			$("#order_list>ul>li>a .order_footer>button").eq(i).hide();
		}
		else if(statement=="待付款"){
			$("#order_list>ul>li>a .order_footer>button")[i].innerText = "确认付款";
		}
	}
	for (let i = 0; i < $("#order_nav>ul>li>a").length; i++) {
		$("#order_nav>ul>li>a").eq(i).click(function(){
			hideUserOrder(i);
		})
	}
}

function userTransform(order_info){
	var temp_arr = [];
	temp_arr.push(order_info.order_number,order_info.order_statement,order_info.order_classify,order_info.order_title,"￥"+order_info.reward,order_info.pick_up.pick_up_address,order_info.pick_up.pick_up_man+" "+order_info.pick_up.pick_up_phone,order_info.receive.receive_address,order_info.receive.receive_man+" "+order_info.receive.receive_phone,order_info.remarks,order_info.order_initiator);
	var order_reg = /(\w*)订单号(.*)订单状态(.*)分类订单(.*)订单标题(.*)订单赏金(.*)从哪里取货？(.*)取货联系人信息(.*)要送到哪里？(.*)收货联系人信息(.*)订单备注信息(.*)下单用户(.*)/g;
	var str = "$1"+temp_arr[0]+"$2"+temp_arr[1]+"$3"+temp_arr[2]+"$4"+temp_arr[3]+"$5"+temp_arr[4]+"$6"+temp_arr[5]+"$7"+temp_arr[6]+"$8"+temp_arr[7]+"$9"+ temp_arr[8]+"$10"+temp_arr[9]+"$11"+temp_arr[10]+"$12";
	return user_order_info.replace(order_reg,str);
}

// 隐藏相应的订单列表
function hideUserOrder(num){
	var arr = ["全部","待付款","待接单","待送单","已完成"];
	$("#order_list>ul>li").hide();
	if(num==0){
		$("#order_list>ul>li").show();
	}
	for (let i = 0; i < $("#order_list>ul>li").length; i++) {
		var statement = $("#order_list>ul>li>a .order_top .order_statement")[i].innerText;
		if(arr[num]==statement){
			$("#order_list>ul>li").eq(i).show();
		}
		if(statement==arr[2] || statement==arr[4]){
			$("#order_list>ul>li>a .order_footer>button").eq(i).hide();
		}
	}
}

// 分隔分类导航订单列表 使其与导航对应
function takeApartClassfiy(){
	for (let i = 0; i < $("#classify>ul>li>a").length; i++) {
		$("#classify>ul>li>a").eq(i).click(function(){
			var arr = ["全部","[代取送东西]","[食堂帮打饭]","[商店买东西]","[图书馆借书]","[图书馆还书]"];
			$("#classify_content>ul>li").hide();
			if(i==0){
				$("#classify_content>ul>li").show();
			}
			for (let j= 0; j < $("#classify_content>ul>li").length; j++) {
				var statement = $("#classify_content>ul>li>a .order_header .order_classify")[j].innerText;
				if(arr[i]==statement && classify_order_juge[j]){
					$("#classify_content>ul>li").eq(j).show();
				}
			}
		});
	}
}

// 完成送单任务
function finishOrder(){
	for (let i = 0; i < $("#order_list>ul>li>a").length; i++) {
		$("#order_list>ul>li>a .order_footer button").eq(i).click(function(){
			if($("#order_list>ul>li>a .order_top .order_statement")[i].innerText == "待送单"){
				var place_order_user = $("#order_list>ul>li>a .order_footer .order_user")[i].innerText;
				var place_order_user_info = JSON.parse(localStorage.getItem(place_order_user));
				var user_info = JSON.parse(localStorage.getItem(username));
				for (let j = 0; j < place_order_user_info.orderlist.length; j++) {
					if(place_order_user_info.orderlist[j].order_number==$("#order_list>ul>li>a .order_top .order_number")[i].innerText){
						user_info.money = user_info.money + Number(place_order_user_info.orderlist[j].reward);
						place_order_user_info.orderlist[j].order_statement = "已完成";
						localStorage.setItem(username, JSON.stringify(user_info));
						localStorage.setItem(place_order_user, JSON.stringify(place_order_user_info));
						alert("订单完成");
						$("#order_list>ul>li>a .order_top .order_statement")[i].innerText = "已完成";
						$("#order_nav>ul>li>a").eq(4).click();
						$("#money_num")[0].innerText = returnFloat(Number($("#money_num")[0].innerText)+Number(place_order_user_info.orderlist[j].reward));
					}
				}
				
			}
		});
	}
}

//	订单点击跳转
function orderClick() {
	$("#ord_all").click(function() {
		if (jugeLogin()) {
			$("#nav a").eq(2).click();
			$("#order_nav a").eq(0).click();
		} else {
			alert("请先登录！");
		}
	})
	for (let i = 0; i < $("#ord a").length; i++) {
		$("#ord a").eq(i).click(function() {
			if (jugeLogin()) {
				$("#nav a").eq(2).click();
				$("#order_nav a").eq(i + 1).click();
			} else {
				alert("请先登录!");
			}
		})
	}
}
