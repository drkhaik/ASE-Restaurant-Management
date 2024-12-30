document.addEventListener('DOMContentLoaded', () => {
    // Select all elements with the class `nav-option`
    const navOptions = document.querySelectorAll('.nav-option');

    navOptions.forEach(opt => opt.classList.remove('selected'));
    // Retrieve the current location of the website (current page's URL)
    const currentLocation = window.location.pathname;

    // Set the default selected navigation link based on the current URL
    navOptions.forEach(option => {
        const href = option.getAttribute('href');
        
        // If the href matches the current location, add the `selected` class
        if (href === currentLocation) {
            option.classList.add('selected');
        }
    });
});
