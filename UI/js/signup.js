/* eslint-disable no-console */
window.onload = () => {
  const profileLink = document.getElementById('profileLink');
  profileLink.style.display = 'none';


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
      .catch(err => console.log(err));
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
      .catch(err => console.log(err));
  };

  const signUpForm = document.getElementById('signUpForm');
  if (signUpForm) {
    signUpForm.addEventListener('submit', postSignUpData);
  }

  const signInForm = document.getElementById('signInForm');
  if (signInForm) {
    signInForm.addEventListener('submit', postSignInData);
  }


  const passInput = document.getElementById('password');
  const passInput2 = document.getElementById('password2');
  const letter = document.getElementById('letter');
  const capital = document.getElementById('capital');
  const number = document.getElementById('number');
  const length = document.getElementById('length');

  // When the user clicks on the password field, show the message box
  passInput.onfocus = () => {
    document.getElementById('mismatch_message').style.visibility = 'hidden';
    document.getElementById('message').style.visibility = 'visible';
  };

  // When the user clicks outside of the password field, hide the message box
  passInput.onblur = () => {
    document.getElementById('message').style.visibility = 'hidden';
  };

  // When the user starts to type something inside the password field
  passInput.onkeyup = () => {
  // Validate lowercase letters
    const lowerCaseLetters = /[a-z]/g;
    if (passInput.value.match(lowerCaseLetters)) {
      letter.classList.remove('invalid');
      letter.classList.add('valid');
    } else {
      letter.classList.remove('valid');
      letter.classList.add('invalid');
    }

    // Validate capital letters
    const upperCaseLetters = /[A-Z]/g;
    if (passInput.value.match(upperCaseLetters)) {
      capital.classList.remove('invalid');
      capital.classList.add('valid');
    } else {
      capital.classList.remove('valid');
      capital.classList.add('invalid');
    }

    // Validate numbers
    const numbers = /[0-9]/g;
    if (passInput.value.match(numbers)) {
      number.classList.remove('invalid');
      number.classList.add('valid');
    } else {
      number.classList.remove('valid');
      number.classList.add('invalid');
    }

    // Validate length
    if (passInput.value.length >= 8) {
      length.classList.remove('invalid');
      length.classList.add('valid');
    } else {
      length.classList.remove('valid');
      length.classList.add('invalid');
    }
  };


  // When the user clicks outside of the second password field
  passInput2.onblur = () => {
    const pass = document.getElementById('password').value;
    const pass2 = document.getElementById('password2').value;
    if (pass !== pass2) document.getElementById('mismatch_message').style.visibility = 'visible';
  };

  // When the user clicks inside of the second password field
  passInput2.onfocus = () => {
    document.getElementById('mismatch_message').style.visibility = 'hidden';
  };
};
