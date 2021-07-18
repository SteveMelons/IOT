function getRandomTemp(){
	return Math.floor(Math.random()*(30-29+1)+29) + Math.floor(Math.random()*(10-0+1)+0)/10;
	}
	
module.exports = getRandomTemp
