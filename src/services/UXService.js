import EventBus from "@/eventBus.js";

class UXService {
    static createNotification() {
        // Create a div element for the notification
        const notification = document.createElement('div');
        notification.style.position = 'fixed';
        notification.style.top = '70px';
        notification.style.right = '10px';
        notification.style.color = '#fff';
        notification.style.padding = '10px 20px';
        notification.style.borderRadius = '5px';
        notification.style.fontSize = '15px';
        notification.style.zIndex = '1000';
        notification.style.boxShadow = '0 2px 5px rgba(0, 0, 0, 0.3)';

        return notification;
    }

    static error(message, error) {
        console.error(error);

        const notification = this.createNotification()
        notification.textContent = message;
        notification.style.backgroundColor = 'rgba(255, 0, 0, 0.9)';

        // Remove any existing notification before showing a new one
        const existingNotification = document.querySelector('.ux-notification');
        if (existingNotification) {
            existingNotification.remove();
        }

        // Add a class to identify the notification
        notification.classList.add('ux-notification');

        // Add the notification to the document body
        document.body.appendChild(notification);

        // Remove the notification after a few seconds
        setTimeout(() => {
            if (notification) {
                notification.remove();
            }
        }, 3000);
    }

    static notify(message) {
        console.info(message);

        const notification = this.createNotification()
        notification.textContent = message;
        notification.style.backgroundColor = 'rgba(35,174,3,0.9)';

        // Remove any existing notification before showing a new one
        const existingNotification = document.querySelector('.ux-notification');
        if (existingNotification) {
            existingNotification.remove();
        }

        // Add a class to identify the notification
        notification.classList.add('ux-notification');

        // Add the notification to the document body
        document.body.appendChild(notification);

        // Remove the notification after a few seconds
        setTimeout(() => {
            if (notification) {
                notification.remove();
            }
        }, 3000);
    }

    static warn(message) {
        console.warn(message)
    }

    static getHPBarClass(current, total) {
        const hp = Math.floor((current / total) * 100);
        return {
            'hp-bar': true,
            'hp-critical': hp <= 25,
            'hp-warn': hp > 25 && hp <= 60,
            'hp-sufficient': hp > 60
        }
    }

    static getHPBarStyle(current, total) {
        const hp = Math.floor((current / total) * 100);
        return {
            width: `${hp}%`,
        }
    }

    static showInfo(v, i) {
        console.log("showing info" + {v: v, i:i})
        EventBus.emit("show-info", {v: v, i:i});
    }
}

export default UXService;