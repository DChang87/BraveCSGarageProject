/**read README.txt first for an overview of the code and the functions
//most of the console.log are commented out for now for a cleaner output
to uncomment, ctrl+H and replace '//->' with ''
*/
var HOST='192.168.150.181';
var PORT=5009;
var transactions = JSON.parse('{}');
var http = require('http');
http.createServer(function (req, res) {
    if (req.method === 'POST') {
        var buffer = '';
        req.on('data', function (chunk) {            buffer += chunk;        });
        req.on('end', function () { 
            var path = req.url.substring(0, req.url.indexOf('/', 1)).toUpperCase();
            var json;
            try {                json = JSON.parse(buffer);            } 
            catch (err) {}
            if (path === '/INPARK') {
                Inpark(json.carID,json.lift,json.floor);
                res.write(JSON.stringify(transactions));
            } else if (path === '/OUTPARK') {
            	Outpark(json.carID);
                res.write(JSON.stringify(transactions));
            } else {                
            	res.write('BAD REQUEST');            
            }
            res.end(); 
        });
    }
}).listen(PORT, HOST);

//constants for carType, FIRST car is the aisle car
var FIRST= 0, SECOND = 1;

//information for each level
var carCount=[0,0,0]; 
var shuttleID = ['111','211','311'];

var transactions = JSON.parse('{}');


//set the availability flags of each lift to not busy (false) 
var lift1State = false, lift2State = false; 

//stores parking lot states
var myData; 

var fs = require('fs');
var pFile = require('./pSpotFile.js');

/**reads the data files and initializes/defines important variables
*  (synchronous file reading)
*/
var Init = function() {
	carCount[0]=0;
	carCount[1]=0;
	carCount[2]=0;
	transactions = JSON.parse('{}');
	transactions["Success"]=true;
	transactions["Message"]="OK";
	transactions["Moves"] = [];
	myData = JSON.parse(fs.readFileSync('input.json'.toString())); 
	for (var f=1;f<=3;f++) {
		for (var i=0;i<pFile.pSpots().length;i++) {
			if (myData['floor'+f][pFile.pSpots()[i].nameS]!='-1')	carCount[f-1]++;		
		}	
	}
};

//writes/appends the data to files and output any necessary information to console
var CloseFile = function() { 
	fs.writeFileSync('input.json',JSON.stringify(myData, null, '\t'));
	fs.appendFileSync('transaction.json',JSON.stringify(transactions, null, '\t')+'\n');
	console.log(JSON.stringify(transactions, null, '\t'));
	//PrintMap();
};


//adds error to the transactions object
var AddErrorToTransaction = function(message){
	transactions["Success"]=false;
	transactions["Message"] = message;
	transactions["Moves"]=[];
}
//adds to the transactions object
var AddToTransactions = function(equipment,action,floor,spot) {
	var ID = ''+Math.floor((Math.random() * 10000000) + 15130245);
	transactions["Moves"].push(JSON.parse("{}"));
	var len = transactions["Moves"].length;
	console.log(JSON.stringify(transactions["Moves"]));
	transactions["Moves"][len-1].move={};

	//if this is a shuttle moving
	if (action!='LIFT') { 
		transactions["Moves"][len-1].move.action=action;

		//if the shuttle is moving to an lift
		if (spot=='L1' || spot=='L2') { 
			if (spot=='L1') {
				transactions["Moves"][len-1].move.spot=3;	
			}else if (spot=='L2') {
				transactions["Moves"][len-1].move.spot=2;
			}
			transactions["Moves"][len-1].move.row=52;
		}else { 
			transactions["Moves"][len-1].move.row=spot.substring(0,2);
			transactions["Moves"][len-1].move.spot=spot.substring(3);	
		}
	}
	transactions["Moves"][len-1].move.floor=floor;
	transactions["Moves"][len-1].move.machineID=equipment;
	transactions["Moves"][len-1].move.requestID = ID;
};

