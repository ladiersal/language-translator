
const dropdownContainer = document.querySelectorAll(".dropdown-container");
const inputLanguageDropdown = document.querySelector("#input-language");
const outputLanguageDropdown = document.querySelector("#output-language");


function dropdowns(dropdown, options) {
    dropdown.querySelector("ul").innerHTML = "";
    options.forEach(option => {
        const li = document.createElement("li");
        const title = option.name + " (" + option.native + ")"
        li.innerHTML = title;
        li.dataset.value = option.code
        li.classList.add("option")
        dropdown.querySelector("ul").appendChild(li);
    });
}

dropdowns(inputLanguageDropdown, languages)
dropdowns(outputLanguageDropdown, languages)


dropdownContainer.forEach((dropdown) => {
    dropdown.addEventListener("click", (e) => {
        dropdown.classList.toggle("active");
    });

    dropdown.querySelectorAll(".option").forEach((item) => {
        item.addEventListener("click", (e) => {

            dropdown.querySelectorAll(".option").forEach((item) => {
                item.classList.remove("active")
            })
            item.classList.add("active")
            const selected = dropdown.querySelector(".selected")
            selected.innerHTML = item.innerHTML;
            selected.dataset.value = item.dataset.value
            
            translate()
        })
    })
})

document.addEventListener("click", (e) => {
    dropdownContainer.forEach((dropdown) => {
        if(!dropdown.contains(e.target)) {
            dropdown.classList.remove("active")
        }
    })
})

const inputText = document.querySelector("#input-text");
const outputText = document.querySelector("#output-text")
const inputLanguage = inputLanguageDropdown.querySelector(".selected");
const outputLanguage = outputLanguageDropdown.querySelector(".selected");
const downloadButton = document.querySelector("#download-document-button")

function translate() {
    const text = inputText.value;
    const inputLanguage = inputLanguageDropdown.querySelector(".selected").dataset.value;
    const outputLanguage = outputLanguageDropdown.querySelector(".selected").dataset.value;
    if(!text) return;
    const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=${inputLanguage}&tl=${outputLanguage}&dt=t&q=${encodeURI(text)}`;
    fetch(url)
    .then((response) => response.json())
    .then((json) => {
        outputText.value = json[0].map((item) => item[0]).join("")
    })
}

const noClick = document.querySelectorAll(".click");
const shareNoClick = document.querySelector(".share-no-click")
const socialIcons = document.querySelector(".share-icons");
const socialIcon = document.querySelectorAll(".share-icons ion-icon");
const shareIcons = document.querySelector(".shareWrapper");




inputText.addEventListener("input", (e) => {
    
    share()
    shareIcons.addEventListener("click", shareClick())

    
    if(outputText.value.length > 10) {
        const link = encodeURI(window.location.href);
        const msg = encodeURIComponent(outputText.value);
        const twitter = document.querySelector(".share-icons .twitter");
        twitter.href = `http://twitter.com/share?&url?${link}&text=${msg}&hashtags=rellenid`
    }
    if(inputText.value.length > 5000) {
        inputText.value = inputText.value.slice(0, 5000)
    } 
    downloadButton.classList.add("button-active")
    if(!inputText.value) {
        downloadButton.classList.remove("button-active")
        outputText.value = "";
        noClick.forEach((element) => {
            element.classList.add("click")
        })
    }
    translate()
    chars()
})



    function shareClick() {
        () => {
        
            if(outputText.value.length < 10) {
                const link = encodeURI(window.location.href);
                const msg = encodeURIComponent(outputText.value);
                
                const twitter = document.querySelector(".share-icons .twitter");
                twitter.href = `http://twitter.com/share?&url?${link}&text=${msg}&hastags=javascript`
                
            }
            socialIcons.classList.toggle("hide")
            socialIcons.addEventListener("click", () => {
                socialIcon.forEach((icon) => {
                    socialIcons.classList.add("hide")
                })
            })
            
    
        }
    }
