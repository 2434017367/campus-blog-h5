<template>
	<view class="main">
		<view class="header">
			<image :src="select && type == 2 ? cropFilePath : user.backImage"  @tap="upload(2)" class="header_image" ></image>
			<view class="head">
				<image class="head_icon" :src="select && type == 1 ? cropFilePath : user.headImage"  @tap="upload(1)"></image>
				<text class="head_font">{{user.username}}</text>
			</view>
		</view>
		<view class="btns" v-show="select">
			<button style="background: #09BB07;" @tap="cancelBtn()">取消</button>
			<button style="background: #007AFF;" @tap="confirmBtn()">确定</button>
		</view>
		<image-cropper  :src="tempFilePath" @confirm="confirm" @cancel="cancel" :crop-width="type == 1 ? 200 : 1000" ></image-cropper>
	</view>	
	
    <!-- <view>
        <button >上传</button>
        <image-cropper  :src="tempFilePath" @confirm="confirm" @cancel="cancel"></image-cropper>
        <image :src="cropFilePath" mode="aspectFit" style="width: 100%;"></image>
		<button></button>
    </view> -->
</template>

<script>
	import ImageCropper from "@/components/invinbg-image-cropper/invinbg-image-cropper.vue";
	import { pathToBase64, base64ToPath } from '@/js_sdk/gsq-image-tools/image-tools/index.js';
	export default {
	    data() {
	        return {
	            tempFilePath: '',
	            cropFilePath: '',
				select: false,
				type: 1, // 1:更改头像 2：更改背景图片
				user:{
					
				}
	        }
	    },
		onLoad:function(option){
			console.log("type:" + option.type);
			this.type = option.type;
			this.user = this.getGlobalUser();
		},
	    components: {ImageCropper},
	    methods: {
	        upload(type) {
				console.log("type:" + type);
				if (type == this.type){
					uni.chooseImage({
					    count: 1, //默认9
					    sizeType: ['original', 'compressed'], //可以指定是原图还是压缩图，默认二者都有
					    sourceType: ['album'], //从相册选择
					    success: (res) => {
							if(type === 2){
								var image = res.tempFilePaths.shift();
								
								this.uploadImage(image);
							}else{
								this.tempFilePath = res.tempFilePaths.shift();
							}
					        
					    }
					});
				}
	        },
			cancelBtn(){
				this.select = false;
			},
			confirmBtn(){
				var _this = this;
				this.uploadImage(this.cropFilePath);
			},
	        confirm(e) {
	            this.tempFilePath = ''
	            this.cropFilePath = e.detail.tempFilePath;
				this.select = true;
				
			
	        },
	        cancel() {
	            console.log('canceled')
	        },
			uploadImage(path){
				pathToBase64(path)
				  .then(base64 => {
				    console.log(base64);
					var url = this.getSessionUrl("tb/tbuser/updateHeadOrBackImage");
					uni.request({
						url: url,
						method: 'POST',
						data: {
							image: base64,
							type: this.type
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
								var user = this.getGlobalUser();
								if (res.data.type == 1){
									// 头像
									user.headImage = res.data.image;
								}else{
									// 背景
									user.backImage = res.data.image;
								}
								
								this.setGlobalUser(user);
								uni.switchTab({
									url:"me"
								})
							}
						},
						fail: () => {},
						complete: () => {}
					});
				  })
				  .catch(error => {
				    console.error(error);
				  })
			}
	    },
	}
</script>

<style>
	@import url("css/me.css");
	
	.btns{
		margin-top: 30upx;
		display: flex;
		flex-direction: row;
	}
	
	button{
		width: 300upx;
	}
</style>
