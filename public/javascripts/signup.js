$("#input-signup").click(function(){
  var passwd = $("#slick-login input[name='password']")[0];
  var passwd2 = $("#slick-login input[name='password2']")[0];
  if (passwd.value != passwd2.value){
    $.alert({
      title: 'Sign up failed',
      content: "Passwords are not same",
      confirmButtonClass: 'btn-info'
    });
    return false;
  }
  passwd.value = CryptoJS.SHA512(passwd.value);
  return true;
});

