const axios = require("axios");
const cheerio = require("cheerio");
const moment = require("moment");
const { insertToExcel, saveExcel } = require("../excel");

const url = "https://xosoketqua.com/xsmb-xo-so-mien-bac.html";
const urlByDate = "https://xosoketqua.com/xsmb-{date}.html";
const axiosConfig = {
  headers: {
    "Accept-Encoding": "gzip, deflate, br",
    Connection: "keep-alive",
    Accept: "*/*",
    "User-Agent": "PostmanRuntime/7.31.3",
  },
};

class MainController {
  getAll = async (req, res) => {
    const numbers = [];
    const names = [];
    const times = [];
    const objTimesNames = {};
    const obj = {};

    try {
      await axios(url, config).then((response) => {
        const html = response.data;
        const $ = cheerio.load(html); // sử dụng giống jQuery

        $("table:nth-child(1)", html)
          // .first()
          .each(function () {
            $(this)
              .find("td > span.div-horizontal")
              .each(function () {
                numbers.push($(this).text());
              });

            // console.log(numbers);
            $(this)
              .find("tr > td:first-child")
              .each(function (i) {
                const name = $(this).text();

                if (name !== "Mã ĐB") {
                  // for (let i = 0; i < names.length; i++) {
                  if (names.includes(name)) {
                    return;
                  } else {
                    names.push(name.split(".").join("_"));
                  }
                  // }
                }
              });
          });
        if (numbers.length > 0) {
          for (let i = 0; i < names.length; i++) {
            objTimesNames[names[0]] = [numbers[0]];
            objTimesNames[names[1]] = [numbers[1]];
            objTimesNames[names[2]] = [numbers[2], numbers[3]];
            objTimesNames[names[3]] = [
              numbers[4],
              numbers[5],
              numbers[6],
              numbers[7],
              numbers[8],
              numbers[9],
            ];
            objTimesNames[names[4]] = [
              numbers[10],
              numbers[11],
              numbers[12],
              numbers[13],
            ];
            objTimesNames[names[5]] = [
              numbers[14],
              numbers[15],
              numbers[16],
              numbers[17],
              numbers[18],
              numbers[19],
            ];
            objTimesNames[names[6]] = [numbers[20], numbers[21], numbers[22]];
            objTimesNames[names[7]] = [
              numbers[23],
              numbers[24],
              numbers[25],
              numbers[26],
            ];
          }
        }

        // $('.list-link', html)
        //    .find('h2 > a:last-child')
        //    .each(function () {
        //       const time = $(this).prop('innerHTML').split(' ')[1];

        // times.push(time);
        //       console.log(time);
        //    });

        // if (times.length > 0) {
        //    times.forEach(time => {
        //       for (let i = 0; i < names.length; i++) {
        //          objTimesNames[time] = [...names];
        //       }
        //    });
        // }
        const nowDay = new Date();
        const calendar =
          nowDay.getDate() +
          "/" +
          (nowDay.getMonth() + 1 < 10
            ? "0" + (nowDay.getMonth() + 1)
            : nowDay.getMonth() + 1) +
          "/" +
          nowDay.getFullYear();
        // console.log(nowDay.getHours() + ':' + nowDay.getMinutes());
        // console.log(objTimesNames);

        const date = $(".class-title-list-link", html)
          .first()
          .find("a:last-child")
          .text()
          .split(" ")[1];

        res?.status(200).json({
          countNumbers: numbers.length,
          time: date,
          objTimesNames,
        });
        console.log("====================================");
        console.log({
          countNumbers: numbers.length,
          time: date,
          objTimesNames,
        });
        console.log("====================================");
      });
    } catch (e) {
      res?.status(500).json({ msg: e });
    }
  };

  getData = async () => {
    const date = moment("01/01/2023", "DD/MM/YYYY");
    const now = moment();
    const promiseAll = [];
    const dates = [];
    while (date.isSameOrBefore(now)) {
      const _date = date.format("DD-MM-YYYY");
      dates.push(_date);
      promiseAll.push(this.getDataOfTime(_date));
      date.add(1, "d");
    }

    Promise.all(promiseAll)
      .then((data) => {
        dates.map((_date, index) => {
          console.log("====================================");
          console.log(_date, data[index]);
          console.log("====================================");
          insertToExcel(_date, data[index]);
        });

        saveExcel()
      })
      .catch((err) => {
        console.log("====================================");
        console.log("err", err);
        console.log("====================================");
      });
  };

  getDataOfTime = async (date) => {
    const _urlByDate = urlByDate.replace("{date}", date);

    const numbers = [];

    try {
      await axios(_urlByDate, axiosConfig).then((response) => {
        const html = response.data;
        const $ = cheerio.load(html); // sử dụng giống jQuery

        $("table:nth-child(1)", html).each(function () {
          $(this)
            .find("tr")
            .each((indexRow, row) => {
              if (indexRow) {
                $(row)
                  .find("span")
                  .each((indexCol, col) => {
                    const number = $(col).text();
                    numbers[indexRow] = numbers[indexRow]
                      ? numbers[indexRow].concat(number)
                      : [number];
                  });
              }
            });
        });
      });
      return numbers;
    } catch (e) {
      console.log("====================================");
      console.log(e);
      console.log("====================================");
      // res?.status(500).json({ msg: e });
    }
  };
  getById = async (req, res) => {};
}

module.exports = new MainController();
