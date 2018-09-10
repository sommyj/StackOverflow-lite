/* eslint-disable no-console */
window.onload = () => {
  const createNode = element => document.createElement(element);

  const append = (parent, el) => parent.appendChild(el);

  const jwt = sessionStorage.getItem('jwt');
  const questionId = sessionStorage.getItem('questionId');

  const topnav = document.getElementById('topnav');
  const signInLink = document.getElementById('signInLink');
  const signOutLink = createNode('a');
  const signOutLinkSpan = createNode('span');

  // Onclick method for signing out
  const signOutMethod = () => {
    // Remove all saved data from sessionStorage
    sessionStorage.clear();
    window.location = 'signup.html';
  };

  signOutLink.innerHTML = 'signout';
  // signOutLink.setAttribute('href', 'signup.html');
  signOutLinkSpan.setAttribute('class', 'floatLeft');

  signOutLink.addEventListener('click', signOutMethod);

  if (jwt) {
    signInLink.style.display = 'none';

    append(signOutLinkSpan, signOutLink);
    append(topnav, signOutLinkSpan);
  } else {
    signInLink.style.display = 'block';
    signInLink.setAttribute('id', '#signupLink');
  }


  const questionTitle = document.getElementById('questionTitle');
  const questionText = document.getElementById('questionText');
  const questionCreatedDate = document.getElementById('questionCreatedDate');
  const questionTags = document.getElementById('questionTags');

  const answerContainer = document.getElementById('answerContainer');

  const url = `https://stackoverflow-lite-1.herokuapp.com/v1/questions/${questionId}`;

  const headers = new Headers({'x-access-token': jwt});

  const init = { method: 'GET', headers };

  const request = new Request(url, init);

  fetch(request)
    .then(resp => resp.json())
    .then((data) => {
      const question = data;
      const [answers] = [question.answers];
      console.log(question.user+"-------------------");

      questionTitle.innerHTML = question.title;
      questionText.innerHTML = question.question;
      questionTags.innerHTML = question.tags;
      questionCreatedDate.innerHTML = question.createdat;

      return answers.forEach((answer) => {
        const answerRow = createNode('div');

        const acceptCol = createNode('div');
        const responseCol = createNode('div');

        const dateRow = createNode('div');
        const dateCol = createNode('div');
        const dateSpan = createNode('span');
        const acceptRow = createNode('div');
        const responseRow = createNode('div');
        const acceptImg = createNode('img');

        dateSpan.setAttribute('class', 'floatLeft');
        dateCol.setAttribute('class', 'col-12');
        dateRow.setAttribute('class', 'row responseDetails');
        answerRow.setAttribute('class', 'row');
        answerRow.setAttribute('class', 'response');
        answerRow.setAttribute('class', 'ptb-6');
        acceptCol.setAttribute('class', 'col-2');
        responseCol.setAttribute('class', 'col-10');
        responseRow.setAttribute('class', 'row pt-8');
        acceptRow.setAttribute('class', 'row');
        acceptRow.setAttribute('align', 'center');

        if(question.user) {
          acceptImg.src = 'img/unticked.png';
          acceptImg.alt = 'accept';
          acceptImg.width = '52';
          acceptImg.height = '42';
        }


        dateSpan.innerHTML = answer.createdat;
        responseRow.innerHTML = answer.response;

        append(responseCol, responseRow);
        append(acceptRow, acceptImg);
        append(acceptCol, acceptRow);
        append(answerRow, acceptCol);
        append(answerRow, responseCol);
        append(dateCol, dateSpan);
        append(dateRow, dateCol);
        append(answerRow, dateRow);
        append(answerContainer, answerRow);
      });
    }).catch(error => console.log(error));


  const postAnwserData = (event) => {
    event.preventDefault();

    const urlAns = `https://stackoverflow-lite-1.herokuapp.com/v1/questions/${questionId}/answers`;


    // The data we are going to send in our request
    const data = {};

    const formData = new FormData(anwserForm);

    data.response = formData.get('response');
    data.answerImage = formData.get('answerImage');

    const httpHeaders = { 'x-access-token': jwt };
    const myHeaders = new Headers(httpHeaders);

    // The parameters we are gonna pass to the fetch function
    const fetchData = {
      method: 'POST',
      body: formData,
      headers: myHeaders
    };

    fetch(urlAns, fetchData)
      .then(res => res.json())
      .then((data2) => {
        if (data2.id) {
          window.location = 'question.html'; // refresh the question page if successful
        } else {
          document.getElementById('answerError').innerHTML = data2.message;
        }
      }).catch(err => console.log(err));
  };

  const anwserForm = document.getElementById('anwserForm');
  if (anwserForm) {
    anwserForm.addEventListener('submit', postAnwserData);
  }
};
