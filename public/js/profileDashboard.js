const BASE_URL = "https://story-9mch.onrender.com";

fetch(`${BASE_URL}/user/me`, {
  credentials: "include"
})
.then(res => res.json())
.then(data => {

  const user = data.user;
  const stories = data.stories;

  document.getElementById("userInfo").innerHTML = `
    <div class="card">
      <h3>${user.username}</h3>
      <p>Email: ${user.email}</p>
    </div>
  `;

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
        <button onclick="deleteStory(${s.id})">Delete Story</button>
      </div>
    `;
  });

});

// DELETE
function deleteStory(id) {
  fetch(`${BASE_URL}/stories/${id}`, {
    method: "DELETE",
    credentials: "include"
  }).then(() => location.reload());
}
