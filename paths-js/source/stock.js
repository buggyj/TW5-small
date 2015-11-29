// Generated by uRequire v0.7.0-beta.15 target: 'dist' template: 'nodejs'
(function () {
  
var __isAMD = !!(typeof define === 'function' && define.amd),
    __isNode = (typeof exports === 'object'),
    __isWeb = !__isNode;

var Polygon = require('./polygon'),
    comp = require('./line-chart-comp'),
    O = require('./ops');

module.exports = (function () {
  return function (options) {
    var arranged, base, i, polygons, ref, scale, xscale, yscale;
    ref = comp(options), arranged = ref.arranged, scale = ref.scale, xscale = ref.xscale, yscale = ref.yscale, base = ref.base;
    i = -1;
    polygons = arranged.map(function (arg) {
      var points, scaled_points, scaled_points_closed, xmax, xmin;
      points = arg.points, xmin = arg.xmin, xmax = arg.xmax;
      scaled_points = points.map(scale);
      points.push([
        xmax,
        base
      ]);
      points.push([
        xmin,
        base
      ]);
      scaled_points_closed = points.map(scale);
      i += 1;
      return O.enhance(options.compute, {
        item: options.data[i],
        line: Polygon({
          points: scaled_points,
          closed: false
        }),
        area: Polygon({
          points: scaled_points_closed,
          closed: true
        }),
        index: i
      });
    });
    return {
      curves: polygons,
      xscale: xscale,
      yscale: yscale
    };
  };
}).call(this);


}).call(this)