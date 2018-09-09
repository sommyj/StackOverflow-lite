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

  // console.log(jwt);

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

  fetch(url)
    .then(resp => resp.json())
    .then((data) => {
      const question = data;
      const [answers] = [question.answers];

      questionTitle.innerHTML = question.title;
      questionText.innerHTML = question.question;
      questionTags.innerHTML = question.tags;
      questionCreatedDate.innerHTML = question.createdat;

      return answers.forEach((answer) => {
        const answerRow = createNode('div');

        const acceptCol = createNode('div');
        const responseCol = createNode('div');

        const dateRow = createNode('div');
        const acceptRow = createNode('div');
        const responseRow = createNode('div');
        const acceptImg = createNode('img');

        dateRow.setAttribute('class', 'row responseDetails');
        answerRow.setAttribute('class', 'row');
        answerRow.setAttribute('class', 'response');
        answerRow.setAttribute('class', 'ptb-6');
        acceptCol.setAttribute('class', 'col-2');
        responseCol.setAttribute('class', 'col-10');
        responseRow.setAttribute('class', 'row');
        acceptRow.setAttribute('class', 'row');
        acceptRow.setAttribute('align', 'center');

        acceptImg.src = '../unticked.png';
        acceptImg.alt = 'accept';
        acceptImg.width = '52';
        acceptImg.height = '42';

        responseRow.innerHTML = answer.response;
        dateRow.innerHTML = answer.createdat;

        append(responseCol, responseRow);
        append(acceptRow, acceptImg);
        append(acceptCol, acceptRow);
        append(answerRow, acceptCol);
        append(answerRow, responseCol);
        append(answerRow, dateRow);
        append(answerContainer, answerRow);
      });
    }).catch((error) => {
      error.json();
    });


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
      }).catch(err => err.json());
  };

  const anwserForm = document.getElementById('anwserForm');
  if (anwserForm) {
    anwserForm.addEventListener('submit', postAnwserData);
  }
};
