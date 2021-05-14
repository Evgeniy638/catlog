import React, {useState} from "react";
import "./submit-box.css";
import photoCameraIcon from "./photo-camera-icon.svg";
import apiPost from "../../api/apiPost";
import {connect} from "react-redux";
import {userGetters} from "../../bll/reducers/reducerUser";
import {postActionCreator, postThunkCreators} from "../../bll/reducers/reducerPost";
import {util} from "../../util/util";
import Alert from "@material-ui/lab/Alert";

const MAX_SIZE_POST = 500;

const createPost = (props, postForm, authorization, errors, setErrors) => {
    const newErrors = {...errors};

    if(postForm.postText.value === ""){
        newErrors.isEmptyPost = true;
    }

    if(postForm.postText.value.length > MAX_SIZE_POST){
        newErrors.isMaxSizePost = true;
    }

    if (!postForm.postTags.value) {
        newErrors.isEmptyTags = true;
    }

    if (!postForm.postText.value || !postForm.postTags.value || postForm.postText.value.length > MAX_SIZE_POST) {
        setErrors(newErrors);
        return;
    }

    const text = postForm.postText.value;

    const tagList = postForm.postTags.value
        .split(" ").map((tag) => ({name: tag}));

    postForm.postText.value = "";
    postForm.postTags.value = "";

    util.readFilesAsDataURL([...postForm.postFile.files], async (images) => {
        const post = await apiPost.createPost(text, tagList, images, authorization);
        post.avatar = props.avatar;
        props.updateNewPosts(post);
    });
}

const SubmitBox = (props) => {
    const [errors, setErrors] = useState({
        isEmptyPost: false,
        isEmptyTags: false,
        isMaxSizePost: false
    });

    const [imageNames, setImageNames] = useState([]);

    const onChangeImages = (e) => {
        setImageNames([...e.currentTarget.files].map(f => f.name));
    }

    const onSubmit = (e) => {
        e.preventDefault();
        let button = document.querySelector(".submit-box__submit-button");
        let inputField = document.querySelector(".submit-box__post-field");
        button.disabled = true;
        inputField.disabled = true;
        createPost(props, e.currentTarget, props.authorization, errors, setErrors);
        setImageNames([]);
        button.disabled = false;
        inputField.disabled = false;
    }

    if (!props.authorization) {
        return null;
    }

    const onChangeText = (e) => {
        if (errors.isMaxSizePost && e.target.value.length <= MAX_SIZE_POST) {
            setErrors({...errors, isMaxSizePost: false});
        }

        if (errors.isEmptyPost && e.target.value) {
            setErrors({...errors, isEmptyPost: false});
        }
    }

    const onChangeTags = (e) => {
        if (errors.isEmptyTags && e.target.value) {
            setErrors({...errors, isEmptyTags: false});
        }
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
                <textarea
                    name="postText"
                    onChange={onChangeText}
                    className={`
                        submit-box__post-field 
                        ${(errors.isEmptyPost || errors.isMaxSizePost) && "submit-box__post-field_error"}`
                    }
                    placeholder={errors.isEmptyPost ?"Пост не может быть пустым" :"Введите текст..."}>
                </textarea>
                {
                    errors.isMaxSizePost &&
                    <Alert severity="error">
                        Размер поста не может быть больше {MAX_SIZE_POST} сисволов
                    </Alert>
                }
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
                    className={`
                        submit-box__tag-field 
                        ${errors.isEmptyTags && "submit-box__tag-field_error"}`
                    }
                    type="text"
                    onChange={onChangeTags}
                    placeholder={
                        errors.isEmptyTags
                            ? "список тегов не может быть пустым"
                            :"добавьте теги через пробел"
                    }/>
                <button className="submit-box__submit-button" type="submit">Опубликовать</button>
            </div>
        </form>
    );
}

const mapStateToProps = (state) => ({
    authorization: userGetters.getAuthorization(state),
    nickname: userGetters.getNickname(state),
    avatar: userGetters.getAvatar(state)
});

const mapDispatchToProps = (dispatch) => ({
    updateNewPosts(post) {
        dispatch(postActionCreator.updateNewPosts(post))
    }
});

export default connect(mapStateToProps, mapDispatchToProps)(SubmitBox);
