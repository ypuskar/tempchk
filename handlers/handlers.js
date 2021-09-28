var Db = require('../db/db');
//var express = require('express');
//var app = express();

exports.historyCount = () => {
    
    Db.query('SELECT Count(*) FROM public."History";');
}

exports.heatperiodCount = () => {
    Db.query('SELECT Count(*) FROM public."Heatperiod";');
    
}
//insert heat period into db
exports.insertHeatPeriod = (HeatObject) => {
    if (Object.getOwnPropertyNames(HeatObject).length !== 0) {
        //console.log(HeatObject);
        var tempValues = [];
        for (var prop in HeatObject) {
            tempValues.push(HeatObject[prop]);
            
        }

        Db.query('INSERT INTO public."Heatperiod"('+
        '"Period", "Start",'+
        '"End", '+
        '"Room"'+
        ') VALUES($1, $2, $3, $4);', tempValues, (err, table) => {

            if(err) {
                console.log(err);
            } else {
                //console.log(table.rows);
                //db.end();
            }
        });
        //db.end();


    }

}
//inserts temp readings into db
exports.insertHistory = (tempObject) => {
    if (Object.getOwnPropertyNames(tempObject).length !== 0) {
        var tempValues = [];
        for (var prop in tempObject) {
            tempValues.push(tempObject[prop]);
            
        }
        //console.log(tempObject);
        Db.query('INSERT INTO public."History"('+
        '"Temp_garaaz", "Kyte_garaaz",'+
        '"Temp_Leiliruum", '+
        '"Temp_Eesruum", "Kyte_eesruum",'+
        '"Temp_valjas"'+
        ') VALUES($1, $2, $3, $4, $5, $6);', tempValues, (err, table) => {

            if(err) {
                console.log(err);
            } else {
                //console.log('INSERTED');
                //db.end();
            }
        }) 
        //db.end();
        

    }

}

//get temps from db
exports.getTemps = (req, res) => {

    if(Object.keys(req.query).length !== 0 ) {
        var StartInterval = req.query.page*req.query.limit;
        var EndInterval = req.query.page*req.query.limit+parseInt(req.query.limit);

        Db.query('SELECT * FROM public."History" '+
        'Where "TimeStamp" Between now() - interval \''+EndInterval+
        ' days\' And now() - interval \''+StartInterval+' days\' Order by "Id";','', (err, table) => {

            if(err) {
                return res.status(400).send(err);
            } else {
                return res.status(200).send(table.rows);
                //db.end();
            }
        })
    }  else {         
        Db.query('SELECT * FROM public."History" LIMIT 10;','', (err, table) => {

        if(err) {
            return res.status(400).send(err);
        } else {
            return res.status(200).send(table.rows);
            //db.end();
        }
    })
    }
}

exports.getPeriod = (req, res) => {

    console.log(req.query);

    if(Object.keys(req.query).length !== 0 ) {
        var StartInterval = req.query.page*req.query.limit;
        var EndInterval = req.query.page*req.query.limit+parseInt(req.query.limit);

        console.log(StartInterval,'  ',EndInterval);

        Db.query('SELECT * FROM public."Heatperiod" '+
        'Where "TimeStamp" Between now() - interval \''+EndInterval+
        ' days\' And now() - interval \''+StartInterval+' days\' Order by "Id";','', (err, table) => {

            if(err) {
                return res.status(400).send(err);
            } else {
                return res.status(200).send(table.rows);
                //db.end();
            }
        })
    }  else {         
        Db.query('SELECT * FROM public."Heatperiod" LIMIT 10;','', (err, table, res) => {

        if(err) {
            return res.status(400).send(err);
        } else {
            return res.status(200).send(table.rows);
            //db.end();
        }
    })
    }
}
