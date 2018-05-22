$(function(){

  var script = document.createElement("SCRIPT");
  script.src = 'https://ajax.googleapis.com/ajax/libs/jquery/1.7.1/jquery.min.js';
  script.type = 'text/javascript';
  driversArray = [];
  
  setTimeout(function(){ 
     
  script.onload = function() {
       var $ = window.jQuery;

       $( document ).ready(function(){

         $('#pageRosterViewContent').prepend(
            optionButton('dlRoster', 'Roster Download', '#FFFFFF', '#cc0000', '5px')
          );

         let node = $('body');
         let roster = $(node).find('#cspDATable > tbody')[1].children;

         for(let i = 0; i < roster.length; i++){
           let driver = $(roster[i], 'tr')[0].children;
           let driverId = $(driver[0]).text();
           let driverName = $(driver[1]).text();
           let driverCurrentStatus = $(driver[2]).text();
           let driverBlockTime = $(driver[4]).text();
           let driverStartTime = $(driver[5]).text();
           let driverEndTime = $(driver[6]).text();

           driversArray.push({'id': driverId, 'name':driverName, 'blockTime': driverBlockTime, 'startTime': driverStartTime, 'endTime': driverEndTime});
         }

         function sortArray(){
           let startTime;
           let endTime;
           let sortArray = [];
           let result = [];

           console.log(driversArray)
           for(let i = 0; i < driversArray.length; i++){
             if(startTime == undefined){
               startTime = driversArray[i]['startTime'];
               //endTime = driversArray[i]['endTime'];
             }
             if(startTime == driversArray[i]['startTime']){
               sortArray.push(driversArray[i])
             } else{
               startTime = driversArray[i]['startTime'];
               //endTime = driversArray[i]['endTime'];
               sortArray.sort(function(a,b){
                 let nameA = a.name.toLowerCase();
                 let nameB = b.name.toLowerCase();

                 if(nameA < nameB){
                   return -1;
                 }
                 if(nameA > nameB){
                   return 1;
                 }
                 return 0;
               })

               for(let i = 0; i < sortArray.length; i++){
                 result.push(sortArray[i]);
               }

               sortArray = [];
               sortArray.push(driversArray[i])

             }
           }
          return result;
         }

         sortedArray = sortArray();

         $("#dlRoster").click(function(){


            //time in miliary hours;
            let hourNow = new Date().getHours();

            //prompt for time
            let time = prompt("Input Military Hour?", hourNow);
            let a = document.getElementById('dlRoster');
            let headers = ['Driver Name', 'Block Time', 'Start Time', 'End Time', 'Check-In', 'Check-Out'];
            let excel = $JExcel.new();

            //format for headers
            var formatHeader=excel.addStyle ( {
              border: "none,none,none,thin #551A8B",font: "Calibri 12 #FFFFFF B", fill: "#000000"}
            );

            for(let i=0; i < headers.length; i++){
              excel.set(0, i, 0, headers[i], formatHeader);
              if(i == 1) {
                excel.set(0, i, undefined, 10);
              } else if(i == 2 || i == 3){
                excel.set(0, i, undefined, 10);
              } else if(i == 4 || i == 5){
                excel.set(0, i, undefined, 12);
              } else {
                excel.set(0, i, undefined, "auto");
              }

            }

            let position = 1;
            for(let i=1; i < sortedArray.length; i++){
              let driverStartTime = convertToTime(sortedArray[i]['startTime']);

              if(driverStartTime > time){
                excel.set(0,0,position, sortedArray[i]['name']);
                //excel.set(0,1,position, sortedArray[i]['id']);
                excel.set(0,1,position, sortedArray[i]['blockTime']);
                excel.set(0,2,position, sortedArray[i]['startTime']);
                excel.set(0,3,position, sortedArray[i]['endTime']);
                position++;
              }
            }
            let file = excel.generate("Rosters.xlsx");
            a.href = file;
         });

       });

       //convert drivers startime to Military hours(integers)
       function convertToTime(time){
         let strNum = "";
         let period = "";
         let num;
         if(time[2] == ":"){
           strNum += time[0] + time[1];
           period += time[6] + time[7];
         } else {
           strNum += time[0];
           period += time[5] + time[6];
         }

         if(period == "pm" && strNum != "12"){
           num = parseInt(strNum) + 12;
         } else {
           num = parseInt(strNum)
         }

         return num;
       }

       //create button with additonal options
       function optionButton(id, value, color, bgColor, padding){
         var id = id;
         var value = value;
         var color = color;
         var bgColor = bgColor;
         var padding = padding;
         var string;

         string = "<input id='" + id + "' type='button' value='" + value +
         "' style='" +"color: " + color + "; " + "background-color:" + bgColor +
         "; " + "padding: " + padding + "; border-style: none;'></button>";

         return string;
       };

};
  
  
  
  
  }, 3000);

  
   document.getElementsByTagName("head")[0].appendChild(script);
});
