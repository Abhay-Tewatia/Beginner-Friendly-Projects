const API_URL = "https://randomuser.me/api/?results=3&nat=us,gb,ca,in";

// Some fake roles to make data interesting
const ROLES = [
  "Product Designer",
  "Frontend Developer",
  "Backend Developer",
  "Full Stack Engineer",
  "UI/UX Designer",
  "Mobile Developer",
];

function getRandomRole() {
  return ROLES[Math.floor(Math.random() * ROLES.length)];
}

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Create a single user card DOM element
function createUserCard(user) {
  const card = document.createElement("div");
  card.className =
    "bg-white rounded-lg shadow-lg overflow-hidden max-w-sm w-full hover:shadow-2xl transition-shadow duration-300";

  const fullName = `${user.name.first} ${user.name.last}`;
  const role = getRandomRole();
  const experience = getRandomInt(1, 10); // years
  const followers = getRandomInt(100, 1000);
  const projects = getRandomInt(10, 100);
  const reviews = getRandomInt(10, 200);

  card.innerHTML = `
    <div class="h-32 bg-gradient-to-r from-blue-500 to-purple-600"></div>

    <div class="px-6 pb-6">
      <div class="flex justify-center -mt-16 mb-4">
        <img
          src="${user.picture.large}"
          alt="User Avatar"
          class="w-32 h-32 rounded-full border-4 border-white shadow-lg object-cover"
        />
      </div>

      <div class="text-center mb-4">
        <h2 class="text-2xl font-bold text-gray-800 mb-1">${fullName}</h2>
        <p class="text-blue-600 font-semibold mb-1">${role}</p>
        <p class="text-gray-600 text-sm">
          ${experience}+ years of experience · ${user.location.city}, ${user.location.country}
        </p>
      </div>

      <div class="grid grid-cols-3 gap-4 mb-6 py-4 border-t border-b border-gray-200">
        <div class="text-center">
          <p class="text-2xl font-bold text-blue-600">${followers}</p>
          <p class="text-gray-600 text-xs">Followers</p>
        </div>
        <div class="text-center">
          <p class="text-2xl font-bold text-purple-600">${projects}</p>
          <p class="text-gray-600 text-xs">Projects</p>
        </div>
        <div class="text-center">
          <p class="text-2xl font-bold text-pink-600">${reviews}</p>
          <p class="text-gray-600 text-xs">Reviews</p>
        </div>
      </div>

      <div class="flex gap-3">
        <button class="flex-1 bg-gradient-to-r from-blue-500 to-blue-600 text-white font-semibold py-2 px-4 rounded-lg hover:shadow-lg transition-all duration-300 transform hover:scale-105">
          Follow
        </button>
        <button class="flex-1 border-2 border-blue-500 text-blue-600 font-semibold py-2 px-4 rounded-lg hover:bg-blue-50 transition-all duration-300">
          Message
        </button>
      </div>
    </div>
  `;

  return card;
}

// Fetch users from API and render cards
async function loadUsers() {
  const cardsContainer = document.getElementById("cards");
  cardsContainer.innerHTML = `<p class="text-white/70">Loading users...</p>`;

  try {
    const res = await fetch(API_URL);
    const data = await res.json();
    const users = data.results;

    // Clear old cards
    cardsContainer.innerHTML = "";

    users.forEach((user) => {
      const card = createUserCard(user);
      cardsContainer.appendChild(card);
    });
  } catch (err) {
    console.error(err);
    cardsContainer.innerHTML =
      `<p class="text-red-400">Failed to load users. Please try again.</p>`;
  }
}

// On page load + on button click
document.addEventListener("DOMContentLoaded", () => {
  const reloadBtn = document.getElementById("reloadBtn");

  reloadBtn.addEventListener("click", loadUsers);

  // Load once on page refresh
  loadUsers();
});
