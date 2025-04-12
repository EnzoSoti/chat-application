document.addEventListener('DOMContentLoaded', function() {
    // Toggle mobile menu
    const mobileMenuToggle = document.getElementById('mobileMenuToggle');
    const mobileMenu = document.getElementById('mobileMenu');
    
    if (mobileMenuToggle && mobileMenu) {
        mobileMenuToggle.addEventListener('click', function() {
            mobileMenu.classList.toggle('hidden');
        });
    }
    
    // Toggle users list on mobile
    const toggleUsersList = document.getElementById('toggleUsersList');
    const usersList = document.getElementById('usersList');
    const closeUsersList = document.getElementById('closeUsersList');
    
    if (toggleUsersList && usersList) {
        toggleUsersList.addEventListener('click', function() {
            usersList.classList.remove('hidden');
            usersList.classList.add('fixed', 'right-0', 'top-0', 'h-full', 'w-64', 'z-50');
        });
    }
    
    if (closeUsersList && usersList) {
        closeUsersList.addEventListener('click', function() {
            usersList.classList.add('hidden');
            usersList.classList.remove('fixed', 'right-0', 'top-0', 'h-full', 'z-50');
        });
    }
    
    // Handle window resize
    window.addEventListener('resize', function() {
        if (window.innerWidth >= 768) { // md breakpoint
            if (usersList) {
                usersList.classList.remove('hidden', 'fixed', 'right-0', 'top-0', 'h-full', 'z-50');
            }
            if (mobileMenu) {
                mobileMenu.classList.remove('hidden');
            }
        } else {
            if (usersList) {
                usersList.classList.add('hidden');
            }
            if (mobileMenu) {
                mobileMenu.classList.add('hidden');
            }
        }
    });
});