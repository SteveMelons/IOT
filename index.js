const tempGenerator = require('./helper/tempGenerator');
const warning = require('./warning/warning')
const deviceModule = require('aws-iot-device-sdk').device;

const fs = require('fs');
const path = require('path')


   const device = deviceModule({
      keyPath: "./cert/tempSensor.private.key",
      certPath: "./cert/tempSensor.cert.pem",  
      caPath: "./cert/root-CA.crt",
      clientId: "sdk-nodejs-b04d7c3d-f5b5-43cd-84cf-18e1b8c175b0",
      host: "a1mrb3557hklej-ats.iot.us-west-2.amazonaws.com",
   });

   var timeout;
   
   let intervalValue = JSON.parse(fs.readFileSync((path.resolve(__dirname, 'interval.json')))).interval
   device.publish('getInterval', JSON.stringify({
            interval: intervalValue
            }));
   timeout = setInterval(function() {
         device.publish('getTemp', JSON.stringify({
            temp: tempGenerator()
         }));
   }, intervalValue*60000); // clip to minimum
   
   //
   // Do a simple publish/subscribe demo based on the test-mode passed
   // in the command line arguments.  If test-mode is 1, subscribe to
   // 'topic_1' and publish to 'topic_2'; otherwise vice versa.  Publish
   // a message every four seconds.to
   //
   device
      .on('connect', function() {
         device.subscribe('getTemp');
         device.subscribe('needCurrentTemp');
         device.subscribe('setInterval');
         console.log('connect');
      });
   device
      .on('close', function() {
         console.log('close');
      });
   device
      .on('reconnect', function() {
         console.log('reconnect');
      });
   device
      .on('offline', function() {
         console.log('offline');
      });
   device
      .on('error', function(error) {
         console.log('error', error);
      });
   device
      .on('message', function(topic, payload) {
         console.info('topic', topic)
         if (topic === 'getTemp') {
            warning.checkTempFun(parseFloat(JSON.parse(payload).temp));
            console.log('message', topic, payload.toString());
            }
         if (topic === 'needCurrentTemp') {
            device.publish('currentTemp', JSON.stringify({
            temp: tempGenerator()
            }));
         }
          if (topic === 'setInterval') {
            clearInterval(timeout)
            let interval = parseFloat(JSON.parse(payload).message) * 60000
            console.info('hello', parseFloat(JSON.parse(payload).message) * 60000)
            device.publish('getTemp', JSON.stringify({
                  temp: tempGenerator()}));
            timeout = setInterval(function() {
               device.publish('getTemp', JSON.stringify({
                  temp: tempGenerator()}));
            }, interval);
            let intervalJson = {
               interval: parseFloat(JSON.parse(payload).message)
               }
            fs.writeFileSync(path.resolve(__dirname, 'interval.json'), JSON.stringify(intervalJson))
   
         }
      });   



