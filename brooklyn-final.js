//read README.txt first for an overview of the code and the functions
//most of the console.log are commented out for now for a cleaner output
//to uncomment, ctrl+H and replace "//->" with ""
var HOST="192.168.150.145";
var PORT=5007;
var transactions = JSON.parse("{}");
var http = require('http');
http.createServer(function (req, res) {
    // Only listen for POST requests
    if (req.method === 'POST') {
        var buffer = '';
        req.on('data', function (chunk) {            buffer += chunk;        });
        req.on('end', function () { 
            var path = req.url.substring(0, req.url.indexOf('/', 1)).toUpperCase();
            var json;
            try {                json = JSON.parse(buffer);            } 
            catch (err) {}
            if (path === '/INPARK') {
                INPARK(json.carID,json.lift,json.floor);
                res.write(JSON.stringify(transactions));
            } else if (path === '/OUTPARK') {
            	OUTPARK(json.carID);
                res.write(JSON.stringify(transactions));
            } else {                res.write('BAD REQUEST');            }
            res.end(); 
        });
    }
}).listen(PORT, HOST);

var FIRST= 0, SECOND = 1;
var carCount=[0,0,0]; //the number of cars on each level
var transactions = JSON.parse("{}");
var mydata;
var shuttleID = ["111","211","311"];
var lift1State = false, lift2State = false; //not busy
var fs = require("fs");
function pspot(type,first,second,third,left,right,across,name){
	//object to store information about each parking spot
	//setting information to point to other pspot objects
	this.type =type; //FIRST or SECOND car type (first is the aisle car)
 	this.neighbourL = left;
  	this.neighbourR = right;
	this.name = name;
	this.first=first;
	this.second = second;
	if (first!=null){			first.second=this;		} 
	if (second!=null){			second.first=this;		}
	this.across=across;
	if (across!=null){					across.across=this;			}
  	if (left!=null){		    		left.neighbourR = this;  	}
  	if (right!=null){		    		right.neighbourL = this;  	}
	this.available=function(floor){					return (mydata["floor"+floor][this.name]=="-1");		}; //if the spot has a cargo or not
	this.accessible = function(floor){ //if this spot can be accessed, i.e. if a car can be moved to the spot without collision
		if (this.type==FIRST){			return true;		}
		if (this.type==SECOND){			return (mydata["floor"+floor][this.first.name]=="-1" && mydata["floor"+floor][this.name]=="-1");		}
	}
}
init = function(){
	mydata = JSON.parse(fs.readFileSync("input.json".toString())); //read data and set/re-set variables
	carCount[0]=0;
	carCount[1]=0;
	carCount[2]=0;
	for (var f=1;f<=3;f++){
		for ( i=0;i<pspots.length;i++){
			if (mydata["floor"+f][pspots[i].name]!='-1'){			carCount[f-1]++;		}
		}	
	}
	transactions = JSON.parse('[]');
}
closeFile = function(){ //write to file and console
	fs.writeFileSync("input.json",JSON.stringify(mydata, null, '\t'));
	fs.appendFileSync("transaction.json",JSON.stringify(transactions, null, '\t')+"\n");
	console.log(JSON.stringify(transactions, null, '\t'));
	//printMap();
}
//creating pspot objects and setting up the connections
p1= new pspot(SECOND,null,null,null,null,null,null,"41-4");	p2= new pspot(FIRST,null,p1,null,null,null,null,"41-3");		p3= new pspot(FIRST,null,null,null,null,null,p2,"41-2");		
p4= new pspot(SECOND,p3,null,null,null,null,null,"41-1");	p5= new pspot(SECOND,null,null,null,p1,null,null,"42-4");	p6= new pspot(FIRST,null,p5,null,null,p3,null,"42-3");
p7= new pspot(FIRST,null,null,null,null,p3,p6,"42-2");		p8= new pspot(SECOND,p7,null,null,null,p4,null,"42-1");		p9= new pspot(SECOND,null,null,null,p5,null,null,"43-4");		
p10= new pspot(FIRST,null,p9,null,p6,null,null,"43-3");		p11= new pspot(FIRST,null,null,null,null,p7,p10,"43-2");		p12=new pspot(SECOND,p11,null,null,null,p8,null,"43-1");
p13= new pspot(SECOND,null,null,null,p9,null,null,"44-4");	p14= new pspot(FIRST,null,p13,null,p10,null,null,"44-3");	p15= new pspot(SECOND,null,null,null,p13,null,null,"45-4");	
p16= new pspot(FIRST,null,p15,null,p14,null,null,"45-3");	p17= new pspot(SECOND,null,null,null,p15,null,null,"46-4");	p18= new pspot(FIRST,null,p17,null,p16,null,null,"46-3");	
p19= new pspot(FIRST,null,null,null,null,null,p18,"46-2");	p20= new pspot(SECOND,p19,null,null,null,null,null,"46-1");	p21= new pspot(SECOND,null,null,null,p17,null,null,"47-4");	
p22= new pspot(FIRST,null,p21,null,p18,null,null,"47-3");	p23= new pspot(FIRST,null,null,null,null,p19,p22,"47-2");	p24= new pspot(SECOND,p23,null,null,null,p20,null,"47-1");		
p25= new pspot(SECOND,null,null,null,p21,null,null,"48-4");	p26= new pspot(FIRST,null,p25,null,p22,null,null,"48-3");	p27= new pspot(FIRST,null,null,null,null,p23,p26,"48-2");	
p28= new pspot(SECOND,p27,null,null,null,p24,null,"48-1");	p29= new pspot(SECOND,null,null,null,p25,null,null,"49-4");	p30= new pspot(FIRST,null,p29,null,p26,null,null,"49-3");	
p31= new pspot(FIRST,null,null,null,null,p27,p30,"49-2");	p32= new pspot(SECOND,p31,null,null,null,p28,null,"49-1");	p33= new pspot(SECOND,null,null,null,p29,null,null,"50-4");	
p34= new pspot(FIRST,null,p33,null,p30,null,null,"50-3");	p35= new pspot(FIRST,null,null,null,null,p31,p34,"50-2");	p36= new pspot(SECOND,p35,null,null,null,p32,null,"50-1");	
p37= new pspot(SECOND,null,null,null,p33,null,null,"51-4");	p38= new pspot(FIRST,null,p37,null,p34,null,null,"51-3");	p39= new pspot(FIRST,null,null,null,null,null,p38,"51-2");	
p40= new pspot(SECOND,p39,null,null,null,p36,null,"51-1");	p41= new pspot(FIRST,null,null,null,p38,null,null,"52-3");	p42= new pspot(FIRST,null,null,null,null,null,p41,"52-2");	
p43= new pspot(SECOND,p42,null,null,null,p40,null,"52-1");
addToTransactions = function(equipment,action,floor,spot){
	//adds to the transactions array
	var ID = ""+Math.floor((Math.random() * 10000000) + 15130245);
	transactions.push(JSON.parse("{}"));
	transactions[transactions.length-1]["move"]={};
	if (action!="LIFT"){ //if this is a shuttle moving
		transactions[transactions.length-1]["move"]["action"]=action;
		if (spot=="L1" || spot=="L2"){ //if the shuttle is moving to an lift
			if (spot=="L1"){
				transactions[transactions.length-1]["move"]["spot"]=3;	
			}
			else if (spot=="L2"){
				transactions[transactions.length-1]["move"]["spot"]=2;
			}
			transactions[transactions.length-1]["move"]["row"]=52;
		}
		else{ 
			transactions[transactions.length-1]["move"]["row"]=spot.substring(0,2);
			transactions[transactions.length-1]["move"]["spot"]=spot.substring(3);	
		}
	}
	transactions[transactions.length-1]["move"]["floor"]=floor;
	transactions[transactions.length-1]["move"]["machineID"]=equipment;
	transactions[transactions.length-1]["move"]["requestID"] = ID;
}
printMap = function(){
	//print the garage map for each floor, code is commented out right now since printMap is only useful for debugging purposes
	for (var floor=1;floor<=3;floor++){
		//->console.log("row 41    "+mydata["floor"+floor]["41-4"]+" "+mydata["floor"+floor]["41-3"]+"    "+mydata["floor"+floor]["41-2"]+" "+mydata["floor"+floor]["41-1"]);
		//->console.log("row 42    "+mydata["floor"+floor]["42-4"]+" "+mydata["floor"+floor]["42-3"]+"    "+mydata["floor"+floor]["42-2"]+" "+mydata["floor"+floor]["42-1"]);
		//->console.log("row 43    "+mydata["floor"+floor]["43-4"]+" "+mydata["floor"+floor]["43-3"]+"    "+mydata["floor"+floor]["43-2"]+" "+mydata["floor"+floor]["43-1"]);
		//->console.log("row 44    "+mydata["floor"+floor]["44-4"]+" "+mydata["floor"+floor]["44-3"]);
		//->console.log("row 45    "+mydata["floor"+floor]["45-4"]+" "+mydata["floor"+floor]["45-3"]);
		//->console.log("row 46    "+mydata["floor"+floor]["46-4"]+" "+mydata["floor"+floor]["46-3"]+"    "+mydata["floor"+floor]["46-2"]+" "+mydata["floor"+floor]["46-1"]);
		//->console.log("row 47    "+mydata["floor"+floor]["47-4"]+" "+mydata["floor"+floor]["47-3"]+"    "+mydata["floor"+floor]["47-2"]+" "+mydata["floor"+floor]["47-1"]);
		//->console.log("row 48    "+mydata["floor"+floor]["48-4"]+" "+mydata["floor"+floor]["48-3"]+"    "+mydata["floor"+floor]["48-2"]+" "+mydata["floor"+floor]["48-1"]);
		//->console.log("row 49    "+mydata["floor"+floor]["49-4"]+" "+mydata["floor"+floor]["49-3"]+"    "+mydata["floor"+floor]["49-2"]+" "+mydata["floor"+floor]["49-1"]);
		//->console.log("row 50    "+mydata["floor"+floor]["50-4"]+" "+mydata["floor"+floor]["50-3"]+"    "+mydata["floor"+floor]["50-2"]+" "+mydata["floor"+floor]["50-1"]);
		//->console.log("row 51    "+mydata["floor"+floor]["51-4"]+" "+mydata["floor"+floor]["51-3"]+"    "+mydata["floor"+floor]["51-2"]+" "+mydata["floor"+floor]["51-1"]);
		//->console.log("          "+"   L1    L2");
		//->console.log("row 52    "+"   "+mydata["floor"+floor]["52-3"]+"    "+mydata["floor"+floor]["52-2"]+" "+mydata["floor"+floor]["52-1"]);
		//->console.log("FLOOR "+floor);	
	}
}
//the order to park the cars
parkingOrder = [p43,p42,p41,p40,p39,p37,p38,p36,p35,p33,p34,p32,p31,p29,p30,p28,p27,p25,p26,p24,p23,p21,p22,p20,p19,p17,p18,p15,p16,p13,p14,p9,p10,p12,p11,p5,p6,p8,p7,p4,p3,p1,p2];
//all the available parking spots stored in an array
pspots = [p1,p2,p3,p4,p5,p6,p7,p8,p9,p10,p11,p12,p13,p14,p15,p16,p17,p18,p19,p20,p21,p22,p23,p24,p25,p26,p27,p28,p29,p30,p31,p32,p33,p34,p35,p36,p37,p38,p39,p40,p41,p42,p43];
INPARK = function (carID,liftID,floor){ //parks the car
	init();
	console.log("INPARK "+carID+" "+liftID+" "+floor);
	var spotID, spotIDS;
	//check if the car has already been parked:
	for (var f =1;f<=3;f++){
		for (var p=0;p<pspots.length;p++){
			if (mydata["floor"+f][pspots[p].name]==carID){
				//->console.log("car "+carID+" has already been parked");
				closeFile();
				return;
			}
		}	
	}
	//->console.log("Procedure to park car "+carID);
	//find the first available spot on the given floor
	for ( p=0;p<pspots.length;p++){
		spotID = pspots.indexOf(parkingOrder[p]);
		if (pspots[spotID].available(floor)){
			mydata["floor"+floor][pspots[spotID].name]=carID;
			spotIDS = pspots[spotID].name;
			if (pspots[spotID].type==SECOND){ //if there is a car in front of the empty spot, move the car
				if (!pspots[spotID].first.available(floor)){					move1stCar(spotID,floor,-1,-1);			}
			}			
			//->console.log("lift up the lift");		
			addToTransactions(liftID,"LIFT",floor,"");
			//->console.log("use shuttle to move car "+carID+" from lift to Spot "+spotIDS+" on floor "+floor);
			addToTransactions(shuttleID[floor-1],"PICK",floor,liftID);
			addToTransactions(shuttleID[floor-1],"DROP",floor,spotIDS);
			carCount[floor-1]++;
			closeFile();
			return;
   		}
  	}
  	//->console.log("Invalid Error: Parking spot is full");
  	closeFile();
  	return;
};
removeCar = function(spotID,carID,floor){ //removing the car from the system by setting the parking spot car information to "-1" & send car to the lift
  	moveTolift(floor);
  	mydata["floor"+floor][pspots[spotID].name]="-1";
  	closeFile();
  	carCount[floor-1]--;
}
moveTolift=function(floor){ //find the available lift, giving priority to lift 1
	if (!lift1State){				addToTransactions(shuttleID[floor],"DROP",floor,"L1");	}
	else{								addToTransactions(shuttleID[floor],"DROP",floor,"L2");	}	
}
relocateCar = function(spotID1,floor1,spotID2,floor2){	//spots here are passed in as pointers instead of index values
	//->console.log("use the shuttle to move car "+mydata["floor"+floor1][spotID1.name]+" from spot "+spotID1.name+" on floor "+floor1+" to spot "+spotID2.name+" on floor "+floor2);
	//swap the values of the car information stored in the parking spots
	//at the point when the function is called, all cars in the way of the transaction should have been cleared out
	addToTransactions(shuttleID[floor1],"PICK",floor1,spotID1.name);
	addToTransactions(shuttleID[floor2],"DROP",floor2,spotID2.name);
	mydata["floor"+floor2][spotID2.name] = mydata["floor"+floor1][spotID1.name];
	mydata["floor"+floor1][spotID1.name]="-1";
}
moveCarToEmptySpot = function(ppos,floor,avoid,avoidfloor){ //finds the closest available parking spot and moves the car in the given spot to the available spot
	closestP = BFS(ppos,floor,avoid,avoidfloor);
	if (closestP==null){ //if there are no available spots
		//->console.log("cannot move car, the parking spot is full");
		return false; 
	}
	
	if (pspots[closestP].type ==FIRST){
		if (pspots[closestP].second!=null &&pspots[closestP].second.available(floor)){ //if both FIRST and SECOND spots of the closestP spots are available
			relocateCar(pspots[ppos],floor,pspots[closestP].second,floor); //move the ppos car into the SECOND spot instead of the first one for convenience's sake
		}
		else if (pspots[closestP].second!=null){
			relocateCar(pspots[ppos],floor,pspots[closestP],floor);						
		}
		else{																		relocateCar(pspots[ppos],floor,pspots[closestP],floor);						}
	}
	else if (pspots[closestP].type==SECOND){
		if (!pspots[closestP].first.available(floor)){ //if there is a car blocking the empty spot
			relocateCar(pspots[closestP].first,floor,pspots[closestP],floor);  //move the blocking car back into the empty spot
			relocateCar(pspots[ppos],floor,pspots[closestP].first,floor); //move the ppos car to the blocking car's old spot
		}
		else{				relocateCar(pspots[ppos],floor,pspots[closestP],floor);			}
	}
	return true;
}
//move the car that is ahead of the ppos car (car in parking spot ppos) to another empty spot so it doesn't block the ppos car
move1stCar = function(ppos,floor,avoid,avoidfloor){ 		return moveCarToEmptySpot(pspots.indexOf(pspots[ppos].first),floor,avoid,avoidfloor);	}
BFS = function(pos,floor,avoid,avoidfloor){
	//finds the closest empty spot to pos by using the algorithm Breadth First Search
	//ignores any car spots that may be invalid (spots that are FIRST or SECOND to pos, spots that another car needs to park into)
  	var queue = [];
  	queue.push(pos);
  	var top;
  	var avoidOFirst=-1,avoidOSecond=-1; //the index of the parking spots to avoid, relating to the Original position, pos
  	if (pspots[pos].type==SECOND){
  		avoidOSecond = pos;
  		avoidOFirst = pspots.indexOf(pspots[pos].first);
  	}
  	var avoidFirst=-1, avoidSecond = -1; //the index of the parking spots to avoid, relating to the position, avoid, passed into the function
  	if (avoid!=-1){
  		avoidFirst = pspots.indexOf(pspots[avoid].first);
	  	avoidSecond = pspots.indexOf(pspots[avoid].second);
  	}
  	var visited = [false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false]
 	while (true){
	    if (queue.length==0){	break;	    	}
	    top = queue.shift();
	    if (mydata["floor"+floor][pspots[top].name]=="-1"&& top!=avoidOFirst && top!=avoidOSecond && top!=avoid &&top!=avoidFirst && top!=avoidSecond){	 		return top;	    	}
	    if (visited[top]){		continue;	    	}
	    visited[top]=true;
	    if (pspots[top].first!=null){  		queue.push(pspots.indexOf(pspots[top].first));	 	}
		if (pspots[top].second!=null){ 		queue.push(pspots.indexOf(pspots[top].second));	 	}
		if (pspots[top].across!=null){  		queue.push(pspots.indexOf(pspots[top].across));	    }
	    if (pspots[top].neighbourL!=null){	queue.push(pspots.indexOf(pspots[top].neighbourL)); 	}
		if (pspots[top].neighbourR!=null){	queue.push(pspots.indexOf(pspots[top].neighbourR)); 	}   	
  	}
  	return null;
}
OUTPARK = function(carID){
	init();
	var ppos=-1; //index value
	var floor=0;
	//find where the car is parked
	for (var f=1;f<=3;f++){
		for (var p=0;p<pspots.length;p++){
			if (mydata["floor"+f][pspots[p].name]==carID){			
				ppos=p;
				floor = f;
			}
		} 	
	 }
	var closestP = -1;
	if (ppos==-1){ //check if the car is in the system
		//->console.log("Car "+carID+" does not exist");
		//->console.log("");
		closeFile();
		return;
	}
	if (pspots[ppos].type==SECOND){ //remove any blocking cars
		if (!pspots[ppos].first.available(floor)){
			if (!move1stCar(ppos,floor,-1,-1)){				
				closeFile();
				return;		
			}			
		}
	}
	//->console.log("picking up car "+carID+"");
	//->console.log("use shuttle to move car "+carID+" from Spot "+pspots[ppos].name+" to the lift");
	addToTransactions(shuttleID[floor-1],"PICK",floor,pspots[ppos].name);
	removeCar(ppos,carID,floor);
}
moveCarbyCarID = function(carID,spotIDS,floor){
	//move the car by the given car ID to a given spot IDS (floor is connected to spotIDS)
	init();
	//locate the car in the system and call moveCar on it
	for (var f=1;f<=3;f++){
		for (var i=0;i<pspots.length;i++){
			if (mydata["floor"+f][pspots[i].name]==carID){
				moveCar(pspots[i].name,f,spotIDS,floor);
				return;
			}
		}	
	}
	//->console.log("Invalid Request: The car is not in the current parking system.");
}
moveCarbyspotID = function(spotID1S,floor1,spotID2S,floor2){	
	//move car from one given spot to another	
	init();
	if (mydata["floor"+floor1][spotID1S]=="-1"){ 	//if there is no car in the spot
		//->console.log("there is no car in spot "+spotID1S);
		closeFile();
		return;
	}
	moveCar(spotID1S,floor1,spotID2S,floor2);	
}
moveCar = function(spotID1S,floor1,spotID2S,floor2){
	//spot IDs are passed in as strings (names of the spot)
	spotID1=-1,spotID2=-1;
	//locate the spots so they can be referenced as index of pspots
	for ( i=0;i<pspots.length;i++){
		if (pspots[i].name==spotID1S){		spotID1=i;	}
		else if (pspots[i].name==spotID2S){	spotID2=i;	}
	}
	if (spotID1==-1 || spotID2==-1){ //check if the spot names given were valid
		//->console.log("Invalid request: invalid spots "+spotID1S+" on floor "+floor1+" "+spotID2S+" on floor "+floor2);
		//->console.log("");
		closeFile();
		return;
	}
	//->console.log("Moving car "+mydata["floor"+floor1][spotID1S]+".... ");
	//->console.log("Procedure to move Car "+mydata["floor"+floor1][spotID1S]+" from Spot "+pspots[spotID1].name+" on floor "+floor1+" to Spot "+pspots[spotID2].name+" on floor "+floor2);
	var carID = mydata["floor"+floor1][spotID1S];
	var closestP=-1, spotsNeeded=0;

	//remove any blocking cars
	if (pspots[spotID1].type==FIRST && pspots[spotID2].type==FIRST){}
	else if (pspots[spotID1].type==FIRST && pspots[spotID2].type==SECOND){
		if (!pspots[spotID2].first.available(floor2)){		move1stCar(spotID2,floor2,spotID1,floor1);			}
	}
	else if (pspots[spotID1].type==SECOND && pspots[spotID2].type==FIRST){
		if (!pspots[spotID1].first.available(floor1)){		move1stCar(spotID1,floor1,spotID2,floor2);			}
	}
	else if (pspots[spotID1].type==SECOND && pspots[spotID2].type==SECOND){
		if (!pspots[spotID2].first.available(floor2)){	spotsNeeded++;		}
		if (!pspots[spotID1].first.available(floor1)){	spotsNeeded++;		}
		if (!pspots[spotID1].first.available(floor1)){		move1stCar(spotID1,floor1,spotID2,floor2);			}
		if (!pspots[spotID2].first.available(floor2)){		move1stCar(spotID2,floor2,spotID1,floor2);			}
	}
	if (mydata["floor"+floor2][pspots[spotID2].name]!="-1"){ //if there is a car in the destination spot, remove it
		//->console.log("Spot "+spotID2S+" is currently occupied, moving car "+mydata["floor"+floor2][spotID2S]+" that is currently occupying the spot");	
		moveCarToEmptySpot(spotID2,floor2,spotID1,floor1);
	}
	//relocate the car as it might have been moved around during the process
	for (var f=1;f<=3;f++){
		for (var i=0;i<pspots.length;i++){
			if (mydata["floor"+f][pspots[i].name]==carID){		
				floor1=f;	
				spotID1=i;		
			}
		}	
	}
	if (floor1!=floor2){ //if the cars are on different floors, add to transactions the move required to move the car to the lift, to another floor, then out of the lift to the destination spot
		addToTransactions(shuttleID[floor1],"PICK",floor1,pspots[spotID1].name);//pick up car from spotID1
		var liftID = "L1";
		if (lift1State){				liftID="L2";	}
		addToTransactions(shuttleID[floor1],"DROP",floor1,liftID); //move into liftID
		addToTransactions(shuttleID[floor2],"PICK",floor2,liftID); //pick up from liftID
		addToTransactions(shuttleID[floor2],"DROP",floor2,spotID2S); //drop in spotID2
	}
	relocateCar(pspots[spotID1],floor1,pspots[spotID2],floor2);
	closeFile();
	//->console.log("");
}

