var Db = require("../db/db");
//var express = require('express');
//var app = express();

exports.historyCount = async () => {
  try {
    const result = await Db.query('SELECT Count(*) FROM public."History";');
    if (result.rows.length) {
      console.log(result.rows);
      return;
    } else {
      console.log("NO History");
      return;
    }
  } catch (error) {
    console.error(error.message);
    return;
  }
};

exports.heatperiodCount = async () => {
  try {
    const result = await Db.query('SELECT Count(*) FROM public."Heatperiod";');
    if (result.rows.length) {
      return result.rows;
    } else {
      return [];
    }
  } catch (error) {
    return console.error(error.message);
  }
};
//insert heat period into db
exports.insertHeatPeriod = async (HeatObject) => {
  if (Object.getOwnPropertyNames(HeatObject).length !== 0) {
    //console.log(HeatObject);
    var tempValues = [];
    for (var prop in HeatObject) {
      tempValues.push(HeatObject[prop]);
    }

    await Db.query(
      'INSERT INTO public."Heatperiod"(' +
        '"Period", "Start",' +
        '"End", ' +
        '"Room"' +
        ") VALUES($1, $2, $3, $4);",
      tempValues
    );
    //db.end();
  }
};
//inserts temp readings into db
exports.insertHistory = async (tempObject) => {
  if (Object.getOwnPropertyNames(tempObject).length !== 0) {
    var tempValues = [];
    for (var prop in tempObject) {
      tempValues.push(tempObject[prop]);
    }
    //console.log(tempObject);
    await Db.query(
      'INSERT INTO public."History"(' +
        '"Temp_garaaz", "Kyte_garaaz",' +
        '"Temp_Leiliruum", ' +
        '"Temp_Eesruum", "Kyte_eesruum",' +
        '"Temp_valjas"' +
        ") VALUES($1, $2, $3, $4, $5, $6);",
      tempValues
    );
    //db.end();
  }
};

//get temps from db
exports.getTemps = async (req, res) => {
  if (Object.keys(req.query).length !== 0) {
    var StartInterval = req.query.page * req.query.limit;
    var EndInterval =
      req.query.page * req.query.limit + parseInt(req.query.limit);
    try {
      const result = await Db.query(
        'SELECT * FROM public."History" ' +
          'Where "TimeStamp" Between now() - interval \'' +
          EndInterval +
          " days' And now() - interval '" +
          StartInterval +
          ' days\' Order by "Id";'
      );

      if (result.rows.length) {
        return res.status(200).json(result.rows);
      } else {
        return res.status(400).send("Not found");
      }
    } catch (error) {
      return res.status(403).send(error);
    }
  } else {
    try {
      const result = await Db.query('SELECT * FROM public."History" LIMIT 10;');

      if (result.rows.length) {
        return res.status(200).json(result.rows);
      } else {
        return res.status(400).send("Not found");
      }
    } catch (error) {
      return res.status(403).send(error);
    }
  }
};

exports.getPeriod = async (req, res) => {
  //console.log(req.query);

  if (Object.keys(req.query).length !== 0) {
    var StartInterval = req.query.page * req.query.limit;
    var EndInterval =
      req.query.page * req.query.limit + parseInt(req.query.limit);

    //console.log(StartInterval,'  ',EndInterval);

    try {
      const result = await Db.query(
        'SELECT * FROM public."Heatperiod" ' +
          'Where "TimeStamp" Between now() - interval \'' +
          EndInterval +
          " days' And now() - interval '" +
          StartInterval +
          ' days\' Order by "Id";'
      );

      if (result.rows.length) {
        return res.status(200).json(result.rows);
      } else {
        return res.status(400).send("Not found");
      }
    } catch (error) {
      return res.status(403).send(error);
    }
  } else {
    try {
      const result = await Db.query(
        'SELECT * FROM public."Heatperiod" LIMIT 10;'
      );

      if (result.rows.length) {
        return res.status(200).json(result.rows);
      } else {
        return res.status(400).send("Not found");
      }
    } catch (error) {
      return res.status(403).send(error);
    }
  }
};
