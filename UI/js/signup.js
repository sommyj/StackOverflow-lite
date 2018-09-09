window.onload = () => {
  const postSignUpData = (event) => {
    event.preventDefault();

    const url = 'https://stackoverflow-lite-1.herokuapp.com/auth/v1/signup';


    // The data we are going to send in our request
    const data = {};

    const formData = new FormData(signUpForm);

    data.username = formData.get('username');
    data.email = formData.get('email');
    data.password = formData.get('password');
    data.password2 = formData.get('password2');
    data.gender = formData.get('gender');
    data.country = formData.get('country');

    // password confirmation
    if (data.password !== data.password2) {
      document.getElementById('signupError').innerHTML = 'password mismatch';
      return;
    }

    // The parameters we are gonna pass to the fetch function
    const fetchData = {
      method: 'POST',
      body: formData,
      headers: new Headers()
    };

    fetch(url, fetchData)
      .then(res => res.json())
      .then((data2) => {
        if (data2.auth) {
        // Save data to sessionStorage
          sessionStorage.setItem('jwt', data2.token);
          window.location = 'index.html'; // refer to index page if sucessful
        } else {
          document.getElementById('signupError').innerHTML = data2.message;
        }
      })
      .catch(err => err.json());
  };


  const postSignInData = (event) => {
    event.preventDefault();

    const url = 'https://stackoverflow-lite-1.herokuapp.com/auth/v1/login';


    // The data we are going to send in our request
    const data = {};

    const formData = new FormData(signInForm);

    data.username = formData.get('username');
    data.password = formData.get('password');

    const httpHeaders = { 'Content-Type': 'application/x-www-form-urlencoded' };
    const myHeaders = new Headers(httpHeaders);


    const searchParams = Object.keys(data).map(key => `${encodeURIComponent(key)}=${encodeURIComponent(data[key])}`).join('&');


    // The parameters we are gonna pass to the fetch function
    const fetchData = {
      method: 'POST',
      body: searchParams,
      headers: myHeaders
    };

    fetch(url, fetchData)
      .then(res => res.json())
      .then((data2) => {
        if (data2.auth) {
        // Save data to sessionStorage
          sessionStorage.setItem('jwt', data2.token);
          window.location = 'index.html';
        } else {
          document.getElementById('loginError').innerHTML = data2.message;
        }
      })
      .catch(err => err.json());
  };

  const signUpForm = document.getElementById('signUpForm');
  if (signUpForm) {
    signUpForm.addEventListener('submit', postSignUpData);
  }

  const signInForm = document.getElementById('signInForm');
  if (signInForm) {
    signInForm.addEventListener('submit', postSignInData);
  }
};
