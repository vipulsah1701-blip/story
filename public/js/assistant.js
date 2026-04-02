// Wait for page to fully load
document.addEventListener("DOMContentLoaded", () => {

  // Insert assistant UI
  document.body.insertAdjacentHTML("beforeend", `

  <div id="ai-button">🤖</div>

  <div id="ai-chat">

    <div id="ai-header">
      AI Assistant
      <span id="ai-close">✖</span>
    </div>

    <div id="ai-messages"></div>

    <input 
      id="ai-input"
      placeholder="Ask about this website..."
    >

  </div>

  `);

  const aiButton = document.getElementById("ai-button");
  const aiChat = document.getElementById("ai-chat");
  const aiClose = document.getElementById("ai-close");
  const aiInput = document.getElementById("ai-input");
  const aiMessages = document.getElementById("ai-messages");

  const currentPage = window.location.pathname;

  // Open Chat
  aiButton.onclick = () => {
    aiChat.style.display = "flex";
  };

  // Close Chat
  aiClose.onclick = () => {
    aiChat.style.display = "none";
  };

  // Helper function
  function addMessage(sender, text){
    aiMessages.innerHTML += `<p><b>${sender}:</b> ${text}</p>`;
    aiMessages.scrollTop = aiMessages.scrollHeight;
  }

  // Send message
  aiInput.addEventListener("keydown", function(e){

    if(e.key !== "Enter") return;

    const text = aiInput.value.trim().toLowerCase();
    if(!text) return;

    addMessage("You", text);

    let reply = "";

    // ===== ADD STORY =====
    if(text.includes("add") || text.includes("post") || text.includes("write story")){
      reply = `
        Steps to add a story:
        <br>1. Go to Home page
        <br>2. Click "+ Add Story"
        <br>3. Enter title and content
        <br>4. Click "Post Story"
      `;
    }

    // ===== DELETE =====
    else if(text.includes("delete")){
      reply = `
        Steps to delete a story:
        <br>1. Go to Profile page
        <br>2. Find your story
        <br>3. Click "Delete Story"
      `;
    }

    // ===== PROFILE =====
    else if(text.includes("profile")){
      reply = `
        Steps to open profile:
        <br>1. Go to Home page
        <br>2. Click "👤 Profile"
      `;
    }

    // ===== LOGIN =====
    else if(text.includes("login")){
      reply = `
        Steps to login:
        <br>1. Enter email
        <br>2. Enter password
        <br>3. Click Login
      `;
    }

    // ===== REGISTER =====
    else if(text.includes("register") || text.includes("signup")){
      reply = `
        Steps to register:
        <br>1. Enter username
        <br>2. Enter Gmail
        <br>3. Enter password
        <br>4. Click Register
      `;
    }

    // ===== SEARCH =====
    else if(text.includes("search")){
      reply = `
        Steps to search:
        <br>1. Click "🔍 Search"
        <br>2. Type keyword
        <br>3. View results
      `;
    }

    // ===== LIKE =====
    else if(text.includes("like")){
      reply = `
        Steps to like a story:
        <br>1. Open Home page
        <br>2. Find story
        <br>3. Click ❤️ button
      `;
    }

    // ===== READ =====
    else if(text.includes("read") || text.includes("listen")){
      reply = `
        Steps to read story:
        <br>1. Click "Read Full Story"
        <br>2. Press "Read" button
      `;
    }

    // ===== CONTEXT =====
    else if(text.includes("where am i")){
      reply = "You are on: " + currentPage;
    }

    // ===== HELP =====
    else if(text.includes("help")){
      reply = `
        I can help with:
        <br>• Login / Register
        <br>• Posting stories
        <br>• Reading stories
        <br>• Searching
        <br>• Profile actions
      `;
    }

    // ===== DEFAULT =====
    else{
      reply = "Try: add story, search, profile, login, help";
    }

    addMessage("Assistant", reply);

    aiInput.value = "";
  });

});
