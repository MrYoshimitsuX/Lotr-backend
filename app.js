import express from "express";
import bodyParser from "body-parser";   
import { dirname, join } from "path";        
import { fileURLToPath } from "url"; 
import cors from "cors";
import rateLimit from 'express-rate-limit';

const app = express();
app.use(cors());  //CORS POLICIES GOT ADDED!!!
const __dirname = dirname(fileURLToPath(import.meta.url));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(join(__dirname, 'public')));

//Setting EJS as View engine
app.set('view engine', 'ejs');
app.set('views', join(__dirname, 'views'));

// Set rate limit
const apiLimiter = rateLimit({
    windowMs: 3 * 60 * 1000, // 3 mins
    max: 25, // Maximum 25 requests per IP in 15 minutes
    handler: (req, res) => {
        res.status(429).json({
          status: 409,
          error: 'Too many requests, please try again later.'
        });
  }});
  
  // Implement it to every /api/v1 paths
  app.use('/api/v1', apiLimiter);

import dark_beings from "./datas/dark-beings.json" assert {type: "json"};
import dragons from "./datas/dragons.json" assert {type: "json"};
import dwarves from "./datas/dwarves.json" assert {type: "json"};
import elves from "./datas/elves.json" assert {type: "json"};
import ents from "./datas/ents.json" assert {type: "json"};
import hobbits from "./datas/hobbits.json" assert {type: "json"};
import humans from "./datas/humans.json" assert {type: "json"};
import locations from "./datas/locations.json" assert {type: "json"};
import orcs_urukhais from "./datas/orcs-urukhais.json" assert {type: "json"};
import rings from "./datas/rings.json" assert {type: "json"};
import trolls from "./datas/trolls.json" assert {type: "json"};
import wizards from "./datas/wizards.json" assert {type: "json"};

const race_dict = {
    "dark_beings": dark_beings,
    "dragons": dragons,
    "dwarves": dwarves,
    "elves": elves,
    "ents": ents,
    "hobbits": hobbits,
    "humans": humans,
    "locations": locations,
    "orcs": orcs_urukhais,
    "rings": rings,
    "trolls": trolls,
    "wizards": wizards
};

function isBearer(res){
    try{
        const raceKeys = Object.keys(race_dict);
        let ring_bearers_arr = [];
        for(let i=0;i<raceKeys.length;i++){
            const universe = race_dict[raceKeys[i]];
            const inner_race = universe[raceKeys[i]];
            for(let j=0;j<inner_race.length;j++){
                if(inner_race[j].ring_bearer === res){
                    ring_bearers_arr.push(inner_race[j]);
                }
            }
        }

        // console.log(ring_bearers_arr);
        // res.status(200).json(ring_bearers_arr);
        return ring_bearers_arr;
    }

    catch(err){
        console.log(err);
    }           
}

function findGender(gender){
    const raceKeys = Object.keys(race_dict);
    const gender_arr = [];
    for(let i=0;i<raceKeys.length;i++){
        const universe = race_dict[raceKeys[i]];
        const inner_data = universe[raceKeys[i]]; //All in arr
        for(let j=0;j<inner_data.length;j++){
            // console.log(inner_data[j]); //All in the same line
            if(inner_data[j].gender === gender){
                gender_arr.push(inner_data[j]);
            }
        }
    }

    return gender_arr;
}

function isRace(race){
    try{
        const raceKeys = Object.keys(race_dict);
        let counter = 0;
        for(let i=0;i<raceKeys.length;i++){
            if(raceKeys[i] === race){
                counter = 1;
                break;
            }
        }

        if(counter === 1){
            return true;
        }
        else{
            return false;
        }
    }
    catch(err){
        console.log(err);
    } 
}

function isTool(tool){
    try{
        const raceKeys = Object.keys(race_dict);
        let counter = 0;
        for(let i=0;i<raceKeys.length;i++){
            const jsonFormat = race_dict[raceKeys[i]];
            const inner_data = jsonFormat[raceKeys[i]];
            for(let j=0;j<inner_data.length;j++){
                if(inner_data[j].tools != undefined){
                    const all_tools = inner_data[j].tools;
                    for(let a=0;a<all_tools.length;a++){
                        // console.log(all_tools[a]);
                        if(all_tools[a].name === tool){
                            counter = 1;
                        }
                    }
                }
                
            }
        }

        if(counter === 1){
            return true;
        }
        else{
            return false;
        }
    }
    catch(err){
        console.log(err);
    } 
}

