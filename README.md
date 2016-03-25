百度地图 for AngularJS
==========================

这个模块包含了使用百度地图的 directive。

这个模块自动管理百度地图 API 的加载，无需引入百度地图的 loader。

支持双向绑定。

安装方法
------------------------

使用 bower 安装

```bash
$ bower install ng-baidu-map --save
```

在自己的模块中加入依赖

```js
angular.module('app', ['ngBaiduMap']);
```

使用方法
-------------------------

在 `angular.module` 的 `config` 中配置 accessKey 和 version

version 默认是 2.0

例子：
```js
angular.module('app', ['ngBaiduMap']).config(config);

function config(baiduMapApiProvider) {
  baiduMapApiProvider.version('2.0').accessKey('您的 ak');
}
```

### baidu-map

使用 `<baidu-map></baidu-map>` 加入地图

参数：

* __center__: 地图的中心点坐标，使用双向绑定方式与外界的数据进行交互

例子：

```html
<div ng-init="point = { lat: 121.491, lng: 31.233 }">
  <baidu-map center="point"></baidu-map>
</div>
```

### marker

使用 `<marker></marker>` 加入标注。元素内部的 html 是点击标注后显示的 InfoWindow 的内容。

参数：

* __latlng__: 标注的坐标

例子：
```html
<div ng-init="point = { lat: 121.491, lng: 31.233 }">
  <baidu-map center="point">
    <marker latlng="point">点击后显示的内容</marker>
  </baidu-map>
</div>
```

### baiduMapApi

如果需要使用 `BMap`，可以注入 `baiduMapApi`，在 then 里拿到 `Bmap`。这个模块会解决加载的时序问题。

例子：

```js
// 定义自己的服务
yourModule.factory('BaiduMapService', function($q, baiduMapApi) {
  return {
    getLocalCity: function() {
      return baiduMapApi.then(function(BMap) {
        var localcity = new BMap.LocalCity();
        return $q(function(resolve, reject) {
          localcity.get(function(r) {
            resolve(r);
          });
        });
      });
    }
  };
});

// 使用自己的服务
yourModule.controller('TestController', function(BaiduMapService) {
  var self = this;
  BaiduMapService.getLocalCity().then(function(r) {
    self.r = r;
  });
});
```
