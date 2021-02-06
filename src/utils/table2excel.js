const uri = 'data:application/vnd.ms-excel;base64,';
const template =
    '<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40"><title></title><head><!--[if gte mso 9]><xml><x:ExcelWorkbook><x:ExcelWorksheets><x:ExcelWorksheet><x:Name>{worksheet}</x:Name><x:WorksheetOptions><x:DisplayGridlines/></x:WorksheetOptions></x:ExcelWorksheet></x:ExcelWorksheets></x:ExcelWorkbook></xml><![endif]--><meta http-equiv="content-type" content="text/plain; charset=UTF-8"/></head><body>{table}</body></html>';

const base64 = function(s) {
    return window.btoa(unescape(encodeURIComponent(s)));
};

const format = function(s, c) {
    return s.replace(/{(\w+)}/g, (m, p) => {
        return c[p];
    });
};

function tableToExcel(table, filename, name = 'Worksheet') {
    const link = document.createElement('a');
    const ctx = {
        worksheet: name,
        table: table,
    };

    if ('download' in link) {
        link.style.display = 'none';
        link.download = (filename || name) + '.xls';
        link.href = uri + base64(format(template, ctx));
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    } else {
        alert('当前浏览器不支持');
    }
}

export default tableToExcel;
