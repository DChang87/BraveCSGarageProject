terminology: 	1st cars -> the cars closest to the aisle
		2nd cars -> the cars behind the 1st cars (closest to the wall)

queueGenerator.js
	calls functions in brooklynRoutingAlgoirthm.js
	for loop runs 5 times
		each time generating a random number, i, between 1 and 5, inclusive
		each number corresponds to a function in brooklynRoutingAlgorithm.js
		more parameters required by the functions are randomly generated specifically to the number, i
			ex. car number, floor number(s), spot number(s);
		a line of what was generated and called is outputted to the console
--------------------------------------------------------------------------------------------------------------------------------
brooklyn-final.js
	there are a lot of excess outputs to the screen for explanation purposes that can be removed if needed
	has a listener set up
	reads data from files
	outputs data to the same files & to the console
	------------------------------------------------
	important variables:
		mydata - saves all the parking spot availability information
		transactions - saves all the moves in the transaction
	---------------------
	general functions:
		init() 
			reads the data files and initializes/defines important variables
			(files are read synchronously)
			called everytime a directly-called function is called
		close()
			writes/appends the data to files and output any necessary information to console
			called everytime a directly-called function is called
		printMap()
			prints the layout of each floor, indicating which spots are empty and which are occupied
			called everytime close() is called (everytime a directly-called function is called)
		addToTransactions(equipment,action,floor,spot)
			called everytime when there is a physically movement of anything in the parking spot (shuttles, cars, lifts)
			adds the move to the transactions array & output instructions to console

	directly-called functions
		these functions call the indirectly-called functions to move the cars
		these are the functions called directly by the user
		-------------------------------
		INPARK(carID,liftID,floor)
			function called to park a car, no assigned spot, only assigned floor
			finds the closest empty spot on the floor to park the car
			if the floor is full, the car will not be parked
				carID = the ID of the car that will be parked (str)
				liftID = the ID of the lift that will be used for parking (str)
				floor = the floor in which the car will be brought to (int)
		occupyspot(spotIDS,carID,liftID,floor)
			function called to park a car, assigned spot and floor
			if the spot is occupied, the occupying car will be moved to the closest empty spot to make space for the new car
				spotIDS = string of the spotID in which the car will be parked in (str)
				carID = the car that will be parked (str)
				liftID = ID of the lift that will be used (str)
				floor = the floor in which the car will be parked (the floor that spotIDS is on) (int)
		moveCarbyCarID(carID,spotIDS,floor)
			function called to move/shuffle cars, refering to the car by its ID
			can shuffle floor to floor
			movesa all the blocking cars blocking carID from reaching spotIDS (including any car that occupies spotIDS) to the each of their closest spots
			does not move anything if there is not a car in the starting position
				carID = the car that will be parked (str)
				spotIDS = string of the ID of the spot in which the car will be parked in (str)
				floor = the floor that the car will be parked on (the floor that spotIDS is on) (int)
		moveCarbyspotID(spotID1S,floor1,spotID2S,floor2)
			variatoin of moveCarbyCarID
			function called to move/shuffle cars, refering to the positions by its IDs instead of the carID in the starting position
			movesa all the blocking cars blocking carID from reaching spotIDS (including any car that occupies spotIDS) to the each of their closest spots
			does not move anything if there is not a car in the starting position
			can shuffle floor to floor
				spotID1S = string of the ID of the starting spot of this shuffle (this spot should contain a car to shuffle) (str)
				floor1 = floor of spotID1S (int)
				spotID2S = string of the ID of the destination spot of the shuffle (this spot should be empty but it is not necessary) (str)
				floor2 = floor of spotID2S (int)
		OUTPARK(carID)
			function called to pick up/ outpark a car
			any blocking cars blocking the car (carID) are moved to the closest available spots
			a lift is selected by the program to move the car by calling moveToLift()
				carID = the ID of the car that will be parked (str)

	indirectly-called functions:
		these functions are called with the purpose to move cars and can be called by multiple different directly-called functions
		these are the functions indirectly called by the user
		----------------------------
		moveCar(spotID1S,floor1,spotID2S,floor2)
			this function directly moves the car around, calling move1stCar in certain scenarios for blocking cars
			this function is called by moveCarbyCarID() and moveCarbyspotID()
			at the end of this function, relocateCar() is called
				spotID1S = string ID of the starting spot (str)
				floor1 =floor of starting spot (int)
				spotID2S = string ID of the destination spot (str)
				floor2 = floor of the destionation spot (int)
		move1stCar(ppos,floor,avoid,avoidfloor)
			this is called by moveCar whenever there is a car blocking another car
			ppos should be a 2nd car position, this function moves the car blocking ppos to the closest available spot
				ppos = parking position of the current car (int)
				floor = floor of ppos (int)
				avoid = the spot the should be avoided when determining the closest empty spot (ex. this spot is the destination spot for another car) (int)
				avoidfloor = floor of the avoiding spot (int)
		moveCartoEmptySpace(ppos,floor,avoid,avoidfloor)
			the function finds an empty spot using BFS(), calling on ppos, and moves the car in ppos to the spot
				ppos = parking position of the current car (int)
				floor = floor of ppos (int)
				avoid = the spot the should be avoided when determining the closest empty spot (ex. this spot is the destination spot for another car) (int)
				avoidfloor = floor of the avoiding spot (int)
		BFS(ppos,floor,avoid,avoidfloor)
			all of the car choosing is executed in this function
			this function executes the graph theory algorithm, Breadth First Search, based on the graph created by linking the pspot objects
			this returns the closest empty use-able parking spot to the ppos provided
			there are certain spots that BFS must avoid because when shuffling cars, there are certain reserved destination spots that other cars must not park into (ex. in moveCar(), any blocking cars cannot be moved to block spotID1S or spotID2S) thus the parking spots are checked against the avoiding spots before being returned by the function
			returns -1 if no spots are available
			it ignores any of the ignored spots during the search so a car doesn't park over the spot of another car
				ppos = parking position of the current car (int)
				floor = floor of ppos (int)
				avoid = the spot the should be avoided when determining the closest empty spot (ex. this spot is the destination spot for another car) (int)
				avoidfloor = floor of the avoiding spot (int)
		relocateCar(spotID1,floor1,spotID2,floor2)
			no extra cars are moved under this function, only values are swapped
			this function does the final swapping of the car
			it relocates the car from spotID1 to spotID2
			it directly accesses mydata and changes the values of the car in the spots
			this function is often called at the end of the other indirectly-called functions
				spotID1S = string ID of the starting spot (str)
				floor1 =floor of starting spot (int)
				spotID2S = string ID of the destination spot (str)
				floor2 = floor of the destionation spot (int)
		removeCar(spotID,carID,floor)
			this function removes the car from the data/system and sends it to the lift by calling moveTolift()
				spotID = spot of the car that will be removed (int)
				carID = the ID of the car to be removed (str)
				floor = floor of spotID (int)
		moveTolift(floor)
			this function selects a lift and drops whatever the shuttle is holding into the lift and sends it to the given floor
			(priority is given to L1, if L1 is full, the car is dropped into L2)
				floor = the floor that the cargo on the shuttle will be moved to (in most cases it would be floor 0, unless a car is being shuffled around between floors) (int)
--------------------------------------------------------------------------------------------------------------------------------
input.json
	contains the parking spot information for each floor
	JSON
		 key:value
		 spot name/number: carID
		"-1" for carID signifies that the spot is empty
		is only being accessed when init() is called in the brooklynRoutingAlgorithm
			 there could be an update in this file during the transaction but the function that is currently running for the transaction will not know/have the data
----------------------------------------------------------------------------------------------------------------------------------------
transaction.json
	contains the details of each transaction in JSON
	since the data is being appended into the file everytime
	the file itself is no longer a JSON file
	instead, a file with multiple JSON inside
--------------------------------------------------------------------------------------------------------------------------------
sender.js
	sends data to brooklyn-final.js to test the program
save files to -> \\bcssv001\20.Projects\Clients\Fata\Current Projects\15FAT006 - Fata - Automated Parking System\3_Programs\Routing Algorithms