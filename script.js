const sideNavigation = document.querySelector(".sideNavigation");
const sideBarToggle = document.querySelector(".fa-bars");
const inputArea = document.querySelector(".inputArea input");
const sendRequestIcon =document.querySelector(".fa-paper-plane");
const chatHistory = document.querySelector(".chatHistory ul");
const startContent  =document.querySelector(".startContent");
const chatContent = document.querySelector(".chatContent");
const result = document.querySelector(".result");
const startContentUl = document.querySelector(".startContent ul");

const promptQuestions = [
  {
    question: "Suggest beautiful places to see on an upcoming road trip",
    icon: "fa-regular fa-compass"
  },
  {
    question: "Briefly summarize this concept: urban planning",
    icon: "fa-solid fa-lightbulb"
  },
  {
    question: "Brainstorm team bonding activities for our work retreat",
    icon: "fa-solid fa-code" // 'fa-sold' ko 'fa-solid' se replace kiya
  },
  {
    question: "Improve the readability of the following code",
    icon: "fa-regular fa-message"
  }
];

window.addEventListener("load", () => {
  promptQuestions.forEach(data => {
    let item = document.createElement("li");
    item.addEventListener("click" , ()=>{
         getResponse(data.question);
    })

    item.innerHTML = `<div class="promptSuggestion">
      <p>${data.question}</p>
      <div class="icon"><i class="${data.icon}"></i></div>
    </div>`;
    console.log(item);
    startContentUl.append(item);
  });
});

sideBarToggle.addEventListener("click", ()=>{
     sideNavigation.classList.toggle("expandClose");
});
inputArea.addEventListener("keyup" ,(e)=>{
    if(e.target.value.length>1){
        sendRequestIcon.style.display ="inline";
    }else {
        sendRequestIcon.style.display ="none";
    }
});
sendRequestIcon.addEventListener("click",()=>{
    getResponse(inputArea.value , true)
})
let choose  = document.querySelector(".choose")
let btns =  choose.querySelectorAll("button");

