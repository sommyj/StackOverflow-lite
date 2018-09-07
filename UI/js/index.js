window.onload= () => {
  function createNode(element) {
      return document.createElement(element);
  }

  function append(parent, el) {
    return parent.appendChild(el);
  }

  // const ul = document.getElementById('authors');
  // const url = 'https://randomuser.me/api/?results=10';
  // fetch(url)
  // .then((resp) => resp.json())
  // .then(function(data) {
  //   let authors = data.results;
  //   return authors.map(function(author) {
  //     let li = createNode('li'),
  //         img = createNode('img'),
  //         span = createNode('span');
  //     img.src = author.picture.medium;
  //     span.innerHTML = `${author.name.first} ${author.name.last}`;
  //     append(li, img);
  //     append(li, span);
  //     append(ul, li);
  //   })
  // })
  // .catch(function(error) {
  //   console.log(error);
  // });

  const questions = document.getElementById('questions');
  const questionLink = document.getElementById('questionLink');
  const questionTags = document.getElementById('questionTags');

  const url = 'https://stackoverflow-lite-1.herokuapp.com/v1/questions/';



  const headers = new Headers({/* 'x-access-token': ''*/'Access-Control-Allow-Origin': '*'});

  const init = { method: 'GET', headers };

  const request = new Request(url, init);


  fetch(request, {mode: 'cors'})
  .then((resp) => resp.json())
  .then((data) => {
    let questions = data;
    return questions.map((question) => {
      // let a = createNode('a');
      console.log(question);
    })
  }).catch((error) => {
    console.log(error);
  });


}
