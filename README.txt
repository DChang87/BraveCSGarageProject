**lot and spot can be used exchangeably 

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
	has a http server set up
	reads data from files
	outputs data to the same files & to the console
	---------------------
	general functions:
		init() 
			reads the data files and initializes/defines important variables
			called everytime 
		close()
		printMap()
		addToTransactions(equipment,action,floor,spot)

	directly-called functions
		these functions call the operational functions to move the cars
		these are the functions called directly by the user
		-------------------------------
		park(carID,elevatorID,floor)
			carID = the ID of the car that will be parked (str)
			elevatorID = the ID of the elevator that will be used for parking (str)
			floor = the floor in which the car will be brought to (int)
		occupyLot(lotIDS,carID,elevatorID,floor)
			lotIDS = string of the lotID in which the car will be parked in (str)
			carID = the car that will be parked (str)
			elevatorID = ID of the elevator that will be used (str)
			floor = the floor in which the car will be parked (the floor that lotIDS is on) (int)
		moveCarbyCarID(carID,lotIDS,floor)
			carID = the car that will be parked (str)
			lotIDS = string of the ID of the lot in which the car will be parked in (str)
			floor = the floor that the car will be parked on (the floor that lotIDS is on) (int)
		moveCarbyLotID(lotID1S,floor1,lotID2S,floor2)
			lotID1S = string of the ID of the starting lot of this shuffle (this spot should contain a car to shuffle) (str)
			floor1 = floor of lotID1S (int)
			lotID2S = string of the ID of the destination lot of the shuffle (this spot should be empty but it is not necessary) (str)
			floor2 = floor of lotID2S (int)
		pickUp(carID)
			carID = the ID of the car that will be parked (str)

	indirectly-called functions:
		these functions are called with the purpose to move cars and can be called by multiple different instructional functions
		these are the functions indirectly called by the user
		----------------------------
		moveCar(lotID1S,floor1,lotID2S,floor2)
		move1stCar(ppos,floor,avoid,avoidfloor)
		moveCartoEmptySpace(ppos,floor,avoid,avoidfloor)
		BFS()
		relocateCar(lotID1,floor1,lotID2,floor2)
		removeCar(lotID,carID,floor)
		moveToElevator(floor)
		


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
	currently is being written over every time there is a new transaction
--------------------------------------------------------------------------------------------------------------------------------


save files to -> \\bcssv001\20.Projects\Clients\Fata\Current Projects\15FAT006 - Fata - Automated Parking System\3_Programs\Routing Algorithms