function getResponse(question ,appendHistory){
    google(question);
    console.log(question);
    let historyli = document.createElement("li");
    historyli.innerHTML =`<i class="fa-regular fa-message"></i> ${question}`
    chatHistory.append(historyli);
    btns.forEach((btn)=>{
        btn.addEventListener("click",()=>{
             if(btn.value =="gemini")  geminiApi(question);
             else if(btn.value =="aiImages") aiImages(question);
             else if(btn.value=="google")  google(question);
             else if(btn.value ==="wikipidi") wikipidi(question);
        }) 
    })
     
   
}
async function geminiApi(question) {
    // Clear previous results and update display
    result.innerHTML = "";
    inputArea.value = "";
    startContent.style.display = "none";
    chatContent.style.display = "block";
 
    let resultTitle = `<p class="resultTitle">${question}</p>`;
    let resultData = ` <div class="resultData">
      <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcThr7qrIazsvZwJuw-uZCtLzIjaAyVW_ZrlEQ&s"/>
       <div class="loader">
          <div class="animatedBG"></div>
          <div class="animatedBG"></div>
          <div class="animatedBG"></div>
       </div>
    </div>
 `;
 
 result.innerHTML += resultTitle;
 result.innerHTML += resultData;
   
   const AIURL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=AIzaSyCUwVteolbsLzaTknZgbQKL4HZTAOk3rFY`;
  
    try {
      const response = await fetch(AIURL, {
        method: "POST",
        body: JSON.stringify({
          "contents": [{ "parts": [{ "text": question }] }]
        })
      });
  
      const data = await response.json();
      console.log(data);
      result.innerHTML = data.candidates[0].content.parts[0].text;
    } catch (error) {
      console.error("Error fetching Gemini API:", error);
    }
  }
  

  async function aiImages(question) {
    result.innerHTML = "";
    inputArea.value = "";
    startContent.style.display = "none";
    chatContent.style.display = "block";
    console.log(question);
    
    result.innerHTML = `<div class="loader">
        <div class="animatedBG"></div>
        <div class="animatedBG"></div>
        <div class="animatedBG"></div>
    </div>`;

    const accessKey = 'SLkZZaTu5YfWkdeuNX_QBuP1GAELFIvmB7ycAII-8Xs'; // Replace with secure storage
    const keyword = question;
    const count = 12;

    try {
        const response = await fetch(`https://api.unsplash.com/search/photos?query=${encodeURIComponent(keyword)}&per_page=${count}&client_id=${accessKey}`);
        const Imagesdata = await response.json();

        console.log("API Response:", Imagesdata); // Debugging ke liye

        // ✅ FIX: Correct response check
        if (Imagesdata.results.length === 0) {
            result.innerHTML = "<p>Images not found!</p>";
            return;
        }

        const imgDiv = document.createElement("div");
        imgDiv.classList.add("imgDiv");

        Imagesdata.results.forEach((img) => {
            const imgElement = document.createElement('img');
            imgElement.src = img.urls.regular;
            imgElement.alt = img.alt_description || keyword;
            imgElement.classList.add("imgElement");
            imgDiv.append(imgElement);
        });

        result.innerHTML = "";
        result.append(imgDiv);
    } catch (error) {
        console.error("Fetch error:", error);
        result.innerHTML = "<p>Error fetching images.</p>";
    }
}

 
  async function google(question){
  const fragment = document.createDocumentFragment();
    result.innerHTML = "";
    inputArea.value ="";
    startContent.style.display ="none";
    chatContent.style.display = " block";
    let resultData = ` <div class="loader">
        <div class="animatedBG"></div>
        <div class="animatedBG"></div>
        <div class="animatedBG"></div>
     </div>`;
     result.innerHTML =resultData;
    
    
    let accessKey ='AIzaSyBw4PldNpQiU2ccLx_5Neb2A0h7hPbWqrI'
    let cx ='0082a744266654257';
    const API_URL = `https://customsearch.googleapis.com/customsearch/v1?q=${question}&key=${accessKey}&cx=${cx}`;
    const response = await fetch(API_URL);
    const data = await response.json();
    console.log(data);
    if (!data.items) {
        result.innerHTML = "<p>No results found</p>";
        return;
    }
    console.log(data.items)
    data.items.forEach(item => {
    const resultItem = document.createElement("div");
    resultItem.classList.add("result-item");
     resultItem.innerHTML = `
        <a href="${item.link}" target="_blank">${item.title}</a>
       <p>${item.snippet}</p>`;
      fragment.appendChild(resultItem);

  });
  
  let search = document.createElement("h3");   
  search.classList.add("searchResult") ;
  search.innerText = `Google search result for: ${question}`;
  fragment.prepend(search)     //jo aaapne ne search kiya hai vo render krvana
  result.innerHTML = "";  //removing loder div
  result.append(fragment);
  }



  async function wikipidi(question) {
    const fragment = document.createDocumentFragment();
    result.innerHTML = "";
    inputArea.value ="";
    startContent.style.display ="none";
    chatContent.style.display = " block";
    let resultData = ` <div class="loader">
        <div class="animatedBG"></div>
        <div class="animatedBG"></div>
        <div class="animatedBG"></div>
     </div>`;
     result.innerHTML =resultData;

     const url = `https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch=${question}&format=json&origin=*`;

    try {
      const response = await fetch(url);
      const data = await response.json();
      console.log(data);
      const dataArray = data.query.search;
      console.log(dataArray)
      dataArray.forEach((data)=>{
        const resultItem = document.createElement("div");
        resultItem.classList.add("result-item");
         resultItem.innerHTML = `
            <a href="https://en.wikipedia.org/wiki/${encodeURIComponent(data.title)}" target="_blank">${data.title}</a>
           <p>${data.snippet}</p>`;
          fragment.appendChild(resultItem)
      })
    } catch (error) {
        result.innerHTML = "<p>Failed to fetch data. Try again later.</p>";
        console.error(error);
    }
    result.innerHTML = "";  //removing loder div
  result.append(fragment);
}
