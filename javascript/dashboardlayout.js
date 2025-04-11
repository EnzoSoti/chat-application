document.addEventListener('DOMContentLoaded', function() {
    // Style for chat messages - emphasizing the chat
    const chatMessages = document.getElementById('chatMessages');
    const observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            if (mutation.addedNodes.length) {
                const messages = chatMessages.querySelectorAll('.message');
                messages.forEach(message => {
                    if (message.classList.contains('sent')) {
                        message.classList.add('bg-primary', 'text-white', 'rounded-4', 'p-3', 'mb-4', 'ms-auto');
                        message.style.maxWidth = '80%';
                        // Add shadow for emphasis
                        message.style.boxShadow = '0 2px 5px rgba(0,0,0,0.1)';
                    } else if (message.classList.contains('received')) {
                        message.classList.add('bg-light', 'border', 'rounded-4', 'p-3', 'mb-4', 'me-auto');
                        message.style.maxWidth = '80%';
                        // Add shadow for emphasis
                        message.style.boxShadow = '0 2px 5px rgba(0,0,0,0.1)';
                    }
                    
                    const messageInfo = message.querySelector('.message-info');
                    if (messageInfo) {
                        messageInfo.classList.add('small', 'mb-1');
                    }
                });
            }
        });
    });
    
    observer.observe(chatMessages, { childList: true, subtree: true });
    
    // Style for online users - simple list
    const onlineUsersObserver = new MutationObserver(function(mutations) {
        const onlineUsers = document.querySelectorAll('#onlineUsersList li');
        onlineUsers.forEach(user => {
            if (!user.classList.contains('styled')) {
                user.classList.add('list-group-item', 'border-0', 'py-2', 'd-flex', 'align-items-center', 'styled');
                
                const statusDot = user.querySelector('.online-status');
                if (statusDot) {
                    statusDot.classList.add('bg-success', 'rounded-circle', 'd-inline-block', 'me-2');
                    statusDot.style.width = '8px';
                    statusDot.style.height = '8px';
                }
            }
        });
    });
    
    onlineUsersObserver.observe(document.getElementById('onlineUsersList'), { 
        childList: true, 
        subtree: true 
    });
});