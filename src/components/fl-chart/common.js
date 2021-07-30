/** Chart全屏 */
export const chartFullScreen = function(echarts) {
    let chartEle, chart;

    function chartResize() {
        chart && chart.resize();
    }

    function destroyChart() {
        chartEle = null;
        if (chart) {
            chart.clear();
            chart.dispose();
            chart = null;
        }
    }

    return e => {
        const parentEle = document.getElementById('basics-frame') || document.body;
        if (!chartEle) {
            console.log(e);
            const option = e.getOption();
            chartEle = document.createElement('div');
            parentEle.appendChild(chartEle);
            chartEle.style = 'position:absolute;top:0px;left:0px;right:0;bottom:0;z-index:1000000;background:#165871;';
            chart = echarts.init(chartEle);
            chart.setOption(option);
            window.addEventListener('resize', chartResize);
        } else {
            parentEle.removeChild(chartEle);
            window.removeEventListener('resize', chartResize);
            destroyChart();
        }
    };
};
