$("#input-submit").click(function(){
  var passwd = $("input[name='password']")[0];
  if (passwd.value != ""){
    passwd.value = CryptoJS.SHA512(passwd.value);
  }
  return true;
});
