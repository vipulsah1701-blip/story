// LOAD STORIES
fetch("/stories/all")
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

//Like Function 
function likeStory(id){

  const btn = document.getElementById("like-" + id);

  fetch(`/stories/like/${id}`, {
    method: "POST"
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
      btn.style.color = "red";   // ❤️ liked
    } else {
      count--;
      btn.style.color = "white"; // 🤍 unliked
    }

    btn.innerText = "❤️ " + count;

  });

}

// =====================
// SEARCH FEATURE
// =====================

const searchBtn = document.getElementById("searchBtn");
const searchModal = document.getElementById("searchModal");
const closeSearch = document.getElementById("closeSearch");
const searchInput = document.getElementById("searchInput");
const searchResults = document.getElementById("searchResults");

searchBtn.onclick = () => {
  searchModal.style.display = "flex";
};

closeSearch.onclick = () => {
  searchModal.style.display = "none";
};


// SEARCH REQUEST

searchInput.addEventListener("input", () => {

  const query = searchInput.value;

  if(query.length < 2){
    searchResults.innerHTML = "";
    return;
  }

  fetch(`/stories/search?q=${query}`)
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
