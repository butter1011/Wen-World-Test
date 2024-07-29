// Function to highlight the active page in the navigation bar
function highlightCurrentPage() {
    const navItems = document.querySelectorAll('.footer .footer-item');
    const currentPage = window.location.pathname;

    navItems.forEach(item => {
        const onclickAttr = item.getAttribute('onclick');
        if (!onclickAttr) return; // Skip if onclick attribute is not present

        const match = onclickAttr.match(/navigateTo\('(.*)'\)/);
        if (!match) return; // Skip if the onclick doesn't match the expected pattern

        const itemPage = match[1];

        if ((itemPage === '' && currentPage === '/') || 
            (itemPage !== '' && currentPage.includes(itemPage))) {
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

// function navigateToHome() {
//     window.location.href = '/';
// }