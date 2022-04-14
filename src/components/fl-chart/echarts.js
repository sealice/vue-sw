import echarts from 'echarts/lib/echarts';
import theme from './theme';

echarts.registerTheme('skin', theme);
export default echarts;

/* 图表chart */
require('echarts/lib/chart/line'); // 折线图
require('echarts/lib/chart/bar'); // 柱状图
require('echarts/lib/chart/pie'); // 饼图
require('echarts/lib/chart/radar'); // 雷达图
// require('echarts/lib/chart/gauge'); // 仪表盘
// require('echarts/lib/chart/scatter'); // 散点图
// require('echarts/lib/chart/effectScatter'); // 涟漪散点图
// require('echarts/lib/chart/lines'); // 线图
require('echarts/lib/chart/map'); // 地图
// require('echarts/lib/chart/heatmap'); // 热力图
// require('echarts/lib/chart/funnel'); // 漏斗图
// require('echarts/lib/chart/tree'); // 树图
// require('echarts/lib/chart/treemap'); // 矩形树图
// require('echarts/lib/chart/graph'); // 关系图
// require('echarts/lib/chart/parallel'); // 平行坐标
// require('echarts/lib/chart/sankey'); // 桑基图
// require('echarts/lib/chart/boxplot'); // 箱线图
// require('echarts/lib/chart/candlestick'); // K线图
// require('echarts/lib/chart/pictorialBar'); // 象形柱图
// require('echarts/lib/chart/themeRiver'); // 主题河流图
// require('echarts/lib/chart/sunburst'); // 旭日图
// require('echarts/lib/chart/custom'); // 自定义系列

/* 坐标系coordinate systems */
require('echarts/lib/component/grid'); // 直角坐标系
require('echarts/lib/component/polar'); // 极坐标系
// require('echarts/lib/component/singleAxis'); // 单轴
require('echarts/lib/component/geo'); // 地理坐标系
// require('echarts/lib/component/parallel');
// require('echarts/lib/component/calendar'); // 日历

/* 组件component */
require('echarts/lib/component/dataset');
require('echarts/lib/component/title'); // 标题
require('echarts/lib/component/legend'); // 图例
require('echarts/lib/component/legendScroll');
require('echarts/lib/component/tooltip'); // 提示框
require('echarts/lib/component/toolbox'); // 工具栏
require('echarts/lib/component/markPoint'); // 标注
require('echarts/lib/component/markLine'); // 标线
require('echarts/lib/component/markArea'); // 标域
require('echarts/lib/component/axisPointer');
require('echarts/lib/component/visualMap'); // 视觉映射
// require('echarts/lib/component/visualMapContinuous');
// require('echarts/lib/component/visualMapPiecewise');
// require('echarts/lib/component/brush'); // 刷选
// require('echarts/lib/component/timeline'); // 时间轴
// require('echarts/lib/component/dataZoom'); // 数据区域缩放
// require('echarts/lib/component/dataZoomInside');
// require('echarts/lib/component/dataZoomSlider');
// require('echarts/lib/component/graphic'); // 自定义图形

// require('zrender/lib/vml/vml');
// require('zrender/lib/svg/svg');