//GET all 
app.get("/api/v1/",(req , res)=>{
    try{
        const raceKeys = Object.keys(race_dict);
        const universe = [];
        for(let i=0;i<raceKeys.length;i++){
            universe.push(race_dict[raceKeys[i]]);
        }
        res.status(200).json(universe);
    }
    catch(err){
        console.log(err);
        res.status(500).json({error: "Internal Server Error"});
    }
    
});

//GET all //RING_BEARER-GENDER OR BOTH
app.get("/api/v1/universe",(req , res)=>{
    try{
        const ring_bearer = req.query.ring_bearer;
        const gender = req.query.gender;
        if(!ring_bearer && !gender){
            try{
                const raceKeys = Object.keys(race_dict);
                const universe = [];
                for(let i=0;i<raceKeys.length;i++){
                    universe.push(race_dict[raceKeys[i]]);
                }
                res.status(200).json(universe); 
            }
            catch(err){
                console.log(err);
                res.status(500).json({error: "Internal Server Error"});
            }
        }
        else if(ring_bearer && !gender){
            try{
               if(req.query.ring_bearer === 'true'){
                res.status(200).json(isBearer(true));            
            }  
            else if(req.query.ring_bearer === 'false'){
                res.status(200).json(isBearer(false)); 
            } 
            else{
                res.status(400).json({
                    status: 400,
                    error: "Bad Request",
                    message: "Invalid value for 'ring_bearer'. Must be 'true' or 'false'."
                });
            }
            }

            catch(err){
                console.log(err);
                res.status(500).json({error: "Internal Server Error"});
            }
        }

        else if(!ring_bearer && gender){
            try{
               if(req.query.gender === 'male' || req.query.gender === 'female'){
                res.status(200).json(findGender(gender));
               }
               else{
                res.status(400).json({
                    status: 400,
                    error: "Bad Request",
                    message: "Invalid value for 'gender'. Must be 'male' or 'female'."
                });
               }
            }

            catch(err){
                console.log(err);
                res.status(500).json({error: "Internal Server Error"});
            }         
        }

        else if(ring_bearer && gender){
            try{
                if(req.query.ring_bearer === 'true' || req.query.ring_bearer === 'false'){

                    if(req.query.gender === 'male' || req.query.gender === 'female'){
                        if(req.query.ring_bearer === 'true'){
                            const ring_bearers_arr = isBearer(true);
                            const arr = [];
                            for(let i=0;i<ring_bearers_arr.length;i++){
                                if(ring_bearers_arr[i].gender === gender){
                                    arr.push(ring_bearers_arr[i]);
                                }
                            }
                            res.status(200).json(arr);
                        }
                        else if(req.query.ring_bearer === 'false'){
                            const ring_bearers_arr = isBearer(false);
                            const arr = [];
                            for(let i=0;i<ring_bearers_arr.length;i++){
                                if(ring_bearers_arr[i].gender === gender){
                                    arr.push(ring_bearers_arr[i]);
                                }
                            }
                            res.status(200).json(arr);
                        }
                    }

                    else{
                        res.status(400).json({
                            status: 400,
                            error: "Bad Request",
                            message: "Invalid value for 'gender'. Must be 'male' or 'female'."
                        });    
                    }

                    
                }

                else{
                    res.status(400).json({
                        status: 400,
                        error: "Bad Request",
                        message: "Invalid value for 'ring_bearer'. Must be 'true' or 'false'."
                    });
                }
    
            }

            catch(err){
                console.log(err);
                res.status(500).json({error: "Internal Server Error"});
            }
            }
        
    }
    catch(err){
        console.log(err);
        res.status(500).json({error: "Internal Server Error"});
    }
});


//1. GET a random race
app.get("/api/v1/random",(req , res)=>{
    try{
        const raceKeys = Object.keys(race_dict);
        const randomIndex = Math.floor(Math.random()*(raceKeys.length));
        res.status(200).json(race_dict[raceKeys[randomIndex]]);  
    }
    catch(err){
        console.log(err);
        res.status(500).json({error: "Internal Server Error"});
    }
      
});


//2. GET datas by filtering on the quotes  
app.get("/api/v1/quotes",(req , res)=>{
    try{
        const raceKeys = Object.keys(race_dict);
        let quotes_arr = [];
        for(let i=0;i<Object.keys(race_dict).length;i++){
            const jsonFormat = race_dict[raceKeys[i]];
            const inner_response = jsonFormat[raceKeys[i]];
            // console.log(inner_response);
            for(let j=0;j<inner_response.length;j++){
                if(inner_response[j].quotes != undefined){
                    quotes_arr.push(inner_response[j].quotes);
                }
            }
        }
        res.status(200).json(quotes_arr);
    }

    catch(err){
        console.log(err);
        res.status(500).json({error: "Internal Server Error"});
    }

});

