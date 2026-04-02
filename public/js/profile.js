// Get userId from URL
const params = new URLSearchParams(window.location.search);
const userId = params.get("userId");

if (!userId) {
  document.body.innerHTML = "<h2>User not found</h2>";
}

fetch(`/user/${userId}`)
  .then(res => res.json())
  .then(data => {

    // Set user info
    document.getElementById("username").innerText = data.user.username;
    document.getElementById("email").innerText = "Email: " + data.user.email;

    const storiesContainer = document.getElementById("userStories");
    storiesContainer.innerHTML = "";

    if (!data.stories || data.stories.length === 0) {
      storiesContainer.innerHTML = `
        <div class="card">
          <p>No stories yet.</p>
        </div>
      `;
      return;
    }

    data.stories.forEach(story => {

      // Limit preview to 250 characters
      const preview = story.content.length > 250
        ? story.content.substring(0, 250) + "..."
        : story.content;

      const card = document.createElement("div");
      card.className = "card";

      card.innerHTML = `
        <h3>${story.title}</h3>
        <p>${preview}</p>
        <a href="viewstory.html?id=${story.id}">Read Full Story</a>
      `;

      storiesContainer.appendChild(card);
    });

  })
  .catch(err => {
    console.log(err);
    document.body.innerHTML = "<h2>Error loading profile</h2>";
  });
