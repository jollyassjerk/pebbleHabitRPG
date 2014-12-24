var UI = require('ui');
var ajax = require('ajax');
var Settings = require('settings');


console.log('Object: ' + Settings);

console.log('Stringified: ' + JSON.stringify(Settings));

console.log('UUID2: ' + Settings.uuid2);

var scard = new UI.Card({
      title:'HabitRPG',
      subtitle:'starting...',
      scrollable: true
    });
scard.show();



function appMessageAck(e) {
	console.log("App message sent successfully");
  
  console.log(JSON.stringify(localStorage.getItem("settings")));
  
}


// app message failed to send
//
function appMessageNack(e) {
	console.log("App message failed to send: " + e.error.message);
}


// app ready event
//
Pebble.addEventListener("ready",
	function(e) {
		console.log("connect! [" + e.ready + "] (" + e.type + ")");
	}
);


// display configuration screen
//
Pebble.addEventListener("showConfiguration",
	function() {
    var config = "http://www.seanisfat.info/pebbleHabitRPG.html";
		var settings = encodeURIComponent(localStorage.getItem("settings"));
    scard.subtitle('Changing Settings');
    console.log("Opening Config: " + config);
		Pebble.openURL(config);

	}
);


// close configuration screen
//
Pebble.addEventListener("webviewclosed",
	function(e) {
		var settings;
    scard.subtitle('Saving Settings');
		try {
			settings = JSON.parse(decodeURIComponent(e.response));
			localStorage.clear();
			localStorage.setItem("settings", JSON.stringify(settings));
			console.log("Settings: " + localStorage.getItem("settings"));
			Pebble.sendAppMessage(settings, appMessageAck, appMessageNack);
		} catch(err) {
			settings = false;
			console.log("No JSON response or received Cancel event");
		}
	}
);






var URL = 'https://habitrpg.com/api/v2/members/' + Settings.uuid2;



 var icard = new UI.Card({
      title:'HabitRPG',
      subtitle:'',
      scrollable: true
    });


console.log('||||||#########################||||||||||||||UUID2|' + Settings.uuid2 + '|' + Settings.key2  );
ajax(
  {
    url: URL,
    type: 'json',
    method: 'GET',
            headers:{
        'x-api-user': Settings.uuid2,  
        'x-api-key': Settings.key2,  
        }
  },
  function(data2) {
  icard.subtitle('Getting Latest data for ' + data2.profile.name + '...');
   

  icard.show();

  },
  function(error2) {
    // Failure!
    console.log('Failed fetching habit data: ' + error2);
  }
);





URL = 'https://habitrpg.com/api/v2/user/tasks';


// Make the request
ajax(
  {
    url: URL,
    type: 'json',
    method: 'GET',
            headers:{
        'x-api-user': Settings.uuid2,  
        'x-api-key': Settings.key2,  
        }
  },
  function(data) {
            // Success!
    console.log('Successfully fetched HABIT data!');
          
            var habits = [];
           // var daily = '';
            var daily = [];
            var todo = [];
          
            
            
            for ( var x = 0; x < data.length; x++ ) {
              
          
              
              
              if (data[x].type == 'habit') 
             { 
                  habits.push({
                    title: data[x].text.replace(/:.*:/, ''),
                    subtitle: data[x].notes.replace(/:.*:/, ''),
                    id: data[x].id
                  });
              }
              
              
              
              if (data[x].type == 'daily') {//&& data[x].completed == 'false') {
                
                  if (data[x].completed === false) {
                    
                  daily.push({
                    title: data[x].text.replace(/:.*:/, ''),
                    subtitle: data[x].notes.replace(/:.*:/, ''),
                    id: data[x].id
                  });
                    
                  } else {
                    
                  daily.push({
                    title: 'DONE(' + data[x].text.replace(/:.*:/, '') + ')',
                    subtitle: data[x].notes.replace(/:.*:/, ''),
                    id: data[x].id
                  });
                    
                  }
              }
              
              
              
              if (data[x].type == 'todos' && data[x].completed === false ) {
                  todo.push({
                    title: data[x].text.replace(/:.*:/, ''),
                    subtitle: data[x].notes.replace(/:.*:/, ''),
                    id: data[x].id
                  });
              }
              
              
            }
          
        
        //var topItems = [];
        //    topItems.push({title: 'Habits', subtitle: '', object: habits});
        //    topItems.push({title: 'Dailies', subtitle: '', object: daily});
        //    topItems.push({title: 'Todos', subtitle: '', object: todo});
            
        var topMenu = new UI.Menu({
          sections: [{
            title: 'Habits',
            items: habits
          },
          {
            title: 'Dailies',
            items: daily
          },
          {
            title: 'ToDos',
            items: todo
          }]
        });    
        
        topMenu.show();
         icard.hide();
        
            
        topMenu.on('select', function(e) {
          console.log(e.item.title + ' - ' + e.item.id);
          
          var id = e.item.id;
          
          var habitCard = new UI.Card({
            title:e.item.title,
            body: 'Press up to + or Complete Task\n\nPress Down to - the task.',
            style: 'small'
          });
          
          habitCard.show();
          topMenu.hide();
          

                    habitCard.on('click', 'down', function() {
            console.log('up pressed');
            var updateURL = 'https://habitrpg.com/api/v2/user/tasks/' + id + '/down';
            
            ajax(
              {
                url: updateURL,
                type: 'json',
                method: 'POST',
                        headers:{
                          'x-api-user': Settings.uuid2,  
                          'x-api-key': Settings.key2,  
                    }
              },
              function(data) {
                console.log('successfully updated');
                habitCard.body('Successfully Updated!');
              },
              function(error) {
            console.log('Failed updating habit data: ' + error);
          });
          
          
                    
        });
          
          
          
          habitCard.on('click', 'up', function() {
            console.log('up pressed');
            var updateURL = 'https://habitrpg.com/api/v2/user/tasks/' + id + '/up';
            
            ajax(
              {
                url: updateURL,
                type: 'json',
                method: 'POST',
                        headers:{
        'x-api-user': options.uuid2,  
        'x-api-key': options.key2,  
                    }
              },
              function(data) {
                console.log('successfully updated');
                habitCard.body('Successfully Updated!');
              },
              function(error) {
            console.log('Failed updating habit data: ' + error);
          });
          
          
                    
        });
          
   
          
          
        });
          
          
  },
  function(error) {
    // Failure!
    console.log('Failed fetching habit data: ' + error);
  }
);
  

