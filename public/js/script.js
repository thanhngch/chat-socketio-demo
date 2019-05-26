// http://stackoverflow.com/questions/37684/how-to-replace-plain-urls-with-links
// GET LINK
function linkify(inputText) {
  var replacedText, replacePattern1, replacePattern2, replacePattern3;

  //URLs starting with http://, https://, or ftp://
  replacePattern1 = /(\b(https?|ftp):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/gim;
  replacedText = inputText.replace(
    replacePattern1,
    '<a href="$1" target="_blank">$1</a>'
  );

  //URLs starting with //
  // replacePattern11 = /(\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/gim;
  // replacedText = replacedText.replace(replacePattern11, '<a href="$1" target="_blank">$1</a>');

  //URLs starting with "www." (without // before it, or it'd re-link the ones done above).
  replacePattern2 = /(^|[^\/])(www\.[\S]+(\b|$))/gim;
  replacedText = replacedText.replace(
    replacePattern2,
    '$1<a href="http://$2" target="_blank">$2</a>'
  );

  //Change email addresses to mailto:: links.
  replacePattern3 = /(([a-zA-Z0-9\-\_\.])+@[a-zA-Z\_]+?(\.[a-zA-Z]{2,6})+)/gim;
  replacedText = replacedText.replace(
    replacePattern3,
    '<a href="mailto:$1">$1</a>'
  );

  return replacedText;
}

// http://php.net/htmlspecialchars
// http://stackoverflow.com/questions/6234773/can-i-escape-html-special-chars-in-javascript
function escapeHtml(unsafe) {
  return unsafe
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}
function convert_string_to_emoticon(inputText) {
  var replacedText = inputText;
  var map_string_emoticons = {
    ":\\)": "smile",
    ":\\(": "sad",
    ":D": "big",
    "8-\\)": "cold",
    ":O": "surprised",
    ";\\(": "crying",
    "\\(:\\|": "sweating",
    ":\\|": "speechless",
    ":\\*": "kiss",
    ":P": "tongue_out",
    ":\\$": "blushing"
  };

  for (var emoticon in map_string_emoticons) {
    if (map_string_emoticons.hasOwnProperty(emoticon)) {
      replacedText = replacedText.replace(
        new RegExp("^" + emoticon + "$", "gi"),
        ' <img class="emoticon" src="/emoticons/' +
          map_string_emoticons[emoticon] +
          '.png" alt=""/> '
      );

      replacedText = replacedText.replace(
        new RegExp(" " + emoticon + "$", "gi"),
        ' <img class="emoticon" src="/emoticons/' +
          map_string_emoticons[emoticon] +
          '.png" alt=""/> '
      );

      replacedText = replacedText.replace(
        new RegExp("^" + emoticon + " ", "gi"),
        ' <img class="emoticon" src="/emoticons/' +
          map_string_emoticons[emoticon] +
          '.png" alt=""/> '
      );

      replacedText = replacedText.replace(
        new RegExp(" " + emoticon + " ", "gi"),
        ' <img class="emoticon" src="/emoticons/' +
          map_string_emoticons[emoticon] +
          '.png" alt=""/> '
      );
    }
  }

  return replacedText;
}
var slot = {
  remains: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
  get_slot: function() {
    return this.remains[0];
  },
  add_slot: function(s) {
    for (var i = this.remains.length; i >= 0; i--) {
      if (s > this.remains[i]) {
        this.remains.splice(i + 1, 0, s);
        return;
      }
    }
    this.remains.splice(0, 0, s);
  },
  obtain_slot: function(s) {
    this.remains.splice(s - 1, 1);
  },
  is_full: function() {
    return this.remains.length == 0;
  },
  get_right_style: function() {
    var my_get_slot = this.get_slot();
    this.obtain_slot(1);
    console.log(this.remains);
    return my_get_slot * 260 + 10;
  },
  add_slot_style: function(right) {
    var right = parseInt(right);
    this.add_slot((right - 10) / 260);
    console.log(this.remains);
  }
};

$(document).ready(function() {
  var open_msg_box = function(id, user_name) {
    if ($("#msg_box_" + id + ".show").length == 1) {
      $("#msg_box_" + id + " .msg_wrap")
        .addClass("show")
        .show();
      return;
    }

    var length = $(".msg_box").length;
    var style_right = null;

    if ($("#msg_box_" + id + " .msg_wrap.show").length == 0) {
      style_right = slot.get_right_style();
    }

    if ($("#msg_box_" + id).length == 0) {
      if (length <= 4) {
        var msg_box = $(".msg_box_sample").html();
        msg_box = msg_box.replace("{user_name}", user_name);

        msg_box =
          '<div class="msg_box" id="msg_box_' + id + '">' + msg_box + "</div>";
        $(msg_box).insertAfter(".list_msg_box");

        $("#msg_box_" + id).css("right", style_right);

        // console.log(user_name);
        $("#msg_box_" + id + " .msg_head .msg_username").text(user_name);
      }
    } else {
      $("#msg_box_" + id)
        .addClass("show")
        .show();
      $("#msg_box_" + id + " .msg_wrap")
        .addClass("show")
        .show();
      if (style_right != null) {
        $("#msg_box_" + id).css("right", style_right);
      }
    }
    console.log(slot.remains);
  };

  $(".chat_head").click(function() {
    $(".chat_body").slideToggle("slow");
  });

  $("html").on("click", ".msg_head", function() {
    $(this)
      .next()
      .removeClass("show")
      .slideToggle("slow");
  });

  $("html").on("click", ".close", function() {
    var close_parent = $(this)
      .parent()
      .parent();
    close_parent.removeClass("show").hide();
    var right = close_parent.css("right");
    slot.add_slot_style(right);
    console.log(slot.remains);
  });
  $("html").on("click", ".user", function() {
    open_msg_box($(this).attr("data-user-id"), $(this).text());
  });

  // });
  // $(function() {
  var username = localStorage.getItem("username") || "";
  var socket = io();

  // get username
  if (username != "") {
    $(".login_page").fadeOut();
    $(".content").removeClass("hide");
    $(".welcome").text("Hi " + username);
    socket.emit("login", username);
    socket.emit("online", username);
  } else {
    $(".usernameInput").keypress(function(e) {
      if (e.keyCode == 13) {
        username = $(".usernameInput").val();
        // if ()
        if (/^[a-zA-Z0-9-_]*$/.test(username) == false) {
          alert(
            "This user name contains illegal characters. It only contain a-z, A-Z, 0-9, - , _ and don' have any space."
          );
          return;
        }
        $(".login_page").fadeOut();
        $(".content").removeClass("hide");
        $(".welcome").text("Hi " + username);
        localStorage.setItem("username", username);

        console.log(username);
        socket.emit("add user", username);
        socket.emit("login", username);
        socket.emit("online", username);
      }
    });
  }
  socket.on("user joined", function(msg) {
    // $('#messages').append($('<li>').text(msg));
    // pr(msg);
    console.log(msg);
    $(".chat_box .chat_body").append(
      '<div class="user active" data-user-id=' +
        msg.username +
        ">" +
        msg.username +
        "</div>"
    );
  });

  socket.on("list users", function(msg) {
    console.log(msg);
    var usernames = msg.usernames;
    $(".chat_box .chat_body").html("");
    for (var u in usernames) {
      if (usernames.hasOwnProperty(u)) {
        //var val = usernames[username];
        if (username != usernames[u]) {
          var online = "active";

          if (localStorage.getItem(u) == "offline") {
            online = "user_offline";
          }
          $(".chat_box .chat_body").append(
            '<div class="user ' +
              online +
              '" data-user-id=' +
              usernames[u] +
              ">" +
              usernames[u] +
              "</div>"
          );
        }
      }
    }
    // for(var i = 0; i < usernames.length; i++) {
    // 	$('.chat_box .chat_body').append('<div class="user active">' + usernames[username] + '</div>');
    // }
  });

  socket.on("user left", function(msg) {
    console.log(msg);
    $(".chat_box .chat_body .user").each(function() {
      if ($(this).text() == msg.username) {
        $(this).remove();
      }
    });
  });

  // $('form').submit(function(){
  // 	socket.emit('add user', username);

  // 	$('#m').val('');
  // 	return false;
  // });
  $("html").on("keypress", "textarea", function(e) {
    // $('textarea').keypress(function(e){
    var receiver = $($(this).parents(".msg_box"))
      .find(".msg_username")
      .text();
    var msg_box_id = $(this)
      .parents(".msg_box")
      .attr("id");
    if (e.keyCode == 13) {
      var msg = $(this).val();
      // $(this).val("");

      msg = msg.trim();
      msg = escapeHtml(msg);
      // $('#' + msg_box_id + ' textarea').val(''.trim());
      // if(msg.length != 0 || (msg.charCodeAt(0) != 8629 && msg.length == 1)) {
      if (msg.length != 0) {
        socket.emit("private message", {
          sender: username,
          receiver: receiver,
          message: msg
        });

        
        // msg = linkify(msg);
        // msg = convert_string_to_emoticon(msg);
        // msg = msg + ' <span class="time">' + moment().format('h:mm a'); + '</span>';
        // $('<div class="msg_b">'+msg+'</div>').insertBefore('#' + msg_box_id + ' .msg_push');

        // $('.msg_body').scrollTop(1200);
      }
      setTimeout(function() {
        $("#" + msg_box_id + " textarea").val("");
      }, 1);
      // $('#' + msg_box_id + ' textarea').val('');
    }
  });

  socket.on("private message", function(data) {
    var sender = data["sender"];
    var receiver = data["receiver"];
    var message = data["message"];
    console.log(data);
    console.log(username);

    if (receiver == username) {
      if (
        $("#msg_box_" + sender).length == 0 ||
        $("#msg_box_" + sender).is(":visible") == false
      ) {
        document.getElementById("audio").play();
      }

      open_msg_box(sender, sender);

      message = message.trim();
      // message = escapeHtml(message);
      message = linkify(message);
      message = convert_string_to_emoticon(message);

      message = message + ' <span class="time">' + moment().format("h:mm a");
      +"</span>";
      $('<div class="msg_a">' + message + "</div>").insertBefore(
        "#msg_box_" + sender + " .msg_push"
      );
      // $('#msg_box_' + sender + ' .msg_body').scrollTop($('.msg_body')[0].scrollHeight);
      $("#msg_box_" + sender + " .msg_body").scrollTop(1200);
    }
    if (sender == username) {
      open_msg_box(receiver, receiver);

      message = message.trim();
      message = linkify(message);
      message = convert_string_to_emoticon(message);
      message = message + ' <span class="time">' + moment().format("h:mm a");
      +"</span>";
      $('<div class="msg_b">' + message + "</div>").insertBefore(
        "#msg_box_" + receiver + " .msg_push"
      );

      $("#msg_box_" + receiver + " .msg_body").scrollTop(1200);
    }
  });

  $(".logout .btn").click(function() {
    // username = localStorage.getItem("username");
    socket.emit("logout", username);
    localStorage.removeItem("username");
    location.reload();
  });

  $(".btn-offline").click(function() {
    // username = localStorage.getItem("username");
    socket.emit("offline", username);
    console.log("btn-offline click");
  });

  $(".btn-online").click(function() {
    // username = localStorage.getItem("username");
    socket.emit("online", username);
    console.log("btn-online click");
  });

  window.onbeforeunload = function() {
    // username = localStorage.getItem("username");
    socket.emit("offline", username);
    console.log("btn-offline click");
  };

  socket.on("user offline", function(data) {
    console.log(data);
    var user = data["username"];
    localStorage.setItem(user, "offline");

    $('.chat_body .user[data-user-id="' + user + '"]')
      .removeClass("active")
      .addClass("user_offline");
    console.log("offline" + user);
  });

  socket.on("user online", function(data) {
    console.log(data);
    var user = data["username"];
    localStorage.setItem(user, "online");

    $('.chat_body .user[data-user-id="' + user + '"]')
      .addClass("active")
      .removeClass("user_offline");
    console.log("online" + user);
  });
});
