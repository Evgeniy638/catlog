const postForm = document.getElementById('postForm');

function readFilesAsDataURL(arrFiles, callback=results=>{}) {
    const arrResults = [];

    if (arrFiles.length === 0) {
        callback(arrResults);
    }

    arrFiles.forEach(file => {
        const reader = new FileReader();

        reader.readAsDataURL(file);

        reader.onload = () => {
            arrResults.push(reader.result);

            if (arrResults.length === arrFiles.length) {
                callback(
                    arrResults.map((dataUrl, i) => ({
                        dataUrl,
                        name: arrFiles[i].name,
                        type: arrFiles[i].type
                    }))
                );
            }
        }
    });
}

postForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const text = postForm.postText.value;

    const tagList = postForm.postTags.value
        .split(" ").map((tag) => ({name: tag}));

    readFilesAsDataURL([...postForm.postFile.files], async (images) => {
        await apiPost.createPost(text, tagList, images);
        showPosts();
    });
});
