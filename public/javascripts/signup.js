$("#input-submit").click(function(){
  var passwd = $("input[name='password']")[0];
  var passwd2 = $("input[name='password2']")[0];

  if (passwd.value == "" || passwd2.value == "")
    return true;

  if (passwd.value != passwd2.value){
    $.alert({
      title: 'Sign up failed',
      content: "Passwords are not same",
      confirmButtonClass: 'btn-info'
    });
    return false;
  }
  passwd.value = CryptoJS.SHA512(passwd.value);
  passwd2.value = CryptoJS.SHA512(passwd2.value);
  return true;
});

