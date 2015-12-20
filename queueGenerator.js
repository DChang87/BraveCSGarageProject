var i;
var file = require("./listener.js");
var INPARK=1,OCCUPYspot=2,OUTPARK=3,MOVECARBYCARID=4,MOVECARBYspotID=5;
for (var j=0;j<5;j++){
	i =Math.floor((Math.random() * 5) + 1);
	console.log(i);
	if (i==INPARK){
		init();
		var car=Math.floor((Math.random()*80)+1);
		var floor = Math.floor((Math.random()*3)+1);
		console.log(" park car "+car+ " on floor "+floor);
		INPARK(""+car,"L1",floor);
	}
	else if (i==OCCUPYspot){
		init();
		var car=Math.floor((Math.random()*80)+1);
		var row = Math.floor((Math.random()*12)+41);
		var spot = Math.floor((Math.random()*4)+1);
		var floor = Math.floor((Math.random()*3)+1);
		console.log("occupyspot with car "+ car+" in spot "+row+"-"+spot+" on floor "+floor);
		occupyspot(row+"-"+spot,""+car,"L2",floor);
	}
	else if (i==OUTPARK){
		init();
		var car=Math.floor((Math.random()*50)+1);
		console.log("pickUp "+car);
		OUTPARK(""+car);
	}
	else if (i==MOVECARBYCARID){
		init();
		var car=Math.floor((Math.random()*80)+1);
		var row = Math.floor((Math.random()*12)+41);
		var spot = Math.floor((Math.random()*4)+1);
		var floor = Math.floor((Math.random()*3)+1);
		console.log("moveCarbyCarID "+car+" "+row+"-"+spot+" on floor "+floor);
		moveCarbyCarID(""+car,row+"-"+spot,floor);
	}
	else if (i==MOVECARBYspotID){
		init();
		var row1 = Math.floor((Math.random()*12)+41);
		var spot1 = Math.floor((Math.random()*4)+1);
		var row2 = Math.floor((Math.random()*12)+41);
		var spot2 = Math.floor((Math.random()*4)+1);
		var floor1 = Math.floor((Math.random()*3)+1);
		var floor2 = Math.floor((Math.random()*3)+1);
		console.log("moveCarbyspotID from spot "+row1+"-"+spot1+" on floor "+floor1+" to spot "+row2+"-"+spot2+" on floor "+floor2);
		moveCarbyspotID(row1+"-"+spot1,floor1,row2+"-"+spot2,floor2);
	}
}
