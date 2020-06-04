<template>
	<view class="main">
		<view v-for="(topic,index) in list" :key="index" id="id" style="margin-top: 20upx;">
			<view class="topic" @tap="toPost(index)" >
				<text class="topic_text">{{topic.title}}</text>
			</view>
		</view>
	</view>
</template>

<script>
	var _this;
	export default {
		data() {
			return {
				list:[
					
				]
			}
		},
		mounted() {
			_this = this;
		},
		onLoad(){
			uni.request({
				url: this.serverUrl + "tb/tbtopic/list",
				method: 'GET',
				data: {},
				success: res => {
					console.log(res);
					this.list = res.data.list;
				},
				fail: () => {},
				complete: () => {}
			});
		},
		methods: {
			toPost(index){
				let topic = this.list[index];
				console.log(topic);
				uni.navigateTo({
					url:"/pages/topic/post?id=" + topic.id
				})
			}
		}
	}
</script>

<style>
	page{
			height: 100%;
			width: 100%;
			background-color: rgb(246, 246, 246);
	}
	
	.main{
		height: 100%;
		width: 100%;
		display: flex;
		flex-direction: column;
	}
	
	.topic{
		width: 100%;
		/* height: 100upx; */
		display: flex;
		flex-direction: row;
		background-color: #FFFFFF;
		/* align-items: center; */
		padding: 0upx 30upx;
		border-bottom: 5upx solid rgb(246, 246, 246);
	}
	
	.topic_text{
		width: 100%;
		font-size: 40upx;
		font-style: italic;
		max-width: 60%;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
		/* text-decoration: underline; */
		/* color: #007AFF; */
	}
</style>
