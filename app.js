var request = require('request');

//var link = "http://www.cameliso.net/alert/api/index.php?";
//var url = "http://localhost/octo/backend/web/index.php?r=site/index";
var url = "http://backend.octopus.co.th/index.php?r=site/calorder";

setInterval(checknotify, 7200000) // 2 ชั่วโมง // 1 minute = 60000

function checknotify(){
    request(url ,function (error, response, body) {
        if (!error && response.statusCode == 200) {
            console.log("ok");
        } else {
            //console.log("Error "+response.statusCode)
        }
    })
}


