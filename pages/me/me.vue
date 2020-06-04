<template>
	<view class="main" >
		<view class="header" @tap="toView('head_image?type=2')">
			<!-- <navigator url="head_image?type=2" > -->
				<!-- <view  class="header_image" @tap="toView('head_image?type=2')" > -->
					<image class="header_image" :src="user.backImage" style="width: 100%; height: 100%;"  @tap="toView('head_image?type=2')"></image>
				<!-- </view> -->
			<!-- </navigator> -->
			<view class="head" >
				<!-- <navigator url="head_image?type=1">	 -->
					<image class="head_icon" :src="user.headImage" @tap="toView('head_image?type=1')"></image>
				<!-- </navigator> -->
				<!-- <navigator url="username"> -->
					<text class="head_font" @tap="toView('username')">{{user.username}}</text>
				<!-- </navigator> -->
			</view>
		</view>
		<view class="body">
			<view class="body_line">
				<text class="body_line_text">学院：{{user.deptName}}</text>
			</view>
			<view class="body_line">
				<text class="body_line_text">学号：{{user.account}}</text>
			</view>
			<view class="body_line">
				<text class="body_line_text">姓名：{{user.name}}</text>
			</view>
			<navigator url="email" class="body_line">
				<text class="body_line_text">邮箱：{{user.email}}</text>
				<view class="body_line_icon">></view>
			</navigator>
			<navigator url="password" class="body_line">
				<text class="body_line_text">更改密码</text>
				<view class="body_line_icon">></view>
			</navigator>
			
			<navigator url="post" class="body_line" style="margin-top: 30upx;">
				<text class="body_line_text">我的帖子</text>
				<view class="body_line_icon">></view>
			</navigator>
			
			<view style="margin-top: 30upx; width: 100%;" class="body">
				<view class="body_line">
					<text class="body_line_text" @tap="logout">退出登录</text>
				</view>
				
				<navigator url="/pages/login/login?to=me" class="body_line">
					<text class="body_line_text">切换账号</text>
				</navigator>
			</view>
			
		</view>
	</view>
</template>

<script>
	var _this;
	// import ImageCropper from "@/components/invinbg-image-cropper/invinbg-image-cropper.vue";
	export default {
		data() {
			return {
				// isLogin: false,
				user:{
					
				}
			}
		},
		mounted() {
			_this = this;
		},
		// components:{
		// 	ImageCropper
		// },
		onLoad:function(){
			
		},
		onShow:function(){
			console.log("我的页面显示")
			var b = this.isLogin();
			if (b){
				// this.isLogin = true;
				this.user = this.getGlobalUser();
				console.log(this.user);
				
				var url = this.getSessionUrl("tb/tbuser/isLogin");
				
				uni.request({
					url: url,
					method: 'GET',
					data: {},
					success: res => {
						if(res.data.code != 0){
							_this.removeGlobalUser();
							uni.navigateTo({
								url:"/pages/login/login?to=me"
							});
						}
					},
					fail: () => {},
					complete: () => {}
				});
			}else{
				uni.navigateTo({
					url:"/pages/login/login?to=me"
				});
			}
		},
		methods: {
			toView(url){
				uni.navigateTo({
				    url: url
				});
			},
			
			updateEmail(){
				uni.navigateTo({
					url: 'email',
					success: res => {},
					fail: () => {},
					complete: () => {}
				});
			},
			
			logout(){
				var _this = this;
				var url = this.getSessionUrl("tb/tbuser/logout")
				
				uni.request({
					url: url,
					method: 'GET',
					success: res => {
						console.log(res);
						if (res.data.code == 0){
							_this.removeGlobalUser();
							uni.switchTab({
								url:"/pages/index/index"
							})
						}else{
							uni.showToast({
								icon: 'none',
								position: 'bottom',
								title: "退出登录失败"
							});
						}
					},
					fail: () => {},
					complete: () => {}
				});
			}
		}
	}
</script>

<style>
	@import url("css/me.css");
</style>
