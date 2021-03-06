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
      error: "Please get to help desk from function"
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
    updatePresentStatus();
  });


  // making all presentStatus tokenId to null
 function updatePresentStatus(){
      pool.query('update presentStatus set tokenId = ?',[null],(err,r,f)=>{
        if(err){
          console.log(err);
        }
      })
  }




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
    console.log("req", req.body.service);
    try {
      pool.query('Select departmentId from serviceDepartment where service like ?', req.body.service, (err, rows,fields)=>{
        if(!err){
          var t;
          if(rows.length>0){
            t = rows[0].departmentId;
          }
          else{
            t = 'CASHW';
          }

          if(!t){
            t = 'CASHW';
          }
          if(second===999){
            first++;
            second=1;
          }
          else{
            second++;
          }
          console.log("dept ", t);
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
              console.log("token: ", x);
              pool.query('select count(tokenId) as \'people\' from ??', t, (e, rw, fe)=>{

                if(!e){
                  var te = rw[0].people;
                  var e = te*3/c;
                  e.toFixed(0);
                  if(e===0){
                    e = 2;
                  }
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
                  console.log(e);
                  senderror(res);
                }
              })
            }
            else{
              console.log("departmentInfo error");
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
      pool.query('delete from ?? where tokenId like  ?', [req.body.dept, req.body.token], (err, result, fields)=>{
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

  //Endpoint to get a new customer to a counter
  app.post('/nextCustomer',(req,res)=>{
    try{
      pool.query('select departmentId from counterDepartment where counter like ?',req.body.counter, (err,r,f)=>{
        if(err){
          console.log(err);
          senderror(res);
        }else{
          var dept = r[0].departmentId;
          console.log(dept);
          //check if token exist , if yes delete it
          pool.query('select tokenId from presentStatus where counter like ? and departmentId like ?',[req.body.counter, dept], (err,r,f)=>{
            if(err){
              console.log(err);
              senderror(err);
            }else{
              var tId = r[0].tokenId;
              if(tId != null){
                pool.query('update presentStatus set tokenId = ? where counter like ? and departmentId like ?',[null, req.body.counter, dept], (err,r,f)=>{

                  console.log("token deleted");
                })
              }
              pool.query('select tokenId,arrivalTime from ??',dept, (err,r,f)=>{
                if(err){
                  senderror(res);
                }
                console.log(r);
                if(r.length <= 0){
                  var m = {
                    tok: 'No customers in queue'
                  };
                  m = JSON.stringify(m);
                  res.send(m);
                }else{
                  var custtk = r[0].tokenId;
                  var arrTime = r[0].arrivalTime;
                  addCustomer(dept, custtk, arrTime);
                  pool.query('update presentStatus set tokenId = ? where counter like ? and departmentId like ?',[custtk, req.body.counter, dept], (err,r,f)=>{
                  pool.query('delete from ?? where tokenId = ?', [dept, custtk], (err,r,f)=>{

                  })
                    if(err){
                      console.log(err);
                      senderror(err);
                    }else{
                      var m = {
                        tok: custtk
                      };
                      m = JSON.stringify(m);
                      res.send(m);
                    }
                  })
                }
              })
            }
          })
        }
      })
    }catch(e){
      console.log(e);
    }
  });

  //function to get daily statistics from customers
  function addCustomer(dept, tkId, arrTime){

    var dur;
    pool.query('select TIMEDIFF(CURRENT_TIME(),?) as dur',arrTime,(err,r,f)=>{

      if(err){
        console.log(err);
      }else{
        dur = r[0].dur;

        pool.query('INSERT INTO dailyBranchStatistics(tokenId, departmentId, waitingTime) VALUES(? ,?, TIME_TO_SEC(?))',[tkId, dept, dur], (err,r,f)=>{

          if(err){
            console.log(err);
          }else{
            console.log("value set successfully");
          }
        })
      }
    })


  }

  //calculating weekly statistics
  app.post('/calculateWeeklyStats',(req,res)=>{
    console.log("calc called");
    evaluateWeekly();
    res.send("done");
  })
  //function to get weekly statistics
  function evaluateWeekly(){
    console.log("evlaueate weekly called");

    pool.query('select departmentId, avg(waitingTime) as av,min(waitingTime) as mn, max(waitingTime) as mx from dailyBranchStatistics group by(departmentId)',(err,r,f)=>{
      if(err){
        console.log(err);
      }else{
        pool.query('insert into weeklyBranchStatistics(departmentId, averageWaitingTime, minimumWaitingTime, maximumWaitingTime) values(?, ?, ?, ?)',[r[0].departmentId, r[0].av, r[0].mn, r[0].mx], (err,r,f)=>{
          if(err){
            senderror(res);
          }else{
            console.log("weekly operation succesfull");
          }
        })
      }
    })
  }

  //kindly send tokenId in post request to get the appropriate result
  app.post('/checkTurn',(req,res)=>{
      pool.query('select * from presentStatus where tokenId like ?', req.body.tokenId, (err,r,f)=>{
        if(err){
          console.log(err);
          senderror(res);
        }else{
          var c = -1;
          if(r.length > 0){
            c = r[0].counter;
          }
          result = {
            counter: c
          }
          result = JSON.stringify(result)
          res.send(result);
        }
      })
  })

 //sending branch statistics to center, kindly send branchId
 app.post('/calculateCentralStats',(req,res)=>{
   var bId = req.body.branchId;
   var bg;
   var sm;
   var bgb;
   var smb;
   pool.query('select * from weeklyBranchStatistics where (departmentId,minimumWaitingTime) IN (select departmentId,min(minimumWaitingTime) from weeklyBranchStatistics group by departmentId)',(err,r,f)=>{
     if(err){
       console.log(err);
     }else{
       sm = r[0].minimumWaitingTime;
       smb = r[0].departmentId;

       pool.query('select * from weeklyBranchStatistics where (departmentId,maximumWaitingTime) IN (select departmentId,max(maximumWaitingTime) from weeklyBranchStatistics group by departmentId)',(err,ro,fe)=>{
         if(err){
           console.log(err);
         }else{
           bg = ro[0].maximumWaitingTime;
           bgb = ro[0].departmentId;

           pool.query('insert into centralStatistics(branchId, minimumWaitingTime, maximumWaitingTime, minWtDept, maxWtDept) values(?,?,?,?,?)',[bId, sm, bg, smb, bgb],(err,row,fie)=>{
             if(err){
               console.log(err);
               senderror(res);
             }else{
                res.send("done");
             }
           })


         }
       })

     }
   })







   // var bg;
   // var sm;
   // pool.query('select min(minimumWaitingTime) as mn from weeklyBranchStatistics group by(departmentId)',(err,r,f)=>{
   //   if(err){
   //     console.log(err);
   //     senderror(res);
   //   }else{
   //     sm = r[0].mn;
   //     console.log("sm",sm);
   //   }
   // })
   //
   // pool.query('select max(maximumWaitingTime) as mx from weeklyBranchStatistics group by(departmentId)',(err,r,f)=>{
   //   if(err){
   //     console.log(err);
   //     senderror(res);
   //   }else{
   //     bg = r[0].mx;
   //     console.log("bg",bg);
   //   }
   // })
      // bg = parseInt(bg);
      // sm = parseInt(sm);
      //  var bgb;
      //  var smb;
      //  pool.query('select departmentId from weeklyBranchStatistics where minimumWaitingTime = ?',sm,(err,r,f)=>{
      //    if(err){
      //      console.log(err);
      //      senderror(res);
      //    }else{
      //      smb = r[0].departmentId;
      //    }
      //  })
      //
      //  pool.query('select departmentId from weeklyBranchStatistics where maximumWaitingTime = ?',bg,(err,r,f)=>{
      //    if(err){
      //      console.log(err);
      //      senderror(res);
      //    }else{
      //      bgb = r[0].departmentId;
      //    }
      //  })
      //
      //  console.log("smb ", smb);
      //  console.log("bgb ", bgb);
      //  pool.query('insert into centralStatistics(branchId,minimumWaitingTime, maximumWaitingTime, minWtDept, maxWtDept) values(?,?,?,?,?)',[bId, sm, bg, smb,bgb],(err,r,f)=>{
      //    if(err){
      //      console.log(err);
      //      senderror(res);
      //    }else{
      //      console.log("calculation of central statistics done");
      //    }
      //  })

 })

 //sending all daily info(departmentId, avgWaitingTime) to frontend
 app.post('/getDailyInfo',(req,res)=>{
   pool.query('select avg(waitingTime) as av, departmentId from dailyBranchStatistics group by departmentId',(err,r,f)=>{
     if(err){
       console.log(err);
       senderror(err);
     }else{
       var br = [];
       var avgWt = [];
       r.forEach((row)=>{
         br.push(row.departmentId);
         avgWt.push(row.av);
       })
       console.log(br);
       console.log(avgWt);
       var dataPoints = [];
       for(var i=0; i < br.length; i++){
         var obj = {
           x: br[i],
           y: avgWt[i]
         }
         dataPoints.push(obj);
       }
       console.log(dataPoints);
       dataPoints = dataPoints.toString();
       res.send(dataPoints);
     }
   })
 })

 //sending all weeekly info(departmentId, avgWaitingTime) to frontend
 app.post('/getWeeklyInfo',(req,res)=>{
   pool.query('select * from weeklyBranchStatistics',(err,r,f)=>{
     if(err){
       console.log(err);
       senderror(res);
     }else{
       console.log('inside else condition');
       var br = [];
       var av = [];
       var mx = [];
       var mn = [];
       var rs = [];
       r.forEach((row)=>{
         br.push(row.departmentId);
         av.push(row.averageWaitingTime);
         mx.push(row.minimumWaitingTime);
         mn.push(row.maximumWaitingTime);
       })
       var dataPoint1 = [];
       var dataPoint2 = [];
       var dataPoint3 = [];
       for(var i=0; i < br.length; i++){
         var obj1 = {
           x: br[i],
           y: av[i]
         }
         var obj2 = {
           x: br[i],
           y: mx[i]
         }
         var obj3 = {
           x: br[i],
           y: mn[i]
         }

         dataPoint1.push(obj1);
         dataPoint2.push(obj2);
         dataPoint3.push(obj3);
       }
       rs.push(dataPoint1);
       rs.push(dataPoint2);
       rs.push(dataPoint3);
       console.log(rs);
       res.send(rs);
     }
   })
 })
  // Starting the server on 8083 port
  app.listen(branch.port, function () {
    console.log('App listening on port ' + branch.port +'!');
  });
