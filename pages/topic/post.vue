<template>
	<view id="moments">

		<view class="p-top">
			<image class="p-top-image" :src="topic.image"></image>
			<view class="p-top-v">{{topic.content}}</view>
		</view>

		<!-- <view style="height: 140upx;"></view> -->
		<view v-if="page.list.length == 0" class="kk">
			<text>空空如也</text>
		</view>
		<view v-else class="moments__post" v-for="(post,index) in page.list" :key="index" id="id" style="margin-top: 50upx;">
			<view class="post-left">
				<image class="post_header" :src="post.headImage"></image>
			</view>

			<view class="post_right">
				<text class="post-username">{{post.username}}</text>
				<view id="paragraph" class="paragraph">{{post.content}}</view>
				<!-- 相册 -->
				<view class="thumbnails" v-if="post.images.length > 0">
					<view :class="post.images.length == 1?'my-gallery':'thumbnail'" v-for="(image, index_images) in post.images" :key="index_images">
						<image class="gallery_img" lazy-load mode="aspectFill" :src="image" :data-src="image" @tap="previewImage(post.images,index_images)"></image>
					</view>
				</view>
				<!-- 资料条 -->
				<view class="toolbar">
					<view class="timestamp">{{post.createDate}}</view>
					<view class="like" @tap="like(index)">
						<image :src="!post.like ? '../../static/index/islike.png':'../../static/index/like.png'"></image>
					</view>
					<view class="comment" @tap="comment(index)">
						<image src="../../static/index/comment.png"></image>
					</view>
				</view>
				<!-- 赞／评论区 -->
				<view class="post-footer">
					<view class="footer_content" v-if="post.likeList.length > 0">
						<image class="liked" src="../../static/index/liked.png"></image>
						<text class="nickname" v-for="(user,index_like) in post.likeList" :key="index_like">{{user.username}}</text>
					</view>
					<view class="footer_content" v-for="(comment,comment_index) in post.commentList" :key="comment_index" @tap="reply(index,comment_index)">
						<view v-if="comment.replyUsername == null">
							<text  class="comment-nickname">{{comment.username}}: <text class="comment-content">{{comment.content}}</text></text>
						</view>
						<view v-else>
							<text  class="comment-nickname">{{comment.username}} 回复 {{comment.replyUsername}}: <text class="comment-content">{{comment.content}}</text></text>
						</view>
					</view>
				</view>
			</view>
			<!-- 结束 post -->
		</view>

		<view class="foot" v-show="showInput">
			<chat-input @send-message="send_comment" @blur="blur" :focus="focus" :placeholder="input_placeholder"></chat-input>
			<!-- <chat-input @send-message="send_comment" @blur="blur" :placeholder="input_placeholder"></chat-input> -->
		</view>
		<view class="uni-loadmore" v-if="showLoadMore">{{loadMoreText}}</view>
		
	</view>

</template>

