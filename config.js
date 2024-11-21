//当前编译环境
const env = 'development';
//编译配置
const buildConfig = {
	//开发环境
	development: {
		baseUrl: "http://dev-appserver.unicoeye.com",
		matomoUrl: 'http://ga.dressin.com',
		matomoSiteid: 12
	},
	//生产环境
	production: {
		baseUrl: "https://appserver.unicoeye.com",
		matomoUrl: 'http://ga.dressin.com',
		matomoSiteid: 12
	}
}
var config = {
	buildConfig: buildConfig,
	env: env,
	//#ifdef H5
    url: '/apis',
	//#endif
	//#ifndef H5
	url: buildConfig[env]['baseUrl'],
	//#endif
	//#ifdef H5
	matomoUrl: '/matomoApis',
	//#endif
	//#ifndef H5
	matomoUrl: buildConfig[env]['matomoUrl'],
	//#endif
	matomoSiteid: buildConfig[env]['matomoSiteid'],
    subDomain: '',
    // 默认语言
    lang_code: 'en',
    // 默认货币
    currency_code: 'USD',
    //版本标识，这里不需要修改
    version: '1.0.0',
	version_code: '100',
	aesKey: '5ed0d723d06df9495c3d83d1a0368893',
	aesIv: '34e6b95426f2f528'
};
module.exports = config;
