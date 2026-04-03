const BASE_URL = "https://story-9mch.onrender.com";

fetch(`${BASE_URL}/user/me`, {
  credentials: "include"
})
.then(res => {
  if(res.status === 401){
    alert("Please login first");
    window.location.href = "login.html";
    return;
  }
  return res.json();
})
.then(data => {

  if(!data) return;

  document.getElementById("userInfo").innerHTML = `
    <div class="card">
      <h3>${data.user.username}</h3>
      <p>Email: ${data.user.email}</p>
    </div>
  `;

  const div = document.getElementById("myStories");
  div.innerHTML = "";

  if (!data.stories || data.stories.length === 0) {
    div.innerHTML = "<p>No stories posted yet.</p>";
    return;
  }

  data.stories.forEach(s => {
    div.innerHTML += `
      <div class="card">
        <h3>${s.title}</h3>
        <p>${s.content.substring(0,150)}...</p>
        <button onclick="deleteStory(${s.id})">Delete Story</button>
      </div>
    `;
  });

});

function deleteStory(id) {
  fetch(`${BASE_URL}/stories/${id}`, {
    method: "DELETE",
    credentials: "include"
  }).then(() => location.reload());
}