<script>
	
	var _this;
	
	import chatInput from '../../components/im-chat/chatinput.vue'; //input框
	import postData from '../../common/index/index.post.data.js';//朋友圈数据
	
	import glbal from '../../common/global.js';
	
	export default {
		components: {
			chatInput,
		},
		data() {
			return {
				// posts: postData,//模拟数据
				// user_id: 4,
				// username: 'Liuxy',
			
				page:{
					list:[]
				},
				
				topic:{
				
				},

				index: '',
				comment_index: '',

				input_placeholder: '评论', //占位内容
				focus: false, //是否自动聚焦输入框
				is_reply: false, //回复还是评论
				showInput: false, //评论输入框

				screenHeight: '', //屏幕高度(系统)
				platform: '',
				windowHeight: '' ,//可用窗口高度(不计入软键盘)
				
				loadMoreText: "加载中...",
				showLoadMore: false,
				
				showDateSelect: false
			}
		},
		mounted() {
			_this= this;
			uni.getStorage({
				key: 'posts',
				success: function (res) {
					console.log(res.data);
					this.posts = res.data;
				}
			});

		},
		onLoad(e) {
			console.log(e);
			var id = e.id;
			uni.request({
				url: this.serverUrl + "tb/tbtopic/info/" + id,
				method: 'GET',
				data: {},
				success: res => {
					console.log(res);
					this.topic = res.data.data;
					uni.setNavigationBarTitle({
						title:this.topic.title
					});
				},
				fail: () => {},
				complete: () => {}
			});
			
			uni.getSystemInfo({ //获取设备信息
				success: (res) => {
					this.screenHeight = res.screenHeight;
					this.platform = res.platform;
				}
			});
			
			uni.startPullDownRefresh();
			
		},
		onShow() {
			uni.onWindowResize((res) => { //监听窗口尺寸变化,窗口尺寸不包括底部导航栏
				if(this.platform === 'ios'){
					this.windowHeight = res.size.windowHeight;
					this.adjust();
				}else{
					if (this.screenHeight - res.size.windowHeight > 60 && this.windowHeight <= res.size.windowHeight) {
						this.windowHeight = res.size.windowHeight;
						this.adjust();
					}
				}
			});
			
		},
		onHide() {
			uni.offWindowResize(); //取消监听窗口尺寸变化
		},
		onUnload() {
			this.max = 0,
				this.data = [],
				this.loadMoreText = "加载更多",
				this.showLoadMore = false;
		},
		onReachBottom() { //监听上拉触底事件
			console.log('onReachBottom');
			this.showLoadMore = true;
			setTimeout(() => {
				//获取数据
				if (this.page.currPage < this.page.totalPage){
					this.loadMoreText = "加载更多";
					this.page.currPage = this.page.currPage + 1;
					var url = _this.getSessionUrl("tb/tbpost/list");
					uni.request({
						url: url,
						method: 'GET',
						data: {
							page: this.page.currPage,
							topicId: this.topic.id
						},
						success: res => {
							console.log(res);
							if (res.data.code != 0){
								uni.showToast({
									title:"数据获取失败！",
									"icon": "none"
								})
							}else{
								var page = res.data.page;
								_this.page.currPage = page.currPage;
								_this.page.pageSize = page.pageSize;
								_this.page.totalCount = page.totalCount;
								_this.page.totalPage = page.totalPage;
								
								_this.page.list = _this.page.list.concat(page.list);
							}
						},
						fail: () => {
							uni.hideLoading();
									uni.showToast({
										icon:'none',
										title:"发布失败,请检查网络"
							})
						},
						complete: () => {}
					});
					
				}else{
					this.loadMoreText = "暂无更多";
				}
			}, 1000);
		},
		onPullDownRefresh() { //监听下拉刷新动作
			console.log('onPullDownRefresh');
			// 这里获取数据
			setTimeout(function() {
				var url = _this.getSessionUrl("tb/tbpost/list");
				//初始化数据
				uni.request({
					url: url,
					method: 'GET',
					data: {
						topicId: _this.topic.id
					},
					success: res => {
						console.log(res);
						if (res.data.code != 0){
							uni.showToast({
								title:"数据获取失败！",
								"icon": "none"
							})
						}else{
							_this.page = res.data.page;
						}
					},
					fail: () => {
						uni.hideLoading();
						uni.showToast({
							icon:'none',
							title:"发布失败,请检查网络"
						})
					},
					complete: () => {}
				});
				uni.stopPullDownRefresh(); //停止下拉刷新
			}, 1000);
		},
		onNavigationBarButtonTap(e) {//监听标题栏点击事件
			var b = this.isLogin();
			if(!b){
				this.toLogin("?to=index");
			}else{
				if (e.index == 0) {
					let data = {
						id: this.topic.id,
						title: ''
					};
					let url = this.getUrl('../publish/publish', data);
					console.log(url);
					this.navigateTo(url);
				}	
			}
			
		},
		computed:{
			
		},
		methods: {
			test(){
				this.navigateTo('../test/test');
			},
			navigateTo(url) {
				uni.navigateTo({
					url: url
				});
			},
			like(index) {
				console.log(index + " like");
				
				var b = this.isLogin();
				
				if(!b){
					this.toLogin("?to=index");
				}else{
					var like = this.page.list[index].like;
					console.log("like:" + like);
					var url;
					if(like){
						url = this.getSessionUrl("tb/tblike/cancelLike");
					}else{
						url = this.getSessionUrl("tb/tblike/like");
					}
					uni.request({
						url: url,
						method: 'GET',
						data: {
							postId: _this.page.list[index].id,
						},
						success: res => {
							console.log(res);
							if (res.data.code == 0){
								_this.page.list[index].like = !like;
								_this.page.list[index].likeList = res.data.likeList;
							}else{
								if (res.data.msg == "用户未登陆"){
									_this.removeGlobalUser();
									_this.toLogin();
								}else{
									uni.showToast({
										icon:"none",
										title:"失败"
									})
								}
								
							}
						},
						fail: () => {
							uni.hideLoading();
							uni.showToast({
								icon:'none',
								title:"发布失败,请检查网络"
							})
						},
						complete: () => {}
					});
				}
				
				// if (this.posts[index].islike === 0) {
				// 	this.posts[index].islike = 1;
				// 	this.posts[index].like.push({
				// 		"uid": this.user_id,
				// 		"username": "," + this.username
				// 	});
				// } else {
				// 	this.posts[index].islike = 0;
				// 	this.posts[index].like.splice(this.posts[index].like.indexOf({
				// 		"uid": this.user_id,
				// 		"username": "," + this.username
				// 	}), 1);
				// }
				
			},
			comment(index) {
				
				var b = this.isLogin();
				if(!b){
					this.toLogin();
				}else{
					var url = this.getSessionUrl("tb/tbuser/isLogin");
					uni.request({
						url: url,
						method: 'GET',
						data: {},
						success: res => {
							if (res.data.code == 0){
								_this.is_reply = false;
								_this.showInput = true; //调起input框
								_this.focus = true;
								_this.index = index;
							}else{
								_this.removeGlobalUser();
								_this.toLogin();
							}
						},
						fail: () => {},
						complete: () => {}
					});
				}
				
			},
			adjust() { //当弹出软键盘发生评论动作时,调整页面位置pageScrollTo
				return;
				uni.createSelectorQuery().selectViewport().scrollOffset(res => {
					var scrollTop = res.scrollTop;
					let view = uni.createSelectorQuery().select("#post-" + this.index);
					view.boundingClientRect(data => {
						console.log("data:" + JSON.stringify(data));
						console.log("手机屏幕高度:" + this.screenHeight);
						console.log("竖直滚动位置" + scrollTop);
						console.log("节点离页面顶部的距离为" + data.top);
						console.log("节点高度为" + data.height);
						console.log("窗口高度为" + this.windowHeight);

						uni.pageScrollTo({
							scrollTop: scrollTop - (this.windowHeight - (data.height + data.top + 45)), //一顿乱算
							// scrollTop: 50, 
							duration: 300
						});
					}).exec();
				}).exec();
			},
			reply(index, comment_index) {
				
				var b = this.isLogin();
				if(!b){
					this.toLogin();
				}else{
					var url = this.getSessionUrl("tb/tbuser/isLogin");
					uni.request({
						url: url,
						method: 'GET',
						data: {},
						success: res => {
							if (res.data.code == 0){
								_this.is_reply = true; //回复中
								_this.showInput = true; //调起input框
								// let replyTo = _this.posts[index].comments.comment[comment_index].username;
								let replyTo = _this.page.list[index].commentList[comment_index].username;
								_this.input_placeholder = '回复' + replyTo;
								_this.index = index; //post索引
								_this.comment_index = comment_index; //评论索引
								_this.focus = true;
							}else{
								_this.removeGlobalUser();
								_this.toLogin();
							}
						},
						fail: () => {},
						complete: () => {}
					});
				}
				
				
			},
			blur: function() {
				this.init_input();
			},
			send_comment: function(message) {
				
				console.log(message);
				
				var comment_content = message.content;
				
				var commentId = "";
							
				if(this.is_reply){
					commentId = this.page.list[this.index].commentList[this.comment_index].id;
					console.log(commentId);
				}
				
				var url = this.getSessionUrl("tb/tbcomment/comment");
				uni.request({
					url: url,
					method: 'POST',
					data: {
						postId: this.page.list[this.index].id,
						content: comment_content,
						commentId: commentId
					},
					success: res => {
						console.log(res);
						if (res.data.code == 0){
							_this.page.list[_this.index].commentList = res.data.commentList;
						}else{
							uni.showToast({
								icon:"none",
								title:"失败"
							})
						}
					},
					fail: () => {
						uni.hideLoading();
						uni.showToast({
							icon:'none',
							title:"发布失败,请检查网络"
						})
					},
					complete: () => {}
				});

				// if (this.is_reply) {
				// 	var reply_username = this.posts[this.index].comments.comment[this.comment_index].username;
				// 	var comment_content = '回复' + reply_username + ':' + message.content;
				// } else {
					
				// }
				// this.posts[this.index].comments.total += 1;
				// this.posts[this.index].comments.comment.push({
				// 	"uid": this.user_id,
				// 	"username": this.username,
				// 	"content": comment_content //直接获取input中的值
				// });
				this.init_input();
			},
			init_input() {
				this.showInput = false;
				this.focus = false;
				this.input_placeholder = '评论';
				this.is_reply = false;
			},
			previewImage(imageList, image_index) {
				var current = imageList[image_index];
				uni.previewImage({
					current: current,
					urls: imageList
				});
			},
			goPublish() {
				uni.navigateTo({
					url: './publish/publish',
					success: res => {},
					fail: () => {},
					complete: () => {}
				});
			}
		}
	}
</script>

<style scoped>
	@import url("../../common/index/index.css");
	
/* 	page{
		background-color: rgb(235, 235, 235);
	} */
	
	.kk{
		width: 100%; 
		height: 750upx; 
		display: flex; 
		flex-direction: column; 
		align-items: center; 
		justify-content: center;
		/* background-color: rgb(235, 235, 235); */
	}
	
	.p-top{
		width: 100%;
		height: 400upx; 
		position: relative;
		
	}
	
	.p-top-image{
		width: 100%;
		height: 400upx;
	}
	
	.p-top-v{
		width: 90%;
		background-color: #FFFFFF;
		border-radius: 30upx;
		min-height: 100upx;
		left: 5%;
		top: 120px;
		position: absolute;
		box-shadow: 0 1px 10px 0 rgba(0,0,0,.2);
		padding: 15upx;
	}
	
	.p-top-text{
		font-family: -apple-system,BlinkMacSystemFont,Helvetica Neue,PingFang SC,Microsoft YaHei,Source Han Sans SC,Noto Sans CJK SC,WenQuanYi Micro Hei,sans-serif;
		font-size: 24upx;
		color: #444;
	}
	
</style>
