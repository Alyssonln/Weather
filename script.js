const key = "ecebd5328ed0f178380a832adeb5a7cd";

async function buscarCidade(cidade) {
    const dados = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${cidade}&appid=${key}&lang=pt_br&units=metric`).then( resposta => resposta.json())
    exibirDados(dados)
}

function clicarBtn() {
    const cidade = document.querySelector('.input-cidade').value;
    buscarCidade(cidade)
}

function exibirDados(dados) {
    document.querySelector('.cidade').innerHTML = "Tempo em " + dados.name
    document.querySelector('.temperatura').innerHTML = Math.floor(dados.main.temp) + " °C"
    document.querySelector('.previsao').innerHTML = dados.weather[0].description
    document.querySelector('.umidade').innerHTML = "Umidade: " + dados.main.humidity + "%"
    document.querySelector('.img-icone').src = `https://openweathermap.org/img/wn/${dados.weather[0].icon}.png`
}
