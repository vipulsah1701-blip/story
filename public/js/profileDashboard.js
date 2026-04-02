// ==========================
// Load Current User + Stories
// ==========================

console.log("Profile JS Loaded");

fetch("/user/me")
  .then(res => res.json())
  .then(data => {

    const user = data.user;
    const stories = data.stories;

    // USER INFO
    document.getElementById("userInfo").innerHTML = `
      <div class="card">
        <h3>${user.username}</h3>
        <p>Email: ${user.email}</p>
      </div>
    `;

    // USER STORIES
    const div = document.getElementById("myStories");
    div.innerHTML = "";

    if (!stories || stories.length === 0) {
      div.innerHTML = "<p>No stories posted yet.</p>";
      return;
    }

    stories.forEach(s => {
      div.innerHTML += `
        <div class="card">
          <h3>${s.title}</h3>
          <p>${s.content.substring(0,150)}...</p>
          <button onclick="deleteStory(${s.id})">
            Delete Story
          </button>
        </div>
      `;
    });

  })
  .catch(err => {
    console.log("Error loading profile:", err);
  });


// ==========================
// DELETE STORY (FIXED)
// ==========================

let deleteId = null;

function deleteStory(id) {
  deleteId = id;
  document.getElementById("deleteModal").classList.add("active");
}

window.addEventListener("DOMContentLoaded", () => {

  const confirmBtn = document.getElementById("confirmDelete");
  const cancelBtn = document.getElementById("cancelDelete");
  const modal = document.getElementById("deleteModal");

  // safety check
  if(!confirmBtn || !cancelBtn || !modal){
    console.log("Modal elements not found ❌");
    return;
  }

  // confirm delete
  confirmBtn.onclick = function(){
    fetch(`/stories/${deleteId}`, {
      method: "DELETE"
    })
    .then(res => res.json())
    .then(() => {
      location.reload();
    });
  };

  // cancel
  cancelBtn.onclick = function(){
    modal.classList.remove("active");
  };

});
