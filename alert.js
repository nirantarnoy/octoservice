var request = require('request');
var fs = require('fs');
var os = require('os');
const si = require('systeminformation');
const osLocale = require('os-locale');
var link = "http://www.cameliso.net/alert/api/index.php?";
var data = 0;
var board,cpu,time,user,hostname,serial,distro,graphics,harddisk,ethernet,ip,mac,program,links,serial2,manufacturer2,board2,memLayout,blockDevices,locale;
var memall = os.totalmem();
var homedir = os.userInfo().homedir;
(async () => {locale = await osLocale()})();
var ram = Math.floor(memall / 1024 / 1024 * 100 / 100000)+" GB";
if (fs.existsSync("C:\\Program Files (x86)\\Microsoft Dynamics AX\\60\\Client\\Bin\\Ax32.exe")) {program = "Microsoft Dynamics AX";}else{program ="";}
si.cpu(function(data){
	cpu = data.manufacturer+' '+data.brand+' '+data.speed+' GHz';
	cpu = cpu.replace("®","");
	cpu = cpu.replace("™","");
});
si.system(function(data) {
	board = data.model;
	manufacturer = data.manufacturer;
	serial = data.serial;
});

si.baseboard(function(data) {
	board2 = data.model;
	manufacturer2 = data.manufacturer;
	serial2 = data.serial;
});
si.users(function(data) {
	user = data[0].user;
	time = data[0].date+' '+data[0].time+':00';
});
si.osInfo(function(data) {
	hostname = data.hostname;
	distro = data.distro+' '+data.arch+' release : '+data.release;
});
si.graphics(function(data) {
	graphics = data.controllers[0].model;
});
si.networkConnections(function(data) {
	//console.log(data);

});

si.blockDevices(function(data) {
	blockDevices = [];
	for(var i = 0; i < data.length; i++){
		if(data[i].label.length > 0)data[i].label = ' - '+data[i].label;
		if(data[i].serial.length > 0)data[i].serial = ' - '+data[i].serial;
		blockDevices[i] = data[i].name+' '+data[i].type+' '+Math.floor(data[i].size / 1024 / 1024 * 100 / 100000)+'GB - '+data[i].physical+data[i].label+data[i].serial;
		blockDevices[i] = blockDevices[i].replace("/"," ");
		blockDevices[i] = blockDevices[i].replace("®","");
		blockDevices[i] = blockDevices[i].replace("™","");
	}
});

si.diskLayout(function(data) {
	var harddisk2 = [];
	for(var i = 0; i < data.length; i++){
		harddisk2[i] = data[i].type+' '+data[i].name+' '+Math.floor(data[i].size / 1024 / 1024 * 100 / 100000)+'GB - '+data[i].interfaceType+' - '+data[i].serialNum;
		harddisk2[i] = harddisk2[i].replace("®","");
		harddisk2[i] = harddisk2[i].replace("™","");
	}
	harddisk = harddisk2;
});
si.networkInterfaces(function(data) {
	ethernet = data[0].iface;
	ip = data[0].ip4;
	mac = data[0].mac.toUpperCase();
});

si.memLayout(function(data) {
	memLayout = [];
	for(var i = 0; i < data.length; i++){
		memLayout[i] = data[i].bank+' - '+data[i].type+' '+data[i].manufacturer+' '+Math.floor(data[i].size / 1024 / 1024 * 100 / 100000)+'GB '+data[i].clockSpeed+'MHz - ';
		memLayout[i] += data[i].partNum+' - '+data[i].serialNum;
		memLayout[i] = memLayout[i].replace("®","");
		memLayout[i] = memLayout[i].replace("™","");
	}
});

//setInterval(alert_pm, 100000)
setInterval(alert_pm, 5000)


function cleck_alert(){
	if(board == "All Series"){
		board = board2;
		manufacturer = manufacturer2;
		serial = serial2;
	}
    links = link+"AssetNo="+hostname+"&serial="+serial+"&cpu="+cpu+"&ram="+ram+"&harddisk="+harddisk+"&locale="+locale;
    links = links+"&program="+program+"&user="+user+"&manufacturer="+manufacturer+"&homedir="+homedir;
    links = links+"&ip="+ip+"&mac="+mac+"&ethernet="+ethernet+"&time="+time+"&blockDevices="+blockDevices;
    links = links+"&board="+board+"&graphics="+graphics+"&distro="+distro+"&memLayout="+memLayout;
    //console.log(links);
	request(links ,function (error, response, body) {
	  if (!error && response.statusCode == 200) {
	   console.log(body)
	    if(body > 1){ data = 1;}else{ data = 0;} 
	  } else {
	    //console.log("Error "+response.statusCode)
	  }
	})
}

 function alert_pm() {
 	cleck_alert()
 	if(data == 1)require("openurl").open("http://www.cameliso.net/alert/index.php");
}
