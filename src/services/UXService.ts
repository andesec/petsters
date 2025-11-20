import eventBus from '../eventBus';

class UXService {
    static createNotification() {
        if (typeof document === 'undefined') return null;

        const notification = document.createElement('div');
        Object.assign(notification.style, {
            position: 'fixed',
            top: '70px',
            right: '10px',
            color: '#fff',
            padding: '10px 20px',
            borderRadius: '5px',
            fontSize: '15px',
            zIndex: '1000',
            boxShadow: '0 2px 5px rgba(0, 0, 0, 0.3)',
        });

        return notification;
    }

    static error(message: string, error?: any) {
        console.error(error);

        const notification = this.createNotification();
        if (!notification) return;

        notification.textContent = message;
        notification.style.backgroundColor = 'rgba(255, 0, 0, 0.9)';

        const existingNotification = document.querySelector('.ux-notification');
        if (existingNotification) {
            existingNotification.remove();
        }

        notification.classList.add('ux-notification');
        document.body.appendChild(notification);

        setTimeout(() => {
            if (notification) {
                notification.remove();
            }
        }, 3000);
    }

    static notify(message: string) {
        console.info(message);

        const notification = this.createNotification();
        if (!notification) return;

        notification.textContent = message;
        notification.style.backgroundColor = 'rgba(35,174,3,0.9)';

        const existingNotification = document.querySelector('.ux-notification');
        if (existingNotification) {
            existingNotification.remove();
        }

        notification.classList.add('ux-notification');
        document.body.appendChild(notification);

        setTimeout(() => {
            if (notification) {
                notification.remove();
            }
        }, 3000);
    }

    static warn(message: string) {
        console.warn(message);
    }

    static getHPBarClass(current: number, total: number) {
        const hp = Math.floor((current / total) * 100);
        return {
            'hp-bar': true,
            'hp-critical': hp <= 25,
            'hp-warn': hp > 25 && hp <= 60,
            'hp-sufficient': hp > 60
        };
    }

    static getHPBarStyle(current: number, total: number) {
        const hp = Math.floor((current / total) * 100);
        return {
            width: `${hp}%`,
        };
    }

    static showInfo(v: string, i: string | number) {
        eventBus.emit("show-info", { v: v, i: i.toString() });
    }
}

export default UXService;
