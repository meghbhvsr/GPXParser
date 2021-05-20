'use strict'

// C library API
const ffi = require('ffi-napi');

// Express App (Routes)
const express = require("express");
const app     = express();
const path    = require("path");
const fileUpload = require('express-fileupload');
const mysql = require('mysql2/promise');
let connection;
app.use(fileUpload());
app.use(express.static(path.join(__dirname+'/uploads')));

// Minimization
const fs = require('fs');
const JavaScriptObfuscator = require('javascript-obfuscator');
const { json } = require('express');

// Important, pass in port as in `npm run dev 1234`, do not change
const portNum = process.argv[2];

// Send HTML at root, do not change
app.get('/',function(req,res){
  res.sendFile(path.join(__dirname+'/public/index.html'));
});

// Send Style, do not change
app.get('/style.css',function(req,res){
  //Feel free to change the contents of style.css to prettify your Web app
  res.sendFile(path.join(__dirname+'/public/style.css'));
});

// Send obfuscated JS, do not change
app.get('/index.js',function(req,res){
  fs.readFile(path.join(__dirname+'/public/index.js'), 'utf8', function(err, contents) {
    const minimizedContents = JavaScriptObfuscator.obfuscate(contents, {compact: true, controlFlowFlattening: true});
    res.contentType('application/javascript');
    res.send(minimizedContents._obfuscatedCode);
  });
});

//Respond to POST requests that upload files to uploads/ directory
app.post('/upload', function(req, res) {
  if(!req.files) {
    return res.status(400).send('No files were uploaded.');
  }
 
  let uploadFile = req.files.uploadFile;
 
  // Use the mv() method to place the file somewhere on your server
  uploadFile.mv('uploads/' + uploadFile.name, function(err) {
    if(err) {
      return res.status(500).send(err);
    }

    res.redirect('/');
  });
});

//Respond to GET requests for files in the uploads/ directory
app.get('/uploads/:name', function(req , res){
  fs.stat('uploads/' + req.params.name, function(err, stat) {
    if(err == null) {
      res.sendFile(path.join(__dirname+'/uploads/' + req.params.name));
    } else {
      console.log('Error in file downloading route: '+err);
      res.send('');
    }
  });
});

//******************** Your code goes here ******************** 
//var ArrayType = require('ref-array');
//var FloatArray = ArrayType(float);
let gpxparser = ffi.Library("./libgpxparser.so", {
  getGPXJSON: ["string", ["string"]],
  fileDataToJSON: ["string", ["string"]],
  otherDataToJSON: ["string", ["string", "string"]],
  createNewGPXFile: ["string", ["string"]],
  changeRouteName: ["string", ["string", "string", "string", "string"]],
  addRouteWithWaypoints: ["string", ["string", "string", "string", "int"]],
  getPointsBetween: ["string", ["string", "float", "float", "float", "float", "float"]],
  fileRouteToJSON: ["string", ["string"]],
  waypointListToJSON: ["string", ["string", "string"]]
});
//Sample endpoint

app.get('/getfileviewpanel', function(req , res){
  let fileList = [];
  fs.readdirSync('./uploads/').forEach(theFile => {
    if (theFile != ".DS_Store") {
      let theCurFile = gpxparser.getGPXJSON("./uploads/" + theFile);
      if (theCurFile != "err") {
        let json = JSON.parse(theCurFile);
        json.fileName = theFile;
        fileList.push(json);
      }
    }
  });
 
  res.send(
    {
      files: fileList
    }
  );
});
app.get('/getotherdata', function(req , res){
  let fileList = "";
   if (gpxparser.otherDataToJSON(req.query.data2, "./uploads/" + req.query.data1) != "") {
     //console.log(gpxparser.otherDataToJSON(req.query.data2, "./uploads/" + req.query.data1));
    let theCurFile = gpxparser.otherDataToJSON(req.query.data2, "./uploads/" + req.query.data1);
    let json = JSON.parse(theCurFile);
    fileList = json;
   } else {
    fileList = "";
   }
    console.log(fileList);
  res.send(
    {
      other: fileList
    }
  );
});
app.get('/writeGPXFile', function(req, res) {
  let parsed = "";
  let flag = 0;
  fs.readdirSync('./uploads/').forEach(theFile => {
    //console.log("data" + theFile);
    if (req.query.data1 == theFile) {
      flag = 1;
    }
  });
  if (flag == 1) {
    //console.log("file already there");
    parsed = "";
  } else {
    let file = gpxparser.createNewGPXFile("./uploads/" + req.query.data1);
    let theCurFile = gpxparser.getGPXJSON("./uploads/" + req.query.data1);
    parsed = JSON.parse(theCurFile);
  }
  res.send({
    parsed
  });
});

