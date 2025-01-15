class UXService {
    static notify(message, error) {
        console.error(error);

        // Create a div element for the notification
        const notification = document.createElement('div');
        notification.textContent = message;
        notification.style.position = 'fixed';
        notification.style.top = '10px';
        notification.style.right = '10px';
        notification.style.backgroundColor = 'rgba(255, 0, 0, 0.9)';
        notification.style.color = '#fff';
        notification.style.padding = '10px 20px';
        notification.style.borderRadius = '5px';
        notification.style.fontSize = '14px';
        notification.style.zIndex = '1000';
        notification.style.boxShadow = '0 2px 5px rgba(0, 0, 0, 0.3)';

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
            'hp-warn': hp > 25 && hp <= 50,
            'hp-sufficient': hp > 50 && hp > 50
        }
    }

    static getHPBarStyle(current, total) {
        const hp = Math.floor((current / total) * 100);
        return {
            width: `${hp}%`,
        }
    }
}

export default UXService;