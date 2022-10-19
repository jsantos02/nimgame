const openModalButtons = document.querySelectorAll('[data-modal-target]')
const closeModalButtons = document.querySelectorAll('[data-close-button]')
const overlay = document.getElementById('overlay')
var tabuleiro;
var starter;
var dificulty;

openModalButtons.forEach(button => {
  button.addEventListener('click', () => {
    const modal = document.querySelector(button.dataset.modalTarget)
    openModal(modal)
  })
})

overlay.addEventListener('click', () => {
  const modals = document.querySelectorAll('.modal.active')
  modals.forEach(modal => {
    closeModal(modal)
  })
})

closeModalButtons.forEach(button => {
  button.addEventListener('click', () => {
    const modal = button.closest('.modal')
    closeModal(modal)
  })
})

function openModal(modal) {
  if (modal == null) return
  modal.classList.add('active')
  overlay.classList.add('active')
}

function closeModal(modal) {
  if (modal == null) return
  modal.classList.remove('active')
  overlay.classList.remove('active')
}

//coisas do tabuleiro a partir daqui

function gerCol(n) {
  for(let i = 0; i < n; i++) {
    array[i].append('');
  }
}
window.onload = function tamanho_tabuleiro() {
    let btn = document.getElementById("submit");
    btn.onclick = function(){
      tabuleiro = document.getElementById("tabuleiro").value;
      starter = document.getElementById("starter").value;
      dificulty = document.getElementById("dificulty").value;
      startGame();
    }
}

function startGame() {
  var tamanho = document.getElementById("changednumber");
  tamanho.innerHTML = tabuleiro;
  var comeca = document.getElementById("starter11");
  comeca.innerHTML = starter;
  var dificuldade = document.getElementById("dificulty11"); //printar no html o input do forms
  dificuldade.innerHTML = dificulty;
  //alert("Boas");
}