app.get('/addwaypointswithroutes', function(req, res) {
  let jsonstring = "";
  
  for (var i = 0; i < req.query.data5; i++) {
    jsonstring += "{\"lat\":" + req.query.data4[i] + "," + "\"lon\":" + req.query.data3[i] + "}";
    if ((i + 1) != req.query.data5) {
      jsonstring += "|";
    }
  }
  //console.log(jsonstring);
  let file = gpxparser.addRouteWithWaypoints("./uploads/" + req.query.data1, req.query.data2, jsonstring, req.query.data5);
  res.send({
    file
  });
});

app.get('/changeroute', function(req, res){
  let variable = gpxparser.changeRouteName("./uploads/" + req.query.data1, req.query.data2, req.query.data3, req.query.data4);
  res.send({
    variable
  });
});

app.get('/getpathbetween', function(req, res) {
  let jsonstring = "["
  var flag = 0;
  fs.readdirSync('./uploads/').forEach(function(theFile, ind) {
    if (theFile != ".DS_Store") {
      //console.log("data" + gpxparser.getPointsBetween("./uploads/" + theFile, req.query.data1, req.query.data2, req.query.data3, req.query.data4, req.query.data5));
      jsonstring += gpxparser.getPointsBetween("./uploads/" + theFile, req.query.data1, req.query.data2, req.query.data3, req.query.data4, req.query.data5);
    }
  });
  
  if (jsonstring != "[") {
    jsonstring = jsonstring.slice(0,-1);
  }
  jsonstring += "]"
  //console.log(jsonstring);
  jsonstring = JSON.parse(jsonstring);
  res.send({
    points: jsonstring
  });
}); 
app.get('/getgpxviewpanel', function(req , res){
  let parsedArr = "";
  fs.readdirSync('./uploads/').forEach(theFile => {
    if (req.query.data1 == theFile) {
      let jsonarr = gpxparser.fileDataToJSON("./uploads/" + req.query.data1);
      parsedArr = ((JSON.parse(jsonarr)));
    }
  });
  res.send({
    dat: parsedArr
  });
});

