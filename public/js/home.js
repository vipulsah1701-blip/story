const BASE_URL = "https://story-9mch.onrender.com";

// LOAD STORIES
fetch(`${BASE_URL}/stories/all`, {
  credentials: "include"
})
.then(res => res.json())
.then(data => {

  const div = document.getElementById("stories");
  div.innerHTML = "";

  data.forEach(s => {
    div.innerHTML += `
      <div class="card">
        <div class="story-user">
          👤 <a href="profile.html?userId=${s.user_id}">
            ${s.username}
          </a>
        </div>

        <h3>${s.title}</h3>
        <p>${s.content.substring(0,120)}...</p>

        <a class="read-btn" href="viewStory.html?id=${s.id}">
          Read Full Story
        </a>

        <div class="story-actions">
          <button id="like-${s.id}" onclick="likeStory(${s.id})">
            ❤️ ${s.likes || 0}
          </button>
        </div>
      </div>
    `;
  });
});

// LIKE FUNCTION
function likeStory(id){
  const btn = document.getElementById("like-" + id);

  fetch(`${BASE_URL}/stories/like/${id}`, {
    method: "POST",
    credentials: "include"
  })
  .then(res => res.json())
  .then(data => {

    if(!data.success){
      alert("Login required");
      return;
    }

    let count = parseInt(btn.innerText.replace(/[^0-9]/g, "")) || 0;

    if(data.liked){
      count++;
      btn.style.color = "red";
    } else {
      count--;
      btn.style.color = "white";
    }

    btn.innerText = "❤️ " + count;
  });
}

// SEARCH
searchInput.addEventListener("input", () => {
  const query = searchInput.value;

  if(query.length < 2){
    searchResults.innerHTML = "";
    return;
  }

  fetch(`${BASE_URL}/stories/search?q=${query}`)
  .then(res => res.json())
  .then(data => {

    searchResults.innerHTML = "";

    data.forEach(s => {
      searchResults.innerHTML += `
        <div class="card">
          <h3>${s.title}</h3>
          <p>By ${s.username}</p>
          <a href="viewStory.html?id=${s.id}">
            Read Story
          </a>
        </div>
      `;
    });
  });
});
