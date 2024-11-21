<template>
	<!-- 分享弹窗 -->
	<uni-popup ref="popupFissionShare" class="share-popup" @change="(e)=>{$emit('changePageMeta',e.show)}">
		<popupContentTemplate :is_show_header_border="true" :title="title" @close="$refs.popupFissionShare.close()">
			<template v-slot:content>
				<shareBar :key_prefix="key_prefix" @clickBarItem="(type)=>{$emit('clickBarItem',type)}" :isDifferPlatformWord="isDifferPlatformWord" :shareData="shareData"></shareBar>
			</template>
		</popupContentTemplate>
	</uni-popup>
</template>

<script>
	import shareBar from '@/components/shareBar/shareBar.vue'
	export default {
		name:"sharePopup",
		components: {
			shareBar
		},
		props: {
			title: {
				type: String,
				default: ''
			},
			key_prefix: {
				type:String,
				default: 'distribute_share_'
			},
			isDifferPlatformWord: {
				type: Boolean,
				default:false
			},
			shareData: {
			    type: Object,
			    default: ()=> {
			    	return {}
			    }
			},
		},
		data() {
			return {
				
			};
		},
		methods: {
			open() {
				this.$refs.popupFissionShare.open('bottom');
			},
			close() {
				this.$refs.popupFissionShare.close();
			}
		}
	}
</script>

<style>

</style>