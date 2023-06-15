$(document).ready(function() {

  /* genera el cupón de cotización */

  $("#formulario-cotizacion").submit(function(event) {

    event.preventDefault(); // evita que el formulario se envíe

    /* extrae los valores ingresados en el formulario */

    let salida = document.getElementById('salida').value,
      destino = document.getElementById('destino').value,
      dias = document.getElementById('cotiza-dias').value,
      cantViajeros = document.getElementById('cotiza-viajeros').value,
      paquete = document.getElementById('paquete').value;

    let extra = 0, pack = 0;

    switch (destino) {
      case "Territorio Nacional":
        extra = 100;
        break;
      case "América del Sur":
        extra = 110;
        break;
      case "América del Central":
        extra = 150;
        break;
      case "América del Norte":
        extra = 200;
        break;
      case "Oceanía, Asia & África":
        extra = 210;
        break;
      case "Europa":
        extra = 220;
        break;
    }

    switch (paquete) {
      case "Económico":
        pack = 500;
        break;
      case "Turista":
        pack = 750;
        break;
      case "Ejectutivo":
        pack = 1000;
        break;
      case "Premium":
        pack = 1500;
        break;
    }

    /* asigna los valores del cupón */

    $("#c-origen").html(salida)
    $("#c-destino").html(destino)
    $("#c-dias").html(dias)
    $("#c-cantViajeros").html(cantViajeros)
    $("#c-pack").html(paquete)
    $("#preciofinal").html(cantViajeros * dias * pack + extra * cantViajeros)

    /* formato del cupón */

    let cupon = `<div class="window" id="cupontab">
        <button type="button" title="Cerrar" id="close-button"><i class="las la-times"></i></button>
        <div class="cupon" id="cupon">
        <table>
            <tr>
                <th colspan="2">Información del pack</th>
            </tr>
            <tr>
                <td>Origen: ${salida}</td>
            </tr>
            <tr>
                <td>Destino: ${destino}</td>
            </tr>
            <tr>
                <td>Dias: ${dias}</td>
            </tr>
            <tr>
                <td>Cantidad de viajeros: ${cantViajeros}</td>
            </tr>
            <tr>
                <td>Nivel del pack: ${paquete}</td>
            </tr>
            <tr>
                <td>Precio final: ARS ${cantViajeros * dias * pack + extra * cantViajeros}</td>
            </tr>
        </table>
        </div>
        <button type="button" id="imprimePDF">Imprimir en PDF</button>
        </div>`

    $(this).parents("section").append(cupon);

    /* reinicia el formulario al apretar "Cotizar" */

    $("#formulario-cotizacion").trigger("reset");

    /* controla el botón de cierre del cupón */

    $("#close-button").on("click", function() {
      $(this).parent().remove();
    });

    /* imprime el cupón en pdf */

    $("#imprimePDF").on("click", function() {
      //$(this).css("color", "red")

      let doc = new jsPDF('p', 'pt', 'a4')

      let elementHTML = $('#cupontab').html();
      doc.fromHTML(elementHTML, 15, 15, {
        'width': 500
      });

      doc.save('Cupon.pdf');

    })

  });

  /* formulario de consulta, muestra cartel de "Mensaje enviado" */

  $("#formulario-consulta").submit(function(event) {

    event.preventDefault();

    let mensaje = `<div class="window">
                            <button type="button" title="Cerrar" id="close-button"><i class="las la-times"></i></button>
                            <div class="cupon">
                                <p>Mensaje enviado</p>
                            </div>
                        </div>`

    $(this).parents("section").append(mensaje);
    $(this).trigger("reset");

    $("#close-button").on("click", function() {
      $(this).parent().remove();
    });
  })

  /* formulario de newsletter, muestra cartel de 'Gracias por registrarte' */

  $("#formulario-newsletter").submit(function(event) {

    event.preventDefault();

    let mensaje = `<div class="window">
                            <button type="button" title="Cerrar" id="close-button"><i class="las la-times"></i></button>
                            <div class="cupon">
                                <p>Gracias por registrarte</p>
                            </div>
                        </div>`

    $("#newsl-form").append(mensaje);
    $(this).trigger("reset");

    $("#close-button").on("click", function() {
      $(this).parent().remove();
    });
  })

  /* sección de fetch de apis */

  let stocksArr = [], urlPeso = 'https://api.bluelytics.com.ar/v2/latest', urlInt = 'https://api.freecurrencyapi.com/v1/latest?apikey=FAP9XdWgKgeBqeuJplARSuU0x3rLFNi0iFDJ2BxB&currencies=EUR%2CJPY%2CRUB%2CBRL';

  /* recoge los valores de peso a dólar y calcula otras conversiones */

  fetch(urlPeso)
    .then(function(response) {
      return response.json()
    })
    .then(function(data) {
      stocksArr.push(data.blue.value_buy);
      stocksArr.push(data.oficial.value_buy);
      return fetch(urlInt) // sacarle las comillas a urlInt para que funcione
    })
    .then(function(response) {
      return response.json();
    })
    .then(function(res) {
      stocksArr.push(...Object.values(res.data));
      $("#stock0").html(stocksArr[0])
      $("#stock1").html(stocksArr[1])
      for (let i = 2; i < stocksArr.length; i++) {
        $(`#stock${i}`).html((stocksArr[1] / stocksArr[i]).toFixed(2))
      }
    })
    .catch(function(error) {
      console.log('Requestfailed', error)
    });

  /* regoge los usuarios */

  fetch('https://reqres.in/api/users?page=1&per_page=4')
    .then(response => response.json())
    .then(response => {
      for (let i = 0; i < 4; i++) {
        $(`#p${i + 1}nombre`).html(response.data[i].first_name + " " + response.data[i].last_name)
        $(`#p${i + 1}foto`).attr("src", response.data[i].avatar)
        $(`#p${i + 1}email`).html(response.data[i].email)
      }
    })
    .catch(err => console.error(err));

  /* recoge las frases de cada persona */

  fetch('https://type.fit/api/quotes')
    .then(response => response.json())
    .then(response => {
      //console.log(response)
      for (let i = 0; i < 4; i++) {
        $(`#p${i + 1}comment`).html(response[Math.floor(Math.random() * (99 - 0 + 1))].text)
      }
    })
    .catch(err => console.error(err));
})
