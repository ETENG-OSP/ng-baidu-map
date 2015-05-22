(function () {
  angular.module('ngBaiduMap', [])
    .factory('baiduMapScriptLoader', baiduMapScriptLoader)
    .provider('baiduMapApi', baiduMapApiProvider)
    .directive('baiduMap', baiduMap);

  /*
   * 用于管理百度地图 API 脚本
   */
  // @ngInject
  function baiduMapScriptLoader($q) {

    var mapApi = $q.defer();
    var callbackName = randomCallbackName();
    window[callbackName] = initialize;

    return load;

    function load(version, accessKey) {
      // load baidu map api
      var script = document.createElement('script');

      var baiduLoader = 'http://api.map.baidu.com/api?'
        + 'v=' + version
        + '&ak=' + accessKey
        + '&callback=' + callbackName;

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

    function accessKey(accessKey) {
      this.options.accessKey = accessKey;
      return this;
    }

    function version(version) {
      this.options.version = version;
      return this;
    }

    // @ngInject
    function $get(baiduMapScriptLoader) {
      return baiduMapScriptLoader(this.options.version, this.options.accessKey);
    }
  }

  /*
   * 生成随机的 callback 方法名
   */
  function randomCallbackName() {
    var name = '_callback' + (Math.random() + 1).toString(36).substring(2, 5)
    return name;
  }

  /*
   * directive 定义
   */
  // @ngInject
  function baiduMap(baiduMapApi) {
    return {
      require: 'baiduMap',
      scope: {
        center: '='
      },
      link: link,
      controller: controller
    };

    function link(scope, element, attrs, controller) {
      baiduMapApi.then(function (BMap) {
        var map = new BMap.Map(element[0]);
        controller.init(map);
      });
    }
  }
  baiduMap.$inject = ["baiduMapApi"];

  /*
   * 用于控制 directive 的内部 controller
   */
  // @ngInject
  function controller($scope, $q) {
    var vm = this;

    this.init = init;

    return;

    function init(map) {

      var center = $scope.center;

      map.centerAndZoom(new BMap.Point(center.lat, center.lng), 11);

      map.addEventListener('dragend', function (type, target) {
        var center = map.getCenter();
        $scope.center = center;
        $scope.$apply();
      });

      $scope.$watch('center', function (newVal, oldVal) {
        var point = new BMap.Point(newVal.lat, newVal.lng);
        map.panTo(point);
      }, true);
    }
  }
  controller.$inject = ["$scope", "$q"];

})();
