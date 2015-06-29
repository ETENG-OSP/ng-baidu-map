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
