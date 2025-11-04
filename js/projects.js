// projects.js - simple handlers for project links
document.addEventListener('click', (e) => {
  if (e.target.matches('.project-card .link')) {
    e.preventDefault();
    alert('Подробности скоро появятся. Можно связать с GitHub репозиторием.');
  }
});
