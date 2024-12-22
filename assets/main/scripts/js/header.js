document.addEventListener('DOMContentLoaded', function () {
    // Search functionality
    const searchButton = document.getElementById('searchButton');
    const searchInputContainer = document.getElementById('header-search-input-container');
    const closeButton = document.querySelector('.mobile-search-close');  

    // Toggle active class when search button is clicked
    if (searchButton) {
        searchButton.addEventListener('click', function () {
            searchInputContainer.classList.toggle('active');
        });
    }

    // Remove active class when close button is clicked
    if (closeButton) {
        closeButton.addEventListener('click', function () {
            searchInputContainer.classList.remove('active');
        });
    }

    // Remove active class when clicking outside of the container
    document.addEventListener('click', function (event) {
        if (!searchInputContainer.contains(event.target) && !searchButton.contains(event.target)) {
            searchInputContainer.classList.remove('active');
        }
    });

    // Mobile version menu functionality
    const mobileVersionButton = document.querySelector('.mobile-version-button');
    const mobileVersionCloseButton = document.querySelector('.mobile-version-close-button');
    const headerLinksContainer = document.querySelector('.header-links-container');

    // When the mobile version button is clicked, add 'active' to the header links container
    if (mobileVersionButton && headerLinksContainer) {
        mobileVersionButton.addEventListener('click', function () {
            headerLinksContainer.classList.add('active'); // Adds active class
        });
    }

    // When the close button is clicked, remove 'active' from the header links container
    if (mobileVersionCloseButton && headerLinksContainer) {
        mobileVersionCloseButton.addEventListener('click', function () {
            headerLinksContainer.classList.remove('active'); // Removes active class
        });
    }

    // Optional: Close the menu if clicked outside of the container
    document.addEventListener('click', function (event) {
        if (headerLinksContainer && !headerLinksContainer.contains(event.target) && !mobileVersionButton.contains(event.target)) {
            headerLinksContainer.classList.remove('active'); // Remove active class when clicked outside
        }
    });

    // Toggle active class for header link button
    const headerLinkButton = document.querySelector('.header-link.button');
    const extraDetailsCloseButton = document.querySelector('.header-link-extra-details-close-button');

    if (headerLinkButton) {
        headerLinkButton.addEventListener('click', function () {
            headerLinkButton.classList.add('active'); // Add active class on click
        });
    }

    if (extraDetailsCloseButton) {
        extraDetailsCloseButton.addEventListener('click', function () {
            headerLinkButton.classList.remove('active'); // Remove active class on close
        });
    }
});
