// APP通知权限检测函数
export default async function permissions() {
	var btnArray = ["Cancel", "Go to Settings"];
	if (plus.os.name === 'Android') {  // 判断是Android
		var main = plus.android.runtimeMainActivity();
		var pkName = main.getPackageName();
		var uid = main.getApplicationInfo().plusGetAttribute("uid");
		var NotificationManagerCompat = plus.android.importClass("android.support.v4.app.NotificationManagerCompat");
		var areNotificationsEnabled = NotificationManagerCompat.from(main).areNotificationsEnabled();
		// 未开通‘允许通知’权限，则弹窗提醒开通，并点击确认后，跳转到系统设置页面进行设置  
		if (!areNotificationsEnabled) {
			mui.confirm('You have not enabled notification rights and cannot receive message notifications. Do you want to go to Settings?', 'Notification Permission Enable alerts', btnArray, function (e) {
				if (e.index === 1) {
					var Intent = plus.android.importClass('android.content.Intent');
					var Build = plus.android.importClass("android.os.Build");
					// android 8.0 
					if (Build.VERSION.SDK_INT >= 26) {
						var intent = new Intent('android.settings.APP_NOTIFICATION_SETTINGS');
						intent.putExtra('android.provider.extra.APP_PACKAGE', pkName);
					} else if (Build.VERSION.SDK_INT >= 21) { // android 5.0-7.0  
						var intent = new Intent('android.settings.APP_NOTIFICATION_SETTINGS');
						intent.putExtra("app_package", pkName);
						intent.putExtra("app_uid", uid);
					} else { // (<21)其他--跳转到该应用管理的详情页  
						intent.setAction(Settings.ACTION_APPLICATION_DETAILS_SETTINGS);
						var uri = Uri.fromParts("package", main.getPackageName(), null);
						intent.setData(uri);
					}
					// 跳转到该应用的系统通知设置页  
					main.startActivity(intent);
				} else if (e.index === 0) {
					// 用户点击了 "Cancel"，设置标记，下次不再提醒
					uni.setStorageSync('notificationPermissionSkipped', true);
				}
			});
		}
	} else if (plus.os.name === 'iOS') {   // 判断是iOS
		var isOn = undefined;
		var types = 0;
		var app = plus.ios.invoke('UIApplication', 'sharedApplication');
		var settings = plus.ios.invoke(app, 'currentUserNotificationSettings');
		if (settings) {
			types = settings.plusGetAttribute('types');
			plus.ios.deleteObject(settings);
		} else {
			types = plus.ios.invoke(app, 'enabledRemoteNotificationTypes');
		}
		plus.ios.deleteObject(app);
		isOn = (0 !== types);
		if (isOn === false) {
			mui.confirm('You have not enabled notification rights and cannot receive message notifications. Do you want to go to Settings?', 'Notification Permission Enable alerts', btnArray, function (e) {
				if (e.index === 1) {
					var app = plus.ios.invoke('UIApplication', 'sharedApplication');
					var setting = plus.ios.invoke('NSURL', 'URLWithString:', 'app-settings:');
					plus.ios.invoke(app, 'openURL:', setting);
					plus.ios.deleteObject(setting);
					plus.ios.deleteObject(app);
				} else if (e.index === 0) {
					// 用户点击了 "Cancel"，设置标志，下次不再提醒
					uni.setStorageSync('notificationPermissionSkipped', true);
				}
			});
		}
	}
}