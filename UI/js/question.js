/* eslint-disable no-console */
window.onload = () => {
  let accepted = false; // answer selected indicator value

  const createNode = element => document.createElement(element);

  const append = (parent, el) => parent.appendChild(el);

  const jwt = sessionStorage.getItem('jwt');
  const questionId = sessionStorage.getItem('questionId');

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
  // signOutLink.setAttribute('href', 'signup.html');
  signOutLinkSpan.setAttribute('class', 'floatLeft');

  signOutLink.addEventListener('click', signOutMethod);

  const userOn = () => {
    signInLink.style.display = 'none';
    append(signOutLinkSpan, signOutLink);
    append(topnav, signOutLinkSpan);
  };

  const userOff = () => {
    signInLink.style.display = 'block';
    // signInLink.setAttribute('id', '#signupLink');
    profileLink.style.display = 'none';
    signOutLink.style.display = 'none';
  };

  if (jwt) {
    userOn();
  } else {
    userOff();
  }

  // This method is used to update the accepted answer
  const updateAcceptedAns = (answerId, value) => {
    const urlAns = `https://stackoverflow-lite-1.herokuapp.com/v1/questions/${questionId}/answers/${answerId}`;

    const formDataAns = new FormData();
    const myHeaders = new Headers({ 'x-access-token': jwt });

    const img = value.src;

    if (img.indexOf('unticked.png') !== -1) {
      if (accepted) {
        // Get the snackbar DIV
        const snackbarDiv = document.getElementById('snackbar');

        // Add the "show" class to DIV
        snackbarDiv.className = 'show';

        // After 3 seconds, remove the show class from DIV
        setTimeout(() => { snackbarDiv.className = snackbarDiv.className.replace('show', ''); }, 3000);

        return;
      }

      value.src = 'img/ticked.jpeg';
      formDataAns.append('accepted', true);
      accepted = true;
    } else {
      value.src = 'img/unticked.png';
      formDataAns.append('accepted', false);
      accepted = false;
    }

    const fetchData = { // The parameters we are gonna pass to the fetch function
      method: 'PUT',
      body: formDataAns,
      headers: myHeaders
    };

    fetch(urlAns, fetchData) // fetch(requestAns)
      .then(resp => resp.json())
      .then((data) => {
        if (!data.message) {
          console.log(data);
        } else {
          document.getElementById('answerError').innerHTML = data.message;
          window.location = 'question.html'; // refresh the question page
        }
      })
      .catch(error => console.log(error));
  };

  // Date format structure
  const time = (dateCreated) => {
    const date = new Date(dateCreated);
    const months = ['January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'];
    return `${months[date.getMonth()]} ${date.getDate()}
    ${date.getFullYear()} at ${date.getHours()}:${date.getMinutes()}`;
  };


  // Question & Answer Section
  const questionTitle = document.getElementById('questionTitle');
  const questionText = document.getElementById('questionText');
  const questionCreatedDate = document.getElementById('questionCreatedDate');
  const questionTags = document.getElementById('questionTags');

  const answerContainer = document.getElementById('answerContainer');

  const url = `https://stackoverflow-lite-1.herokuapp.com/v1/questions/${questionId}`;

  const headers = new Headers({ 'x-access-token': jwt });

  const init = { method: 'GET', headers };

  const request = new Request(url, init);

  fetch(request)
    .then(resp => resp.json())
    .then((data) => {
      const question = data;
      const [answers] = [question.answers];

      if (question.auth === false) {
        userOff();
      } else {
        userOn();
      }

      questionTitle.innerHTML = question.title;
      questionText.innerHTML = question.question;
      questionTags.innerHTML = question.tags;
      if (question.questionimage) {
        document.getElementById('questionImg').src = question.questionimage;
      }

      // Question time format
      questionCreatedDate.innerHTML = time(question.createdat);

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
        const responseImg = createNode('img');

        dateSpan.setAttribute('class', 'floatLeft');
        dateCol.setAttribute('class', 'col-12');
        dateRow.setAttribute('class', 'row responseDetails');
        answerRow.setAttribute('class', 'row');
        answerRow.setAttribute('class', 'response');
        answerRow.setAttribute('class', 'ptb-6');
        acceptCol.setAttribute('class', 'col-2');
        responseCol.setAttribute('class', 'col-10');
        responseRow.setAttribute('class', 'row pt-8');
        responseImg.setAttribute('class', 'responseImg pt-8');
        acceptRow.setAttribute('class', 'row');
        acceptRow.setAttribute('align', 'center');

        if (question.user) {
          if (answer.accepted) {
            accepted = true;
            acceptImg.src = 'img/ticked.jpeg';
            acceptImg.alt = 'accepted';
          } else {
            acceptImg.src = 'img/unticked.png';
            acceptImg.alt = 'not accepted';
          }

          acceptImg.addEventListener('click', () => { updateAcceptedAns(answer.id, acceptImg); });
          acceptImg.width = '52';
          acceptImg.height = '42';
        }

        if (answer.answerimage) {
          responseImg.src = answer.answerimage;
        }

        // Answer time format
        dateSpan.innerHTML = time(answer.createdat);
        responseRow.innerHTML = answer.response;

        append(responseCol, responseRow);
        append(responseCol, responseImg);
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

  // Post answer section
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
