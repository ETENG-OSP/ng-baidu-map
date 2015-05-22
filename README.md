百度地图 for Angular
==========================

这个模块包含了使用百度地图的 Directive。

这个模块自动管理百度地图 API 的加载，无需引入百度地图的 loader。

支持双向绑定。

安装方法
------------------------

使用 bower 安装

```bash
bower install ng-baidu-map
```

在自己的模块中加入依赖

```javascript
angular.module('app', ['ngBaiduMap']);
```

使用方法
-------------------------

在 `angular.module` 的 `config` 中配置 accessKey 和 version

version 默认是 2.0

例子：
```javascript
angular.module('app', ['ngBaiduMap']).config(config);

function config(baiduMapApiProvider) {
  baiduMapApiProvider.version('2.0').accessKey('您的 ak');
}
```

使用 `<baidu-map></baidu-map>` 加入地图

参数：

* _center_: 地图的中心点坐标，使用双向绑定方式与外界的数据进行交互

例子：

```
<div ng-init="point = { lat: 121.491, lng: 31.233 }">
  <baidu-map center="point"></baidu-map>
</div>
```