app.get('/logins', async function(req, res){
 try {
    let dbConf = {
      host     : 'dursley.socs.uoguelph.ca',
      user     : req.query.data1,
      password : req.query.data2,
      database : req.query.data3,
    };
    connection = await mysql.createConnection(dbConf);
    await connection.execute("CREATE TABLE IF NOT EXISTS FILE(gpx_id INT AUTO_INCREMENT PRIMARY KEY, file_name VARCHAR(60) NOT NULL, ver DECIMAL(2,1) NOT NULL, creator VARCHAR(256) NOT NULL);");
    await connection.execute("CREATE TABLE IF NOT EXISTS ROUTE(route_id INT AUTO_INCREMENT PRIMARY KEY, route_name VARCHAR(256), route_len FLOAT(15,7) NOT NULL, gpx_id INT NOT NULL, FOREIGN KEY(gpx_id) REFERENCES FILE(gpx_id) ON DELETE CASCADE);");
    await connection.execute("CREATE TABLE IF NOT EXISTS POINT(point_id INT AUTO_INCREMENT PRIMARY KEY, point_index INT NOT NULL, latitude DECIMAL(11,7) NOT NULL, longitude DECIMAL(11,7) NOT NULL, point_name VARCHAR(256), route_id INT NOT NULL, FOREIGN KEY(route_id) REFERENCES ROUTE(route_id) ON DELETE CASCADE);");
    res.send(
      "true"
    );
  } catch(e) {
    res.send(
      "false"
    );
  }
});
app.get('/deletetables', async function(req, res){
  try {
    await connection.execute("DELETE FROM POINT;");
    await connection.execute("DELETE FROM ROUTE;");
    await connection.execute("DELETE FROM FILE;");
    res.send(
      "true"
    );
  } catch (e){
    res.send(
      "false"
    );
  }
});
app.get('/populate', async function(req, res){
  try {
    await connection.execute("DELETE FROM POINT;");
    await connection.execute("DELETE FROM ROUTE;");
    await connection.execute("DELETE FROM FILE;");
    let fileList = [];
    var filenames = fs.readdirSync('./uploads/');
    console.log(filenames);
    let id = 0;
    let flag = -1;
    for (let i = 0; i < filenames.length; i++) {
      const [row, fields1] = await connection.execute('SELECT * from `FILE` ORDER BY `file_name`');
      if (filenames[i] != ".DS_Store") {
        let theCurFile = gpxparser.getGPXJSON("./uploads/" + filenames[i]);
        if (theCurFile != "err") {
          let json = JSON.parse(theCurFile);
          let creator = json.creator;
          let version = json.version;
          let filename = filenames[i];
          id++;
          let string2 = "INSERT INTO FILE(gpx_id, creator, ver, file_name) VALUES("+id+",\""+creator+"\","+version+",\""+filename+"\");";
          await connection.execute(string2);
          await connection.execute("SELECT creator, ver, file_name FROM FILE;");
          fileList.push(json); 
        }
      }
    }
    const [rows1, fields1] = await connection.execute('SELECT * from `FILE` ORDER BY `file_name`');
    for (let row of rows1) {
      console.log("gpx_id : " + row.gpx_id + " creator: " + row.creator + " ver: " + row.ver + " file_name: " + row.file_name);
    }
    let id2 = 0;
    let routeid = 0;
    for (let i = 0; i < filenames.length; i++) {
      if (filenames[i] != ".DS_Store") {
        let routeData = gpxparser.fileRouteToJSON("./uploads/" + filenames[i]);
        if (routeData != "err") {
          let json = JSON.parse(routeData);
          id2++;
          for (let j = 0; j < json.length; j++) {
            routeid++;
            let routeId = json[j].count;
            let routeName = json[j].name;
            let routeLen = json[j].len;
            let string3 = "INSERT INTO ROUTE(gpx_id, route_id, route_name, route_len) VALUES("+id2+","+routeid+",\""+routeName+"\","+routeLen+");";
            await connection.execute(string3);
          }
        }
      }
    }
    const [rows2, fields2] = await connection.execute('SELECT * from `ROUTE` ORDER BY `route_name`');
    for (let row of rows2) {
      console.log("Route ID: " + row.route_id + " Route Name: " + row.route_name + " len: " + row.route_len + " gpx id: " + row.gpx_id);
    }
    let routeidx = 0;
    let waypointidx = 0;
    for (let i = 0; i < filenames.length; i++) {

      if (filenames[i] != ".DS_Store") {
        let routeData2 = gpxparser.fileRouteToJSON("./uploads/" + filenames[i]);
        if (routeData2 != "err") {
          let json2 = JSON.parse(routeData2);
          for (let j = 0; j < json2.length; j++) {
            routeidx++;
            let waypointData = gpxparser.waypointListToJSON("./uploads/" + filenames[i], json2[j].name);
            let json3 = JSON.parse(waypointData);
            for (let k = 0; k < json3.length; k++) {
              waypointidx++;
              let string4 = "INSERT INTO POINT(point_id, point_index, latitude, longitude, point_name, route_id) VALUES("+waypointidx+","+json3[k].index+","+json3[k].latitude+","+json3[k].longitude+",\""+json3[k].name+"\", "+routeidx+");";
              await connection.execute(string4);
            }
          }
        }
      }
    }
    
    const [rows3, fields3] = await connection.execute('SELECT * from `POINT` ORDER BY `point_name`');
    for (let row of rows3) {
      console.log("Point ID: " + row.point_id + " PointIndex: " + row.point_index + " latitude: " + row.latitude + " longitude: " + row.longitude + " point name: " + row.point_name + " route id: " + row.route_id);
    }
    res.send(
      "true"
    );
  } catch(e) {
  }
});

