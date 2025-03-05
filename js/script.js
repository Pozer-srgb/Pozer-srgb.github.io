document.addEventListener('DOMContentLoaded', () => {

    let isButtonBusy = false;

    const elements = {
        button: document.getElementById('myButton'),
        audio: document.getElementById('clickSound')
    };

    const observerConfig = {
        threshold: 0.2,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const delay = entry.target.dataset.animateDelay || 0;
                setTimeout(() => {
                    entry.target.classList.add('animate-fadein');
                }, Number(delay));
                observer.unobserve(entry.target);
            }
        });
    }, observerConfig);

    document.querySelectorAll('[data-animate]').forEach(element => {
        observer.observe(element);
    });

    const buttonTexts = {
        true: '🌞 Вернуть тему',
        false: '🌓 Нажми меня!'
    };

    function updateButtonText() {
        const isDark = document.body.classList.contains('alternate-theme');
        elements.button.textContent = buttonTexts[isDark];
        elements.button.setAttribute (
            'aria-label',
            isDark ? 'Включить светлую тему' : 'Включить тёмную тему'
        );
    }

    if (!elements.button) {
        console.error('Кнопка не найдена');
    }

    if (!elements.audio) {
        console.error('Аудио не найдено');
    }

    try {
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme) {
            document.body.classList.add(savedTheme);
            updateButtonText();
        }
    } catch (e) {
        console.log('Не удалось загрузить настройки темы');
    }

    elements.button.addEventListener('click', () => {
        if (isButtonBusy) return;

        isButtonBusy = true;

        elements.audio.play().catch((error) => {
            console.log('Ошибка воспроизведения:', error.message);
            elements.button.setAttribute('aria-label', 'Требуется взаимодействие для звука');
            elements.button.disabled = true;
        });
        document.body.classList.toggle('alternate-theme');
        localStorage.setItem('theme', document.body.classList.contains('alternate-theme') ? 'alternate-theme' : '');
        updateButtonText();

        setTimeout(() => {
            isButtonBusy = false;
        }, 500);
    });

    window.addEventListener ('load', () => {
        elements.button.classList.add('loaded');
    });
});