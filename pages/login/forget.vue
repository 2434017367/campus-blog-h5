<template>
	<view class="forget">
		
		<view class="content">
			<!-- 主体 -->
			<view class="main">
				<view class="tips">若你忘记了密码，可在此重置新密码。</view>
				<wInput
					v-model="account"
					type="text"
					maxlength="10"
					placeholder="请输入学号"
				></wInput>
				<wInput
					v-model="name"
					type="text"
					maxlength="4"
					placeholder="姓名"
				></wInput>
				<wInput
					v-model="password"
					type="password"
					maxlength="12"
					placeholder="请输入新密码"
					isShowPass
				></wInput>
				
				<wInput
					v-model="verPassword"
					type="password"
					maxlength="12"
					placeholder="确认密码"
					isShowPass
				></wInput>
				
				<wInput
					v-model="email"
					type="text"
					maxlength="30"
					placeholder="邮箱"
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
				
			</view>
			
			<wButton 
				text="重置密码"
				:rotate="isRotate" 
				@click.native="startRePass()"
			></wButton>
			
			<!-- 底部信息 -->
			<view class="footer">
				<navigator url="login" open-type="navigate">登录</navigator>
				<text>|</text>
				<navigator url="register" open-type="navigate">注册账号</navigator>
			</view>

		</view>
	</view>
</template>

<script>
	var _this;
	import wInput from '../../components/watch-login/watch-input.vue' //input
	import wButton from '../../components/watch-login/watch-button.vue' //button
	export default {
		data() {
			return {
				account: "", //学号
				password: "", //密码
				verPassword: "",
				name: "",
				verCode:"", //验证码
				isRotate: false, //是否加载旋转
			}
		},
		components:{
			wInput,
			wButton
		},
		mounted() {
			_this= this;
		},
		methods: {
			getVerCode(){
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
			startRePass() {
				//重置密码
				if(this.isRotate){
					//判断是否加载中，避免重复点击请求
					return false;
				}
				
				
				var b = true;
				var errorMsg = "";
							
				var msg = this.accountCheck(this.account);
				if (msg != ""){
					errorMsg = msg;
					b = false;
				}
				
				msg = this.nameCheck(this.name);
				if (msg != "" && b){
					errorMsg = msg;
					b = false;
				}
				
			    msg = this.passwordCheck(this.password);
			    if (msg != "" && b){
			    	errorMsg = msg;
			    	b = false;
			    }
			    
			    if ((this.password != this.verPassword) && b){
			    	errorMsg = "确认密码和密码输入不一致";
			    	b = false;
			    }
			    
			    msg = this.emailCheck(this.email);
			    if (msg != "" && b){
			    	errorMsg = msg;
			    	b = false;
			    }
			    
			    msg = this.verCodeCheck(this.verCode);
			    if (msg != "" && b){
			    	errorMsg = msg;
			    	b = false;
			    }
				
				if (b){
					uni.request({
						url: this.serverUrl + "tb/tbuser/retrievePassword",
						method: 'POST',
						data: {
							account: this.account,
							name: this.name,
							password: this.password,
							email: this.email,
							verCode: this.verCode
						},
						success: res => {
							console.log(res);
							var msg = "修改成功";
							if(res.data.code != 0){
								msg = res.data.msg;
							}
							uni.showToast({
								icon: 'none',
								position: 'bottom',
								title: msg
							});
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

