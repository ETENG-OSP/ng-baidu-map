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
