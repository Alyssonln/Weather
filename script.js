const key = "ecebd5328ed0f178380a832adeb5a7cd";

const GRADIENTS = {
    Clear: ["#a8d8ff", "#d0e6ff"],
    Clouds: ["#7fb0f0", "#b7d0ff"],
    Rain: ["#5f8fb8", "#88b3d6"],
    Drizzle: ["#7aa8d9", "#a9c8ef"],
    Thunderstorm: ["#5a74a8", "#86a3d8"],
    Snow: ["#b7d5ff", "#d9ecff"],
    Mist: ["#bcd2e8", "#d7e5f3"],
    Fog: ["#bcd2e8", "#d7e5f3"],
    Haze: ["#bcd2e8", "#d7e5f3"],
    DEFAULT: ["#7fa9ff", "#5d86e6"],
};

function hexToRgba(hex, a = 0.6) {
    const m = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    if (!m) return hex;
    const r = parseInt(m[1], 16);
    const g = parseInt(m[2], 16);
    const b = parseInt(m[3], 16);
    return `rgba(${r}, ${g}, ${b}, ${a})`;
}

function gradientCSS([from, to]) {
    const f = hexToRgba(from, 0.6);
    const t = hexToRgba(to, 0.6);
    return `linear-gradient(135deg, ${f}, ${t})`;
}

function ensureStatusEl() {
    let el = document.querySelector("#status");
    if (!el) {
        el = document.createElement("p");
        el.id = "status";
        const card = document.querySelector(".principal");
        (card?.parentElement || document.body).appendChild(el);
    }
    return el;
}

function setStatus(msg) {
    const el = ensureStatusEl();
    el.textContent = msg || "";
}

function setCardTheme(mainType = "DEFAULT") {
    const card = document.querySelector(".principal");
    if (!card) return;
    const grad = gradientCSS(GRADIENTS[mainType] || GRADIENTS.DEFAULT);
    card.style.backgroundImage = grad;
    card.style.transition = "background-image 300ms ease";
}

function capitalizePtBr(str = "") {
    return str.replace(/\p{L}+/gu, w => w[0].toUpperCase() + w.slice(1));
}

async function buscarCidade(cidade) {
    const input = document.querySelector(".input-cidade");
    try {
        const q = (cidade || "").trim();
        if (!q) {
            setStatus("Digite uma cidade para buscar.");
            input?.focus();
            return;
        }

        setStatus("Carregando...");

        const resp = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(q)}&appid=${key}&lang=pt_br&units=metric`
        );

        if (!resp.ok) {
            throw new Error("Local não encontrado.");
        }

        const dados = await resp.json();
        exibirDados(dados);
        setStatus("");
    } catch (e) {
        setStatus(e.message || "Erro ao buscar dados.");
        limparDados();
    }
}

function clicarBtn() {
    const cidade = document.querySelector(".input-cidade")?.value || "";
    buscarCidade(cidade);
}

function exibirDados(dados) {
    const nome = dados?.name || "—";
    const main = dados?.weather?.[0]?.main || "DEFAULT";
    const descricao = capitalizePtBr(dados?.weather?.[0]?.description || "");
    const icon = dados?.weather?.[0]?.icon || "04n";
    const temp = Math.floor(dados?.main?.temp ?? 0);
    const hum = dados?.main?.humidity ?? 0;

    document.querySelector(".cidade").textContent = "Tempo em " + nome;
    document.querySelector(".temperatura").textContent = `${temp} °C`;
    document.querySelector(".previsao").textContent = descricao;
    document.querySelector(".umidade").textContent = `Umidade: ${hum}%`;
    document.querySelector(".img-icone").src = `https://openweathermap.org/img/wn/${icon}@2x.png`;

    setCardTheme(main);
    document.title = `Previsão do Tempo — ${nome}`;
}

function limparDados() {
    document.querySelector(".cidade").textContent = "Tempo em ...";
    document.querySelector(".temperatura").textContent = "0 °C";
    document.querySelector(".previsao").textContent = "Nublado";
    document.querySelector(".umidade").textContent = "Umidade: 76%";
    document.querySelector(".img-icone").src = "https://openweathermap.org/img/wn/04n.png";
    setCardTheme("DEFAULT");
}

document.addEventListener("DOMContentLoaded", () => {
    ensureStatusEl();
    const input = document.querySelector(".input-cidade");

    input?.addEventListener("keydown", (e) => {
        if (e.key === "Enter") {
            e.preventDefault();
            clicarBtn();
        }
    });

    input?.focus({ preventScroll: true });
    setCardTheme("DEFAULT");
});

window.clicarBtn = clicarBtn;
