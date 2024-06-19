document.addEventListener('DOMContentLoaded', function() {
    // За замовчуванням встановлюємо англійську мову
    switchToEnglish();

    // Додаємо обробник події для кнопки зміни мови
    document.getElementById('languageButton').addEventListener('click', function() {
        if (document.documentElement.lang === 'en') {
            switchToUkrainian();
        } else {
            switchToEnglish();
        }
    });

    // Функція для зміни мови на українську
    function switchToUkrainian() {
        document.documentElement.lang = 'uk'; // Встановлюємо атрибут lang для української мови
        updateTextContent('uk');
    }

    // Функція для зміни мови на англійську
    function switchToEnglish() {
        document.documentElement.lang = 'en'; // Встановлюємо атрибут lang для англійської мови
        updateTextContent('en');
    }

    // Функція для оновлення тексту на сторінці відповідно до обраної мови
    function updateTextContent(language) {
        if (language === 'uk') {
            document.getElementById('homeButton').innerText = 'Головна';
            document.getElementById('tableButton').innerText = 'Таблиця';
            document.getElementById('adminButton').innerText = 'Адмін';
            document.getElementById('languageButton').innerText = 'Мова';
            document.getElementById('themeButton').innerText = 'Змінити тему';
            document.getElementById('humidity').innerText = 'Вологість: -- %';
            document.getElementById('temperature').innerText = 'Температура: -- *C';
            document.getElementById('startButton').innerText = 'Старт';
            document.getElementById('stopButton').innerText = 'Стоп';
            document.getElementById('showTableButton').innerText = 'Показати таблицю';
            document.getElementById('clearTableButton').innerText = 'Очистити таблицю';
            document.getElementById('closeTableButton').innerText = 'Закрити таблицю';
            document.getElementById('adminPanel').getElementsByTagName('h2')[0].innerText = 'Панель адміністратора';
            document.getElementById('thresholdForm').getElementsByTagName('label')[0].innerText = 'Нижній поріг вологості (%):';
            document.getElementById('thresholdForm').getElementsByTagName('label')[1].innerText = 'Верхній поріг вологості (%):';
            document.getElementById('thresholdForm').getElementsByTagName('label')[2].innerText = 'Нижній поріг температури (°C):';
            document.getElementById('thresholdForm').getElementsByTagName('label')[3].innerText = 'Верхній поріг температури (°C):';
            document.getElementById('thresholdForm').getElementsByTagName('button')[0].innerText = 'Зберегти пороги';

            document.querySelector('#data-container h1').innerText = 'Системне управління';  // System Control
            document.querySelector('#chart-section h2').innerText = 'Графік даних';  // Data Chart
            document.querySelector('#table-section h2').innerText = 'Останні дані';  // Recent Data
            const tableHeaders = document.querySelectorAll('#dataTable thead tr th');
            tableHeaders[0].innerText = 'Часова мітка';  // Timestamp
            tableHeaders[1].innerText = 'Вологість (%)';  // Humidity (%)
            tableHeaders[2].innerText = 'Температура (*C)';  // Temperature (*C)
            tableHeaders[3].innerText = 'Статус';  // Status
        } else {
            // Якщо мова англійська
            document.getElementById('homeButton').innerText = 'Home';
            document.getElementById('tableButton').innerText = 'Table';
            document.getElementById('adminButton').innerText = 'Admin';
            document.getElementById('languageButton').innerText = 'Language';
            document.getElementById('themeButton').innerText = 'Toggle Theme';
            document.getElementById('humidity').innerText = 'Humidity: -- %';
            document.getElementById('temperature').innerText = 'Temperature: -- *C';
            document.getElementById('startButton').innerText = 'Start';
            document.getElementById('stopButton').innerText = 'Stop';
            document.getElementById('showTableButton').innerText = 'Show Table';
            document.getElementById('clearTableButton').innerText = 'Clear Table';
            document.getElementById('closeTableButton').innerText = 'Close Table';
            document.getElementById('adminPanel').getElementsByTagName('h2')[0].innerText = 'Admin Panel';
            document.getElementById('thresholdForm').getElementsByTagName('label')[0].innerText = 'Humidity Low Threshold (%):';
            document.getElementById('thresholdForm').getElementsByTagName('label')[1].innerText = 'Humidity High Threshold (%):';
            document.getElementById('thresholdForm').getElementsByTagName('label')[2].innerText = 'Temperature Low Threshold (°C):';
            document.getElementById('thresholdForm').getElementsByTagName('label')[3].innerText = 'Temperature High Threshold (°C):';
            document.getElementById('thresholdForm').getElementsByTagName('button')[0].innerText = 'Save Thresholds';

            document.querySelector('#data-container h1').innerText = 'System Control';  // System Control
            document.querySelector('#chart-section h2').innerText = 'Data Chart';  // Data Chart
            document.querySelector('#table-section h2').innerText = 'Recent Data';  // Recent Data
            const tableHeaders = document.querySelectorAll('#dataTable thead tr th');
            tableHeaders[0].innerText = 'Timestamp';  // Timestamp
            tableHeaders[1].innerText = 'Humidity (%)';  // Humidity (%)
            tableHeaders[2].innerText = 'Temperature (*C)';  // Temperature (*C)
            tableHeaders[3].innerText = 'Status';  // Status
        }
    }
});