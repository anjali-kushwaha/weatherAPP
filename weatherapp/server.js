const http = require("http");
const fs= require("fs");
var requests =require("requests")
const homeFile=fs.readFileSync("home.html","utf-8");

const replaceval =(tempval,orgval)=>{
    let temprature =tempval.replace("{%tempval%}",orgval.main.temp);
    temprature =temprature.replace("{%tempmin%}",orgval.main.temp_min);
    temprature =temprature.replace("{%tempmax%}",orgval.main.temp_max);
    temprature =temprature.replace("{%location%}",orgval.name);

temprature =temprature.replace("{%country%}",orgval.sys.country);
temprature =temprature.replace("{%status%}",orgval.weather[0].main);

return temprature;
}




const server =http.createServer((req,res) =>{

    if(req.url == "/"){
      requests("https://api.openweathermap.org/data/2.5/weather?q=delhi&appid=abc735b10d39279cdfa3fecaad556c70")
   
    .on("data",(chunk)=>{
        const objdata =JSON.parse(chunk);
        const arrData =[objdata];
        //console.log(arrData);
        const realTimeData =arrData
        .map((val) =>replaceval(homeFile,val))
        //converting array into string
        .join("");
        res.write(realTimeData);
    })   
    .on("end",(err)=>{
        if (err) return console.log("connection closed due to errors",err);
        res.end();
    });
    }

});

server.listen(8000,"127.0.0.1");