/**prints the layout of each floor, indicating which spots are empty and which are occupied
*  called everytime close() is called
*  code is commented out right now since PrintMap is only useful for debugging purposes
*/
var PrintMap = function() {
	for (var floor=1;floor<=3;floor++) {
		//->console.log('row 41    '+myData['floor'+floor]['41-4']+' '+myData['floor'+floor]['41-3']+'    '+myData['floor'+floor]['41-2']+' '+myData['floor'+floor]['41-1']);
		//->console.log('row 42    '+myData['floor'+floor]['42-4']+' '+myData['floor'+floor]['42-3']+'    '+myData['floor'+floor]['42-2']+' '+myData['floor'+floor]['42-1']);
		//->console.log('row 43    '+myData['floor'+floor]['43-4']+' '+myData['floor'+floor]['43-3']+'    '+myData['floor'+floor]['43-2']+' '+myData['floor'+floor]['43-1']);
		//->console.log('row 44    '+myData['floor'+floor]['44-4']+' '+myData['floor'+floor]['44-3']);
		//->console.log('row 45    '+myData['floor'+floor]['45-4']+' '+myData['floor'+floor]['45-3']);
		//->console.log('row 46    '+myData['floor'+floor]['46-4']+' '+myData['floor'+floor]['46-3']+'    '+myData['floor'+floor]['46-2']+' '+myData['floor'+floor]['46-1']);
		//->console.log('row 47    '+myData['floor'+floor]['47-4']+' '+myData['floor'+floor]['47-3']+'    '+myData['floor'+floor]['47-2']+' '+myData['floor'+floor]['47-1']);
		//->console.log('row 48    '+myData['floor'+floor]['48-4']+' '+myData['floor'+floor]['48-3']+'    '+myData['floor'+floor]['48-2']+' '+myData['floor'+floor]['48-1']);
		//->console.log('row 49    '+myData['floor'+floor]['49-4']+' '+myData['floor'+floor]['49-3']+'    '+myData['floor'+floor]['49-2']+' '+myData['floor'+floor]['49-1']);
		//->console.log('row 50    '+myData['floor'+floor]['50-4']+' '+myData['floor'+floor]['50-3']+'    '+myData['floor'+floor]['50-2']+' '+myData['floor'+floor]['50-1']);
		//->console.log('row 51    '+myData['floor'+floor]['51-4']+' '+myData['floor'+floor]['51-3']+'    '+myData['floor'+floor]['51-2']+' '+myData['floor'+floor]['51-1']);
		//->console.log('          '+'   L1    L2');
		//->console.log('row 52    '+'   '+myData['floor'+floor]['52-3']+'    '+myData['floor'+floor]['52-2']+' '+myData['floor'+floor]['52-1']);
		//->console.log('FLOOR '+floor);	
	}
};

/**function called to park a car, no assigned spot, only assigned floor
*  finds the closest empty spot on the floor to park the car
*  if the floor is full, the car will not be parked
*  		carID = the ID of the car that will be parked (str)
*  		liftID = the ID of the lift that will be used for parking (str)
*  		floor = the floor in which the car will be brought to (int)
*/
var Inpark = function (carID,liftID,floor) { 
	Init();
	console.log('Inpark '+carID+' '+liftID+' '+floor);
	var spotID, spotIDS;
	
	//check if the car has already been parked:
	for (var f =1;f<=3;f++) {
		for (var p=0;p<pFile.pSpots().length;p++) {
			if (myData['floor'+f][pFile.pSpots()[p].nameS]==carID) {
				AddErrorToTransaction("Car "+carID+" has already been parked");
				//transactions.push('BAD REQUEST');
				CloseFile();
				return;
			}
		}	
	}
	
	//find the first available spot on the given floor
	for (var p=0;p<pFile.pSpots().length;p++) {
		spotID = pFile.pSpots().indexOf(pFile.parkingOrder()[p]);
		if (myData['floor'+floor][pFile.pSpots()[spotID].nameS]=='-1') {
			myData['floor'+floor][pFile.pSpots()[spotID].nameS]=carID;
			spotIDS = pFile.pSpots()[spotID].nameS;

			//if there is a car in front of the empty spot, move the car
			if (pFile.pSpots()[spotID].carType==SECOND) { 
				if (myData['floor'+floor][pFile.pSpots()[spotID].first.nameS]!='-1')				
					if (!Move1stCar(spotID,floor,-1,-1)){
						AddErrorToTransaction("There are not enough spots in the parking lot to create space for car "+carID);
						//transactions.push('BAD REQUEST');
						CloseFile();
						return;
					}			
			}			
			AddToTransactions(liftID,'LIFT',floor,'');
			AddToTransactions(shuttleID[floor-1],'PICK',floor,liftID);
			AddToTransactions(shuttleID[floor-1],'DROP',floor,spotIDS);
			AddToTransactions(liftID,'LIFT',0,'');
			carCount[floor-1]++;
			CloseFile();
			return;
   		}
  	}
  	AddErrorToTransaction("Parking lot is full");
  	//transactions.push('BAD REQUEST');
  	CloseFile();
  	return;
};

