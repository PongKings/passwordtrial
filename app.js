$(document).ready(function(){
  page.init();
});


var page = {
  init: function(){
    page.initStyling();
    page.initEvents();
  },
  initStyling: function(){


  },

  initEvents: function(){

    //When you submit to log in as an existing user
    $('#returning').on('submit', function(event){
      event.preventDefault();
      var userName= $('input[name="userName"]').val();
      var password = $('input[name="password"]').val();
      $('input'[type="text"]).val("");
      $('input'[type="password"]).val("");
      //Does a GET call to get user data
      $.ajax({
        method: 'GET',
        url: page.url,
        success: function(data){
          var userInfo = data;
          //passes that user data along with our user name and password checks password/ if user exists
          page.checkPassword(userName,password, userInfo);
        },
        failure: function(data){

        }

      });

    });

    // if you are creating a new user this sends upon submitting the info
    $('#newLogin').on('submit', function(event){
      event.preventDefault();
      var userName = $('input[name="newUserName"]').val();
      var password = $('input[name="newPassword"]').val();
      // Performs a GET to make sure the userName is not taken
      $.ajax({
        method: 'GET',
        url: page.url,
        success: function(data){
          var userInfo = data;
          page.checkForUser(userName, password, userInfo);
        },
        failure: function(data){
          console.log("something went wrong");
        }
      });
    });
  },
   //this is just a quick workaround I was using to instantly create users in the console. Not used in the end product
  addNewUser: function(userInfo){
    $.ajax({
      method: 'POST',
      url: page.url,
      data: userInfo,
      success: function(){
        console.log("Well that worked");
      },
      failure: function(){
        console.log("What's going on?");
      }

    });

  },

  //function that checks if user exists and verifies passwords of existing users
  checkPassword: function(username, userPassword, userInfo){
    // if the user does not exist then it opens up the new login
    if(_.findWhere(userInfo, {userName: username})=== undefined){
      alert("no user exists");
      $('#newLogin').toggleClass('hidden');
    }
    //if the user exists then it checks the password
    else{
    _.each(userInfo, function(currVal, idx, arr){
      if(currVal.userName === username){
        //if the password corresponds to the username then it logs you in
        if(currVal.password === userPassword){

        $('section').toggleClass('hidden');
        $('#currentUser').html(username);
        $('#userMoney').html(currVal.money);
        }

        //if it doesn't then you get an alert that the wrong password was entered and you have to try again
        else{
          alert("Wrong Password");
        }
      }

    });
    }
  },

  //searching for whether or not the user already exists
  checkForUser: function(username, passWord, info){
    //if the user does not exist in the database then it makes a new user
    if(_.findWhere(info, {userName: username}) === undefined){
      var newUser = {userName: username, password: passWord, money: 20};

      // POST call to add the user and his info to the database
      $.ajax({
        method: 'POST',
        url: page.url,
        data: newUser,
        success: function(resp){
          console.log("That worked");
          // user is now logged in and main page will display
          $('section').toggleClass('hidden');
          $('#currentUser').html(newUser.userName);
          $('#userMoney').html(newUser.money);
        },
        failure: function(resp){
          console.log("Something went wrong");
        }

      });
    }

    //if the userName is taken then you have to try again
    else{
      alert("That username already exists. Please pick a new one or log in with your password.");
    }
  },

  //the url for the database i'm using
  url: "https://tiny-tiny.herokuapp.com/collections/terry",


};
