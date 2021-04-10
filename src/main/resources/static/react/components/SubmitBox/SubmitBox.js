import React, {useState} from "react";
import "./submit-box.css";
import photoCameraIcon from "./photo-camera-icon.svg";
import apiPost from "../../api/apiPost";
import {connect} from "react-redux";
import {userGetters} from "../../bll/reducers/reducerUser";
import {postActionCreator, postThunkCreators} from "../../bll/reducers/reducerPost";
import {loginActionCreators} from "../../bll/reducers/reducerLogin";

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
                        src: dataUrl,
                        name: arrFiles[i].name,
                        type: arrFiles[i].type
                    }))
                );
            }
        }
    });
}

const createPost = (props, postForm, authorization) => {
    const text = postForm.postText.value;

    const tagList = postForm.postTags.value
        .split(" ").map((tag) => ({name: tag}));

    readFilesAsDataURL([...postForm.postFile.files], async (images) => {
        await apiPost.createPost(text, tagList, images, authorization);
        props.getPosts();
    });
}

const SubmitBox = (props) => {
    const [imageNames, setImageNames] = useState([]);

    const onChangeImages = (e) => {
        setImageNames([...e.currentTarget.files].map(f => f.name));
    }

    const onSubmit = (e) => {
        e.preventDefault();
        createPost(props, e.currentTarget, props.authorization);
    }

    if (!props.authorization) {
        return null;
    }

    return (
        <form
            onSubmit={onSubmit}
            className="submit-box"
            encType="multipart/form-data"
            action="#"
        >
            <div className="submit-box__author">{props.nickname}</div>
            <div>
                <textarea name="postText" className="submit-box__post-field" placeholder="Введите текст..."></textarea>
            </div>
            {
                imageNames.length > 0 &&
                <p className="submit-box__image-names">
                    {
                        imageNames.map(n => (
                            <span className="submit-box__image-name-span">{n}</span>
                        ))
                    }
                </p>
            }
            <div className="submit-box__submit-area">
                <label className="submit-box__photo-button">
                    <img src={photoCameraIcon} alt="photo"/>
                    <input
                        type="file"
                        name="postFile"
                        style={{display: "none"}}
                        onChange={onChangeImages}
                        multiple
                        accept="image/jpg, image/jpeg, image/png"
                    />
                </label>
                <input
                    name="postTags"
                    className="submit-box__tag-field"
                    type="text"
                    placeholder="добавьте теги через пробел"/>
                <button className="submit-box__submit-button" type="submit">Опубликовать</button>
            </div>
        </form>
    );
}

const mapStateToProps = (state) => ({
    authorization: userGetters.getAuthorization(state),
    nickname: userGetters.getNickname(state)
});

const mapDispatchToProps = (dispatch) => ({
    updateNewPosts(post) {
        dispatch(postActionCreator.updateNewPosts(post))
    },

    getPosts(){
        dispatch(postThunkCreators.getPosts())
    }
});

export default connect(mapStateToProps, mapDispatchToProps)(SubmitBox);
