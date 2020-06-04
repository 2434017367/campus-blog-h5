<template>
	<view >
		<view class="content">
			<!-- 主体 -->
			<view class="main">
				<view class="tips">更改密码</view>
				<wInput
					v-model="password"
					type="password"
					maxlength="12"
					placeholder="密码"
					isShowPass
				></wInput>
				<wInput
					v-model="newPassword"
					type="password"
					maxlength="12"
					placeholder="新密码"
					isShowPass
				></wInput>
				<wInput
					v-model="verNewPassword"
					type="password"
					maxlength="12"
					placeholder="确认密码"
					isShowPass
				></wInput>
				
				<wButton
					text="重置密码"
					:rotate="isRotate" 
					@click.native="startRePassword()"
				></wButton>
				
			</view>	
		</view>	
	</view>			
</template>

<script>
	import wInput from '../../components/watch-login/watch-input.vue' //input
	import wButton from '../../components/watch-login/watch-button.vue' //button
	export default {
		data() {
			return {
				password: "",
				newPassword: "",
				verNewPassword: "",
				isRotate: false //是否加载旋转
			}
		},
		components:{
			wInput,
			wButton
		},
		methods: {
			startRePassword(){
				var _this = this;
				if(this.isRotate){
					//判断是否加载中，避免重复点击请求
					return false;
				}
				
				var b = true;
				var errorMsg = "";
				
				var msg = this.passwordCheck(this.password);
				if (msg != "" && b){
					errorMsg = msg;
					b = false;
				}
				
				var user = this.getGlobalUser();
				if ((user.password != this.password) && b){
					errorMsg = "密码错误";
					b = false;
				}
				
				var reg = /^[0-9a-zA-Z]{6,12}$/;
				msg = this.checkStr(reg, this.newPassword, "新密码");
				console.log(this.newPassword);
				msg == "新密码格式不正确" ? "密码格式为数字字母6到12位字符" : msg;
				console.log(msg)
				if (msg != "" && b){
					errorMsg = msg;
					b = false;
				}
				
				if ((this.newPassword != this.verNewPassword) && b){
					errorMsg = "确认密码和新密码输入不一致";
					b = false;
				}
				
				if ((this.password == this.newPassword) && b){
					errorMsg = "新密码不能和旧密码一致";
					b = false;
				}
				
				if (b){
					var url = this.getSessionUrl("tb/tbuser/updatePassword");
					uni.request({
						url: url,
						method: 'POST',
						data: {
							password: this.password,
							newPassword: this.newPassword
						},
						success: res => {
							console.log(res);
							// var msg = "修改成功";
							if(res.data.code != 0){
								var msg = res.data.msg;
								uni.showToast({
									icon: 'none',
									position: 'bottom',
									title: msg
								});
							}else{
								var user = _this.getGlobalUser();
								user.password = res.data.password;
								_this.setGlobalUser(user);
								
								uni.switchTab({
									url:"me"
								})
							}
						},
						fail: () => {},
						complete: () => {}
					});
								
					_this.isRotate=true
					setTimeout(function(){
						_this.isRotate=false
					},3000);
				}else{
					uni.showToast({
					    icon: 'none',
						position: 'bottom',
					    title: errorMsg
					});
				}
				
			}
		}
	}
</script>

<style>
	@import url("../../components/watch-login/css/icon.css");
	@import url("../../components/watch-login/css/main.css");
</style>
