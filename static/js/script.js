document.addEventListener('DOMContentLoaded', function() {
    var socket = io.connect('http://' + document.domain + ':' + location.port);
    var dataBuffer = [];
    var lastUpdateTime = 0;
    var updateInterval = 10000; // 10 секунд

    // Порогові значення температури і вологості
    var temperatureThresholdHigh = 30;
    var temperatureThresholdLow = 20;
    var humidityThresholdHigh = 60;
    var humidityThresholdLow = 20;

    var isStarted = false; // Прапорець для стану старту даних

    var themeButton = document.getElementById('themeButton');

    themeButton.addEventListener('click', function() {
        document.body.classList.toggle('dark'); // Перемикач класу для темної теми
        themeButton.classList.toggle('dark-theme'); // Додати/видалити клас для зміни кольору тексту кнопки
    });

    // Функція для встановлення теми
    function setTheme(theme) {
        if (theme === 'dark') {
            document.body.classList.add('dark-theme'); // Додаємо клас для темної теми
        } else {
            document.body.classList.remove('dark-theme'); // Видаляємо клас для темної теми
        }
    }
    // Функція для встановлення теми
    function setTheme(theme) {
        if (theme === 'dark') {
            document.body.classList.add('dark-theme'); // Додаємо клас для темної теми
            document.getElementById('languageButton').classList.add('dark-theme'); // Додаємо клас для зміни кольору тексту кнопки мови
        } else {
            document.body.classList.remove('dark-theme'); // Видаляємо клас для темної теми
            document.getElementById('languageButton').classList.remove('dark-theme'); // Видаляємо клас для зміни кольору тексту кнопки мови
        }
    }
    
    // Обробник кліку на кнопці теми
    document.getElementById('themeButton').addEventListener('click', function() {
        var currentTheme = document.body.classList.contains('dark-theme') ? 'dark' : 'light';
        var newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        setTheme(newTheme); // Переключаємо на протилежну тему
    });

    socket.on('data_update', function(data) {
        document.getElementById('humidity').innerHTML = 'Humidity: ' + data.humidity + ' %';
        document.getElementById('temperature').innerHTML = 'Temperature: ' + data.temperature + ' *C';
        updateChart(data.humidity, data.temperature);

        // Оновлення сповіщень, якщо дані стартовані
        if (isStarted) {
            updateNotifications(data.humidity, data.temperature, humidityThresholdLow, humidityThresholdHigh, temperatureThresholdLow, temperatureThresholdHigh);
        }

        var currentTime = new Date().getTime();
        dataBuffer.push(data);

        if (isStarted && currentTime - lastUpdateTime >= updateInterval) {
            var timestamp = new Date().toLocaleTimeString();
            var averageHumidity = calculateAverage(dataBuffer, 'humidity');
            var averageTemperature = calculateAverage(dataBuffer, 'temperature');
            updateTable(timestamp, averageHumidity.toFixed(2), averageTemperature.toFixed(2));
            dataBuffer = [];
            lastUpdateTime = currentTime;
        }
    });

    socket.on('connect', function() {
        console.log('Connected to server');
    });

    socket.on('disconnect', function() {
        console.log('Disconnected from server');
    });

    function startData() {
        socket.emit('start_data');
        isStarted = true; // Встановлюємо прапорець старту даних
    }

    function stopData() {
        socket.emit('stop_data');
        isStarted = false; // Скидаємо прапорець старту даних

        // При зупинці системи приховуємо всі сповіщення
        removeNotification('humidityNotification');
        removeNotification('temperatureNotification');
    }

    // Функція для оновлення графіку
    var ctx = document.getElementById('dataChart').getContext('2d');
    var dataChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: [],
            datasets: [
                {
                    label: 'Humidity',
                    borderColor: 'rgba(75, 192, 192, 1)',
                    backgroundColor: 'rgba(75, 192, 192, 0.2)',
                    data: [],
                    yAxisID: 'y'
                },
                {
                    label: 'Temperature',
                    borderColor: 'rgba(255, 99, 132, 1)',
                    backgroundColor: 'rgba(255, 99, 132, 0.2)',
                    data: [],
                    yAxisID: 'y1'
                }
            ]
        },
        options: {
            scales: {
                y: {
                    type: 'linear',
                    position: 'left',
                },
                y1: {
                    type: 'linear',
                    position: 'right',
                    grid: {
                        drawOnChartArea: false,
                    },
                },
            },
        }
    });

    function updateChart(humidity, temperature) {
        const time = new Date().toLocaleTimeString();
        if (dataChart.data.labels.length > 20) {
            dataChart.data.labels.shift();
            dataChart.data.datasets[0].data.shift();
            dataChart.data.datasets[1].data.shift();
        }
        dataChart.data.labels.push(time);
        dataChart.data.datasets[0].data.push(humidity);
        dataChart.data.datasets[1].data.push(temperature);
        dataChart.update();
    }

    // Функція для обчислення середнього значення
    function calculateAverage(buffer, property) {
        if (buffer.length === 0) return 0;
        var sum = buffer.reduce((acc, data) => acc + parseFloat(data[property]), 0);
        return sum / buffer.length;
    }

    // Функція для оновлення таблиці
    function updateTable(timestamp, humidity, temperature) {
        const table = document.getElementById('dataTable').getElementsByTagName('tbody')[0];
        const newRow = table.insertRow();
        const timestampCell = newRow.insertCell(0);
        const humidityCell = newRow.insertCell(1);
        const temperatureCell = newRow.insertCell(2);
        const statusCell = newRow.insertCell(3); // Adding a new status column
    
        timestampCell.innerHTML = timestamp;
        humidityCell.innerHTML = humidity;
        temperatureCell.innerHTML = temperature;
    
        // Determine status based on threshold values
        let status = getStatus(humidity, temperature);
        statusCell.innerHTML = status;
        setStatusColor(status, statusCell);
    }
    
    // Function to determine status based on threshold values
    function getStatus(humidity, temperature) {
        if ((humidity >= humidityThresholdLow && humidity <= humidityThresholdHigh) &&
            (temperature >= temperatureThresholdLow && temperature <= temperatureThresholdHigh)) {
            return "Normal";
        } else if ((humidity < humidityThresholdLow || humidity > humidityThresholdHigh) &&
                   (temperature >= temperatureThresholdLow && temperature <= temperatureThresholdHigh)) {
            return "Warning (Humidity)";
        } else if ((humidity >= humidityThresholdLow && humidity <= humidityThresholdHigh) &&
                   (temperature < temperatureThresholdLow || temperature > temperatureThresholdHigh)) {
            return "Warning (Temperature)";
        } else {
            return "Critical";
        }
    }
    
    // Function to set text color in the status column
    function setStatusColor(status, cell) {
        if (status === "Normal") {
            cell.style.color = "green";
        } else if (status.startsWith("Warning")) {
            cell.style.color = "orange";
        } else {
            cell.style.color = "red";
        }
    }

    // Attach event listeners
    document.getElementById('startButton').addEventListener('click', startData);
    document.getElementById('stopButton').addEventListener('click', stopData);

    // Functions for table buttons
    document.getElementById('showTableButton').addEventListener('click', function() {
        document.getElementById('dataTable').style.display = 'table';
    });

    document.getElementById('clearTableButton').addEventListener('click', function() {
        var tableBody = document.getElementById('dataTable').getElementsByTagName('tbody')[0];
        tableBody.innerHTML = ''; // Clear all rows
    });

    document.getElementById('closeTableButton').addEventListener('click', function() {
        document.getElementById('dataTable').style.display = 'none';
    });

    document.getElementById('dataTable').style.display = 'none';

    // Event listeners for navigation buttons
    document.getElementById('homeButton').addEventListener('click', function(event) {
        event.preventDefault();
        showHomeContent();
    });

    document.getElementById('tableButton').addEventListener('click', function(event) {
        event.preventDefault();
        showTableContent();
    });

    // Event listener for Admin button
    document.getElementById('adminButton').addEventListener('click', function(event) {
        event.preventDefault();
        showAdminContent();
    });

    // Initial display setup
    showHomeContent();

    // Функція показу контенту для "Home"
    function showHomeContent() {
        document.getElementById('data-container').style.display = 'block';
        document.getElementById('chart-section').style.display = 'block';
        document.getElementById('table-section').style.display = 'none';
        document.getElementById('adminPanel').style.display = 'none'; // Приховуємо панель Admin
    }

    // Функція показу контенту для "Table"
    function showTableContent() {
        document.getElementById('data-container').style.display = 'none';
        document.getElementById('chart-section').style.display = 'none';
        document.getElementById('table-section').style.display = 'block';
        document.getElementById('adminPanel').style.display = 'none'; // Приховуємо панель Admin
    }

    // Функція показу контенту для "Admin"
    function showAdminContent() {
        document.getElementById('data-container').style.display = 'none';
        document.getElementById('chart-section').style.display = 'none';
        document.getElementById('table-section').style.display = 'none';
        document.getElementById('adminPanel').style.display = 'block'; // Показуємо панель Admin
    }

    // Функція для збереження порогових значень
    document.getElementById('thresholdForm').addEventListener('submit', function(event) {
        event.preventDefault();
        var humidityLow = parseInt(document.getElementById('humidityLow').value);
        var humidityHigh = parseInt(document.getElementById('humidityHigh').value);
        var temperatureLow = parseInt(document.getElementById('temperatureLow').value);
        var temperatureHigh = parseInt(document.getElementById('temperatureHigh').value);

        // Збереження нових порогових значень
        humidityThresholdLow = humidityLow;
        humidityThresholdHigh = humidityHigh;
        temperatureThresholdLow = temperatureLow;
        temperatureThresholdHigh = temperatureHigh;

        // Приховання панелі після збереження
        showHomeContent();

        // Оновлення сповіщень після зміни порогових значень, якщо система запущена
        if (isStarted) {
            updateNotifications(0, 0, humidityThresholdLow, humidityThresholdHigh, temperatureThresholdLow, temperatureThresholdHigh);
        }
    });
});