const endpoint="https://nyqxplfhrzydxnwhvhco.supabase.co/functions/v1/translate"

const supabase="https://nyqxplfhrzydxnwhvhco.supabase.co"

const anon="DIN_ANON_KEY_HÄR"


const languages={
spanish:"Spanska",
ukrainian:"Ukrainska",
english:"Engelska",
arabic:"Arabiska",
somali:"Somaliska",
persian:"Persiska",
turkish:"Turkiska",
thai:"Thailändska",
russian:"Ryska",
french:"Franska",
german:"Tyska",
italian:"Italienska",
polish:"Polska",
tigrinya:"Tigrinja"
}


let selected={
spanish:true,
ukrainian:true
}


createLanguageGrid()
loadFavorites()


function createLanguageGrid(){

const container=document.getElementById("languages")

for(const key in languages){

const div=document.createElement("div")
div.className="langbox"

div.innerHTML=
`<label>
<input type="checkbox" ${selected[key]?"checked":""} value="${key}">
${languages[key]}
</label>`

div.onclick=(e)=>{

const cb=div.querySelector("input")

if(e.target.tagName!=="INPUT"){
cb.checked=!cb.checked
}

selected[key]=cb.checked

}

container.appendChild(div)

}

}


async function translate(){

const text=document.getElementById("text").value

if(!text)return alert("Skriv text")

const results=document.getElementById("results")
results.innerHTML=""

const langs=Object.entries(selected)
.filter(([k,v])=>v)
.map(([k,v])=>k)

for(const lang of langs){

const res=await fetch(endpoint,{
method:"POST",
headers:{"Content-Type":"application/json"},
body:JSON.stringify({
text:text,
language:lang
})
})

const data=await res.json()

createCard(languages[lang],data.translation,data.id)

}

}



function createCard(lang,translation,id){

const container=document.getElementById("results")

const card=document.createElement("div")
card.className="card"

const title=document.createElement("div")
title.className="lang"
title.innerText=lang

const qr=document.createElement("div")

new QRCode(qr,{
text:`view.html?id=${id}`,
width:140,
height:140
})

const text=document.createElement("div")
text.className="translation"
text.innerText=translation


const copy=document.createElement("button")
copy.className="copy"
copy.innerText="Kopiera"
copy.onclick=()=>{

navigator.clipboard.writeText(translation)

copy.innerText="Kopierad!"

setTimeout(()=>copy.innerText="Kopiera",1500)

}


card.appendChild(title)
card.appendChild(qr)
card.appendChild(text)
card.appendChild(copy)

container.appendChild(card)

}



async function saveFavorite(){

const text=document.getElementById("text").value

await fetch(`${supabase}/rest/v1/favorites`,{
method:"POST",
headers:{
apikey:anon,
Authorization:`Bearer ${anon}`,
"Content-Type":"application/json"
},
body:JSON.stringify({text:text})
})

loadFavorites()

}



async function loadFavorites(){

const res=await fetch(`${supabase}/rest/v1/favorites?select=*`,{
headers:{
apikey:anon,
Authorization:`Bearer ${anon}`
}
})

const data=await res.json()

const select=document.getElementById("favorites")

select.innerHTML="<option>Favoriter</option>"

data.forEach(f=>{

const option=document.createElement("option")

option.value=f.text
option.innerText=f.text

select.appendChild(option)

})

select.onchange=e=>{
document.getElementById("text").value=e.target.value
}

}



function printQR(){

const cards=[...document.querySelectorAll(".card")]

let html=""

cards.forEach(c=>{
html+=c.outerHTML
})

localStorage.setItem("qrprint",html)

window.open("print.html")

}
