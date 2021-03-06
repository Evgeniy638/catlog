const postForm = document.getElementById('postForm');

postForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const text = postForm.postText.value;

    const tagList = postForm.postTags.value
        .split(" ").map((tag) => ({name: tag}));

    console.log(text, tagList);
    apiPost.createPost(text, tagList);
});
