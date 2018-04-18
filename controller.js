const axios = require('axios');
const qs  = require('qs');
const config = require('./config');

let token = null;
let expireIn = null;
let timestamp = null;

const instance = axios.create({
    baseURL: config.GROUP50.REST_URL
});

module.exports.getAllPlaces = async(req,res)=>{

    try{
        console.log('inside checktoken')
        await checkToken();
        console.log('id is ', req.params)
       let response =  await instance.get(`${req.params.appId}/places`)
        console.log('response is')
        console.log(response)
        res.json(response.data);
    }

    catch (err){
        return handleHttpError(res,err);
    }

}


module.exports.getAllThings = async(req,res)=>{

    try{
        await checkToken();
        let response =  await instance.get(`${req.params.appId}/things`)
        res.json(response.data);
    }

    catch (err){
        return handleHttpError(res,err);
    }

}
module.exports.getThingsByiD = async(req,res)=>{

    try{
        await checkToken();
        let response =  await instance.get(`${req.params.appId}/things/${req.params.thingId}`)
        res.json(response.data);
    }

    catch (err){
        return handleHttpError(res,err);
    }

}


module.exports.getPeripheralsByiD = async(req,res)=>{

    try{
        await checkToken();
        let response = await instance.get(`${req.params.appId}/things/${req.params.thingId}/peripherals`)
        res.json(response.data);
    }

    catch (err){
        return handleHttpError(res,err);
    }

}


module.exports.getDeviceDetailById = async(req,res)=>{

    try{
        await checkToken();
        let response = await instance.get(`${req.params.appId}/things/${req.params.thingId}`)
        res.send(response.data);
    }

    catch (err){
        return handleHttpError(res,err);
    }

}

module.exports.getDeviceMovements = async(req,res)=>{

    try{
        await checkToken();
        let response = await instance.get(`${req.params.appId}/things/${req.params.thingId}/movements`)
        res.send(response.data);
    }

    catch (err){
        return handleHttpError(res,err);
    }

}

const getToken= async ()=>{
    let result;
    let auth = 'Basic ' + Buffer.from(config.GROUP50.CLIENT + ':' + config.GROUP50.SECRET).toString('base64');

    try{
        let response = await axios.post(
            config.GROUP50.AUTH_URL,
            qs.stringify({ 'grant_type': 'client_credentials' }),
            {
                headers:{
                    'Content-Type':'application/x-www-form-urlencoded',
                    'Authorization':auth
                }
            })

        result= response.data || {} ;
        console.log(result)
        token=result.access_token;
        timestamp=Date.now();
        expireIn=result.expires_in;

        instance.defaults.headers.common['Authorization'] = token;
        instance.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';
    }
    catch (err){
        throw new Error(err);
    }

    return result;

};



const checkToken=  async ()=>{
    const lastTimestamp= parseInt( timestamp,10)||0;
    const lastPeriod= parseInt (expireIn,10)||0;
    const currentTimestamp= Date.now();
    let result={};
    console.log('cuurent timestamp is', currentTimestamp)
    console.log(lastTimestamp+(lastPeriod*1000))
    if(currentTimestamp >= lastTimestamp+(lastPeriod*1000)){
        console.log('token needs to be refreshed')
        let response  = await getToken();
        let result = response.data;
        if(result){
           token=result.access_token;
            expireIn = result.expires_in;
            timestamp = String(Date.now());
        }
    }
    else{
        console.log('no need to refresh token')
    }

    return result;
}



const handleHttpError = (res,error)=>{


        if (error.response) {
            // The request was made and the server responded with a status code
            // that falls out of the range of 2xx
            console.log(error.response)

            res.send(error.response.data);
        } else if (error.request) {
            // The request was made but no response was received
            // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
            // http.ClientRequest in node.js
            res.send(error.request);

        } else {
            // Something happened in setting up the request that triggered an Error
            console.log(error.message)

            res.send(error.message);

        }

}