/**removing the car from the system by setting the parking spot car information to '-1' & send car to the lift
*  this function removes the car from the data/system and sends it to the lift by calling moveTolift()
*  		spotID = spot of the car that will be removed (int)
*  		carID = the ID of the car to be removed (str)
*  		floor = floor of spotID (int)
*/
var RemoveCar = function(spotID,carID,floor) { 
  	MoveToLift(floor);
  	myData['floor'+floor][pFile.pSpots()[spotID].nameS]='-1';
  	CloseFile();
  	carCount[floor-1]--;
};

/**this function selects a lift and drops whatever the shuttle is holding into the lift and sends it to the given floor
*  (priority is given to L1, if L1 is full, the car is dropped into L2)
*		floor = the floor that the cargo on the shuttle will be moved to (in most cases it would be floor 0, unless a car is being shuffled around between floors) (int)
*/
var MoveToLift=function(floor) { 
	if (!lift1State) {				
		AddToTransactions(shuttleID[floor],'DROP',floor,'L1');	
	}else {
		AddToTransactions(shuttleID[floor],'DROP',floor,'L2');	
  }
};

/**swap the values of the car information stored in the parking spots
* at the point when the function is called, all cars in the way of the transaction should have been cleared out
* spots here are passed in as pointers instead of index values
* no extra cars are moved under this function, only values are swapped
* relocates the car from spotID1 to spotID2
*		spotID1S = string ID of the starting spot (str)
*		floor1 =floor of starting spot (int)
*		spotID2S = string ID of the destination spot (str)
*		floor2 = floor of the destionation spot (int)
*/
var RelocateCar = function(spotID1,floor1,spotID2,floor2) {	
	AddToTransactions(shuttleID[floor1],'PICK',floor1,spotID1.nameS);
	AddToTransactions(shuttleID[floor2],'DROP',floor2,spotID2.nameS);
	myData['floor'+floor2][spotID2.nameS] = myData['floor'+floor1][spotID1.nameS];
	myData['floor'+floor1][spotID1.nameS]='-1';
};

/**
* the function finds an empty spot using BFS(), calling on ppos, and moves the car in ppos to the spot
*		ppos = parking position of the current car (int)
*		floor = floor of ppos (int)
*		avoid = the spot the should be avoided when determining the closest empty spot (ex. this spot is the destination spot for another car) (int)
* 		avoidfloor = floor of the avoiding spot (int)
*/
var MoveCarToEmptySpot = function(ppos,floor,avoid,avoidfloor) { 
	var closestP = Bfs(ppos,floor,avoid,avoidfloor);
	
	//if there are no available spots
	if (closestP===null)		return false; 
	if (pFile.pSpots()[closestP].carType ==FIRST) {

		//if both FIRST and SECOND spots of the closestP spots are available
		if (pFile.pSpots()[closestP].second!==null &&  myData['floor'+floor][pFile.pSpots()[closestP].second.nameS]=='-1') { 

			//move the ppos car into the SECOND spot instead of the first one for convenience
			RelocateCar(pFile.pSpots()[ppos],floor,pFile.pSpots()[closestP].second,floor); 
		}else if (pFile.pSpots()[closestP].second!==null) {
			RelocateCar(pFile.pSpots()[ppos],floor,pFile.pSpots()[closestP],floor);						
		}else {													
			RelocateCar(pFile.pSpots()[ppos],floor,pFile.pSpots()[closestP],floor);						
		}
	}
	else if (pFile.pSpots()[closestP].carType==SECOND) {

		//if there is a car blocking the empty spot
		if (myData['floor'+floor][pFile.pSpots()[closestP].first.nameS]!='-1') {

			//move the blocking car back into the empty spot
			RelocateCar(pFile.pSpots()[closestP].first,floor,pFile.pSpots()[closestP],floor);  

			//move the ppos car to the blocking car's old spot
			RelocateCar(pFile.pSpots()[ppos],floor,pFile.pSpots()[closestP].first,floor); 
		}else {				
			RelocateCar(pFile.pSpots()[ppos],floor,pFile.pSpots()[closestP],floor);			
		}
	}
	return true;
};

