(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
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

  $get.$inject = ["baiduMapScriptLoader"];
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

},{}],2:[function(require,module,exports){
/**
 * directive 定义
 * @ngInject
 */
function BaiduMapDirective(baiduMapApi) {
  return {
    require: 'baiduMap',
    scope: {
      center: '='
    },
    link: link,
    controller: controller
  };

  function link(scope, element, attrs, controller) {
    element.css('display', 'block');
    baiduMapApi.then(function(BMap) {
      var map = new BMap.Map(element[0]);
      controller.init(map);
    });
  }
}
BaiduMapDirective.$inject = ["baiduMapApi"];

/**
 * 用于控制 directive 的内部 controller
 * @ngInject
 */
function controller($scope, $q) {
  var vm = this;

  this.init = init;

  return;

  function init(map) {

    var center = $scope.center;

    map.centerAndZoom(new BMap.Point(center.lng, center.lat), 11);

    map.addEventListener('dragend', function(type, target) {
      var center = map.getCenter();
      $scope.center = center;
      $scope.$apply();
    });

    $scope.$watch('center', function(newVal, oldVal) {
      var point = new BMap.Point(newVal.lng, newVal.lat);
      map.panTo(point);
    }, true);
  }
}
controller.$inject = ["$scope", "$q"];

module.exports = BaiduMapDirective;

},{}],3:[function(require,module,exports){
/**
 * 用于管理百度地图 API 脚本
 * @ngInject
 */
function baiduMapScriptLoader($q) {

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
baiduMapScriptLoader.$inject = ["$q"];

/**
 * 生成随机的 callback 方法名
 */
function randomCallbackName() {
  var name = '_callback' + (Math.random() + 1).toString(36).substring(2, 5);
  return name;
}

module.exports = baiduMapScriptLoader;

},{}],4:[function(require,module,exports){
angular.module('ngBaiduMap', [])
  .factory('baiduMapScriptLoader', require('./src/script-loader-factory'))
  .provider('baiduMapApi', require('./src/api-provider'))
  .directive('baiduMap', require('./src/baidu-map-directive'));

},{"./src/api-provider":1,"./src/baidu-map-directive":2,"./src/script-loader-factory":3}]},{},[4]);
