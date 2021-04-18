import React, {useEffect, useState} from "react";
import "./search-input.css";
import apiPost from "../../../api/apiPost";

const SearchInput = () => {
    const [tags, setTags] = useState("");
    const onChange = (e) => {
        setTags(e.target.value);
    }

    const [tagMatches, setTagMatches] = useState([]);

    useEffect(() => {
        (async () => {
            setTagMatches(await apiPost.findMatchesByTags(tags.split(" ")));
        })();
    }, [tags]);

    const [isActive, setIsActive] = useState(false);

    return (
        <div className="search-input">
            <input
                className={`search-input__input 
                    ${isActive && "search-input__input_active"}
                    ${isActive && tags !== "" && "search-input__input_active-with-list"}`}
                placeholder="введите тег"
                value={tags}
                onChange={onChange}
                onFocus={() => setIsActive(true)}
                onBlur={() => setIsActive(false)}
            />

            <ul className={`search-input__list ${!isActive && "search-input__list_close"}`}>
                {
                    tagMatches.map(tag => (
                        <li key={tag} className="search-input__item-list">
                            {tag}
                        </li>
                    ))
                }

                {
                    tagMatches.length === 0 && tags !== "" &&
                    <li className="search-input__item-not-found">
                        Ничего не найдено
                    </li>
                }
            </ul>
        </div>
    );
}

export default SearchInput;
