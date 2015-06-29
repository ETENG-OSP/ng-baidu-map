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

module.exports = BaiduMapDirective;
