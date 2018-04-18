const express  = require('express');
const config = require('./config');
const app = express();
const routes = require('./controller');
const cors = require('cors');

app.use(cors())
app.get('/api/:appId/places',routes.getAllPlaces)

app.get('/api/:appId/things',routes.getAllThings)
app.get('/api/:appId/things/:thingId',routes.getThingsByiD)
app.get('/api/:appId/things/:thingId/movements',routes.getDeviceMovements)
app.get('/api/:appId/things/:thingId/peripherals',routes.getPeripheralsByiD)



app.listen(config.PORT,()=>{
    "use strict";
    console.log('app is listening on port',config.PORT);
})