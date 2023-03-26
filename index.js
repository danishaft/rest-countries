const options = document.getElementById('options')
const select = document.getElementById('select')
let selectedText = select.children[0]
const modal = document.getElementById('modal')
const wrapper = document.getElementById('wrapper')
const searchInput = document.getElementById('search')

searchInput.addEventListener('input', filterSearch)

document.addEventListener('click', (e) => {
    if(e.target.dataset.details){
        handleDetails(e.target.dataset.details)
    }
})

options.addEventListener('click', (e)=>{
    options.classList.add('hidden')
    selectedText.textContent = e.target.textContent
    searchInput.value = ''
    urlFinder()
})

select.addEventListener('click', ()=>{
    options.classList.toggle('hidden')
})

document.getElementById('mode-btn').addEventListener('click', ()=>{
    document.body.classList.toggle('light-mode')
    document.body.classList.contains('light-mode')? document.getElementById('icon-mode').name = 'moon' : document.getElementById('icon-mode').name = 'sunny'
})

//fetch resources 
let url = ''
let countryArr;
function urlFinder(){
    if(selectedText.textContent === 'Filter by Region'){
        url = `https://restcountries.com/v3.1/all`
    }else{
        url = `https://restcountries.com/v3.1/region/${selectedText.textContent}`
    }
    fetch(url)
        .then(res => res.json())
        .then((data) => {
            countryArr = data
            renderCountryHtml()
        })
}
urlFinder()

function renderCountryHtml(){
    const html = countryArr.map((items)=>{
        return `
        <article class="country w-3/4 h-80  elements rounded-lg" id="${items.name.common}">
            <div class="img h-2/5 cursor-pointer">
                <img src="${items.flags.png}" class=" rounded-t-lg" alt="${items.flags.alt}" data-details="${items.population}">
            </div>
            <div class="details px-6">
                <h4 class="text-xl font-semibold pt-6 pb-2">${items.name.common}</h4>
                <p class="text-sm pb-1"><span class="font-semibold">Population:</span> ${items.population}</p>
                <p class="text-sm pb-1"><span class="font-semibold">Region:</span> ${items.region}</p>
                <p class="text-sm pb-1"><span class="font-semibold">Capital:</span> ${items.capital}</p>
            </div>
        </article>`
    })
    document.getElementById('country-container').innerHTML = html.join('')
}

function handleDetails(data){
    const targetCountry = countryArr.filter((items)=>{
        return items.population == data
    })[0]
    const objName = targetCountry.name.nativeName
    const key = Object.values(objName)[0]
    const objCur = Object.values(targetCountry.currencies)[0]
    let boder1;
    let boder2;
    let boder3;
    if(targetCountry.borders){
        boder1 = targetCountry.borders[0]
        boder2 = targetCountry.borders[1]
        boder3 = targetCountry.borders[2]
    }else {
        boder1 = 'N/A'
        boder2 = 'N/A'
        boder3 = 'N/A'
    }
    const detailsHtml = `
    <div class="w-full mx-auto flex flex-col md:flex-row items-center pb-8">
        <div class="details w-5/6 sm:w-2/4 md:w-full mx-auto px-2 md:flex md:items-center md:justify-evenly lg:justify-evenly lg:w-9/12">
            <div class=" md:w-2/5 md:pr-4 lg:w-2/4">
                <button onclick="goBack()"  class="py-2 rounded px-4 my-8 lg:my-12 md:my-6 elements flex items-center"><ion-icon name="arrow-back-outline" class="mr-3 text-lg"></ion-icon> Back</button>
                <img src="${targetCountry.flags.png}" class=" w-full md:h-80" alt="${targetCountry.flags.alt}">
            </div>
            <div class="main-detials  md:self-end md:w-2/4 lg:w-2/5">
                <div class="list md:flex  md:justify-between ">
                        <ul>
                            <li class="text-2xl font-bold pt-8 md:pt-4 md:pb-1 pb-4">${targetCountry.name.common}</li>
                            <li class="text-sm pb-1"><span class="font-semibold text-base">Native Name:</span> ${key.common}</li>
                            <li class="text-sm pb-1"><span class="font-semibold text-base">Population:</span> ${targetCountry.population}</li>
                            <li class="text-sm pb-1"><span class="font-semibold text-base">Region:</span> ${targetCountry.region}</li>
                            <li class="text-sm pb-1"><span class="font-semibold text-base">Sub Region:</span> ${targetCountry.subregion}</li>
                            <li class="text-sm pb-1"><span class="font-semibold text-base">capital:</span> ${targetCountry.capital[0]}</li>
                        </ul>
                        <ul class="my-5 md:my-0 md:self-center md:pl-3">
                            <li class="text-sm pb-1"><span class="font-semibold text-base">Top Level Domain:</span> ${targetCountry.tld[0]}</li>
                            <li class="text-sm pb-1"><span class="font-semibold text-base">Currencies:</span> ${objCur.name}</li>
                            <li class="text-sm pb-1"><span class="font-semibold text-base">Languages:</span> ${Object.values(targetCountry.languages)[0]}, ${Object.values(targetCountry.languages)[1]}</li>
                        </ul>
                </div>
                    <div class="lg:flex lg:justify-between">
                        <p class="text-xl font-semibold mb-3 w-full md:pt-2 lg:pr-2">Border Countries:</p>
                        <div class="flex flex-wrap lg:flex-nowrap lg:items-center w-full">
                            <span class=" elements py-2 px-4 text-sm mr-2 mb-1 lg:mr-1">${boder1}</span>
                            <span class=" text-sm elements py-2 px-4 mr-2 mb-1 lg:mr-1">${boder2}</span>
                            <span class=" text-sm elements py-2 px-4 mr-2 mb-1 lg:mr-1">${boder3}</span>
                        </div>
                    </div>
            </div>
        </div>
    </div>`
    modal.innerHTML = detailsHtml
    wrapper.classList.add('hidden')
    modal.classList.remove('hidden')
}

function goBack(){
    modal.classList.add('hidden')
    wrapper.classList.remove('hidden')
}

function filterSearch(){
    const items = document.querySelectorAll('.country')
    const filter = searchInput.value.toLowerCase()
    items.forEach((item)=>{
        let text = item.id
        if(text.toLowerCase().includes(filter.toLowerCase())){
            item.style.display = ''
        }else {
            item.style.display = 'none'
        }
    })
}
