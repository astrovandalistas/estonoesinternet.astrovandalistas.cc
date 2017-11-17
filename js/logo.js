var siglas = Array(
  "TELEVISA",
  "TELMEX",
  "FACEBOOK",
  "CENSURA",
  "COMPADRE",
  "SOBORNO",
  "MONOPOLIO",
  "SALINAS",
  "AYOTZINAPA");

var palabras1 = Array(
  "Agencia",
  "Secretaría",
  "Instituto",
  "Consejo",
  "Departamento",
  "Unidad",
  "Comisión");

var palabras2 = Array(
  "de nepotismo e impunidad",
  "de Intimidación y vigilancia",
  "para la manipulación mediática",
  "de la desaparición forzada",
  "de legitimación de la mentira",
  "de espionaje y venta de datos personales",
  "de saqueo a los bienes públicos",
  "de control de la opinión pública");

function cambiarTitulo() {
  var sigla, palabra1, palabra2;

  sigla = siglas[Math.floor(Math.random()*siglas.length)];
  palabra1 = palabras1[Math.floor(Math.random()*palabras1.length)];
  palabra2 = palabras2[Math.floor(Math.random()*palabras2.length)];

  document.getElementById('logo-sigla').innerHTML = sigla;
  document.getElementById('logo-titulo').innerHTML = palabra1 + " " + palabra2;
}

(function() {
  setInterval(cambiarTitulo, 5000);
})();