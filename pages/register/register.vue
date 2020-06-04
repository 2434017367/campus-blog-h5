<template>
	<view class="page">
		<view class="form">
			
			<form @submit="" @reset="" style="display: flex; flex-direction: column; width: 100%; height: 100%; align-items: center;">
				<view class="uni-form-item uni-column">
					<view class="title">switch</view>
					<view>
						<switch name="switch" />
					</view>
				</view>
				<view style="display: flex; flex-direction: row; width: 330upx; justify-content: space-between;">
					<button style="width: 150upx; background-color: #007AFF;" form-type="submit">注册</button>
					<button  style="width: 150upx; background-color: #00B26A;" form-type="reset">重置</button>
				</view>
			</form>
			
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				
			}
		},
		methods: {
			
		}
	}
</script>

<style>
	.page{
		display: flex;
		flex-direction: row;
		height: 100%;
		width: 100%;
		justify-content: center;
	}
	
	.form{
		margin-top: 200upx;
		width: 600upx;
		height: 700upx;
		align-items: center;
		/* background-color: #00B26A; */
	}
</style>
