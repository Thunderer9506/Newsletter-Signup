const bodyparser = require('body-parser');
const express = require('express')
const request = require('request')
const https = require('https')
require('dotenv').config({path: __dirname + '/.env'})

const app = express()

app.use(express.static('public'))
app.use(bodyparser.urlencoded({extended: true}))

app.get('/',function(req,res){
    res.sendFile(__dirname+'/signup.html')
})
app.post('/',function(req,res){
    const firstname = req.body.fname
    const lastname = req.body.lname
    const email = req.body.ema
    const data = {
        members:[{
            email_address:email,
            status:'subscribed',                                                                                        
            merge_fields:{
                FNAME: firstname,
                LNAME: lastname
            }
        }]
    }
    const jsondata = JSON.stringify(data)
    const url = 'https://us12.api.mailchimp.com/3.0/lists/'+process.env.URL
    const options = {
        method:'POST',
        auth:process.env.AUTH
    }
    const request = https.request(url,options,function(response){
        if (response.statusCode === 200){
            res.sendFile(__dirname+"/success.html")
        }
        else{
            res.sendFile(__dirname+'/failure.html')
        }
        response.on('data',function(data){
            console.log(JSON.parse(data))
        })
    })
    request.write(jsondata)
    request.end()
})
app.post('/failure',function(req,res){ 
    res.redirect('/')
})
app.listen(3000,function(){
    console.log('listening on port 3000')
})