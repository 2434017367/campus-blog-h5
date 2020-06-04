<template>
	<view >
		<view class="content">
			<!-- 主体 -->
			<view class="main">
				<view class="tips">更改昵称</view>
				<wInput
					v-model="username"
					type="text"
					maxlength="10"
					placeholder="昵称"
				></wInput>
				<wButton
					text="更改"
					:rotate="isRotate" 
					@click.native="startReUsername()"
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
				username: "",
				isRotate: false //是否加载旋转
			}
		},
		components:{
			wInput,
			wButton
		},
		methods: {
			startReUsername(){
				var _this = this;
				if(this.isRotate){
					//判断是否加载中，避免重复点击请求
					return false;
				}
				var msg = '';
				if (this.isNotEmpty(this.username)){
					if (this.username.length <= 10){
						var url = this.getSessionUrl("tb/tbuser/updateUsername");
						uni.request({
							url: url,
							method: 'POST',
							data: {
								username: this.username
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
									user.username = res.data.username;
									_this.setGlobalUser(user);
									
									uni.switchTab({
										url:"me"
									})
								}
							},
							fail: () => {},
							complete: () => {}
						});
					}else{
						msg = "昵称不能超过10个字符";
					}
				}else{
					msg = "昵称不能为空";
				}
				
				if (this.isNotEmpty(msg)){
					uni.showToast({
						icon: 'none',
						position: 'bottom',
						title: msg
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
