/**
 * 用于管理百度地图 API 脚本
 *
 * @ngInject
 */
function ScriptLoaderFactory($q) {

  var mapApi = $q.defer();
  var callbackName = randomCallbackName();
  window[callbackName] = initialize;

  return load;

  function load(version, accessKey) {
    // load baidu map api
    var script = document.createElement('script');

    var baiduLoader = [
      'http://api.map.baidu.com/api?',
      'v=', version,
      '&ak=', accessKey,
      '&callback=', callbackName
    ].join('');

    console.log(baiduLoader);
    script.src = baiduLoader;
    document.body.appendChild(script);

    return mapApi.promise;
  }

  function initialize() {
    // console.log('api loaded');
    mapApi.resolve(BMap);
    delete window[callbackName];
  }
}

/**
 * 生成随机的 callback 方法名
 */
function randomCallbackName() {
  var name = '_callback' + (Math.random() + 1).toString(36).substring(2, 5);
  return name;
}

module.exports = ScriptLoaderFactory;