/**moves the car that is ahead of the ppos car (car in parking spot ppos) to another empty spot so it doesn't block the ppos car
*  this is called by moveCar whenever there is a car blocking another car
*  ppos should be a 2nd car position, this function moves the car blocking ppos to the closest available spot
*		ppos = parking position of the current car (int)
*		floor = floor of ppos (int)
*		avoid = the spot the should be avoided when determining the closest empty spot (ex. this spot is the destination spot for another car) (int)
*		avoidfloor = floor of the avoiding spot (int)
*/
var Move1stCar = function(ppos,floor,avoid,avoidfloor) {
  return MoveCarToEmptySpot(pFile.pSpots().indexOf(pFile.pSpots()[ppos].first),floor,avoid,avoidfloor);	
};

/**all of the car choosing is executed in this function
*  this function executes the graph theory algorithm, Breadth First Search, based on the graph created by linking the pspot objects
*  this returns the closest empty use-able parking spot to the ppos provided
*  there are certain spots that BFS must avoid because when shuffling cars, there are certain reserved destination spots that other cars must not park into (ex. in moveCar(), any blocking cars cannot be moved to block spotID1S or spotID2S) thus the parking spots are checked against the avoiding spots before being returned by the function
*  returns -1 if no spots are available
*  ignores any car spots that may be invalid (spots that are FIRST or SECOND to pos, spots that another car needs to park into)
*		ppos = parking position of the current car (int)
*		floor = floor of ppos (int)
*		avoid = the spot the should be avoided when determining the closest empty spot (ex. this spot is the destination spot for another car) (int)
*		avoidfloor = floor of the avoiding spot (int)
*/
var Bfs = function(pos,floor,avoid,avoidfloor) {	
  	var queue = [];
  	queue.push(pos);
  	var top;

  	//the index of the parking spots to avoid, relating to the Original position, pos
  	var avoidOFirst=-1,avoidOSecond=-1; 
  	
  	//the index of the parking spots to avoid, relating to the position, avoid, passed into the function
  	var avoidFirst=-1, avoidSecond = -1; 

  	var visited = [false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false];
  	if (pFile.pSpots()[pos].carType==SECOND) {
  		avoidOSecond = pos;
  		avoidOFirst = pFile.pSpots().indexOf(pFile.pSpots()[pos].first);
  	}  	

  	if (avoid!=-1) {
  		avoidFirst = pFile.pSpots().indexOf(pFile.pSpots()[avoid].first);
	  	avoidSecond = pFile.pSpots().indexOf(pFile.pSpots()[avoid].second);
  	}
 	
 	while (true) {
	    if (queue.length===0) 	break;	    
	    top = queue.shift();
	    if (myData['floor'+floor][pFile.pSpots()[top].nameS]=='-1'&& top!=avoidOFirst && top!=avoidOSecond && top!=avoid &&top!=avoidFirst && top!=avoidSecond)	 		return top;	    	
	    if (visited[top])		continue;	    	
	    visited[top]=true;
	    if (pFile.pSpots()[top].first!==null)  		queue.push(pFile.pSpots().indexOf(pFile.pSpots()[top].first));	 	
		if (pFile.pSpots()[top].second!==null) 		queue.push(pFile.pSpots().indexOf(pFile.pSpots()[top].second));	 	
		if (pFile.pSpots()[top].across!==null)  	queue.push(pFile.pSpots().indexOf(pFile.pSpots()[top].across));	    
	    if (pFile.pSpots()[top].neighbourL!==null)	queue.push(pFile.pSpots().indexOf(pFile.pSpots()[top].neighbourL)); 	
		if (pFile.pSpots()[top].neighbourR!==null)	queue.push(pFile.pSpots().indexOf(pFile.pSpots()[top].neighbourR)); 	   	
  	}
  	return null;
};

