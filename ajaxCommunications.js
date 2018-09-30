var httpRequest = new XMLHttpRequest();

httpRequest.onreadystatechange = function () {
  if(httpRequest.readyState){
    check the state
  }
  if (httpRequest.status === 200)

  do not forget that httpRequest.on("error", function(){}); is a seperate thing
  incase server fails

}

httpRequest.open("GET", "htp://localhost:3000/add-Task");
httpRequest.setRequestHeader('Content-Type', 'application/json')
httpRequest.send(JSON);

set header Cache-Control: no-cache
//request object's responseText property
