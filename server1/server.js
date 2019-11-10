var express = require('express');
var app = express();
var request = require('request');
var bodyParser = require('body-parser');
require('request-debug')(request);
var fetch =  require('fetch');
var mysql = require('mysql');
var ip = require("ip");
var config = require("./config.json");
var ip = require("ip");
var branch = require("./branch.json");
const FileSystem = require("fs");
var cron = require('node-cron');


  // A function to send failed message back to client
  function senderror(res){
    var m = {
      error: "Please get to help desk"
    }
    m = JSON.stringify(m);
    res.send(m);
  }

  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({
    extended: true
  }));

  // CORS removal
  app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.setHeader("Access-Control-Allow-Headers", "Authorization, Cache-Control, Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers");
    next();
  });

  //for getting ipaddress
  app.get('/ipaddr',(req,res)=>{
    console.log("called me");
    var hi = {
      ip: ip.address()
    }
    console.log(hi);
    hi = JSON.stringify(hi);
    console.log(hi);
    res.send(hi);
  })

  // Static HTML server
  app.use(express.static(__dirname + '/public'));

  // DB Connection
  var pool = mysql.createPool(config);

  // Funtion to update token with given values
  function updateTok(fNew, sNew){
    try{
      pool.query('Update token set first= ?, second = ?', [fNew, sNew], (e,r,f)=>{
        if(!e){
          console.log("Token updated");
        }
        else{
          console.log(e);
        }
      })
    }
    catch(er){
      console.log(er);
    }
  }

  // Initialize token everyday to zero
  cron.schedule('* 10 8 * 1-5', () => {
    updateTok('A', 0);
  });

  //  An endpoint to test from mobile application
  app.get('/testdb', (req, res) =>{
    pool.query('SELECT * FROM test', (err,rows,fields)=>{
      if(!err){
         res.send(rows);
      }
      else {
        console.log(err);
      }
    })
  });

  // Getting first and second for Token
  var first = "A".charCodeAt(0);
  var second = 0;
  try {
    pool.query('SELECT * FROM token', (err,rows,fields)=>{
      if(!err && rows.length >0){
         first = rows[0].first.charCodeAt(0);
         second = rows[0].second;
      }
      else {
        console.log(err);
      }
    })
  } catch (e) {
    console.log(e);
  }

  // Endpoint to register to queue with a specific service
  app.post('/regQueue', (req, res) =>{
    console.log("Reg queue called");
    try {
      pool.query('Select departmentId from serviceDepartment where service like ?', req.body.service, (err, rows,fields)=>{
        if(!err){
          var t;
          if(rows.length>0){
            t = rows[0].departmentId;
          }
          else{
            t = 'CASHD';
          }

          if(!t){
            t = 'CASHD';
          }
          if(second===999){
            first++;
            second=1;
          }
          else{
            second++;
          }
          updateTok(String.fromCharCode(first), second);
          pool.query('Select counterCount from DepartmentInfo where departmentId like ?', t, (et, ans, fd)=>{
            if(!et){
              var c;
              if(ans.length>0){
                c = ans[0].counterCount;
              }
              else{
                c = 1;
              }

              if(!c){
                c = 1;
              }
              var x = String.fromCharCode(first) + ''+second;
              pool.query('select count(ticketId) as \'people\' from ??', t, (e, rw, fe)=>{
                if(!e){
                  var te = rw[0].people;
                  var e = te*3/c;
                  e.toFixed(0);
                  pool.query("Insert into ?? values(?, now())", [t, x], (er, row, fiel)=>{
                    if(!er){
                      var m = {
                        token: x,
                        wait_time: e,
                        dept: t
                      }
                    }
                    else{
                      var m = {
                        error: "Please get to help desk"
                      }
                      console.log(er);
                    }
                    m = JSON.stringify(m);
                    res.send(m);
                  })
                }
                else{
                  senderror(res);
                }
              })
            }
            else{
              senderror(res);
            }
          })
        }
        else{
          console.log(err);
        }
      })
    } catch (e) {
      senderror(res);
    }
  });


  // Cancel a token
  app.post('/cancelTicket', (req, res)=>{
    try {
      pool.query('delete from ?? where ticketId like  ?', [req.body.dept, req.body.token], (err, result, fields)=>{
        if(err){
          console.log(err);
          senderror(res);
        }
        else{
          res.send("done");
        }
      })
    } catch (e) {
      console.log(e);
    }
  });

  // Get next token for a counter
  app.post('/getNext', (req, res)=>{
    try {
      pool.query('select departmentId from counterDept where counterId =  ?', [req.body.counterId], (err, r, f)=>{
        if(err){
          console.log(err);
          senderror(res);
        }
        else{
          var t = result[0].departmentId;
          // get the next token from this departmentId:

        }
      })
    }
    catch (e) {
      console.log(e);
    }
  });

  // Starting the server on 8083 port
  app.listen(branch.port, function () {
    console.log('App listening on port ' + branch.port +'!');
  });
