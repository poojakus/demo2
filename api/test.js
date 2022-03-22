const Paytm = require('./api/service/paytm/index');

async function verify(){
    try{
        console.log(await Paytm.verify_transaction("5e451c7c5e8dc604943a206b"));
    } catch(err){
        console.log("EXCEPTION",err);
    }
}

verify();

