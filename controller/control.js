
const con = require('../model/schema');
exports.loginauth = async (req, res) => {
  try {
    const { username, password } = req.body;

    // Validate input
    if (!username || !password) {
      return res.status(400).json({
        status: 'fail',
        message: 'Username and password are required'
      });
    }

    // Query database
    con.query(
      'SELECT * FROM userdetails WHERE username = ? AND userpass = ?',
      [username, password],
      (error, result) => {
        if (error) {
          console.error('MySQL Error:', error);
          return res.status(500).json({
            status: 'fail',
            message: 'Database error'
          });
        }

        if (result.length > 0) {
          return res.status(200).json({
            status: 'valid',
            user: result[0]
          });
        } else {
          return res.status(401).json({
            status: 'invalid',
            message: 'Invalid username or password'
          });
        }
      }
    );
  } catch (error) {
    res.status(500).json({
      status: 'fail',
      message: 'Server error'
    });
  }
};
  exports.addsalesorder=function (req, res) {
    try {
      let invitem = req.body.inventoryEntries;
      let orderno = req.body.orderNo;
      let date = req.body.date;
      let executive = req.body.executive;
      let user = req.body.username;
      let party = req.body.partyName;
      let count = 0;

      con.query("insert into voucher(voucherNo,date,vouchertype,partyname,executive,username) values (?,?,?,?,?,?)",[orderno,date,"Sales Order",party,executive,user]);

      for (i = 0; i < invitem.length; i++) {
        let itemno = invitem[i].sno;
        let partno = invitem[i].partno;
        let stk = invitem[i].stockitemname;
        let qty = invitem[i].qty;
         con.query("insert into salesorder(orderNo,partyname,date,executive,username,partNo,stockname,quantity,itemno) values (?,?,?,?,?,?,?,?,?)", [orderno, party, date, executive, user, partno, stk, qty, itemno]);
        count++;
      }

      if (count === invitem.length) {
        res.status(200).json({
          status: 'valid',
        });
      }

      else {
        res.status(200).json({
          status: 'invalid',
        });
      }
    }
    catch (error) {
      res.status(404).json({
        status: 'fail',
        message: error,
      });
    }
  }

  exports.addreceipt=async(req,res)=>{
    try{
         
         con.query("Select * from receipt where receiptNo=? AND partyName=? AND amount=? AND date=? AND mode=? AND executive=? AND username=?",[req.body.receiptNo,req.body.partyName,req.body.amount,req.body.date,req.body.mode,req.body.executive,req.body.username],function(error,result,field){
          if(error) throw error;
          if(result.length>0){
            res.status(200).json({
              status:'already exists',
            })
          }
        
        else{
          con.query("insert into voucher(voucherNo,date,vouchertype,partyname,executive,username) values (?,?,?,?,?,?)",[req.body.receiptNo,req.body.date,"Receipt",req.body.partyName,req.body.executive,req.body.username]);
          con.query("Insert into receipt (receiptNo,partyname,amount,date,mode,executive,username) values (?,?,?,?,?,?,?)",[req.body.receiptNo,req.body.partyName,req.body.amount,req.body.date,req.body.mode,req.body.executive,req.body.username],function(error,result,field){
          if(error) throw error;
          if(result.affectedRows===1){
           res.status(200).json({
          status:'valid',
        })
          }
          else{
            res.status(200).json({
              status:'invalid',
            })
          }
      });
    }});
      }
      catch(error){
        res.status(404).json({
            status:'fail',
            message:error,
        });
      }
  }

  exports.getsalesorder=async(req,res)=>{
    try{
      con.query("Select orderNo from salesorder where username=? AND executive=?",[req.params.user,req.params.executive],function(error,result,field){
       if(error) throw error;
       if(result.length>0){
       vchno=result[result.length-1].orderNo
        res.status(200).json({
          status:'exist',
          number:vchno
        })
      }
      else{
        res.status(200).json({
          status:'no'
                })
      }
       
      })
    }
      catch(error){
        res.status(404).json({
            status:'fail',
            message:error,
        });
      }
  }

  exports.getreceipt=async(req,res)=>{
    try{
      con.query("Select receiptNo from receipt where username=? AND executive=?",[req.params.user,req.params.executive],function(error,result,field){
        if(error) throw error;
        
        if(result.length>0){
        vchno=result[result.length-1].receiptNo
         res.status(200).json({
           status:'exist',
           number:vchno
         })
       }
       else{
         res.status(200).json({
           status:'no'
                 })
       }
        
       })
       
      }
      catch(error){
        res.status(404).json({
            status:'fail',
            message:error,
        });
      }
  }

  exports.getvoucher=async(req,res)=>{
    try{
        con.query("Select * from voucher where username=? AND date BETWEEN ? AND ? ",[req.params.user,req.params.start,req.params.end],function(error,result,field){
          if(error) throw error;
          if(result.length>0){
           res.status(200).json({
          voucher:result
        })
          }
          else{
            res.status(200).json({
              status:'invalid',
            })
          }
        });
      
     
    }
    catch(error){
      res.status(404).json({
          status:'fail',
          message:error,
      });
    }
  };
  
  exports.extractdata=async(req,res)=>{
    try{
      let data;
      con.query("Select * from salesorder where username=? AND date BETWEEN ? AND ? ",[req.params.user,req.params.start,req.params.end],function(error,result,field){
        if(error) throw error;
        if(result.length>0){
        data=result;
        }
        else{
          data="empty";
        }
       
      });

      con.query("Select * from receipt where username=? AND date BETWEEN ? AND ? ",[req.params.user,req.params.start,req.params.end],function(error,result,field){
        if(error) throw error;
        if(result.length>0){
         res.status(200).json({
         salesorder:data,
        receipt:result
      })
        }
        else{
          res.status(200).json({
            salesorder:data,
            receipt:"empty"
          })
        }
      });
    
   
  }
  catch(error){
    res.status(404).json({
        status:'fail',
        message:error,
    });
  }
  };

  exports.importdata=function(req,res){
    try{
    user=req.body.username;
    retval=req.body.data;
    retval = retval.replace('<ENVELOPE>', ''); //Eliminate ENVELOPE TAG
    retval = retval.replace('</ENVELOPE>', '');
    retval = retval.replace(/\s+\r\n/g, ''); //remove empty lines
    retval = retval.replace(/\s+\<F/g, '<F');
    retval = retval.replace('<F01>', '');
    retval = retval.replace(/\r\n/g, ''); 
    retval = retval.replace(/&amp;/g, '&'); //escape ampersand
    retval = retval.replace(/&lt;/g, '<'); //escape less than
    retval = retval.replace(/&gt;/g, '>'); //escape greater than
   collection=retval.split("</F01><F02>");
   stklst=collection[0].split("</F01><F01>");
   ledlst=collection[1].split("</F02><F02>");
     con.query("delete from stocklist where username=?",[user]);
     con.query("delete from ledgerlist where username=?",[user]);
   for(i=0;i<stklst.length;i++){
    con.query("insert into stocklist(username,name) values (?,?)", [user,stklst[i]],function(error,result){
     if(error) throw error;
    });

   }
   
   for(i=0;i<ledlst.length;i++){
    if(i==(ledlst.length-1)){
    ledlst[i]=ledlst[i].replace("</F02>","");
      }
        con.query("insert into ledgerlist(username,name) values (?,?)", [user,ledlst[i]],function(error,result){
     if(error) throw error;
    });

   }
      res.status(200).json({
          status: 'Updated Successfully'
        });

      }

      catch(err){
        res.status(404).json({
            status:'fail',
            message:err,
        });
      }

  };

  exports.importled=function(req,res){
    try{
    user=req.body.username;
    ledlst=req.body.data;
    con.query("delete from ledgerlist where username=?",[user]);
      
   for(i=0;i<ledlst.length;i++){
        con.query("insert into ledgerlist(username,name) values (?,?)", [user,ledlst[i]],function(error,result){
     if(error) throw error;
    });

   }
      res.status(200).json({
          status: 'Updated Successfully'
        });

      }

      catch(err){
        res.status(404).json({
            status:'fail',
            message:err,
        });
      }

  };

  exports.importcc=function(req,res){
    try{
    user=req.body.username;
    cclst=req.body.data;
    con.query("delete from cclist where username=?",[user]);
      
   for(i=0;i<cclst.length;i++){
        con.query("insert into cclist(username,name) values (?,?)", [user,cclst[i]],function(error,result){
     if(error) throw error;
    });

   }
      res.status(200).json({
          status: 'Updated Successfully'
        });

      }

      catch(err){
        res.status(404).json({
            status:'fail',
            message:err,
        });
      }

  };

  exports.importstock=function(req,res){
    try{
    user=req.body.username;
    stklst=req.body.data;
    if(req.body.initial=="yes"){
    con.query("delete from stocklist where username=?",[user]);
  }
  
   for(i=0;i<stklst.length;i++){
        data=stklst[i].split("</");
        con.query("insert into stocklist(username,name,partno) values (?,?,?)", [user,data[0],data[1]],function(error,result){
     if(error) throw error;
     
    });

   }
      res.status(200).json({
          status: 'Updated Successfully'
        });

      }

      catch(err){
        res.status(404).json({
            status:'fail',
            message:err,
        });
      }

  };

  exports.getparty=async(req,res)=>{
    try{
      con.query("Select name from ledgerlist where username=? ",[req.params.user],function(error,result,field){
        if(error) throw error;
        if(result.length>0){
         res.status(200).json({
        party:result
      })
        }
        else{
          res.status(200).json({
            status:'invalid',
          })
        }
      });

    }
    catch(error){
      res.status(404).json({
        status:'fail',
        message:err,
    });
    }
  };

  exports.getstock=async(req,res)=>{
    try{
      con.query("Select name,partno from stocklist where username=? ",[req.params.user],function(error,result,field){
        if(error) throw error;
        if(result.length>0){
         res.status(200).json({
        stock:result
      })
        }
        else{
          res.status(200).json({
            status:'invalid',
          })
        }
      });

    }
    catch(error){
      res.status(404).json({
        status:'fail',
        message:err,
    });
    }
  }

  exports.getcc=async(req,res)=>{
    try{
      con.query("Select name from cclist where username=? ",[req.params.user],function(error,result,field){
        if(error) throw error;
        if(result.length>0){
         res.status(200).json({
        cc:result
      })
        }
        else{
          res.status(200).json({
            status:'invalid',
          })
        }
      });

    }
    catch(error){
      res.status(404).json({
        status:'fail',
        message:err,
    });
    }
  }
  exports.invalid=async(req,res)=>{
    res.status(404).json({
        status: 'fail',
        message: 'Invalid path',
      });
};

  

