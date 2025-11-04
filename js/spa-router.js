// SPA Router - управление навигацией без перезагрузки страницы
class SPARouter {
    constructor() {
        this.routes = {
            'home': 'pages/home.html',
            'projects': 'pages/projects.html', 
            'skills': 'pages/skills.html',
            'contact': 'pages/contact.html'
        };
        
        this.currentPage = 'home';
        this.init();
    }

    init() {
        // Обработка навигации по клику
        document.addEventListener('click', (e) => {
            if (e.target.matches('.nav-link')) {
                e.preventDefault();
                const page = e.target.getAttribute('data-page');
                this.navigateTo(page);
            }
            
            // Обработка кнопок с data-page
            if (e.target.matches('.btn[data-page]')) {
                e.preventDefault();
                const page = e.target.getAttribute('data-page');
                this.navigateTo(page);
            }
        });

        // Обработка хэша в URL
        window.addEventListener('hashchange', () => {
            this.handleHashChange();
        });

        // Загрузка начальной страницы
        this.handleHashChange();
    }

    async handleHashChange() {
        const hash = window.location.hash.replace('#', '') || 'home';
        const page = this.routes[hash] ? hash : 'home';
        
        if (page !== this.currentPage) {
            await this.loadPage(page);
            this.updateActiveLink(page);
            this.currentPage = page;
        }
    }

    async navigateTo(page) {
        if (this.routes[page] && page !== this.currentPage) {
            window.location.hash = page;
        }
    }

    async loadPage(page) {
        const contentElement = document.getElementById('app-content');
        
        try {
            contentElement.innerHTML = '<div id="loading">Загрузка...</div>';
            
            const response = await fetch(this.routes[page]);
            if (!response.ok) throw new Error('Страница не найдена');
            
            const html = await response.text();
            contentElement.innerHTML = html;
            
            // Загружаем специфичные для страницы скрипты
            this.loadPageScripts(page);
            
        } catch (error) {
            console.error('Ошибка загрузки страницы:', error);
            contentElement.innerHTML = `
                <div class="error-page">
                    <h2>Ошибка загрузки</h2>
                    <p>Страница временно недоступна</p>
                    <a href="#home" class="btn">На главную</a>
                </div>
            `;
        }
    }

    loadPageScripts(page) {
        // Инициализация специфичных для страницы функций
        switch(page) {
            case 'home':
                this.initHomePage();
                break;
            case 'projects':
                this.initProjectsPage();
                break;
            case 'skills':
                this.initSkillsPage();
                break;
            case 'contact':
                this.initContactPage();
                break;
        }
    }

    initHomePage() {
        // Терминал уже загружен в terminal.js, нужно только переинициализировать если нужно
        console.log('Home page initialized');
    }

    initProjectsPage() {
        // Обработка кликов по проектам
        document.addEventListener('click', (e) => {
            if (e.target.matches('.project-link')) {
                e.preventDefault();
                alert('Подробности скоро появятся. Можно связать с GitHub репозиторием.');
            }
        });
    }

    initSkillsPage() {
        console.log('Skills page initialized');
    }

    initContactPage() {
        // Инициализация формы контактов
        const form = document.getElementById('contact-form');
        if (form) {
            form.addEventListener('submit', (e) => {
                e.preventDefault();
                const name = form.elements['name']?.value || '';
                const email = form.elements['email']?.value || '';
                const msg = form.elements['message']?.value || '';

                alert('Спасибо! Ваше сообщение сохранено локально. (Заглушка отправки)');
                form.reset();
            });
        }
    }

    updateActiveLink(activePage) {
        document.querySelectorAll('.nav-link').forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('data-page') === activePage) {
                link.classList.add('active');
            }
        });
    }
}

// Инициализация роутера когда DOM загружен
document.addEventListener('DOMContentLoaded', () => {
    new SPARouter();
});