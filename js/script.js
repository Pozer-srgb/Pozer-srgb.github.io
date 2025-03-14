document.addEventListener('DOMContentLoaded', () => {
    let isButtonBusy = false;

    const elements = {
        button: document.getElementById('myButton'),
        audio: document.getElementById('clickSound'),
        backToTop: document.getElementById('backToTop')
    };

    elements.audio.preload = 'metadata';

    function updateThemeColor() {
        const metaThemeColor = document.querySelector('meta[name="theme-color"]');
        const themeAnnounce = document.getElementById('theme-announce');
        const isDark = document.body.classList.contains('alternate-theme');

        if (isDark) {
            metaThemeColor.setAttribute('content', '#34495e');
            themeAnnounce.textContent = 'Тёмная тема включена';
        } else {
            metaThemeColor.setAttribute('content', '#2ecc71');
            themeAnnounce.textContent = 'Светлая тема включена';
        }
    }

    const observerConfig = {
        threshold: 0.2,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries, observer) => {
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
            updateThemeColor();
            updateButtonText();
        } else {
            updateThemeColor();
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
        updateThemeColor();

        setTimeout(() => {
            isButtonBusy = false;
        }, 500);
    });

    window.addEventListener ('load', () => {
        elements.button.classList.add('loaded');
    });

    // Скрипт для прогресс бара навыков
    const chartObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const level = entry.target.dataset.level;
                const label = entry.target.querySelector('.sr-only');
                entry.target.style.width = level + '%';
                entry.target.setAttribute('aria-valuenow', level)
                label.textContent = `${entry.target.dataset.skill}: ${level}%`;
            }
        });
    }, {threshold: 0.5});

    document.querySelectorAll('.skill-bar').forEach(bar => {
        chartObserver.observe(bar);
    });

    // Скрипт для кнопки "Наверх"
    if (elements.backToTop) {
        let lastKnownY = 0;
        window.addEventListener('scroll', () => {
            const y = window.pageYOffset || document.documentElement.scrollTop;

            if (Math.abs(y - lastKnownY) > 50) {
                elements.backToTop.classList.toggle('visible', y > 300);
                lastKnownY = y;
            }
        });
    
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Home' && e.ctrlKey) {
            e.preventDefault();
            window.scrollTo({top: 0, behavior: 'smooth'});
        }
    });

        elements.backToTop.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
            setTimeout(() => document.querySelector('h1').focus(), 500);
        });
    } else {
        console.warn('Кнопка "Наверх" не найдена');
    }
});