/**function called to pick up/ outpark a car
*  any blocking cars blocking the car (carID) are moved to the closest available spots
*  a lift is selected by the program to move the car by calling moveToLift()
*		carID = the ID of the car that will be parked (str)
*/
var Outpark = function(carID) {
	Init();

	//index value of the parking spot in pFile.pSpots()
	var ppos=-1; 
	var floor=0;

	//find where the car is parked
	for (var f=1;f<=3;f++) {
		for (var p=0;p<pFile.pSpots().length;p++) {
			if (myData['floor'+f][pFile.pSpots()[p].nameS]==carID) {			
				ppos=p;
				floor = f;
			}
		} 	
	 }

	//check if the car is in the system
	if (ppos==-1) { 
		AddErrorToTransaction("Car "+carID+" is not in the garage");
		//transactions.push('BAD REQUEST');
		CloseFile();
		return;
	}

	//remove any blocking cars
	if (pFile.pSpots()[ppos].carType==SECOND) { 
		if (myData['floor'+floor][pFile.pSpots()[ppos].first.nameS]!='-1') {
			if (!Move1stCar(ppos,floor,-1,-1)) {			
				AddErrorToTransaction("There are not enough spots in the parking lot to allow car "+carID+" to be removed");
				//transactions.push('BAD REQUEST');	
				CloseFile();
				return;		
			}			
		}
	}
	
	//pick up car and move to the lift
	AddToTransactions(shuttleID[floor-1],'PICK',floor,pFile.pSpots()[ppos].nameS);
	RemoveCar(ppos,carID,floor);
};

/**function called to move/shuffle cars, refering to the car by its ID
*  can shuffle floor to floor
*  movesa all the blocking cars blocking carID from reaching spotIDS (including any car that occupies spotIDS) to the each of their closest spots
*  if the program reaches the end of the function, it means that the car is not in the garage system
*		carID = the car that will be parked (str)
*		spotIDS = string of the ID of the spot in which the car will be parked in (str)
*		floor = the floor that the car will be parked on (the floor that spotIDS is on) (int)
*/
var MoveCarByCarID = function(carID,spotIDS,floor) {
	Init();

	//locate the car in the system and call moveCar on it
	for (var f=1;f<=3;f++) {
		for (var i=0;i<pFile.pSpots().length;i++) {
			if (myData['floor'+f][pFile.pSpots()[i].nameS]==carID) {
				MoveCar(pFile.pSpots()[i].nameS,f,spotIDS,floor);
				return;
			}
		}	
	}
};

/**variatoin of moveCarbyCarID
*  function called to move/shuffle cars, refering to the positions by its IDs instead of the carID in the starting position
*  movesa all the blocking cars blocking carID from reaching spotIDS (including any car that occupies spotIDS) to the each of their closest spots
*  does not move anything if there is not a car in the starting position
*  can shuffle floor to floor
*		spotID1S = string of the ID of the starting spot of this shuffle (this spot should contain a car to shuffle) (str)
*		floor1 = floor of spotID1S (int)
*		spotID2S = string of the ID of the destination spot of the shuffle (this spot should be empty but it is not necessary) (str)
*		floor2 = floor of spotID2S (int)
*/
var MoveCarBySpotID = function(spotID1S,floor1,spotID2S,floor2) {	
	Init();

	//if there is no car in the spot
	if (myData['floor'+floor1][spotID1S]=='-1') { 	
		CloseFile();
		return;
	}
	MoveCar(spotID1S,floor1,spotID2S,floor2);	
};