//3. GET datas by filtering on the tools NAME QUERY
app.get("/api/v1/tools", (req, res) => {
    try {
        const name = req.query.name;
        const raceKeys = Object.keys(race_dict);
        let tools_arr = [];

        if (!name) {
            for (let i = 0; i < raceKeys.length; i++) {
                const jsonFormat = race_dict[raceKeys[i]];
                const inner_data = jsonFormat[raceKeys[i]];
                for (let j = 0; j < inner_data.length; j++) {
                    if (inner_data[j].tools != undefined) {
                        tools_arr.push(inner_data[j].tools);
                    }
                }
            }
            return res.status(200).json(tools_arr);
        } else {
            if (isTool(name)) {
                for (let i = 0; i < raceKeys.length; i++) {
                    const jsonFormat = race_dict[raceKeys[i]];
                    const inner_data = jsonFormat[raceKeys[i]];
                    for (let j = 0; j < inner_data.length; j++) {
                        if (inner_data[j].tools != undefined) {
                            const all_tools = inner_data[j].tools;
                            for (let a = 0; a < all_tools.length; a++) {
                                if (all_tools[a].name === name) {
                                    tools_arr.push(all_tools[a]);
                                }
                            }
                        }
                    }
                }
                return res.status(200).json(tools_arr);
            } else {
                return res.status(404).json({
                    status: 404,
                    error: "Not Found",
                    message: `No tool found with the name '${name}'`
                });
            }
        }
    } catch (err) {
        console.log(err);
        return res.status(500).json({ error: "Internal Server Error" });
    }
});



//4. GET a specific race parameter + NAME QUERY AND HOME QUERY
app.get("/api/v1/:race",(req , res)=>{
        try{
            const race = req.params.race;
            if(isRace(req.params.race))
            {
                    const name = req.query.name;
                    const home = req.query.home;
                if(!name && !home){
                    try{
                        res.status(200).json(race_dict[race]);
                    }
                    catch(err){
                        console.log(err);
                        res.status(500).json({error: "Internal Server Error"});
                    }
                    
                }
                else{
                    try{
                        if(name && !home){
                            const jsonFormat = race_dict[race];
                            const inner_response = jsonFormat[race];
                            let isHere = 0;
                            let answer = "";
                            for(let i=0;i<Object.keys(inner_response).length;i++){
                                if(inner_response[i].name === name){
                                    isHere = 1;
                                    answer = inner_response[i];
                                    break;
                                }
                            }
            
                            if(isHere === 1){
                                res.status(200).json(answer);
                            }
                            else{
                                if(race === "dwarves"){
                                    // res.status(500).json({error: `Your dwarf not here :(`});
                                    res.status(404).json({
                                        status: 404,
                                        error: "Not Found",
                                        message: `Your dwarf not here :(`
                                    });
                                }
                                else if(race === "elves"){
                                    // res.status(500).json({error: `Your elf not here :(`});
                                    res.status(404).json({
                                        status: 404,
                                        error: "Not Found",
                                        message: `Your elf not here :(`
                                    });
                                }
                                else{
                                    // res.status(500).json({error: `Your ${race.slice(0,race.length-1)} not here :(`});
                                    res.status(404).json({
                                        status: 404,
                                        error: "Not Found",
                                        message: `Your ${race.slice(0,race.length-1)} not here :(`
                                    });
                                }
                            }
                        }
                        else if(!name && home){
                            const race = req.params.race;
                            const jsonFormat = race_dict[race];
                            const response = jsonFormat[race];
                            let citizens_arr = [];
                            for(let i=0;i<response.length;i++){
                                if(response[i].home === home){
                                    citizens_arr.push(response[i]);
                                }
                            }
                            // console.log(citizens_arr);
                            if(citizens_arr.length > 0){
                                res.status(200).json(citizens_arr);
                            }
                            else{
                                res.status(404).json({
                                    status: 404,
                                    error: "Not Found",
                                    message: `The home you're looking for not here :(`
                                });
                            }
                            
                        }
                        
                    }

                    catch(err){
                        console.log(err);
                        res.status(500).json({error: "Internal Server Error"});
                    }
                
                }
            }
            else{
                res.status(404).json({
                    status: 404,
                    error: "Not Found",
                    message: `No race found with the name '${race}'`  
                });
            }
            
        }

        catch(err){
            console.log(err);
            res.status(500).json({error: "Internal Server Error"});
        }
    }
);


const port = 3000;
app.listen(port , ()=>{
    console.log(`Listening port ${port}...`);
});