app.get('/displaydbinfo', async function(req, res) {
  try {
    var count = {x1: -1, x2: -1, x3: -1}; 
    const [rows1, fields1] = await connection.execute('SELECT COUNT (*) AS num FROM FILE;');
    count.x1 = rows1[0].num;
    const [rows2, fields2] = await connection.execute('SELECT COUNT (*) AS num FROM ROUTE;');
    count.x2 = rows2[0].num;
    const [rows3, fields3] = await connection.execute('SELECT COUNT (*) AS num FROM POINT;');
    count.x3 = rows3[0].num;
    res.send(
      count
    );
  } catch(e) {
  }
});
app.get('/changeroutedb', async function(req, res){
  try {
    if (comp.includes("Route")) {
      const [rows1, fields1] = await connection.execute('SELECT * from `FILE` ORDER BY `file_name`');
      let fileid = 0;
      for (let row of rows1) {
        if (row.file_name == req.query.data1) {
          fileid = row.gpx_id;
        }
      }
      const [rows2, fields2] = await connection.execute('SELECT * from `ROUTE` ORDER BY `route_name`');
      let id = 0;
      for (let row of rows2) {
        if (row.route_name == req.query.data2 && row.gpx_id == fileid) {
          id = row.route_id;
        }
      }
      let str = "UPDATE ROUTE SET route_name = "+req.query.data3+" WHERE route_id = "+id+";";
      await connection.execute(str);
    }
  } catch (e) {
  }
});

