angular.module('ngBaiduMap', [])
  .factory('baiduMapScriptLoader', require('./src/script-loader-factory'))
  .provider('baiduMapApi', require('./src/api-provider'))
  .directive('baiduMap', require('./src/baidu-map-directive'));
