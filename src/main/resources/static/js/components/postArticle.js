async function showPosts(){
    let posts = await apiPost.getAllPosts();

    for(let i = 0; i < posts.length; i++){
        const article = document.createElement("div");
        article.classList.add("article");

        const time = new Date(posts[i].time);

        let dd = time.getDate();
        dd = dd < 10 ?`0${dd}` :dd; 

        let mm = time.getMonth() + 1;
        mm = mm < 10 ?`0${mm}` :mm; 

        let yyyy = time.getFullYear(); 

        article.innerHTML = `
            <div class="article__info">
                <div class="article__author">${posts[i].authorNickname}</div>
                <div class="article__time">${dd}.${mm}.${yyyy}</div>
            </div>
            <input type="checkbox" class="article__hiddenchecker" id="article__hiddenchecker${posts[i].id}" />
            <div class="article__text"><p>${posts[i].text}</p></div>
            <div class="article__images"></div>
            <div class="article__bottom"></div>
            </div>
            <label for="article__hiddenchecker${posts[i].id}" class="article__hiddenbutton"></label>
            <div class="article__tags">
            </div>
            <div class="article__like-and-comment-area">${posts[i].countComments} комментариев
                <div>
                <button class="article__comment-button"><img src="./css/article/comment.svg" alt="comment"></button>
                <button class="article__like-button"><img src="./css/article/active_like.svg" alt="like">${posts[i].countLikes}</button>
                </div>
            </div>
        `;
        document.querySelector('.content').appendChild(article);
        let tagsArea = article.querySelector('.article__tags');
        for(let j = 0; posts[i].tagList && j < posts[i].tagList.length; j++){
            const wrap = document.createElement("div");
            wrap.innerHTML = `<div class="article__tag"><a href="">${posts[i].tagList[j].name}</a></div>`;
            const tag = wrap.firstChild;
            tagsArea.appendChild(tag);
        }

        const wrapImages = article.querySelector(".article__images");

        posts[i].images.forEach(({src, name}) => {
           const img =  document.createElement("img");
           img.src = src;
           img.alt = name;
           wrapImages.appendChild(img);
        });

        let textPost = article.querySelector('.article__text');
        let bottomPost = article.querySelector('.article__bottom');
        let labelPost = article.querySelector('.article__hiddenbutton');
        setTimeout(() => {
            if (textPost.scrollHeight <= 350) {
                bottomPost.style.display = "none";
                labelPost.style.display = "none";
            }
        }, 100);
    }
}

window.addEventListener("load", showPosts);