app.get('/addroutedb', async function(req, res) {
  try {
    var filenames = fs.readdirSync('./uploads/');
    let id2 = 0;
    let routeid = 0;
    for (let i = 0; i < filenames.length; i++) {
      if (filenames[i] != ".DS_Store") {
        let routeData = gpxparser.fileRouteToJSON("./uploads/" + filenames[i]);
        if (routeData != "err") {
          let json = JSON.parse(routeData);
          id2++;
          for (let j = 0; j < json.length; j++) {
            routeid++;
            let routeId = json[j].count;
            let routeName = json[j].name;
            let routeLen = json[j].len;
            let string3 = "INSERT INTO ROUTE(gpx_id, route_id, route_name, route_len) VALUES("+id2+","+routeid+",\""+routeName+"\","+routeLen+");";
            await connection.execute(string3);
          }
        }
      }
    }
    let routeidx = 0;
    let waypointidx = 0;
    for (let i = 0; i < filenames.length; i++) {
      if (filenames[i] != ".DS_Store") {
        let routeData2 = gpxparser.fileRouteToJSON("./uploads/" + filenames[i]);
        if (routeData2 != "err") {
          let json2 = JSON.parse(routeData2);
          for (let j = 0; j < json2.length; j++) {
            routeidx++;
            let waypointData = gpxparser.waypointListToJSON("./uploads/" + filenames[i], json2[j].name);
            let json3 = JSON.parse(waypointData);
            for (let k = 0; k < json3.length; k++) {
              waypointidx++;
              let string4 = "INSERT INTO POINT(point_id, point_index, latitude, longitude, point_name, route_id) VALUES("+waypointidx+","+json3[k].index+","+json3[k].latitude+","+json3[k].longitude+",\""+json3[k].name+"\", "+routeidx+");";
              await connection.execute(string4);
            }
          }
        }
      }
    }
  } catch(e) {
  }
});
app.get('/allRoutesDisplayName', async function(req, res) {
  try {
    //let string1 = "SELECT ROUTE FROM (*) ORDER BY route_name;";
    //await connection.execute(string1);
    const [rows, fields] = await connection.execute('SELECT * from `ROUTE` ORDER BY `route_name`');
    
    let str;
    let arr = "";
    str = "[";
    let filename;
    for (let row of rows) {
      const [rows2, fields2] = await connection.execute('SELECT * from `FILE` ORDER BY `file_name`');
      for (let r of rows2) {
        if (row.gpx_id == r.gpx_id) {
          filename = r.file_name;
        }
      }
      str += "{" + "\"Filename\":" + "\"" + filename  + "\"" + "," + "\"Route_ID\":"  + row.route_id + "," +  "\"Route_name\":" +  "\"" +  row.route_name + "\"" +  "," +  "\"len\":" + row.route_len + "," +  "\"gpx_id\":" + row.gpx_id + "}" + ",";
    }
    str = str.slice(0,-1);
    str += "]";
    arr = JSON.parse(str);
    //await connection.query(string2);
    res.send(
      arr
    );
  } catch(e) {
  }
});
app.get('/allRoutesDisplayLength', async function(req, res) {
  try {
    //let string1 = "SELECT ROUTE FROM (*) ORDER BY route_name;";
    //await connection.execute(string1);
    const [rows, fields] = await connection.execute('SELECT * from `ROUTE` ORDER BY `route_len`');
    
    let str;
    let arr = "";
    str = "[";
    let filename;
    for (let row of rows) {
      const [rows2, fields2] = await connection.execute('SELECT * from `FILE` ORDER BY `file_name`');
      for (let r of rows2) {
        if (row.gpx_id == r.gpx_id) {
          filename = r.file_name;
        }
      }
      str += "{" + "\"Filename\":" + "\"" + filename  + "\"" + "," + "\"Route_ID\":"  + row.route_id + "," +  "\"Route_name\":" +  "\"" +  row.route_name + "\"" +  "," +  "\"len\":" + row.route_len + "," +  "\"gpx_id\":" + row.gpx_id + "}" + ",";
    }
    str = str.slice(0,-1);
    str += "]";
    arr = JSON.parse(str);
    //await connection.query(string2);
    res.send(
      arr
    );
  } catch(e) {
  }
});
app.get('/allRoutesDisplay', async function(req, res) {
  try {
    //let string1 = "SELECT ROUTE FROM (*) ORDER BY route_name;";
    //await connection.execute(string1);
    const [rows, fields] = await connection.execute('SELECT * from `ROUTE`');
    let str;
    let arr = "";
    str = "[";
    let filename;
    for (let row of rows) {
      const [rows2, fields2] = await connection.execute('SELECT * from `FILE` ORDER BY `file_name`');
      for (let r of rows2) {
        if (row.gpx_id == r.gpx_id) {
          filename = r.file_name;
        }
      }
      str += "{" + "\"Filename\":" + "\"" + filename  + "\"" + "," + "\"Route_ID\":"  + row.route_id + "," +  "\"Route_name\":" +  "\"" +  row.route_name + "\"" +  "," +  "\"len\":" + row.route_len + "," +  "\"gpx_id\":" + row.gpx_id + "}" + ",";
    }
    str = str.slice(0,-1);
    str += "]";
    arr = JSON.parse(str);
    //await connection.query(string2);
    res.send(
      arr
    );
  } catch(e) {
  }
});
app.get('/getroutebyfilename', async function(req, res) {
  try {
    //let string1 = "SELECT ROUTE FROM (*) ORDER BY route_name;";
    //await connection.execute(string1);
    let filename;
    let theId;
    const [rows2, fields2] = await connection.execute('SELECT * from `FILE` ORDER BY `file_name`');
    for (let r of rows2) {
      if (r.file_name == req.query.data1) {
        filename = r.file_name;
        theId = r.gpx_id
      }
    }
    const [rows, fields] = await connection.execute('SELECT * from `ROUTE`');
    let str;
    let arr = "";
    str = "[";
    
    for (let row of rows) {
        if (row.gpx_id == theId) {
          str += "{" + "\"Filename\":" + "\"" + filename  + "\"" + "," + "\"Route_ID\":"  + row.route_id + "," +  "\"Route_name\":" +  "\"" +  row.route_name + "\"" +  "," +  "\"len\":" + row.route_len + "," +  "\"gpx_id\":" + row.gpx_id + "}" + ",";
        }
    }
    str = str.slice(0,-1);
    str += "]";
    arr = JSON.parse(str);
    //await connection.query(string2);
    res.send(
      arr
    );
  } catch(e) {
  }
});
app.get('/dbdropdown', async function(req, res){
  try {
    let filearr = [];
    const [rows2, fields2] = await connection.execute('SELECT * from `FILE`');
    for (let row of rows2) {
      filearr.push(row.file_name);
    }
    console.log(filearr);
    res.send(
        filearr
    );
  } catch(e) {
  }
});
app.get('/getroutebyfilenamebyname', async function(req, res) {
  try {
    //let string1 = "SELECT ROUTE FROM (*) ORDER BY route_name;";
    //await connection.execute(string1);
    let filename;
    let theId;
    const [rows2, fields2] = await connection.execute('SELECT * from `FILE` ORDER BY `file_name`');
    for (let r of rows2) {
      if (r.file_name == req.query.data1) {
        filename = r.file_name;
        theId = r.gpx_id
      }
    }
    const [rows, fields] = await connection.execute('SELECT * from `ROUTE` ORDER BY `route_name`');
    let str;
    let arr = "";
    str = "[";
    
    for (let row of rows) {
        if (row.gpx_id == theId) {
          str += "{" + "\"Filename\":" + "\"" + filename  + "\"" + "," + "\"Route_ID\":"  + row.route_id + "," +  "\"Route_name\":" +  "\"" +  row.route_name + "\"" +  "," +  "\"len\":" + row.route_len + "," +  "\"gpx_id\":" + row.gpx_id + "}" + ",";
        }
    }
    str = str.slice(0,-1);
    str += "]";
    arr = JSON.parse(str);
    //await connection.query(string2);
    res.send(
      arr
    );
  } catch(e) {
  }
});
app.get('/getroutebyfilenamebylength', async function(req, res) {
  try {
    //let string1 = "SELECT ROUTE FROM (*) ORDER BY route_name;";
    //await connection.execute(string1);
    let filename;
    let theId;
    const [rows2, fields2] = await connection.execute('SELECT * from `FILE` ORDER BY `file_name`');
    for (let r of rows2) {
      if (r.file_name == req.query.data1) {
        filename = r.file_name;
        theId = r.gpx_id
      }
    }
    const [rows, fields] = await connection.execute('SELECT * from `ROUTE` ORDER BY `route_len`');
    let str;
    let arr = "";
    str = "[";
    
    for (let row of rows) {
        if (row.gpx_id == theId) {
          str += "{" + "\"Filename\":" + "\"" + filename  + "\"" + "," + "\"Route_ID\":"  + row.route_id + "," +  "\"Route_name\":" +  "\"" +  row.route_name + "\"" +  "," +  "\"len\":" + row.route_len + "," +  "\"gpx_id\":" + row.gpx_id + "}" + ",";
        }
    }
    str = str.slice(0,-1);
    str += "]";
    arr = JSON.parse(str);
    //await connection.query(string2);
    res.send(
      arr
    );
  } catch(e) {
  }
});

