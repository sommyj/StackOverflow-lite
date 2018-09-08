window.onload= () => {
  const createNode = (element) => {
      return document.createElement(element);
  }

  const append = (parent, el) => {
    return parent.appendChild(el);
  }

  const questionTitle = document.getElementById(`questionTitle`);
  const questionText = document.getElementById(`questionText`);
  const questionCreatedDate = document.getElementById(`questionCreatedDate`);
  const questionTags = document.getElementById(`questionTags`);

  const answerContainer = document.getElementById(`answerContainer`);

  const url = 'https://stackoverflow-lite-1.herokuapp.com/v1/questions/1';

  fetch(url)
  .then((resp) => resp.json())
  .then((data) => {
    let question = data;
    const answers = question.answers;

    questionTitle.innerHTML = question.title;
    questionText.innerHTML = question.question;
    questionTags.innerHTML = question.tags;
    questionCreatedDate.innerHTML = question.createdat

    return answers.map((answer) => {
      let answerRow = createNode('div');

      let acceptCol = createNode('div');
      let responseCol = createNode('div');

      let dateRow = createNode('div')
      let acceptRow = createNode('div');
      let responseRow = createNode('div');
      let acceptImg = createNode('img');

      dateRow.setAttribute(`class`, `row responseDetails`);
      answerRow.setAttribute(`class`, `row`);
      answerRow.setAttribute(`class`, `response`);
      answerRow.setAttribute(`class`, `ptb-6`);
      acceptCol.setAttribute(`class`, `col-2`);
      responseCol.setAttribute(`class`, `col-10`);
      responseRow.setAttribute(`class`, `row`);
      acceptRow.setAttribute(`class`, `row`);
      acceptRow.setAttribute(`align`, `center`);

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
    })
  }).catch((error) => {
    console.log(error);
  });


}