/**this function directly moves the car around, calling move1stCar in certain scenarios for blocking cars
*  this function is called by moveCarbyCarID() and moveCarbyspotID()
*  at the end of this function, relocateCar() is called
*		spotID1S = string ID of the starting spot (str)
*		floor1 =floor of starting spot (int)
*		spotID2S = string ID of the destination spot (str)
*  		floor2 = floor of the destionation spot (int)
*/
var MoveCar = function(spotID1S,floor1,spotID2S,floor2) {
	var carID = myData['floor'+floor1][spotID1S];
	var spotID1=-1,spotID2=-1;

	//locate the spots so they can be referenced as index of pFile.pSpots()
	for ( i=0;i<pFile.pSpots().length;i++) {
		if (pFile.pSpots()[i].nameS==spotID1S) {		
			spotID1=i;	
		}else if (pFile.pSpots()[i].nameS==spotID2S) {	
			spotID2=i;	
		}
	}

	//check if the spot names given were valid
	if (spotID1==-1 || spotID2==-1) { 
		CloseFile();
		return;
	}
	
	//remove any blocking cars
	if (pFile.pSpots()[spotID1].carType==FIRST && pFile.pSpots()[spotID2].carType==SECOND) {
		if (myData['floor'+floor2][pFile.pSpots()[spotID2].first.nameS]!='-1')		Move1stCar(spotID2,floor2,spotID1,floor1);			
	}else if (pFile.pSpots()[spotID1].carType==SECOND && pFile.pSpots()[spotID2].carType==FIRST) {
		if (myData['floor'+floor1][pFile.pSpots()[spotID1].first.nameS]!='-1')		Move1stCar(spotID1,floor1,spotID2,floor2);			
	}else if (pFile.pSpots()[spotID1].carType==SECOND && pFile.pSpots()[spotID2].carType==SECOND) {
		if (myData['floor'+floor1][pFile.pSpots()[spotID1].first.nameS]!='-1')		Move1stCar(spotID1,floor1,spotID2,floor2);			
		if (myData['floor'+floor2][pFile.pSpots()[spotID2].first.nameS]!='-1')		Move1stCar(spotID2,floor2,spotID1,floor2);			
	}

	 //if there is a car in the destination spot, remove it
	if (myData['floor'+floor2][pFile.pSpots()[spotID2].nameS]!='-1') {
		MoveCarToEmptySpot(spotID2,floor2,spotID1,floor1);
	}

	//relocate the car as it might have been moved around during the process
	for (var f=1;f<=3;f++) {
		for (var i=0;i<pFile.pSpots().length;i++) {
			if (myData['floor'+f][pFile.pSpots()[i].nameS]==carID) {		
				floor1=f;	
				spotID1=i;		
			}
		}	
	}

	//if the cars are on different floors, add to transactions the move required to move the car to the lift, to another floor, then out of the lift to the destination spot
	if (floor1!=floor2) { 
		AddToTransactions(shuttleID[floor1],'PICK',floor1,pFile.pSpots()[spotID1].nameS);
		var liftID = 'L1';
		if (lift1State)		liftID='L2';	
		AddToTransactions(shuttleID[floor1],'DROP',floor1,liftID); 
		AddToTransactions(shuttleID[floor2],'PICK',floor2,liftID); 
		AddToTransactions(shuttleID[floor2],'DROP',floor2,spotID2S); 
	}
	RelocateCar(pFile.pSpots()[spotID1],floor1,pFile.pSpots()[spotID2],floor2);
	CloseFile();
};

/**unction called to park a car, assigned spot and floor
*  if the spot is occupied, the occupying car will be moved to the closest empty spot to make space for the new car
*		spotIDS = string of the spotID in which the car will be parked in (str)
*		carID = the car that will be parked (str)
*		liftID = ID of the lift that will be used (str)
*		floor = the floor in which the car will be parked (the floor that spotIDS is on) (int)
*/
var OccupySpot = function(spotIDS,carID,liftID,floor) {
	Init();
	var spotID=-1;

	//locate the spot in terms of index in pFile.pSpots(), save to spotID
	for (var i=0;i<pFile.pSpots().length;i++) {
		if (pFile.pSpots()[i].nameS==spotIDS){		spotID=i;		}
	}

	//check if the given spot is not valid
  	if (spotID==-1) { 
  		CloseFile();
  		return;
  	}

  	//check if the given car has already been parked
  	for (var f=1;f<=3;f++) {
  		for (var p=0;p<pFile.pSpots().length;p++) {
			if (myData['floor'+f][pFile.pSpots()[p].nameS]==carID) {
				CloseFile();
				return;
			}
		}	
  	}
  	
  	//move any blocking cars
  	if (pFile.pSpots()[spotID].carType==SECOND) {
  		if (myData['floor'+floor][pFile.pSpots()[spotID].first.nameS]!='-1')				Move1stCar(spotID,floor,-1,-1);	
  	}
  	
  	if (myData['floor'+floor][pFile.pSpots()[spotID].nameS]!='-1') {
  		MoveCarToEmptySpot(spotID,floor,-1,-1);
  	}
  	myData['floor'+floor][spotIDS] = carID;
  	AddToTransactions(liftID,'LIFT',floor,'');
	AddToTransactions(shuttleID[floor-1],'PICK',floor,liftID);
	AddToTransactions(shuttleID[floor-1],'DROP',floor,spotIDS);
   	carCount[floor-1]++;
  	CloseFile();	
};
