// YOUR CODE HERE:

// message format
// var message = {
//   username: 'shawndrost',
//   text: 'trololo',
//   roomname: '4chan'
// };

// example post request
// $.ajax({
//   // This is the url you should use to communicate with the parse API server.
//   url: 'http://parse.CAMPUS.hackreactor.com/chatterbox/classes/messages',
//   type: 'POST',
//   data: JSON.stringify(message),
//   contentType: 'application/json',
//   success: function (data) {
//     console.log('chatterbox: Message sent');
//   },
//   error: function (data) {
//     // See: https://developer.mozilla.org/en-US/docs/Web/API/console.error
//     console.error('chatterbox: Failed to send message', data);
//   }
// });

// http://parse.sfm6.hackreactor.com/chatterbox/classes/messages
const App = function() {
  this.param = new URLSearchParams(window.location.search);
  this.username = this.param.get('username');
  this.server = 'http://127.0.0.1:3000/';
  this.rooms = [];
  this.lastMessageID = null;
  this.friends = {};
};

App.prototype.init = function() {
  this.fetch();
};

App.prototype.fetch = function() {
  // this.clearMessages();

  $.ajax({
    url: this.server,
    type: 'GET',
    contentType: 'application/json',
    data: 'order=-createdAt&limit=200',
    success: (messageObject) => {

      for ( var i = 0; i < messageObject.results.length; i++ ) {
        const message = messageObject.results[i];
        this.renderMessage(message);
        // this.rooms.push(message.roomname);
        this.renderRoom(message.roomname);
      }

      // this.rooms = [...new Set(this.rooms)];
      // for (var i = 0; i < this.rooms.length; i++) {
      //   this.renderRoom(this.rooms[i]);
      // }

      this.lastMessageID = messageObject.results[0].objectId;
    },
    error: (data) => {
      console.error('chatterbox: Failed to send message', data);
    }
  });
};

App.prototype.update = function() {

  $.ajax({
    url: this.server,
    type: 'GET',
    contentType: 'application/json',
    data: 'order=-createdAt&limit=200',
    success: (messageObject) => {
      const $firstChat = $('.chat:first');

      for ( var i = 0; i < messageObject.results.length; i++ ) {
        const message = messageObject.results[i];

        if ( message.objectId === this.lastMessageID) {
          break;
        }

        this.renderMessage(message, $firstChat, true);
      }
      this.lastMessageID = messageObject.results[0].objectId;
    },
    error: (data) => {
      console.error('chatterbox: Failed to send message', data);
    }
  });
};

App.prototype.clearMessages = function() {
  $('#chats').empty();
};

App.prototype.send = function(message) {
  $.ajax({
    url: this.server,
    type: 'POST',
    data: JSON.stringify(message),
    contentType: 'application/json',
    success: function (data) {
      console.log('chatterbox: Message sent');
    },
    error: function (data) {
      // See: https://developer.mozilla.org/en-US/docs/Web/API/console.error
      console.error('chatterbox: Failed to send message', data);
    }
  });
};

App.prototype.renderMessage = function(message, $firstChat, update = false) {
  const $message = $('<div></div>').data('objectId', message.objectId)
    .data('room', message.roomname).addClass('chat');

  const $topBar = $('<div></div>').addClass('top-bar');
  const $username = $('<div></div>').addClass('username')
    .text(message.username || 'no name');

  const $created = $('<div></div>').addClass('created').text(message.createdAt);
  const $text = $('<div></div>').addClass('text').text(message.text);
  // const $updated = $('<div></div>').addClass('updated').text(message.updatedAt);
  const $roomname = $('<div></div>').addClass('roomname').text(message.roomname);

  $message.append($topBar)
    .append($text);
    // .append($updated);

  $topBar.append($username)
    .append($roomname)
    .append($created);
  if (this.friends[message.username]) {
    $($username).css('color', 'green');
  }
  if (update) {
    $message.insertBefore($firstChat);
  } else {
    $('#chats').append($message);
  }
};
// Add new room
App.prototype.renderRoom = function(room) {
  if (!this.rooms.includes(room)) {
    const $option = $('<option></option>').text(room).val(room);
    $('#roomSelect').append($option);
    this.rooms.push(room);
  }
  $('#roomSelect').val(room);
  this.handleRoomFilter(room);
};

App.prototype.handleUsernameClick = function(username) {
  this.friends[username] = username;
  $(`.username:contains(${username})`).css('color', 'green');
  console.log('username clicked');
};

App.prototype.handleSubmit = function(text, room) {
  var message = {
    username: this.username,
    text: text,
    roomname: room,
  };
  this.send(message);
  console.log('submit message');
};

App.prototype.handleRoomFilter = function(room) {
  console.log('clicked room submit');
  $('.chat').hide();
  $(`.chat:contains(${room})`).show();
  $('#chats').filter('Lobby');
};

const app = new App;

$(document).ready( () => {

  app.init();

  $('#room-form').change((event) => {
    event.preventDefault();
    const roomname = $('#roomSelect option:selected').text();
    app.handleRoomFilter(roomname);
  });

  $('#add-room').on('submit', (event) => {
    event.preventDefault();
    var newRoom = $('#newroom').val();
    app.renderRoom(newRoom);
  });

  $('#chats').on('click', '.username', (event) => {
    var username = $(event.currentTarget).text();
    app.handleUsernameClick(username);
  });

  $('#update').on('click', () => {
    app.update();
  });

  $('#send').on('submit', (event) => {
    event.preventDefault();
    var newMessage = $('#message').val();
    var currentRoom = $('#roomSelect > option:selected').text();
    app.handleSubmit(newMessage, currentRoom);
    app.update();
  });


});
