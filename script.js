const endpoint="https://nyqxplfhrzydxnwhvhco.supabase.co/functions/v1/translate"

const languages={

spanish:{sv:"Spanska",flag:"🇪🇸"},
ukrainian:{sv:"Ukrainska",flag:"🇺🇦"},
urdu:{sv:"Urdu",flag:"🇵🇰"},
english:{sv:"Engelska",flag:"🇬🇧"},
greek:{sv:"Grekiska",flag:"🇬🇷"},
turkish:{sv:"Turkiska",flag:"🇹🇷"},
tigrinya:{sv:"Tigrinja",flag:"🇪🇷"},
swahili:{sv:"Swahili",flag:"🇰🇪"},
bangla:{sv:"Bangla",flag:"🇧🇩"},
arabic:{sv:"Arabiska",flag:"🇸🇦"},
russian:{sv:"Ryska",flag:"🇷🇺"},
mandarin:{sv:"Mandarin",flag:"🇨🇳"},
thai:{sv:"Thailändska",flag:"🇹🇭"},
mongolian:{sv:"Mongoliska",flag:"🇲🇳"},
dari:{sv:"Dari",flag:"🇦🇫"},
persian:{sv:"Persiska",flag:"🇮🇷"}

}

let selected={}

createLanguageGrid()

function createLanguageGrid(){

const grid=document.getElementById("languages")

Object.entries(languages).forEach(([key,lang])=>{

const div=document.createElement("div")
div.className="language"

div.innerHTML=`<input type="checkbox" id="${key}">
<span>${lang.flag}</span>
<span>${lang.sv}</span>`

div.onclick=()=>{

const cb=div.querySelector("input")
cb.checked=!cb.checked
selected[key]=cb.checked

}

grid.appendChild(div)

})

}

async function translate(){

const text=document.getElementById("text").value.trim()

if(!text){

alert("Skriv text")

return

}

const langs=["spanish","ukrainian"]

Object.entries(selected).forEach(([k,v])=>{
if(v)langs.push(k)
})

const results=document.getElementById("results")
results.innerHTML="Översätter..."

try{

const promises=langs.map(async lang=>{

const res=await fetch(endpoint,{
method:"POST",
headers:{"Content-Type":"application/json"},
body:JSON.stringify({
text:text,
language:lang
})
})

return await res.json()

})

const translations=await Promise.all(promises)

results.innerHTML=""

translations.forEach((data,i)=>{

const langKey=langs[i]
const lang=languages[langKey]

const card=document.createElement("div")
card.className="resultCard"

const header=document.createElement("div")
header.className="resultHeader"
header.innerText=`${lang.flag} ${lang.sv}`

const translation=document.createElement("div")
translation.className="translation"
translation.innerText=data.translation

const qr=document.createElement("div")

new QRCode(qr,{
text:`https://erengisle.github.io/translate_mars/view.html?id=${data.id}`,
width:120,
height:120
})

card.appendChild(header)
card.appendChild(qr)
card.appendChild(translation)

results.appendChild(card)

})

}catch(e){

results.innerHTML="Fel vid översättning"

}

}
