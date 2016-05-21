$("#input-submit").click(function(){
  var room_name = $("input[name='room_name']")[0];
  var passwd = $("input[name='password']")[0];

  if (room_name.value != ""){
    passwd.value = CryptoJS.SHA512(passwd.value);
  }

  return true;
});

