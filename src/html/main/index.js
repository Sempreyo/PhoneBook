//import 'bootstrap/dist/css/bootstrap.min.css';
import '../../css/style.less';

let isFav = false,
    parent = document.querySelector('.contact-list'),
    parentFav = document.querySelector('.fav-list'),
    template = parent.removeChild(parent.querySelector('.contact-item')),
    newContact = document.createDocumentFragment(),
    persons = [
    {
        "name": "Henry",
        "phone": "+7 (937) 837-48-48",
        "photo": "/src/images/terminator.jpg"
    },
    {
        "name": "Tom",
        "phone": "+7 (937) 374-74-74",
        "photo": "/src/images/terminator.jpg"
    },
    {
        "name": "Ann",
        "phone": "+7 (999) 837-09-10",
        "photo": "/src/images/terminator.jpg"
    }
];

//Create new sort method for key in object (name)
let compareName = (item, nextItem) => {
    if (item.name < nextItem.name) {
        return -1;
    } else if (item.name > nextItem.name) {
        return 1;
    }
    return 0;
}
persons.sort(compareName);

/*let createElement = (parentTagClass, newTag, newTagClass) => {
    let parent = document.querySelector(parentTagClass);
    let name = document.createElement(newTag);
    name.classList.add(newTagClass);
    parent.appendChild(name);
}*/

//Add new contact
let renderList = () => {
    persons.reduce(function (newContact, elem) {
        let duplicate = template.cloneNode(true);
        duplicate.querySelector('.name').textContent = elem.name;
        duplicate.querySelector('.phone').textContent = elem.phone;

        //Avatar properties
        let img = duplicate.querySelector('.face');
        img.src = elem.photo;
        img.width = 50;
        img.height = 50;

        newContact.appendChild(duplicate);

        return newContact;
    }, newContact);

    parent.appendChild(newContact);
}
renderList();

//Behavior to "favorites-button" and "delete-button"
let setContactBehavior = () => {
    let child = document.querySelectorAll('.contact-item'); //All contacts
    for (let i = 0; i < child.length; i++) {
        //Create onClickButtonFav event
        child[i].querySelector('.fav-btn').onclick = (e) => {
            if (isFav === false) {
                child[i].querySelector('.fav-btn').classList.toggle('fa-heart-o', false);
                child[i].querySelector('.fav-btn').classList.toggle('fa-heart', true);
                isFav = true;

                //Move element to top (in favorites)
                let toFav = parent.removeChild(e.target.closest('li'));
                parentFav.appendChild(toFav);
                parentFav.insertBefore(e.target.closest('li'), parentFav.firstChild);
            } else {
                child[i].querySelector('.fav-btn').classList.toggle('fa-heart', false);
                child[i].querySelector('.fav-btn').classList.toggle('fa-heart-o', true);
                isFav = false;

                //Move element to bottom
                let toContact = parentFav.removeChild(e.target.closest('li'));
                parent.appendChild(toContact);
                parent.insertBefore(e.target.closest('li'), parent.firstChild);
            }
        };

        //Create onClickButtonDel event
        child[i].querySelector('.del-btn').onclick = function () {
            child[i].remove();
        };
    }
}

//Open-close modal window
let modalWin = document.querySelector('.add-contact'),
    addBtn = document.querySelector('#add');
addBtn.onclick = () => {
    modalWin.style.display = 'block';
};
window.onclick = (e) => {
    if (e.target === modalWin) {
        modalWin.style.display = 'none';
    }
};

//Create-button click event
let createContact = () => {
    if (document.getElementById('name-field').value === '') {
        document.getElementById('name-field').placeholder = 'Заполните поле!';
    } else if (document.getElementById('phone-field').value === '') {
        document.getElementById('phone-field').placeholder = 'Заполните поле!';
    } else {
        let oldContact = document.querySelector('.contact-item');
        newContact = oldContact.cloneNode(true);
        newContact.querySelector('.name').innerHTML = document.getElementById('name-field').value;
        newContact.querySelector('.phone').innerHTML = document.getElementById('phone-field').value;
        modalWin.style.display = 'none';
        let addFavBtn = newContact.querySelector('.fav-btn');
        if (document.getElementById('isFavorites').checked) {
            addFavBtn.classList.toggle('fa-heart-o', false);
            addFavBtn.classList.toggle('fa-heart', true);
            parentFav.appendChild(newContact);
        } else {
            addFavBtn.classList.toggle('fa-heart', false);
            addFavBtn.classList.toggle('fa-heart-o', true);
            parent.appendChild(newContact);
        }
        document.getElementById('name-field').value = '';
        document.getElementById('phone-field').value = '';
        setContactBehavior();
    }
};

//Sort contacts by ascending
document.body.onclick = function (e) {
    let target = e.target;

    sortContacts(target);
};
let sortContacts = () => {
    let child = document.querySelectorAll('.contact-item'),
        parent = document.querySelector('.contact-list'),
        //parentFav = document.querySelector('.fav-list'),
        mass = [];
    for (let i = 0; i < child.length; i++) {
        mass.push(parent.removeChild(child[i]));
    }
    mass.sort(compareContacts).forEach(function (node) {
        parent.appendChild(node);
    });
};
let compareContacts = (a,b) => {
    let first = a.querySelector('.info').querySelector('.name').innerHTML,
        second = b.querySelector('.info').querySelector('.name').innerHTML;
    if (first < second) return -1;
    if (first > second) return 1;
    return 0;
}

//Filter by "contact name" field
let setFilter = () => {
    let child = document.querySelectorAll('.contact-item');
    for (let i = 0; i < child.length; i++) {
        let filter = document.getElementById('search').value.toLowerCase();
        let nameValue = child[i].querySelector('.info').querySelector('.name').innerHTML;
        if (nameValue.toLowerCase().indexOf(filter) > -1) {
            child[i].style.display = '';
        } else {
            child[i].style.display = 'none';
        }
    }
}

//Put a mask on a "phone" field
$(document).ready(() => {
    $('#name-field').inputmask({'placeholder': ''});
    $('#phone-field').inputmask('+7 (999) 999-99-99');
});

document.getElementById('search').onkeyup = setFilter;
document.getElementById('create-btn').addEventListener('click',createContact);
setContactBehavior();