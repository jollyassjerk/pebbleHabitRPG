var UI = require('ui');
var ajax = require('ajax');


var Settings = require('settings');

Settings.config(
  { url: 'http://www.seanisfat.info/pebbleHabitRPG.html' },
  function(e) {
    console.log('closed configurable');

    // Show the parsed response
    console.log(JSON.stringify(e.options));

    // Show the raw response if parsing failed
    if (e.failed) {
      console.log(e.response);
    }
  }
);


var options = Settings.option();
console.log(JSON.stringify(options));


// Create a Card with title and subtitle
var card = new UI.Card({
  title:'HabitRPG',
  subtitle:'Getting Latest...',
  scrollable: true
});

// Display the Card
card.show();

// Construct URL
//var cityName = 'London';

//var URL = cityName;
var URL = 'https://habitrpg.com/api/v2/user/tasks';

// Make the request
ajax(
  {
    url: URL,
    type: 'json',
    method: 'GET',
            headers:{
        'x-api-user': options.uuid,  
        'x-api-key': options.key,  
        }
  },
  function(data) {
            // Success!
            console.log("Successfully fetched HABIT data!");
          
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
        card.hide();       
        
            
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
        'x-api-user': options.uuid,  
        'x-api-key': options.key,  
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
        'x-api-user': options.uuid,  
        'x-api-key': options.key,  
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
