import { showDetails } from './details.js'

async function getMoviesByID(id) {

    const response = await fetch('http://localhost:3030/data/movies/' + id);
    const data = await response.json();

    return data;
}

async function onSubmit(formData) {

    const body = JSON.stringify({

        title: formData.title,
        description: formData.description,
        img: formData.imageUrl,

    });

    const token = sessionStorage.getItem('authToken');
    if (token == null) {
        return alert('You\'re not logged in');
    }

    try {
        const response = await fetch('http://localhost:3030/data/movies/' + idToFind, {
            method: 'put',
            headers: {
                'Content-Type': 'application/json',
                'X-Authorization': token
            },
            body
        });

        if (response.status == 200) {
            const movie = await response.json();
            showDetails(movie._id);
        } else {
            throw new Error(await response.json());
        }
    } catch (err) {
        console.error(err.message);
    }
}

let main;
let section;
let idToFind;

export function setupEdit(mainTarget, sectionTarget) {
    main = mainTarget;
    section = sectionTarget;

    const form = section.querySelector('form');

    form.addEventListener('submit', (ev => {
        ev.preventDefault();
        const formData = new FormData(ev.target);
        onSubmit([...formData.entries()].reduce((p, [k, v]) => Object.assign(p, {
            [k]: v
        }), {}));
    }));

}

export async function showEdit(id) {

    main.innerHTML = '';
    idToFind = id;
    main.appendChild(section);
    const data = await getMoviesByID(id);
    section.querySelector('[name="title"]').value = data.title;
    section.querySelector('[name="description"]').value = data.description;
    section.querySelector('[name="imageUrl"]').value = data.img;

}