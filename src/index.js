let addToy = false;

document.addEventListener("DOMContentLoaded", () => {
  const addBtn = document.querySelector("#new-toy-btn");
  const toyFormContainer = document.querySelector(".container");
  addBtn.addEventListener("click", () => {
    // hide & seek with the form
    addToy = !addToy;
    if (addToy) {
      toyFormContainer.style.display = "block";
    } else {
      toyFormContainer.style.display = "none";
    }
  });
});


//Add toy info to the card

fetch('http://localhost:3000/toys')
.then(result => result.json())
.then(data => {
  for(item of data){
    const itemCard = createCard(item)

    document.getElementById('toy-collection').append(itemCard)
    handleLikeButton(itemCard)
  }
})


//Add a new toy
const addToyForm = document.querySelector('form.add-toy-form')
addToyForm.addEventListener('submit', event =>{
  event.preventDefault()

  fetch('http://localhost:3000/toys', {
    method: 'POST',
    headers: {
      "Content-Type": 'application/json',
      "Accept": "application/json"
    },
    body:JSON.stringify({
      "name": addToyForm.querySelector('input[name = "name"]').value,
      "image": addToyForm.querySelector('input[name = "image"]').value,
      "likes": 0,
    })
  })
  .then(result => result.json())
  .then(item => {
    const itemCard = createCard(item)

    document.getElementById('toy-collection').append(itemCard)
    handleLikeButton(itemCard)
  })
})



function createCard(item){
const itemCard = document.createElement('div')
itemCard.classList.add('card')
itemCard.innerHTML = `<h2>${item.name}</h2>
<img src="${item.image}" class="toy-avatar" />
<p>${item.likes} Likes</p>
<button class="like-btn" id="${item.id}">Like ❤️</button>`

return itemCard
}


function handleLikeButton(itemCard){
const likeButton = itemCard.querySelector('.like-btn')

likeButton.addEventListener('click', e=>{
  const currentNoOfLikes = parseInt(likeButton.parentNode.querySelector('p').textContent.split(' ')[0])
  const updatedNoOfLikes = currentNoOfLikes + 1

  fetch(`http://localhost:3000/toys/${likeButton.id}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    },
    body: JSON.stringify(
      {
        "likes": updatedNoOfLikes
      }
    )
  })
  .then(result => result.json())
  .then(data => {
    likeButton.parentNode.querySelector('p').textContent = `${data.likes} likes`
  })
})
}