import React, {useEffect, useRef, useState} from "react";
import "./search-input.css";
import apiPost from "../../../api/apiPost";
import {Link} from "react-router-dom";

const SearchInput = () => {
    const refSearchInput = useRef(null);

    const [tags, setTags] = useState("");
    const onChange = (e) => {
        setTags(e.target.value);
    }

    const [tagMatches, setTagMatches] = useState([]);

    useEffect(() => {
        (async () => {
            if (!tags) {
                setTagMatches([]);
                return;
            }
            setTagMatches(await apiPost.findMatchesByTags(tags.split(" ")));
        })();
    }, [tags]);

    const [isActive, setIsActive] = useState(false);

    const onFocus = () => {
        setIsActive(true);

        window.addEventListener("click", onBlur);
    }

    const onBlur = (e) => {
        const clickedSearchField = e.target.closest(".search-input");
        if (clickedSearchField === refSearchInput.current) return;
        setIsActive(false);
        window.removeEventListener("click", onBlur);
    }

    const onClickByLink = () => {
        setIsActive(false);
        window.removeEventListener("click", onBlur);
        setTags("");
    }

    return (
        <div className="search-input" ref={refSearchInput}>
            <input
                className={`search-input__input 
                    ${isActive && "search-input__input_active"}
                    ${isActive && tags !== "" && "search-input__input_active-with-list"}`}
                placeholder="введите тег"
                value={tags}
                onChange={onChange}
                onFocus={onFocus}
            />

            <ul className={`search-input__list ${!isActive && "search-input__list_close"}`}>
                {
                    tagMatches.map(tag => (
                        <li key={tag} className="search-input__item-list">
                            <Link
                                className="search-input__item-link"
                                to={`/home/${tag}`}
                                onClick={onClickByLink}
                            >
                                {tag}
                            </Link>
                        </li>
                    ))
                }

                {
                    tagMatches.length === 0 && tags !== "" &&
                    <li className="search-input__item-link search-input__item-not-found">
                        Ничего не найдено
                    </li>
                }
            </ul>
        </div>
    );
}

export default SearchInput;
