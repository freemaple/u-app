<template>
    <view class="container">
        <web-view ref="webview" :src="webviewSrc" allow :fullscreen="false" :webview-styles="webviewStyles"
            :frameBorder="0" @message="handleMessage"
            style="top:calc(50%-32.5px);background-color: rgba(0, 0, 0, 0) !important;">
        </web-view>
    </view>
</template>
<script>
import config from '../../config.js'
export default {
    name: "CodeView",
    props: {
        cf_code_params: {
            type: String,
            default: '',
        },
		type: {
			type: String,
			default: ''
		},
  		// 需要埋点的数据
		trackData: {
			type: Object,
			default: () => ({
				type: "",
				data: {}
			})
		}
    },
    data() {
        return {
            codeBaseUrl: config.url,
            wv: null,
            webviewStyles: {
                progress: {
                    color: "#3e3adc",
                },
                width: '330px',
                height: "65px",
                margin: "auto",
            },
        };
    },
    computed: {
        webviewSrc() {
            // #ifdef H5
            const url = window.location.origin
            return `${url}${this.codeBaseUrl}/turnstile/index.html?cf_code_params=${this.cf_code_params}&type=${this.type}`;
            // #endif
            // #ifdef APP-PLUS 
            return `${this.codeBaseUrl}/turnstile/index.html?cf_code_params=${this.cf_code_params}&type=${this.type}`;
            // #endif
        }
    },
    methods: {
        // 接收h5页面发来的键值判断需要执行的操作
        handleMessage(event) {
			const code = event.detail.data[0].action
            // 判断 action 值是否为 1
            if (code == 1) {
                setTimeout(() => {
                    this.$emit("update:actionData", event.detail.data[0]);
                }, 200);
            } else if (code == 2) {
				// 埋点上报数据
				const trackDataArr = Object.keys(this.trackData.data)
				if (trackDataArr.length) {
				  this.$apis.turnstileTrack(
					{
						type: this.trackData.type,
						...this.trackData.data
					}
				  ).then((res)=> {
					  console.log('track success!', res)
				  })
				}
			}
            uni.getSystemInfo({
                success: (res) => {
                    this.webviewStyles.height = `${res.screenHeight -
                        res.statusBarHeight -
                        res.safeAreaInsets?.bottom -
                        100
                        }px`;
                    this.webviewStyles.bottom = `${res.safeAreaInsets?.bottom + 56}px`;
                },
            });
            try {
                const data = JSON.parse(event.detail.data);
                switch (data.type) {
                    case "error":
                        this.$emit("error", data.code);
                        break;
                    default:
                        console.warn("未处理的消息类型:", data.type);
                        break;
                }
            } catch (error) {
                console.error("解析消息失败:", error);
            }
        }
    },
};
</script>

<style scoped>
.container {
    background-color: transparent;
}
</style>