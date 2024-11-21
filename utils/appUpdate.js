// APP 提示更新hooks
import { getForceupdate } from "@/apis/index.js";

export default async function AppUpdate() {
  // 设备类型
  const platform = uni.getSystemInfoSync().platform;
  // 获取当前版本信息
  let appInfo = uni.getAppBaseInfo();
  try {
    // 获取服务器的更新信息
    const { data } = await getForceupdate({'appVersion':appInfo.appVersion,'appVersionCode':appInfo.appVersionCode,'platform':platform});
    const forceUpdate =data.force_update;
    const updateTips = data.update_tips;
    const title = data.title;
    const content = data.content;
    const android_download = data.android_download;
    const ios_download = data.ios_download;
    const currentTime = new Date().getTime(); 
    const lastPopupTime = uni.getStorageSync('appLastPopupTime');
    // 判断是否需要强制更新或显示更新提示
    if (forceUpdate == "1") {
      showUpdateModal(forceUpdate, title,content,android_download,ios_download,platform);
    } else if (forceUpdate == "0" && updateTips == "1") {
      const popDays = data.pop_rate;
      if(lastPopupTime){
        if (currentTime - lastPopupTime > popDays * 24 * 60 * 60 * 1000) {
          showUpdateModal(forceUpdate, title,content,android_download,ios_download,platform);
        }
      }else{
        showUpdateModal(forceUpdate, title,content,android_download,ios_download,platform);
      }
    }
  } catch (error) {
    console.error("Failed to check for updates:", error);
  }
}
// 通用弹窗
function showUpdateModal(forceUpdate, title,content,android_download,ios_download,platform) {
  let isForceUpdate = 0;
  if (forceUpdate == 1) {
    isForceUpdate = 1;
  }
  if(platform === "ios"){
    uni.navigateTo({
      url: `/pages/appupdatepupop/appupdatepupop?title=${encodeURIComponent(title)}&content=${encodeURIComponent(content)}&isForceUpdate=${isForceUpdate}&downloadLink=${encodeURIComponent(ios_download)}`
    });
  }else{
    uni.navigateTo({
      url: `/pages/appupdatepupop/appupdatepupop?title=${encodeURIComponent(title)}&content=${encodeURIComponent(content)}&isForceUpdate=${isForceUpdate}&downloadLink=${encodeURIComponent(android_download)}`
      });
  }
}
