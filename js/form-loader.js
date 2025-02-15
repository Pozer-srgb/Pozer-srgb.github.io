const showStatusMessage = (form, type, message) => {
    const statusEl = form.querySelector('.form-status');
    if (!statusEl) return;

    statusEl.textContent = message;
    statusEl.className = 'form-status ${type}';
    statusEl.style.display = 'block';

    setTimeout(() => {
        statusEl.style.opacity = '0';
        setTimeout (() => {
            statusEl.style.display = 'none';
            statusEl.style.opacity = '1';
        }, 500);
    }, 3000);
};

const handleFormSubmit = async (event) => {
    event.preventDefault();
    const form = event.target;
    const loader = form.querySelector('.loader');
    const btnText = form.querySelector('.btn-text');
    const submitBtn = form.querySelector('button[type="submit"]');

    try {
        submitBtn.disabled = true;
        if (loader && btnText) {
            loader.style.display = 'block';
            btnText.style.visibility = 'hidden';
        }

        const formData = new FormData(form);

        const response = await fetch(form.action, {
            method: 'POST',
            body: formData,
            headers: {
                'Accept': 'application/json'
            }
        });

        if (!response.ok) throw new Error('Ошибка отправки формы');

        showStatusMessage(form, 'success', 'Сообщение успешно отправлено!');
        form.reset();

    } catch (error) {
        console.error('Error: ', error);
        showStatusMessage (form, 'error', 'Ошибка при отправке. Попробуйте ещё раз.');
    } finally {
        submitBtn.disabled = false;
        if (loader && btnText) {
            loader.style.display = 'none';
            btnText.style.visibility = 'visible';
        }
    }
};

const initFormLoader = () => {
    const forms = document.querySelectorAll('.contact-form');

    forms.forEach(form => {
        form.addEventListener('submit', handleFormSubmit);

        form.addEventListener('input', (e) => {
            if(!e.target.matches('input, textarea')) return;
            e.target.checkValidity();
        });
    });
};

document.addEventListener('DOMContentLoaded', initFormLoader);