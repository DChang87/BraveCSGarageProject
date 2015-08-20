queueGenerator.js
	calls functions in brooklynRoutingAlgoirthm.js
	for loop runs 5 times
		each time generating a random number, i, between 1 and 5, inclusive
		each number corresponds to a function in brooklynRoutingAlgorithm.js
		more parameters required by the functions are randomly generated specifically to the number, i
			ex. car number, floor number(s), spot number(s);
		a line of what was generated and called is outputted to the console
--------------------------------------------------------------------------------------------------------------------------------
listener.js
	there are a spot of excess outputs to the screen for explanation purposes that can be removed if needed
	has a listener set up
	reads data from files
	outputs data to the same files & to the console
	---------------------
	general functions:
		init() 
			reads the data files and initializes/defines important variables
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
				carID = the ID of the car that will be parked (str)
				liftID = the ID of the lift that will be used for parking (str)
				floor = the floor in which the car will be brought to (int)
		occupyspot(spotIDS,carID,liftID,floor)
			function called to park a car, assigned spot and floor
				spotIDS = string of the spotID in which the car will be parked in (str)
				carID = the car that will be parked (str)
				liftID = ID of the lift that will be used (str)
				floor = the floor in which the car will be parked (the floor that spotIDS is on) (int)
		moveCarbyCarID(carID,spotIDS,floor)
			function called to move/shuffle cars, refering to the car by its ID
			can shuffle floor to floor
				carID = the car that will be parked (str)
				spotIDS = string of the ID of the spot in which the car will be parked in (str)
				floor = the floor that the car will be parked on (the floor that spotIDS is on) (int)
		moveCarbyspotID(spotID1S,floor1,spotID2S,floor2)
			variatoin of moveCarbyCarID
			function aclled to move/shuffle cars, refering to the positions by its IDs instead of the carID in the starting position
			can shuffle floor to floor
				spotID1S = string of the ID of the starting spot of this shuffle (this spot should contain a car to shuffle) (str)
				floor1 = floor of spotID1S (int)
				spotID2S = string of the ID of the destination spot of the shuffle (this spot should be empty but it is not necessary) (str)
				floor2 = floor of spotID2S (int)
		OUTPARK(carID)
			function called to pick up/ outpark a car
			an lift is selected by the program to move the car
				carID = the ID of the car that will be parked (str)

	indirectly-called functions:
		these functions are called with the purpose to move cars and can be called by multiple different directly-called functions
		these are the functions indirectly called by the user
		----------------------------
		moveCar(spotID1S,floor1,spotID2S,floor2)
			this function directly moves the car around, calling move1stCar in certain scenarios for blocking cars
			this function is called by moveCarbyCarID() and moveCarbyspotID()
			at the end of this function, relocateCar() is called
				spotID1S = string ID of the starting spot
				floor1 =floor of starting spot
				spotID2S = string ID of the destination spot
				floor2 = floor of the destionation spot
		move1stCar(ppos,floor,avoid,avoidfloor)
			this is called by moveCar whenever there is a car blocking another car
				ppos = parking position of the current car
				floor = floor of ppos
				avoid = the spot the should be avoided when determining the closest empty spot (ex. this spot is the destination spot for another car)
				avoidfloor = floor of the avoiding spot
		moveCartoEmptySpace(ppos,floor,avoid,avoidfloor)
			the function finds an empty spot using BFS() and moves the car to the spot
				ppos = parking position of the current car
				floor = floor of ppos
				avoid = the spot the should be avoided when determining the closest empty spot (ex. this spot is the destination spot for another car)
				avoidfloor = floor of the avoiding spot
		BFS(ppos,floor,avoid,avoidfloor)
			this function executes the graph theory algorithm, Breadth First Search, based on the graph created by linking the pspot objects
			it ignores any of the ignored spots during the search so a car doesn't park over the spot of another car
				ppos = parking position of the current car
				floor = floor of ppos
				avoid = the spot the should be avoided when determining the closest empty spot (ex. this spot is the destination spot for another car)
				avoidfloor = floor of the avoiding spot
		relocateCar(spotID1,floor1,spotID2,floor2)
			no extra cars are moved under this function
			this function does the final swapping of the car
			it relocates the car from spotID1 to spotID2
			it accesses mydata and changes the values of the car in the spots
			this function is often called at the end of the other indirectly-called functions
				spotID1S = string ID of the starting spot
				floor1 =floor of starting spot
				spotID2S = string ID of the destination spot
				floor2 = floor of the destionation spot
		removeCar(spotID,carID,floor)
			this function removes the car from the data and sends it to the lift by calling moveTolift()
				spotID = spot of the car that will be removed
				carID = the ID of the car to be removed
				floor = floor of spotID
		moveTolift(floor)
			this function selects an lift and drops whatever the shuttle is holding into the lift and sends it to the given floor
				floor = the floor that the cargo on the shuttle will be moved to
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

save files to -> \\bcssv001\20.Projects\Clients\Fata\Current Projects\15FAT006 - Fata - Automated Parking System\3_Programs\Routing Algorithms