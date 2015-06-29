(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
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

},{}],2:[function(require,module,exports){
/**
 * directive 定义
 * @ngInject
 */
function BaiduMapDirective($q, baiduMapApi) {

  return {
    transclude: true,
    template: [
      '<div></div>',
      '<div ng-transclude></div>'
    ].join(''),
    scope: {
      center: '='
    },
    link: link
  };

  function link(scope, element, attrs) {
    var container = element.children();
    angular.element(container[1]).css('display', 'none');
    angular.element(container[0]).css({
      'min-height': '100px',
      'min-width': '100px',
      height: '100%',
      width: '100%'
    });

    scope.$on('mapready', initialize);

    baiduMapApi.then(function(BMap) {
      var map = new BMap.Map(container[0]);
      var center = scope.center;
      var point = new BMap.Point(center.lng, center.lat);
      map.centerAndZoom(point, 11);
      scope.$broadcast('mapready', map);
    });

    return;

    function initialize(e, map) {
      map.addEventListener('dragend', function(type, target) {
        var center = map.getCenter();
        scope.center = center;
        scope.$apply();
      });

      scope.$watch('center', function(newVal, oldVal) {
        var point = new BMap.Point(newVal.lng, newVal.lat);
        map.panTo(point);
      }, true);
    }
  }

}

module.exports = BaiduMapDirective;

},{}],3:[function(require,module,exports){
function MarkerDirective() {

  return {
    scope: {
      latlng: '='
    },
    link: link
  };

  function link(scope, element) {
    scope.$on('mapready', initialize);
    return;

    function initialize(e, map) {
      console.log('put marker');
      var lng = scope.latlng.lng;
      var lat = scope.latlng.lat;
      var point = new BMap.Point(lng, lat);
      var marker = new BMap.Marker(point);
      var infoWindow = new BMap.InfoWindow(element.html());
      map.addOverlay(marker);

      marker.addEventListener('click', function() {
        this.openInfoWindow(infoWindow);
      });
    }
  }

}

module.exports = MarkerDirective;

},{}],4:[function(require,module,exports){
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

},{}],5:[function(require,module,exports){
angular.module('ngBaiduMap', [])
  .factory('baiduMapScriptLoader', require('./src/script-loader-factory'))
  .provider('baiduMapApi', require('./src/api-provider'))
  .directive('baiduMap', require('./src/baidu-map-directive'))
  .directive('marker', require('./src/marker-directive'));

},{"./src/api-provider":1,"./src/baidu-map-directive":2,"./src/marker-directive":3,"./src/script-loader-factory":4}]},{},[5]);
