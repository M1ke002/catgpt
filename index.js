const input = document.getElementsByTagName("textarea")[0];
const submitBtn = document.getElementById("submitBtn");
const newChatBtns = document.getElementsByClassName("new-chat-btn");
const menuBtn = document.getElementById("menu-btn");
const closeMenuBtn = document.getElementById("close-btn-mobile");
const sideMenu = document.getElementById("left-menu");
const chatSection = document.getElementById("chat-section");
const blurBackground = document.getElementById("blur");
let hideContent = false;
let showSideMenu = false;

const getRandomInt = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1) + min);
};

const generateMessage = async (parent, placeholder, message) => {
  let text = "";
  let index = 0;
  const cursor = "█";
  let cursorCounter = 0;

  const paragraph = document.createElement("p");
  placeholder.appendChild(paragraph);

  //set the cursor interval
  const intervalId = setInterval(() => {
    if (index === 0) {
      //first time then just one character which is the cursor
      paragraph.innerHTML = cursorCounter < 10 ? cursor : "";
    } else {
      paragraph.innerHTML += cursorCounter < 10 ? cursor : "";
    }
    cursorCounter++;
    if (cursorCounter >= 20) cursorCounter = 0;
    if (index >= message.length) {
      clearInterval(intervalId);
      paragraph.innerHTML = text;
    }
  }, 50);

  //function to type the characters
  const typeReply = () => {
    if (index < message.length) {
      //add 1-5 characters each time
      const numberOfCharacters = getRandomInt(1, 5);
      text += message.slice(index, index + numberOfCharacters);
      index += numberOfCharacters;
      paragraph.innerHTML = text;
      parent.scrollIntoView();
      setTimeout(typeReply, 50);
    } else {
      console.log("done");
    }
  };

  const data = await getCatImage();

  //create img element
  const img = document.createElement("img");
  img.src = data.url;
  img.width = "350";
  img.height = "250";
  img.classList.add("cat-img");
  img.alt = "cat image";

  placeholder.prepend(img);

  //start the typing
  setTimeout(typeReply, 200);
};

const generateMeowString = (userInput) => {
  const MIN_SENTENCES = 1;
  const MAX_SENTENCES = 10;
  const MIN_WORDS = 1;
  const MAX_WORDS = 10;
  let punctuationMark;

  if (userInput.toLowerCase() === "mitty vien") return "*pees*";

  const mood = getRandomInt(0, 5);

  if (mood === 0) {
    return "MEOWWW!@#";
  } else if (mood === 1) {
    return "...zzzz";
  }

  let numSentences = getRandomInt(MIN_SENTENCES, MAX_SENTENCES);
  let sentences = [];

  for (let i = 0; i < numSentences; i++) {
    let numWords = getRandomInt(MIN_WORDS, MAX_WORDS);
    let sentence = "";

    for (let j = 0; j < numWords; j++) {
      let sentencePrefix = "";
      if (j === 0) {
        //if prev sentence's last character is a comma or dash -> not capital letter
        if (sentences.length > 0) {
          const lastChar = sentences[sentences.length - 1].trim().slice(-1);
          sentencePrefix =
            lastChar == "," || lastChar === "-" ? "meow " : "Meow ";
        } else {
          sentencePrefix = "Meow ";
        }
      } else {
        sentencePrefix = "meow ";
      }
      sentence += sentencePrefix;
    }

    if (i !== numSentences - 1) {
      //50% chance of getting ','
      if (Math.random() < 0.5) {
        punctuationMark = ",";
      } else {
        punctuationMark = ["!", ".", " -"][getRandomInt(0, 2)];
      }
      sentence = sentence.trim() + punctuationMark;
    }

    sentences.push(sentence.trim());
  }
  // end with '.' or '!'
  const lastPunctuationMark = getRandomInt(0, 1) === 0 ? "." : "!";
  return sentences.join(" ") + lastPunctuationMark;
};

const getCatImage = async () => {
  const res = await fetch("https://api.thecatapi.com/v1/images/search");
  const data = await res.json();
  return data[0];
};

const createUserChatElement = (userInput) => {
  if (userInput.trim() === "") return;
  if (!hideContent) {
    //first time chat
    hideContent = true;
    document.getElementById("content").classList.add("hide");
  } else {
    //remove previous reply's margin bottom
    const prevReply = chatSection.lastElementChild;
    prevReply.style.marginBottom = "0";
  }
  const html = `
        <div class="text">
            <img
            src="./assets/user.png"
            alt=""
            class="avatar"
            />
            <p>${userInput}</p>
        </div>
    `;
  const htmlElement = document.createElement("div");
  htmlElement.classList.add("user-chat");
  htmlElement.innerHTML = html;
  chatSection.appendChild(htmlElement);
  createBotReplyElement(userInput);
};

const createBotReplyElement = async (userInput) => {
  const numberOfChildren = chatSection.childElementCount;
  const message = generateMeowString(userInput);
  const html = `
            <div class="text">
                <img
                    src="./assets/mit.jpg"
                    alt=""
                    class="avatar"
                />
                <div id="reply-message-${numberOfChildren}">
                </div>
            </div>
        `;
  const htmlElement = document.createElement("div");
  htmlElement.classList.add("chat-reply");
  htmlElement.style.marginBottom = "200px";
  htmlElement.innerHTML = html;
  chatSection.appendChild(htmlElement);
  htmlElement.scrollIntoView();

  const placeholder = document.getElementById(
    `reply-message-${numberOfChildren}`
  );

  generateMessage(htmlElement, placeholder, message);
};

submitBtn.onclick = () => {
  createUserChatElement(input.value);
  input.value = "";
};

for (let i = 0; i < newChatBtns.length; i++) {
  const newChatBtn = newChatBtns[i];
  newChatBtn.onclick = () => {
    if (hideContent) {
      hideContent = false;
      chatSection.innerHTML = null;
      document.getElementById("content").classList.remove("hide");
    }
  };
}

const closeMenu = () => {
  console.log("clicked");
  if (showSideMenu) {
    blurBackground.style.opacity = 0;
    setTimeout(() => {
      blurBackground.style.display = "none";
    }, 500);
    sideMenu.style.marginLeft = "-350px";
    showSideMenu = false;
  }
};

menuBtn.onclick = () => {
  if (!showSideMenu) {
    blurBackground.style.display = "block";
    setTimeout(() => {
      blurBackground.style.opacity = 1;
    }, 0);
    sideMenu.style.marginLeft = "0";
    showSideMenu = true;
  }
};

blurBackground.onclick = closeMenu;
closeMenuBtn.onclick = closeMenu;
