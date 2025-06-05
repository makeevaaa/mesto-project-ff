import { setLike, unSetLike } from "./api.js";

async function likeCard(item, cardLike, cardLikeCount) {
    if (cardLike.classList.contains('card__like-button_is-active')) {
        try {
            const likeCount = await unSetLike(item._id);
            cardLike.classList.remove('card__like-button_is-active');
            cardLikeCount.textContent = likeCount.likes.length;
        } catch (error) {
            console.error('Ошибка при снятии лайка:', error);
        }
    } else {
        try {
            const likeCount = await setLike(item._id);   
            cardLike.classList.add('card__like-button_is-active');
            cardLikeCount.textContent = likeCount.likes.length;
        } catch (error) {
            console.error('Ошибка при установке лайка:', error);
        }
    }
}

export function createCard(userId, item, { deleteCard, imageClick }) {
    const cardTemplate = document.querySelector('#card-template').content;
    const cardElement = cardTemplate.querySelector('.card').cloneNode(true);
    const cardDeleteButton = cardElement.querySelector('.card__delete-button');
    const cardTitle = cardElement.querySelector('.card__title');
    const cardImage = cardElement.querySelector('.card__image');
    const cardLike = cardElement.querySelector('.card__like-button');
    const cardLikeCount = cardElement.querySelector('.card__like-count');

    if (userId !== item.owner._id) {
        cardElement.removeChild(cardDeleteButton);
    }

    cardTitle.textContent = item.name;
    cardImage.src = item.link;
    cardImage.alt = item.name;
    cardLikeCount.textContent = item.likes.length;

    if (item.likes.some(like => like._id === userId)) {
        cardLike.classList.add('card__like-button_is-active');
    } else {
        cardLike.classList.remove('card__like-button_is-active');
    }

    cardDeleteButton.addEventListener('click', () => deleteCard(item._id, cardElement));
    cardLike.addEventListener('click', () => likeCard(item, cardLike, cardLikeCount));
    cardImage.addEventListener('click', () => {
        imageClick(cardImage.src, cardImage.alt);
    });

    return cardElement;
}