app.get('/getpointsinroute', async function(req, res) {
  try {
    const [rows, fields] = await connection.execute('SELECT * from `ROUTE` ORDER BY `route_len`');
    let routeName;
    let theId;
    for (let row of rows) {
      if (req.query.data1 == row.route_name) {
        routeName = row.route_name;
        theId = row.route_id;
      }
    }
    let arr = "";
    let str = "[";
    const [rows2, fields2] = await connection.execute('SELECT * from `POINT` ORDER BY `point_index`');
    for (let r of rows2) {
      if (theId == r.route_id) {
        str += "{" + "\"RouteName\":" + "\"" + routeName  + "\"" + "," + "\"Point_ID\":"  + r.point_id + "," +  "\"PointIndex\":" + r.point_index +  "," +  "\"latitude\":" + r.latitude + "," +  "\"longitude\":" + r.longitude + "," + "\"point_name\":" + "\"" + r.point_name  + "\"" + "}" + ",";
      }
    }
    str = str.slice(0,-1);
    str += "]";
    arr = JSON.parse(str);
    res.send(
      arr
    );
  } catch(e) {
  }
});
app.get('/getpointsbyfilenamename', async function(req, res) {
  try {
    const [rows, fields] = await connection.execute('SELECT * from `FILE` ORDER BY `file_name`');
    let fileName;
    let theId;
    for (let row of rows) {
      if (req.query.data1 == row.file_name) {
        fileName = row.file_name;
        theId = row.gpx_id; 
      }
    }
    let arr = "";
    let str = "[";
    const [rows3, fields3] = await connection.execute('SELECT * from `ROUTE` ORDER BY `route_name`');
    const [rows2, fields2] = await connection.execute('SELECT * from `POINT` ORDER BY `point_index`');
    for (let r1 of rows3) {
      for (let r of rows2) {
        if (theId == r1.gpx_id) {
          if (r1.route_id == r.route_id) {
            str += "{" + "\"RouteName\":" + "\"" + r1.route_name + "\"" + "," + "\"Point_ID\":"  + r.point_id + "," +  "\"PointIndex\":" + r.point_index +  "," +  "\"latitude\":" + r.latitude + "," +  "\"longitude\":" + r.longitude + "," + "\"point_name\":" + "\"" + r.point_name  + "\"" + "}" + ",";
          }
        }
      }
    }
    
    str = str.slice(0,-1);
    str += "]";
    console.log(str);
    if (str != "]") {
      arr = JSON.parse(str);
    } else {
      arr = "";
      res.send(
        "[]"
      );
    }
    console.log("duh"+ arr);
    res.send(
      arr
    );
  } catch(e) {
  }
});
app.get('/getpointsbyfilenamelength', async function(req, res) {
  try {
    const [rows, fields] = await connection.execute('SELECT * from `FILE` ORDER BY `file_name`');
    let fileName;
    let theId;
    for (let row of rows) {
      if (req.query.data1 == row.file_name) {
        fileName = row.file_name;
        theId = row.gpx_id; 
      }
    }
    let arr = "";
    let str = "[";
    const [rows3, fields3] = await connection.execute('SELECT * from `ROUTE` ORDER BY `route_len`');
    const [rows2, fields2] = await connection.execute('SELECT * from `POINT` ORDER BY `point_index`');
    for (let r1 of rows3) {
      for (let r of rows2) {
        if (theId == r1.gpx_id) {
          if (r1.route_id == r.route_id) {
            str += "{" + "\"RouteLen\":" + "\"" + r1.route_len + "\"" + "," + "\"Point_ID\":"  + r.point_id + "," +  "\"PointIndex\":" + r.point_index +  "," +  "\"latitude\":" + r.latitude + "," +  "\"longitude\":" + r.longitude + "," + "\"point_name\":" + "\"" + r.point_name  + "\"" + "}" + ",";
          }
        }
      }
    }
    
    str = str.slice(0,-1);
    str += "]";
    console.log(str);
    if (str != "]") {
      arr = JSON.parse(str);
    } else {
      arr = "";
      res.send(
        "[]"
      );
    }
    console.log("duh"+ arr);
    res.send(
      arr
    );
  } catch(e) {
  }
});

