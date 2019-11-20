const search = document.getElementById('search');
const matchList = document.getElementById('match-list');

// Search the JSON result from the backend
const searchStates = async searchText => {
  const res = await fetch(url('/search/'));
  const states = await res.json();

  console.log(states);
}

search.addEventListener('input', () => searchStates(search.value));
