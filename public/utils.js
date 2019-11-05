function updatePlayer(link){
let Player = document.getElementById('reproductor');
Player.outerHTML = '<iframe allow="autoplay; fullscreen" scrolling="no" allowfullscreen="yes" style="width: 100%; height: 100%;" src="' + link + '" frameborder="no"></iframe>';
}
