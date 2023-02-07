const button = document.querySelector("#orderSubmit");

button.addEventListener("click", submitOrder);

const submitOrder = () => {

  const requestOptions = {
    method: 'POST',
    redirect: 'follow'
  };

  fetch("http://127.0.0:3000/api/order", requestOptions)
    .then(response => response.text())
    .then(result => console.log(result))
    .catch(error => console.log('error', error));

}