<script>
	export default {
	
		onLaunch: function () {
			var _this = this;
			
			var b = this.isLogin();
			if (b){
				this.reLogin();
			}else{
				this.toLogin();
			}

			console.log('App Launch');
			setInterval(() => {
				// console.log("aaaaaaaaaaaa")
				_this.reLogin();
			},1000 * 60 * 10);
		},
		onShow: function () {
			console.log('App Show')
		},
		onHide: function () {
			console.log('App Hide')
		}
	}
</script>

<style>
	@import './common/uni.css';
	/*每个页面公共css */
</style>
