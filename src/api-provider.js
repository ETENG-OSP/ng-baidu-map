/**
 * 用于配置加载地图的方法
 */
function ApiProvider() {

  return {
    $get: $get,
    accessKey: accessKey,
    version: version,
    options: {
      version: '2.0'
    }
  };

  function accessKey(_accessKey) {
    this.options.accessKey = _accessKey;
    return this;
  }

  function version(_version) {
    this.options.version = _version;
    return this;
  }

  /**
   * @ngInject
   */
  function $get(baiduMapScriptLoader) {
    return baiduMapScriptLoader(this.options.version, this.options.accessKey);
  }
}

module.exports = ApiProvider;
