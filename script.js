const btn = document.getElementById("dys");

btn.onclick = () => {
  document.body.classList.toggle("font-dyslexic");

  if (document.body.classList.contains("font-dyslexic")) {
    btn.textContent = "Police normale";
  } else {
    btn.textContent = "Mode dyslexique";
  }
};