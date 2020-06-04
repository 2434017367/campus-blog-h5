import Vue from 'vue'
import App from './App'

Vue.config.productionTip = false

Vue.prototype.serverUrl = "http://192.168.43.119:8081/renren-api/";			// 开发环境
// Vue.prototype.serverUrl = "http://127.0.0.1:8081/renren-api/";

App.mpType = 'app';


Vue.prototype.getSessionUrl = function(url){
	var userInfo = this.getGlobalUser();
	if (this.isEmpty(userInfo)){
		return this.serverUrl + url;
	}else{
		var sessionId = userInfo.sessionId;
		return this.serverUrl + url + ";jsessionid=" + sessionId;
	}
	
}

Vue.prototype.getGlobalUser = function() {
	var userInfo = uni.getStorageSync("globalUser");
	if (userInfo != null && userInfo != "" && userInfo != undefined) {
		return userInfo;
	} else {
		return null;
	}
}

Vue.prototype.setGlobalUser = function(user) {
	uni.setStorageSync("globalUser", user);
}

Vue.prototype.removeGlobalUser = function(){
	uni.removeStorageSync("globalUser");
}

Vue.prototype.reLogin = function() {
	var _this = this;
	var user = this.getGlobalUser();
	// if (user != null){
	// 	uni.request({
	// 		url: this.serverUrl + "tb/tbuser/login",
	// 		method: 'POST',
	// 		data: {
	// 			account: user.account,
	// 			password: user.password,
	// 			type: 0
	// 		},
	// 		success: res => {
	// 			console.log("更新用户信息:" + res.data.user);
	// 			// 将登录用户信息保存在缓存中
	// 			uni.setStorageSync("globalUser", res.data.user);
	// 		},
	// 		fail: () => {},
	// 		complete: () => {}
	// 	});
	// }	
	var url = this.getSessionUrl("tb/tbuser/isLogin");
	uni.request({
		url: url,
		method: 'GET',
		data: {},
		success: res => {
			console.log(res);
			var data = res.data;
			console.log(data)
			if (data.code != 0){
				if (user != null){
					uni.request({
						url: _this.serverUrl + "tb/tbuser/login",
						method: 'POST',
						data: {
							account: user.account,
							password: user.password,
							type: 0
						},
						success: res => {
							console.log("更新用户信息:" + res.data.user);
							// 将登录用户信息保存在缓存中
							uni.setStorageSync("globalUser", res.data.user);
						},
						fail: () => {},
						complete: () => {}
					});
				}else{
					console.log("登录还未过期")
				}
			}
		},
		fail: () => {},
		complete: () => {}
	});
	
}


// Vue.prototype.login = function() {
// 	var userInfo = this.getGlobalUser();
// 	uni.request({
// 		url: this.serverUrl + "tb/tbuser/login",
// 		method: 'POST',
// 		data: {
// 			account: userInfo.account,
// 			password: userInfo.password
// 		},
// 		success: res => {},
// 		fail: () => {},
// 		complete: () => {}
// 	});
// }


Vue.prototype.isNotEmpty = function(value){
	return !this.isEmpty(value);
}

Vue.prototype.isEmpty = function(value){
	if (value != null && value != "" && value != undefined) {
		return false;
	}else{
		return true;
	}
}

Vue.prototype.notLoginToLogin = function(){
	var b = this.isLogin();
	if(!b){
		this.toLogin();
	}
}

Vue.prototype.isLogin = function(){
	// var userInfo = this.getGlobalUser();
	// if (this.isNotEmpty(userInfo)) {
	// 	return true;
	// } else {
	// 	return false;
	// }
	var url = this.getSessionUrl("tb/tbuser/isLogin");
	console.log("url: " + url)
	if (url.indexOf("jsessionid") > 0){
		// 包含jsessionid说明有缓存
		// uni.request({
		// 	url:url
		// }).then(data => {
		// 	var [error, res] = data;
		// 	console.log(res.data);
		// 	if (res.data.code == 0){
		// 		return true;
		// 	}else{
		// 		return false;
		// 	}
		// });
		
		// var [error, res] = uni.request({
		// 	url: url
		// });
		
		// if (res.data.code == 0){
		// 	return true;
		// }else{
		// 	return false;
		// }
		
		return true;
		
	}else{
		return false;
	}
}

// function async request () {
//     var [error, res] = await uni.request({
//         url: 'https://www.example.com/request'
//     });
//     console.log(res.data);
// }

Vue.prototype.toLogin = function(suffix){
	console.log(suffix);
	if (this.isEmpty(suffix)){
		suffix = "";
	}
	uni.showModal({
		title: '提示',
		content: '你还未登录，快去登陆吧',
		showCancel: true,
		cancelText: '取消',
		confirmText: '登陆',
		success: res => {
			if(res.confirm){
				console.log("login")
				uni.navigateTo({
					url: '/pages/login/login' + suffix,
					success: res => {
						console.log("跳转到登陆页");
					},
					fail: () => {
						console.log("页面跳转失败");
					},
					complete: () => {}
				});
			}
		},
		fail: () => {},
		complete: () => {}
	});
}


Vue.prototype.emailCheck = function(email){
	var reg = /^\w+((.\w+)|(-\w+))@[A-Za-z0-9]+((.|-)[A-Za-z0-9]+).[A-Za-z0-9]+$/; //正则表达式
	// if(email == ""){
	// 	return "邮箱不能为空";
	// }else if(!reg.test(email)){
	// 	return "邮箱格式不正";
	// }else{
	// 	return "";
	// }
	return this.checkStr(reg, email, "邮箱");
}

Vue.prototype.accountCheck = function(account){
	var reg = /^20[0-9]{8}$/;
	return this.checkStr(reg, account, "学号");
}

Vue.prototype.passwordCheck = function(password){
	var reg = /^[0-9a-zA-Z]{6,12}$/;
	var msg = this.checkStr(reg, password, "密码");
	return msg == "密码格式不正确" ? "密码格式为数字字母6到12位字符" : msg;
}

Vue.prototype.verCodeCheck = function(verCode){
	var reg = /^[0-9]{6}$/;
	return this.checkStr(reg, verCode, "验证码");
}

Vue.prototype.nameCheck = function(name){
	var reg = /^[\u4E00-\u9FA5]{2,4}$/;
	return this.checkStr(reg, name, "姓名");
}

Vue.prototype.checkStr = function(reg, str, msg){
	console.log("str:" + str);
	if(this.isEmpty(str)){
		return msg + "不能为空";
	}else if(!reg.test(str)){
		return msg + "格式不正确";
	}else{
		return "";
	}
}


Vue.prototype.getUrl = function(url, data){
	console.log(url);
	console.log(data);
	
	var param = "";
	for (var d in data){
		if (this.isEmpty(data[d])){
			continue;
		}
		param = param + "&" + d + "=" + data[d];
	}
	console.log(param);
	if(this.isEmpty(param)){
		return url;
	}else{
		param = "?" + param.substring(1, param.length);
		url += param;
		console.log(url);
		return url;
	}
}


const app = new Vue({
    ...App
})
app.$mount()
