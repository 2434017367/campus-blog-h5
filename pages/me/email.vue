<template>
	<view >
		<view class="content">
			<!-- 主体 -->
			<view class="main">
				<view class="tips">更改邮箱</view>
				<wInput
					v-model="email"
					type="text"
					maxlength="30"
					placeholder="新的邮箱"
				></wInput>
				<wInput
					v-model="verCode"
					type="number"
					maxlength="6"
					placeholder="验证码"
					isShowCode
					ref="runCode"
					@setCode="getVerCode()"
				></wInput>
				
				<wButton
					text="重置邮箱"
					:rotate="isRotate" 
					@click.native="startReEmail()"
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
				email: "",
				verCode: "",
				isRotate: false //是否加载旋转
			}
		},
		components:{
			wInput,
			wButton
		},
		methods: {
			getVerCode(){
				var _this = this;
				var msg = this.emailCheck(this.email);
				if(msg != ""){
					uni.showToast({
					    icon: 'none',
						position: 'bottom',
					    title: msg
					});
					return isEmail;
				}else{
					console.log("获取验证码");
					this.$refs.runCode.$emit('runCode'); //触发倒计时（一般用于请求成功验证码后调用）
			
					uni.request({
						url: this.serverUrl + "tb/tbuser/sendVerCode",
						method: 'GET',
						data: {"email": this.email},
						success: res => {
							console.log(res);
							if(res.data.code != 0){
								_this.$refs.runCode.$emit('runCode',0);
								uni.showToast({
								    icon: 'none',
									position: 'bottom',
								    title: res.data.msg
								});
							}
							
						},
						fail: () => {},
						complete: () => {
							setTimeout(function(){
								_this.$refs.runCode.$emit('runCode',0); //假装模拟下需要 终止倒计时
							
							},1000 * 60)
						}
					});
					
				}
				
			},
			startReEmail(){
				var _this = this;
				if(this.isRotate){
					//判断是否加载中，避免重复点击请求
					return false;
				}
				
				var b = true;
				var errorMsg = "";
				
				var msg = this.emailCheck(this.email);
				if (msg != "" && b){
					errorMsg = msg;
					b = false;
				}
				
				msg = this.verCodeCheck(this.verCode);
				if (msg != "" && b){
					errorMsg = msg;
					b = false;
				}
				
				var user = this.getGlobalUser();
				var emailInfo = user.email;
				if (this.email == emailInfo){
					errorMsg = "新的邮箱不能可之前的一样";
					b = false;
				}
				
				if (b){
					var url = this.getSessionUrl("tb/tbuser/updateEmail");
					uni.request({
						url: url,
						method: 'POST',
						data: {
							email: this.email,
							verCode: this.verCode
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
								user.email = res.data.email;
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
