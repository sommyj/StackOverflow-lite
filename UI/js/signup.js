window.onload= () => {
  
  const postSignUpData = () => {

    const url = 'https://stackoverflow-lite-1.herokuapp.com/auth/v1/signup';


    // The data we are going to send in our request
    let data = {};

    const formData = new FormData(signUpForm);

    data.username = formData.get(`username`);
    data.email = formData.get(`email`);
    data.password = formData.get(`password`);
    data.gender = formData.get(`gender`);

    console.log(data);

    const httpHeaders = { 'Content-Type': 'multipart/form-data'};
    const myHeaders = new Headers(httpHeaders);

    // The parameters we are gonna pass to the fetch function
    let fetchData = {
        method: 'POST',
        body: data,
        headers: new Headers(myHeaders)
    }

    fetch(url, fetchData)
    .then((res) => res.json())
    .then((data) => console.log(data))
    .catch((err)=>console.log(err))
  }


  const postSignInData = () =>{

    const url = 'https://stackoverflow-lite-1.herokuapp.com/auth/v1/login';


    // The data we are going to send in our request
    let data = {};

    const formData = new FormData(signInForm);

    data.username = formData.get(`username`);
    data.password = formData.get(`password`);

    console.log(data);

    const httpHeaders = { 'Content-Type': 'application/x-www-form-urlencoded'};
    const myHeaders = new Headers(httpHeaders);

    // The parameters we are gonna pass to the fetch function
    let fetchData = {
        method: 'POST',
        body: JSON.stringify(data),
        headers: new Headers(myHeaders)
    }

    fetch(url, fetchData)
    .then((res) => res.json())
    .then((data) => console.log(data))
    .catch((err)=>console.log(err))
  }

  const signUpForm = document.getElementById('signUpForm')
  if(signUpForm) {
    signUpForm.addEventListener('submit', postSignUpData);
  }

  const signInForm = document.getElementById('signInForm')
  if(signInForm) {
    signInForm.addEventListener('submit', postSignInData);
  }

}