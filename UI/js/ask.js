/* eslint-disable no-console */
window.onload = () => {
  const createNode = element => document.createElement(element);

  const append = (parent, el) => parent.appendChild(el);

  const jwt = sessionStorage.getItem('jwt');
  // const questionId = sessionStorage.getItem('questionId');

  const topnav = document.getElementById('topnav');
  const signInLink = document.getElementById('signInLink');
  const signOutLink = createNode('a');
  const signOutLinkSpan = createNode('span');
  const profileLink = document.getElementById('profileLink');

  // Onclick method for signing out
  const signOutMethod = () => {
    // Remove all saved data from sessionStorage
    sessionStorage.clear();
    window.location = 'signup.html';
  };

  signOutLink.innerHTML = 'signout';
  signOutLinkSpan.setAttribute('class', 'floatLeft');

  signOutLink.addEventListener('click', signOutMethod);

  if (jwt) {
    signInLink.style.display = 'none';

    append(signOutLinkSpan, signOutLink);
    append(topnav, signOutLinkSpan);
  } else {
    signInLink.style.display = 'block';
    // signInLink.setAttribute('id', '#signupLink');
    profileLink.style.display = 'none';
    signOutLink.style.display = 'none';
  }

  const postQuestionData = (event) => {
    event.preventDefault();

    const url = 'https://stackoverflow-lite-1.herokuapp.com/v1/questions';

    // The data we are going to send in our request
    const data = {};

    const formData = new FormData(questionForm);

    data.title = formData.get('title');
    data.question = formData.get('question');
    data.tags = formData.get('tags');
    data.questionImage = formData.get('questionImage');

    const httpHeaders = { 'x-access-token': jwt };
    const myHeaders = new Headers(httpHeaders);

    // The parameters we are gonna pass to the fetch function
    const fetchData = {
      method: 'POST',
      body: formData,
      headers: myHeaders
    };

    fetch(url, fetchData)
      .then(res => res.json())
      .then((data2) => {
        if (data2.id) {
          window.location = 'index.html'; // refers user to the index page
        } else {
          document.getElementById('questionError').innerHTML = data2.message;
          window.location = 'signup.html';
        }
      }).catch(err => console.log(err));
  };

  const questionForm = document.getElementById('questionForm');
  if (questionForm) {
    questionForm.addEventListener('submit', postQuestionData);
  }
};
