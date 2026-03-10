const endpoint = "https://nyqxplfhrzydxnwhvhco.supabase.co/functions/v1/translate";

const defaultLanguages = {
  "Ukrainska":"Ukrainian",
  "Spanska":"Spanish"
};

async function translate(){

const text = document.getElementById("text").value;

if(!text){
alert("Skriv text först");
return;
}

const results = document.getElementById("results");
results.innerHTML="";

let languages = {...defaultLanguages};

document.querySelectorAll("input[type=checkbox]:checked")
.forEach(cb=>{
languages[cb.parentNode.innerText.trim()] = cb.value;
});

for(const label in languages){

const language = languages[label];

const res = await fetch(endpoint,{
method:"POST",
headers:{"Content-Type":"application/json"},
body:JSON.stringify({
text:text,
language:language
})
});

const data = await res.json();

const translation = data.translation;

createCard(label,translation);

}

}

function createCard(language,translation){

const container = document.getElementById("results");

const card = document.createElement("div");
card.className="card";

const lang = document.createElement("div");
lang.className="lang";
lang.innerText=language;

const text = document.createElement("div");
text.innerText=translation;

const qr = document.createElement("div");

const url =
`view.html?text=${encodeURIComponent(translation)}&lang=${encodeURIComponent(language)}`;

new QRCode(qr,{
text:url,
width:150,
height:150
});

card.appendChild(lang);
card.appendChild(qr);
card.appendChild(text);

container.appendChild(card);

}
