import express from "express";
import bodyParser from "body-parser";   
import { dirname, join } from "path";        
import { fileURLToPath } from "url"; 
import axios from "axios";       
import pg from "pg";
import bcrypt from "bcrypt";

const app = express();
const __dirname = dirname(fileURLToPath(import.meta.url));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(join(__dirname, 'public')));

//Setting EJS as View engine
app.set('view engine', 'ejs');
app.set('views', join(__dirname, 'views'));



const port = 4000;
app.listen(port, ()=>{
    console.log(`Listening port ${port}...`);
});
