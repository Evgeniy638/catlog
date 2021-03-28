const searchInput = document.querySelector(".search-input__input");

searchInput.addEventListener("keypress", async (e) => {
    // нажали на Enter
    if (e.charCode === 13) {
        const posts = await apiPost.filterPostsByTag(searchInput.value);
        createPosts(posts);
    }
});
