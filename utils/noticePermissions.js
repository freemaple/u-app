// Android/iOS设置手机通知权限hooks
export const setPermissionsInform = () => {
	// 第一次进入应用不弹自定义弹窗
	let is_nterception_notice = uni.getStorageSync('is_nterception_notice');
	if (!is_nterception_notice) {
		uni.setStorageSync('is_nterception_notice', true);
		return;
	}
	// 自定义弹窗时间
	// const sevenDaysInMilliseconds = 7 * 24 * 60 * 60 * 1000;
	// const lastPromptTime = uni.getStorageSync('permissionsLastPromptTime') || 0;
	// const currentTime = Date.now();

	// if (currentTime - lastPromptTime < sevenDaysInMilliseconds) {
	// 	return;
	// }
	// Android
	if (plus.os.name == 'Android') {
		const main = plus.android.runtimeMainActivity();
		const pkName = main.getPackageName();
		const uid = main.getApplicationInfo().plusGetAttribute('uid');
		let NotificationManagerCompat = plus.android.importClass(
			'android.support.v4.app.NotificationManagerCompat',
		);
		//android.support.v4升级为androidx
		if (NotificationManagerCompat == null) {
			NotificationManagerCompat = plus.android.importClass(
				'androidx.core.app.NotificationManagerCompat',
			);
		}
		const areNotificationsEnabled =
			NotificationManagerCompat.from(main).areNotificationsEnabled();
		// 未开通允许通知权限，则弹窗提醒开通，并点击确认后，跳转到系统设置页面进行设置
		if (!areNotificationsEnabled) {
			uni.showModal({
				title: 'Notification Permission Enable alerts',
				content: 'You have not enabled notification rights, can not receive message notifications, please go to Settings!',
				showCancel: true,
				confirmText: 'Go to Settings',
				cancelText: 'Set later',
				success: function (res) {
					if (res.confirm) {
						const Intent = plus.android.importClass(
							'android.content.Intent',
						);
						const Build = plus.android.importClass('android.os.Build');
						// android 13.0以上
						if (Build.VERSION.SDK_INT >= 33) {
							let intent;
							intent = new Intent('android.settings.APP_NOTIFICATION_SETTINGS');
							intent.putExtra('android.provider.extra.APP_PACKAGE', main.getPackageName());
							main.startActivity(intent); // 跳转到该应用的系统通知设置页
						} else if (Build.VERSION.SDK_INT >= 26) {
							//android 8.0
							const intent = new Intent(
								'android.settings.APP_NOTIFICATION_SETTINGS',
							);
							intent.putExtra('android.provider.extra.APP_PACKAGE', pkName);
							main.startActivity(intent);
						} else if (Build.VERSION.SDK_INT >= 21) {
							//android 5.0-7.0
							const intent = new Intent(
								'android.settings.APP_NOTIFICATION_SETTINGS',
							);
							intent.putExtra('app_package', pkName);
							intent.putExtra('app_uid', uid);
							main.startActivity(intent);
						}
					} else if (res.cancel) {
						uni.setStorageSync('permissionsLastPromptTime', currentTime);
					}
				},
			});
		}
	} else if (plus.os.name == 'iOS') {
		// iOS逻辑
		let isOn = undefined;
		let types = 0;
		const app = plus.ios.invoke('UIApplication', 'sharedApplication');
		const settings = plus.ios.invoke(app, 'currentUserNotificationSettings');
		if (settings) {
		  types = settings.plusGetAttribute('types');
		  plus.ios.deleteObject(settings);
		} else {
		  types = plus.ios.invoke(app, 'enabledRemoteNotificationTypes');
		}
		plus.ios.deleteObject(app);
		isOn = 0 != types;
		if (isOn == false) {
		  uni.showModal({
			title: 'Notification Permission Enable alerts',
			content: 'You have not enabled notification rights, can not receive message notifications, please go to Settings!',
			showCancel: true,
			confirmText: 'Go to Settings',
			cancelText: 'Set later',
			success: function (res) {
			  if (res.confirm) {
				const app = plus.ios.invoke('UIApplication', 'sharedApplication');
				const setting = plus.ios.invoke(
				  'NSURL',
				  'URLWithString:',
				  'app-settings:'
				);
				if (plus.ios.invoke(app, 'canOpenURL:', setting)) {
				  plus.ios.invoke(app, 'openURL:', setting);
				}
				plus.ios.deleteObject(setting);
				plus.ios.deleteObject(app);
			  } else if (res.cancel) {
				uni.setStorageSync('permissionsLastPromptTime', currentTime);
			  }
			}
		  });
		}
	  }
	// if (plus.os.name == 'iOS') {
	// 	// iOS逻辑
	// 	let isOn = undefined;
	// 	let types = 0;
	// 	const app = plus.ios.invoke('UIApplication', 'sharedApplication');
	// 	const settings = plus.ios.invoke(app, 'currentUserNotificationSettings');
	// 	if (settings) {
	// 		types = settings.plusGetAttribute('types');
	// 		plus.ios.deleteObject(settings);
	// 	} else {
	// 		types = plus.ios.invoke(app, 'enabledRemoteNotificationTypes');
	// 	}
	// 	plus.ios.deleteObject(app);
	// 	isOn = 0 != types;
	// 	if (isOn == false) {
	// 		uni.showModal({
	// 			title: 'Notification Permission Enable alerts',
	// 			content: 'You have not enabled notification rights, can not receive message notifications, please go to Settings!',
	// 			showCancel: true,
	// 			confirmText: 'Go to Settings',
	// 			cancelText: 'Set later',
	// 			success: function (res) {
	// 				if (res.confirm) {
	// 					const app = plus.ios.invoke('UIApplication', 'sharedApplication');
	// 					const setting = plus.ios.invoke(
	// 						'NSURL',
	// 						'URLWithString:',
	// 						'app-settings:',
	// 					);
	// 					plus.ios.invoke(app, 'openURL:', setting);
	// 					plus.ios.deleteObject(setting);
	// 					plus.ios.deleteObject(app);
	// 				} else if (res.cancel) {
	// 					uni.setStorageSync('permissionsLastPromptTime', currentTime);
	// 				}
	// 			},
	// 		});
	// 	}
	// }
};
