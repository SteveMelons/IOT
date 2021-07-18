var Gpio = require('onoff').Gpio; //include onoff to interact with the GPIO
var LED = new Gpio(4, 'out'); //use GPIO pin 4, and specify that it is output

function checkTemp(temp) { 
	console.info(temp)
	if(temp>=30){
		LED.writeSync(1);
		} else {
			LED.writeSync(0); 
			}
			}

module.exports.checkTempFun = checkTemp;
