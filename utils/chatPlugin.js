//  H5客服窗口hooks
export default {
	openTidioChat(serviceScriptUrl) {
		const scriptUrl = serviceScriptUrl;
		const openChat = () => {
			globalThis.JSY_PLUGIN_API.open({
				view: 'RegisterView' // 显示注册视图，可选参数
			});
		};
		const initializePlugin = () => {
			globalThis.addEventListener('jsy_plugin_ready', (evt) => {
				const jsy_plugin_api = evt.detail;
				globalThis.JSY_PLUGIN_API = jsy_plugin_api; // 赋值给全局变量，便于后续调用
				jsy_plugin_api.setOptions({
					closeButtonVisible: true,       // 显示右上角关闭按钮
					launcherButtonVisible: false,   // 隐藏默认启动按钮
					// email: email || '',           // 设置默认邮箱地址，设置默认值后会自动执行注册
				});

				// 检查是否有方法来监听关闭按钮事件
				const originalClose = jsy_plugin_api.close;
				jsy_plugin_api.close = () => {
					// handleClose();
					if (typeof originalClose === 'function') {
						originalClose();
					}
				};
				// 打开客服弹窗
				openChat();
			});
		};

		if (!globalThis.JSY_PLUGIN_API) {
			if (!document.querySelector(`script[src='${scriptUrl}']`)) {
				const script = document.createElement('script');
				script.src = scriptUrl;
				script.onload = initializePlugin;
				document.body.appendChild(script);
			} else {
				initializePlugin();
			}
		} else {
			// 如果脚本已经加载并初始化，直接打开客服弹窗
			openChat();
		}
	}
};
