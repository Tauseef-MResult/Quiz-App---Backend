const express = require('express');
const app = express();
const cors=require("cors");
const mongoose = require('mongoose');

require('dotenv').config()
const port = process.env.PORT || 5555;


// Importing local modules:
require('./src/services/dbConnect');

const insertCandidate = require('./src/models/dbQueries/insertCandidate')
const findCandidate = require('./src/models/dbQueries/findCandidate')

const insertQuestion = require('./src/models/dbQueries/insertQuestion')
const findQuestions = require('./src/models/dbQueries/findQuestions')
const deleteQuestion = require('./src/models/dbQueries/deleteQuestion')

const insertReport = require('./src/models/dbQueries/insertReport')
const findReport = require('./src/models/dbQueries/findReport')

const findAllTestees = require('./src/models/dbQueries/findAllTestees')

const sendMail = require('./src/services/sendMail')


// Middleware CORS Config:
const corsOptions ={
   origin:'*', 
   credentials:true,           
   optionSuccessStatus:200,
}


// Middlewares:
app.use(cors(corsOptions))
app.use(express.json());


// ROUTING: Endpoint is http://localhost:5555

// Used in registration Page
app.post("/insertCandidate", async (req, resp) => {
    try{
        console.log(req.body)
        const result = await insertCandidate(req.body);
        resp.send({success: true, document : result});
        console.log("Candidate successfully added to DataBase.")
    }
    catch(e){
        resp.status(400);
        resp.send({success: false, errorMsg: e.message});
        console.log(e.message)
    }
    
});


// Used in Login Page
app.get("/findCandidate/:email", async (req, resp) => {
    try{
        console.log(req.params)
        const result = await findCandidate(req.params);
        resp.send({success: true, document : result});
        console.log("Candidate has registered and is authorized to go to assessment page.")
    }
    catch(e){
        resp.status(400);
        resp.send({success: false, errorMsg: e.message});
        console.log(e.message)
    }
    
});



// Used in Admin Question Entering Page
app.post("/insertQuestion", async (req, resp) => {
    try{
        console.log(req.body)
        const result = await insertQuestion(req.body);
        resp.send({success: true, document : result});
        console.log("Question successfully added to DataBase.")
    }
    catch(e){
        resp.status(400);
        resp.send({success: false, errorMsg: e.message});
        console.log(e.message)
    }
    
});



// Used in Candidate Assessment Page and in Admin Question Viewing Page
app.get("/findQuestions/:technology", async (req, resp) => {
    try{
        console.log(req.params)
        const result = await findQuestions(req.params);
        resp.send({success: true, document : result});
        console.log("Questions found on this technology in Database.")
    }
    catch(e){
        resp.status(400);
        resp.send({success: false, errorMsg: e.message});
        console.log(e.message)
    }
    
});


// Used in Admin Question Viewing Page for admin to delete questions
app.delete("/deleteQuestion/:questionID", async (req, resp) => {
    try{
        console.log(req.params)
        const result = await deleteQuestion({"_id": mongoose.Types.ObjectId(req.params.questionID)});
        resp.send({success: true, document : result});
        console.log("Questions successfully deleted from DataBase.")
    }
    catch(e){
        resp.status(400);
        resp.send({success: false, errorMsg: e.message});
        console.log(e.message)
    }
})


// Used in Candidate Assessment Page 
app.post("/insertReport", async (req, resp) => {
    try{
        console.log(req.body)
        const result = await insertReport(req.body);
        resp.send({success: true, document : result});
        console.log("Report successfully added to DataBase.")
    }
    catch(e){
        resp.status(400);
        resp.send({success: false, errorMsg: e.message});
        console.log(e.message)
    }
    
});

// Used in Admin Report Second Page
app.get("/findReport/:email&:technology", async (req, resp) => {
    try{
        console.log(req.params)
        const result = await findReport(req.params);
        resp.send({success: true, document : result});
        console.log("Candidate Test report of the technology found in Database.")
    }
    catch(e){
        resp.status(400);
        resp.send({success: false, errorMsg: e.message});
        console.log(e.message)
    }
    
});


// Used in Admin Report First Page
app.get("/findAllTestees/", async (req, resp) => {
    try{
        const result = await findAllTestees();
        resp.send({success: true, document : result});
        console.log("Testees details found in database.")
    }
    catch(e){
        resp.status(400);
        resp.send({success: false, errorMsg: e.message})
        console.log(e.message)
    }

    
});


// Used To Send the Test Link via E-Mail 
app.post("/sendMail", async (req, resp) => {
    try{
        console.log(req.body)
        await sendMail(req.body.email)
        const msg = "Successfully sent Test Link Email to the candidate.";
        resp.send({success: true, message : msg});
        console.log(msg)
    }
    catch(e){
        console.log(e.message)
        const msg = "Unable to send Test Link Email to the candidate.";
        resp.status(400);
        resp.send({success: false, errorMsg: msg});
        console.log(msg)
    }
    
});


// Start the server at port 5555
app.listen(port, () => {
    console.log('Listening on port ' + port);
});