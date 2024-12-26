document.addEventListener('DOMContentLoaded', () => {
    // Select all elements with the class `nav-option`
    const navOptions = document.querySelectorAll('.nav-option');

    // Retrieve the previously selected link from localStorage
    const savedSelected = localStorage.getItem('selectedNavOption');

    // If there's a saved selection, apply the `selected` class to it
    if (savedSelected) {
        const savedOption = document.querySelector(`[href="${savedSelected}"]`);
        if (savedOption) savedOption.classList.add('selected');
    }

    // Add click event listeners to each option
    navOptions.forEach(option => {
        option.addEventListener('click', function (event) {
            // Remove the `selected` class from all options
            navOptions.forEach(opt => opt.classList.remove('selected'));

            // Add the `selected` class to the clicked option
            this.classList.add('selected');

            // Save the clicked option's href attribute in localStorage
            const selectedHref = this.getAttribute('href');
            if (selectedHref) {
                localStorage.setItem('selectedNavOption', selectedHref);
            }
        });
    });
});

