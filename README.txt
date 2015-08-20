**the words lot and spot can be used exchangeably 

queueGenerator.js
	calls functions in brooklynRoutingAlgoirthm.js
	for loop runs 5 times
		each time generating a random number, i, between 1 and 5, inclusive
		each number corresponds to a function in brooklynRoutingAlgorithm.js
		more parameters required by the functions are randomly generated specifically to the number, i
			ex. car number, floor number(s), spot number(s);
		a line of what was generated and called is outputted to the console
--------------------------------------------------------------------------------------------------------------------------------
brooklynRoutingAlgorithm.js
	there are a lot of excess outputs to the screen for explanation purposes that can be removed if needed
	has a http server set up
	reads data from files
	outputs data to the same files & to the console
	---------------------
	general functions:
		init() 
			reads the data files and initializes/defines important variables
			called everytime a directly-called function is called
		close()
			called everytime a directly-called function is called
		printMap()
			called everytime close() is called (everytime a directly-called function is called)

		addToTransactions(equipment,action,floor,spot)
			called everytime when there is a physically movement of anything in the parking lot (shuttles, cars, elevators)

	directly-called functions
		these functions call the operational functions to move the cars
		these are the functions called directly by the user
		-------------------------------
		park(carID,elevatorID,floor)
			function called to park a car, no assigned spot, only assigned floor
				carID = the ID of the car that will be parked (str)
				elevatorID = the ID of the elevator that will be used for parking (str)
				floor = the floor in which the car will be brought to (int)
		occupyLot(lotIDS,carID,elevatorID,floor)
			function called to park a car, assigned spot and floor
				lotIDS = string of the lotID in which the car will be parked in (str)
				carID = the car that will be parked (str)
				elevatorID = ID of the elevator that will be used (str)
				floor = the floor in which the car will be parked (the floor that lotIDS is on) (int)
		moveCarbyCarID(carID,lotIDS,floor)
			function called to move/shuffle cars, refering to the car by its ID
				carID = the car that will be parked (str)
				lotIDS = string of the ID of the lot in which the car will be parked in (str)
				floor = the floor that the car will be parked on (the floor that lotIDS is on) (int)
		moveCarbyLotID(lotID1S,floor1,lotID2S,floor2)
			variatoin of moveCarbyCarID
			function aclled to move/shuffle cars, refering to the positions by its IDs instead of the carID in the starting position
				lotID1S = string of the ID of the starting lot of this shuffle (this spot should contain a car to shuffle) (str)
				floor1 = floor of lotID1S (int)
				lotID2S = string of the ID of the destination lot of the shuffle (this spot should be empty but it is not necessary) (str)
				floor2 = floor of lotID2S (int)
		pickUp(carID)
			function called to pick up/ outpark a car
			an elevator is selected by the program to move the car
				carID = the ID of the car that will be parked (str)

	indirectly-called functions:
		these functions are called with the purpose to move cars and can be called by multiple different instructional functions
		these are the functions indirectly called by the user
		----------------------------
		moveCar(lotID1S,floor1,lotID2S,floor2)
			this function directly moves the car around, calling move1stCar in certain scenarios for blocking cars
			this function is called by moveCarbyCarID() and moveCarbyLotID()
			at the end of this function, relocateCar() is called
				lotID1S = string ID of the starting spot
				floor1 =floor of starting spot
				lotID2S = string ID of the destination spot
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
			this function executes the graph theory algorithm, Breadth First Search based on the graph created by linking the pLot objects
			it ignores any of the ignored spots during the search so a car doesn't park over the spot of another car
				ppos = parking position of the current car
				floor = floor of ppos
				avoid = the spot the should be avoided when determining the closest empty spot (ex. this spot is the destination spot for another car)
				avoidfloor = floor of the avoiding spot
		relocateCar(lotID1,floor1,lotID2,floor2)
			no extra cars are moved under this function
			this function does the final swapping of the car
			it relocates the car from lotID1 to lotID2
			it accesses mydata and changes the values of the car in the spots
			this function is often called at the end of the other indirectly-called functions
				lotID1S = string ID of the starting spot
				floor1 =floor of starting spot
				lotID2S = string ID of the destination spot
				floor2 = floor of the destionation spot
		removeCar(lotID,carID,floor)
			this function removes the car from the data and sends it to the elevator by calling moveToElevator()
				lotID = spot of the car that will be removed
				carID = the ID of the car to be removed
				floor = floor of lotID
		moveToElevator(floor)
			this function selects an elevator and drops whatever the shuttle is holding into the elevator and sends it to the given floor
				floor = the floor that the cargo on the shuttle will be moved to

--------------------------------------------------------------------------------------------------------------------------------
input.json
	contains the parking lot information for each floor
	JSON
		 key:value
		 spot name/number: carID
	"-1" for carID signifies that the spot is empty
	is only being accessed when init() is called in the brooklynRoutingAlgorithm
		 there could be an update in this file during the transaction but the function that is currently running for the transaction will not know/have the data

--------------------------------------------------------------------------------------------------------------------------------
transaction.json
	contains the details of each transaction in JSON
	since the data is being appended into the file everytime
	the file itself is no longer a JSON file
	instead, a file with multiple JSON inside
--------------------------------------------------------------------------------------------------------------------------------

save files to -> \\bcssv001\20.Projects\Clients\Fata\Current Projects\15FAT006 - Fata - Automated Parking System\3_Programs\Routing Algorithms