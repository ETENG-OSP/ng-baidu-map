/*
 * 用于配置加载地图的方法
 */
function baiduMapApiProvider() {

  this.$get = $get;
  this.accessKey = accessKey;
  this.version = version;
  this.options = {
    version: '2.0'
  };

  return this;

  function accessKey(_accessKey) {
    this.options.accessKey = _accessKey;
    return this;
  }

  function version(_version) {
    this.options.version = _version;
    return this;
  }

  // @ngInject
  function $get(baiduMapScriptLoader) {
    return baiduMapScriptLoader(this.options.version, this.options.accessKey);
  }
}

module.exports = baiduMapApiProvider;
