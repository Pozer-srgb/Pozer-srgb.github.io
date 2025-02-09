const handlerFormSubmit = (event) => {
    const form = event.target;
    const loader = form.querySelector('.loader');
    const btnText = form.querySelector('.btn-text');

    if (loader && btnText) {
        loader.style.dispaly = 'block';
        btnText.style.visibility = 'hidden';
    }

    const formData = new FormData(form);

    fetch('your-api-endpoint', {
        method: 'POST',
        body: formData
    })
    .then(response => {
        loader.style.dispaly = 'none';
        btnText.style.visibility = 'visible';
    })
    .catch(error => {
        console.error('Error, error');
    });
};

const initFormLoader = () => {
    const form = document.querySelector('.contact-form');

    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            handlerFormSubmit(e);
        });
    }
};

document.addEventListener('DOMContentLoaded', initFormLoader);