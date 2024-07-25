// Function to highlight the active page in the navigation bar
function highlightCurrentPage() {
    const navItems = document.querySelectorAll('.footer .footer-item');
    const currentPage = window.location.pathname;

    navItems.forEach(item => {
        const itemPage = item.getAttribute('onclick').match(/navigateTo\('(.*)'\)/);
        if ((itemPage === '' && currentPage === '/') || currentPage.includes(itemPage)) {
            item.classList.add('active');
        } else {
            item.classList.remove('active');
        }
    });
}

// Call the function on page load
highlightCurrentPage();

function navigateTo(page) {
    window.location.href = `/${page}`;
}

function navigateToHome() {
    window.location.href = '/';
}