app.get('/lastonelength', async function(req, res){
  try {
    const [rows2, fields2] = await connection.execute('SELECT * from `FILE` ORDER BY `file_name`');
    let fileName;
    let theId;
    for (let row of rows2) {
      if (req.query.data1 == row.file_name) {
        fileName = row.file_name;
        theId = row.gpx_id; 
      }
    }
    if (req.query.data3 == "shortest") {
      const [rows, fields] = await connection.execute('SELECT * from `ROUTE` ORDER BY `route_len`');
      let counter = 0;
      let arr = "";
      let str = "[";
      //while (counter < req.query.data2) {
        for (let row of rows) {
          if (row.gpx_id == theId && counter < req.query.data2) {
            str += "{" + "\"Filename\":" + "\"" + fileName  + "\"" + "," + "\"Route_ID\":"  + row.route_id + "," +  "\"Route_name\":" +  "\"" +  row.route_name + "\"" +  "," +  "\"len\":" + row.route_len + "," +  "\"gpx_id\":" + row.gpx_id + "}" + ",";
            counter++;
          }
        }
        
      //}
      str = str.slice(0,-1);
      str += "]";
      arr = JSON.parse(str);
      res.send(
        arr
      );
    } else if (req.query.data3 == "longest") {
      const [rows, fields] = await connection.execute('SELECT * from `ROUTE` ORDER BY `route_len` desc');
      let counter = 0;
      let arr = "";
      let str = "[";
      let idarr = [];
      let i = 0;
        for (let row of rows) {
          if (row.gpx_id == theId && counter < req.query.data2) {
            //str += "{" + "\"Filename\":" + "\"" + fileName  + "\"" + "," + "\"Route_ID\":"  + row.route_id + "," +  "\"Route_name\":" +  "\"" +  row.route_name + "\"" +  "," +  "\"len\":" + row.route_len + "," +  "\"gpx_id\":" + row.gpx_id + "}" + ",";
            idarr.push(row.route_id);
            counter++;
            i++;
          }
        }
        i = 0;
        const [rows3, fields3] = await connection.execute('SELECT * from `ROUTE` ORDER BY `route_len`');
        for (let row of rows3) {
          i = 0;
          while (i < idarr.length) {
            if (idarr[i] == row.route_id) {
              str += "{" + "\"Filename\":" + "\"" + fileName  + "\"" + "," + "\"Route_ID\":"  + row.route_id + "," +  "\"Route_name\":" +  "\"" +  row.route_name + "\"" +  "," +  "\"len\":" + row.route_len + "," +  "\"gpx_id\":" + row.gpx_id + "}" + ",";
            }
            i++;
          }
        }
      //}
      str = str.slice(0,-1);
      str += "]";
      arr = JSON.parse(str);
      res.send(
        arr
      );
    }
  } catch(e) {
  }
});
app.get('/lastonename', async function(req, res) {
  try {
    const [rows2, fields2] = await connection.execute('SELECT * from `FILE` ORDER BY `file_name`');
    let fileName;
    let theId;
    for (let row of rows2) {
      if (req.query.data1 == row.file_name) {
        fileName = row.file_name;
        theId = row.gpx_id; 
      }
    }
    if (req.query.data3 == "shortest") {
      const [rows, fields] = await connection.execute('SELECT * from `ROUTE` ORDER BY `route_len`');
      let counter = 0;
      let arr = "";
      let str = "[";
      let idarr = [];
      let i = 0;
        for (let row of rows) {
          if (row.gpx_id == theId && counter < req.query.data2) {
            //str += "{" + "\"Filename\":" + "\"" + fileName  + "\"" + "," + "\"Route_ID\":"  + row.route_id + "," +  "\"Route_name\":" +  "\"" +  row.route_name + "\"" +  "," +  "\"len\":" + row.route_len + "," +  "\"gpx_id\":" + row.gpx_id + "}" + ",";
            idarr.push(row.route_id);
            counter++;
            i++;
          }
        }
        i = 0;
        const [rows3, fields3] = await connection.execute('SELECT * from `ROUTE` ORDER BY `route_name`');
        for (let row of rows3) {
          i = 0;
          while (i < idarr.length) {
            if (idarr[i] == row.route_id) {
              str += "{" + "\"Filename\":" + "\"" + fileName  + "\"" + "," + "\"Route_ID\":"  + row.route_id + "," +  "\"Route_name\":" +  "\"" +  row.route_name + "\"" +  "," +  "\"len\":" + row.route_len + "," +  "\"gpx_id\":" + row.gpx_id + "}" + ",";
            }
            i++;
          }
        }
      //}
      str = str.slice(0,-1);
      str += "]";
      arr = JSON.parse(str);
      res.send(
        arr
      );
    } else if (req.query.data3 == "longest") {
      const [rows, fields] = await connection.execute('SELECT * from `ROUTE` ORDER BY `route_len` desc');
      let counter = 0;
      let arr = "";
      let str = "[";
      let idarr = [];
      let i = 0;
        for (let row of rows) {
          if (row.gpx_id == theId && counter < req.query.data2) {
            //str += "{" + "\"Filename\":" + "\"" + fileName  + "\"" + "," + "\"Route_ID\":"  + row.route_id + "," +  "\"Route_name\":" +  "\"" +  row.route_name + "\"" +  "," +  "\"len\":" + row.route_len + "," +  "\"gpx_id\":" + row.gpx_id + "}" + ",";
            idarr.push(row.route_id);
            counter++;
            i++;
          }
        }
        i = 0;
        const [rows3, fields3] = await connection.execute('SELECT * from `ROUTE` ORDER BY `route_name`');
        for (let row of rows3) {
          i = 0;
          while (i < idarr.length) {
            if (idarr[i] == row.route_id) {
              str += "{" + "\"Filename\":" + "\"" + fileName  + "\"" + "," + "\"Route_ID\":"  + row.route_id + "," +  "\"Route_name\":" +  "\"" +  row.route_name + "\"" +  "," +  "\"len\":" + row.route_len + "," +  "\"gpx_id\":" + row.gpx_id + "}" + ",";
            }
            i++;
          }
        }
      //}
      str = str.slice(0,-1);
      str += "]";
      arr = JSON.parse(str);
      res.send(
        arr
      );
    } 
  } catch(e) {
  }
});
app.listen(portNum);
console.log('Running app at localhost: ' + portNum);
