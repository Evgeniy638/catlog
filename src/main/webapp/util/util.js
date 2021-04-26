export const util = {
    readFilesAsDataURL(arrFiles, callback=results=>{}) {
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
                            src: dataUrl,
                            name: arrFiles[i].name,
                            type: arrFiles[i].type
                        }))
                    );
                }
            }
        });
    }
}
