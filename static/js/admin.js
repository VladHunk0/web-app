document.addEventListener('DOMContentLoaded', function() {
    var adminForm = document.getElementById('adminForm');

    adminForm.addEventListener('submit', function(event) {
        event.preventDefault();

        var formData = new FormData(adminForm);

        fetch('/admin', {
            method: 'POST',
            body: formData
        })
        .then(response => {
            if (response.ok) {
                alert('Settings saved successfully');
            } else {
                alert('Failed to save settings');
            }
        })
        .catch(error => {
            console.error('Error saving settings:', error);
            alert('Failed to save settings');
        });
    });
});