function share() {
    if(inputText.value.length < 10) {
        socialIcons.classList.add("hide")
        shareNoClick.classList.add("share-no-click")
    } else {
        shareNoClick.classList.remove("share-no-click")
    }

    noClick.forEach((element) => {
        element.classList.remove("click")
    })
}

const swapBtn = document.querySelector(".swap");

swapBtn.addEventListener("click", (e) => {
    const temp = inputLanguage.innerHTML;
    inputLanguage.innerHTML = outputLanguage.innerHTML
    outputLanguage.innerHTML = temp

    const tempValue = inputLanguage.dataset.value;
    inputLanguage.dataset.value = outputLanguage.dataset.value;
    outputLanguage.dataset.value = tempValue

    const tempInputText = inputText.value;
    inputText.value = outputText.value;
    outputText.value = tempInputText
})


const uploadDocument = document.querySelector("#upload-document");
const uploadTitle = document.querySelector(".button-text #upload-title")
const uploadDocumentWrapper = document.querySelector(".translate-tab label");


uploadDocument.addEventListener("change", (e) => {
    const file = e.target.files[0];

    uploadDocumentWrapper.classList.remove("u-file")
    if (
        file.type === "application/pdf" ||
        file.type === "application/msword" ||
        file.type === "text/plain"
    ) {
        fileName = file.name.slice(0, 15)
        uploadTitle.innerText = fileName + "..";
        const reader = new FileReader(file)
        reader.readAsText(file);
        reader.onload = (e) => {
            inputText.value = e.target.result
            translate()
            chars()
            share()
            shareClick()
        }
    } else {
        uploadTitle.innerHTML = "Unidentified File";
        uploadDocumentWrapper.classList.add("u-file");
    }
})

const downloadDocument = document.querySelector("#download-document-button")

downloadDocument.addEventListener("click", (e) => {
    const downloadText = outputText.value;
    if(downloadText) {
        const blob = new Blob([downloadText], {type: "text/plain"})
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.download = "Rellenid Translation File.txt";
        a.href = url;
        a.click();
    }
})

const bottomIcon = document.querySelectorAll(".bottom-icon ion-icon");


bottomIcon.forEach(icon => {
    icon.addEventListener("click", ({target}) => {
        if(target.classList.contains("copy")) {
            if(target.id == "from") {
                navigator.clipboard.writeText(inputText.value)
            } else {
                navigator.clipboard.writeText(outputText.value)
            }
        } else if (target.classList.contains("volume")) {
            let uttrance;
            uttrance = new SpeechSynthesisUtterance(outputText.value);
            uttrance.lang =  outputLanguage.dataset.value
            speechSynthesis.speak(uttrance)
        } else if (target.classList.contains("shareWrapper")) {
            socialIcons.classList.remove("hide")
        }
    })
})

class speechApi {

        constructor() {
    
        const SpeechToText = window.SpeechRecognition || window.webkitSpeechRecognition
    
        this.speechApi = new SpeechToText()
        this.output = outputText.output 
        this.speechApi.continuous = true
        this.speechApi.lang = inputLanguage.dataset.value
        
        this.speechApi.onresult = (e) => {
            var resultIndex = e.resultIndex
            var transcript = e.results[resultIndex][0].transcript
    
            inputText.value += transcript
            translate()
        }
        }
    
        start() {
        this.speechApi.start()
        }
    
        stop() {
        this.speechApi.stop()
        }
    }
let speech = new speechApi()

const mic = document.querySelector(".mic");
const displayMic = document.querySelector(".dn-mic")
mic.addEventListener("click", () => {
    speech.start()
    displayMic.classList.remove("display-none");
})

displayMic.addEventListener("click", () => {
    speech.stop()
    displayMic.classList.add("display-none");
})


function chars() {
    
    const chars = document.querySelector(".input-chars");

    if(inputText.value.length > 4900) {
        chars.innerHTML = inputText.value.length
        chars.style.color = "red"
    } else {
        chars.style.color = "#cdccd1"
        chars.innerHTML = inputText.value.length

    }
}