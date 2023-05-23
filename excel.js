const ExcelJS = require("exceljs");
const workbook = new ExcelJS.Workbook();

workbook.creator = "hungnm7";
workbook.lastModifiedBy = "hungnm7";
workbook.created = new Date(1985, 8, 30);
workbook.modified = new Date();
workbook.lastPrinted = new Date(2016, 9, 27);

function insertToExcel(date, data = []) {

    // create new sheet
  const worksheet = workbook.addWorksheet(date, {
    pageSetup: { paperSize: 9, orientation: "landscape" },
  });
  const rows = data
  worksheet.addRows(rows);
}

function saveExcel() {
    workbook.xlsx.writeFile(`./xsmb-${new Date().getTime()}.xlsx`);
}

module.exports = {
  insertToExcel,
  saveExcel
};
