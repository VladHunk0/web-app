window.humidityNotificationVisible = false;
window.temperatureNotificationVisible = false;

document.addEventListener('DOMContentLoaded', function() {
    var notificationContainer = document.createElement('div');
    notificationContainer.classList.add('notification-container');
    document.body.appendChild(notificationContainer);
});

function showNotification(type, value) {
    var notification = document.createElement('div');
    notification.classList.add('notification');
    notification.id = type.toLowerCase() + 'Notification';
    notification.innerHTML = `${type} is out of range: ${value}`;
    document.querySelector('.notification-container').appendChild(notification);
}

function updateNotification(id, type, value) {
    var notification = document.getElementById(id);
    if (notification) {
        notification.innerHTML = `${type} is out of range: ${value}`;
    }
}

function removeNotification(id) {
    var notification = document.getElementById(id);
    if (notification) {
        notification.classList.add('fadeOut'); // Додаємо клас для анімації
        setTimeout(function() {
            if (notification) {
                notification.parentNode.removeChild(notification);
                if (id === 'humidityNotification') {
                    window.humidityNotificationVisible = false;
                } else if (id === 'temperatureNotification') {
                    window.temperatureNotificationVisible = false;
                }
            }
        }, 500); // Тривалість анімації зникнення
    }
}

function updateNotifications(humidity, temperature, humidityThresholdLow, humidityThresholdHigh, temperatureThresholdLow, temperatureThresholdHigh) {
    // Сповіщення для вологості
    if (humidity < humidityThresholdLow || humidity > humidityThresholdHigh) {
        if (!window.humidityNotificationVisible) {
            showNotification('Humidity', humidity);
            window.humidityNotificationVisible = true;
        } else {
            updateNotification('humidityNotification', 'Humidity', humidity);
        }
    } else {
        if (window.humidityNotificationVisible) {
            removeNotification('humidityNotification');
        }
    }

    // Сповіщення для температури
    if (temperature < temperatureThresholdLow || temperature > temperatureThresholdHigh) {
        if (!window.temperatureNotificationVisible) {
            showNotification('Temperature', temperature);
            window.temperatureNotificationVisible = true;
        } else {
            updateNotification('temperatureNotification', 'Temperature', temperature);
        }
    } else {
        if (window.temperatureNotificationVisible) {
            removeNotification('temperatureNotification');
        }
    }
}
