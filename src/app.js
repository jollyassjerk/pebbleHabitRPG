var UI = require('ui');
var ajax = require('ajax');
var Settings = require('settings');
var habit = [];
var stat = [];

console.log('Stringified: ' + JSON.stringify(Settings));
console.log('Stringified: ' + Settings.option('uuid'));


var scard = new UI.Card({
      title:'HabitRPG',
      subtitle:'starting...',
      scrollable: true
    });
scard.show();



function appMessageAck(e) {
	console.log("App message sent successfully");
  
  console.log('Stringified: ' + JSON.stringify(Settings));
  console.log('item ' + Settings.option('uuid'));
  
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
    var config = "https://gist.githack.com/yoshimov/9dc26302ac8d3863cd62/raw/d5ade036e3435c98294be68adff018c8416081fa/pebble-habitrpg.html";
		//var settings = encodeURIComponent(localStorage.getItem("settings"));
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
			Settings.option('uuid', settings.uuid2);

      
      Settings.option('key', settings.key2);


      Pebble.sendAppMessage(JSON.parse(decodeURIComponent(e.response)), appMessageAck, appMessageNack);
		} catch(err) {
      console.log(err);
			settings = false;
			console.log("No JSON response or received Cancel event");
      
		}
	}
);




 console.log('item ' + Settings.options);

//var URL = 'https://habitrpg.com/api/v2/members/' + Settings.option('uuid');
var URL = 'https://habitrpg.com/api/v2/user';



 var icard = new UI.Card({
      title:'HabitRPG',
      subtitle:'',
      scrollable: true
    });


//console.log('||||||#########################||||||||||||||UUID|' + Settings.uuid + '|' + Settings.key  );
ajax(
  {
    url: URL,
    type: 'json',
    method: 'GET',
            headers:{
        'x-api-user': Settings.option('uuid'),  
        'x-api-key': Settings.option('key'),  
        }
  },
  function(data2) {
  icard.subtitle('Getting Latest data for ' + data2.profile.name + '...');
   
    habit = data2;
    stat = habit.stats;
  icard.show();
  scard.hide();
  },
  function(error2) {
    // Failure!
  scard.subtitle('Something was not right, likely UUID or Key')  ;
    console.log('Failed fetching habit data: ' + error2);
  }
);





URL = 'https://habitrpg.com/api/v2/user/';


// Make the request
ajax(
  {
    url: URL,
    type: 'json',
    method: 'GET',
            headers:{
        'x-api-user': Settings.option('uuid'),  
        'x-api-key': Settings.option('key'),  
        }
  },
  function(data) {
            // Success!
    console.log('Successfully fetched HABIT data!');
          
   // icard.hide();  
    var habits = [];
           // var daily = '';
            var daily = [];
            var todo = [];
          
    
    var user = [];
    
    console.log(data.stats.hp);
                  
                user.push({
                  title: "Level: " + data.stats.lvl,
                    subtitle: data.stats.class,
                    id: 999
                  });    
 
    
               
    
                  user.push({
                    title: "HP",
                    subtitle: data.stats.hp  + " / " + data.stats.maxHealth,
                    id: 999
                  });
    
                 user.push({
                    title: "XP",
                    subtitle: data.stats.exp + " / " + ( data.stats.exp + data.stats.toNextLevel ),
                    id: 999
                  });
    
                  user.push({
                    title: "MP",
                    subtitle: data.stats.mp + " / " + data.stats.maxMP,
                    id: 999
                  });    
    
       user.push({
                    title: "GP",
                    subtitle: data.stats.gp,
                    id: 999
                  });
    
    
    

              
    for ( var x = 0; x < data.habits.length; x++ ) {
              if (data.habits[x].type == 'habit') 
             { 
                  habits.push({
                    title: data.habits[x].text.replace(/:.*:/, ''),
                    subtitle: data.habits[x].notes.replace(/:.*:/, ''),
                    id: data.habits[x].id
                  });
              }
    }
    
    
    
        for (x = 0; x < data.todos.length; x++ ) {
              if (data.todos[x].type == 'todo???') 
             { 
                  habits.push({
                    title: data.todo[x].text.replace(/:.*:/, ''),
                    subtitle: data.todo[x].notes.replace(/:.*:/, ''),
                    id: data.todo[x].id
                  });
              }
    }
    
    
    
     for (x = 0; x < data.dailys.length; x++ ) {
                  if (data.dailys[x].type == 'daily') {//&& data[x].completed == 'false') {
                
                  if (data.dailys[x].completed === false) {
                    
                  daily.push({
                    title: data.dailys[x].text.replace(/:.*:/, ''),
                    subtitle: data.dailys[x].notes.replace(/:.*:/, ''),
                    id: data.dailys[x].id
                  });
                    
                  } else {
                    
                  daily.push({
                    title: 'DONE(' + data.dailys[x].text.replace(/:.*:/, '') + ')',
                    subtitle: data.dailys[x].notes.replace(/:.*:/, ''),
                    id: data.dailys[x].id
                  });
                    
                  }
              }
     }

    
        //var topItems = [];
        //    topItems.push({title: 'Habits', subtitle: '', object: habits});
        //    topItems.push({title: 'Dailies', subtitle: '', object: daily});
        //    topItems.push({title: 'Todos', subtitle: '', object: todo});
            
        var topMenu = new UI.Menu({
          sections: [
          {
            title: 'User',
            items: user
          },            
          {
            title: 'Dailies',
            items: daily
          },          

          {
            title: 'Habits',
            items: habits
          },
          {
            title: 'ToDos',
            items: todo
          }]
        });    
        
topMenu.show();
icard.hide();

    
        topMenu.on('click', 'back', function(){
            icard.show();
            topMenu.hide();
          });
    
            
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
          
          habitCard.on('click', 'back', function(){
            topMenu.show();
            habitCard.hide();
          });
          

                    habitCard.on('click', 'down', function() {
            console.log('up pressed');
            var updateURL = 'https://habitrpg.com/api/v2/user/tasks/' + id + '/down';
            
            ajax(
              {
                url: updateURL,
                type: 'json',
                method: 'POST',
                        headers:{
        'x-api-user': Settings.option('uuid'),  
        'x-api-key': Settings.option('key'),  
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
        'x-api-user': Settings.option('uuid'),  
        'x-api-key': Settings.option('key'),  
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