occupyspot = function(spotIDS,carID,liftID,floor){
	//occupy a parking spot with a car and a given spotID (passed through as the name of the spot)
	init();
	var spotID=-1;
	//locate the spot in terms of index in pspots, save to spotID
	for (var i=0;i<pspots.length;i++){
		if (pspots[i].name==spotIDS){		spotID=i;		}
	}

  	if (spotID==-1){ //the given spot is not valid
  		//->console.log("Invalid request: invalid spot "+spotIDS+"");
  		closeFile();
  		return;
  	}
  	//check if the given car has already been parked
  	for (var f=1;f<=3;f++){
  		for (var p=0;p<pspots.length;p++){
			if (mydata["floor"+f][pspots[p].name]==carID){
				//->console.log("car "+carID+" has already been parked");
				closeFile();
				return;
			}
		}	
  	}
  	  	//->console.log("Procedure for Car "+carID+" to park Spot "+spotIDS);
  	 //move any blocking cars
  	if (pspots[spotID].type==SECOND){
  		if (!pspots[spotID].first.available(floor)){  						move1stCar(spotID,floor,-1,-1);	}
  	}
  	if (!pspots[spotID].available(floor)){
  		//->console.log("Spot "+spotIDS+" is currently occupied, moving car "+mydata[spotIDS]+" that is currently occupying the spot");
		moveCarToEmptySpot(spotID,floor,-1,-1);
  	}
  	mydata["floor"+floor][spotIDS] = carID;
  	 	//->console.log("lift up the lift");		
	addToTransactions(liftID,"LIFT",floor,"");
	//->console.log("use shuttle to move car "+carID+" from lift to Spot "+spotIDS+" on floor "+floor);
	addToTransactions(shuttleID[floor-1],"PICK",floor,liftID);
	addToTransactions(shuttleID[floor-1],"DROP",floor,spotIDS);
   	carCount[floor-1]++;
  	closeFile();	
}
