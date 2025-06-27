document.addEventListener('DOMContentLoaded', function() {
    const chatMessages = document.getElementById('chat-messages');
    const messageInput = document.getElementById('message-input');
    const sendButton = document.getElementById('send-button');
    
    let userName = '';
    let numbersToCalculate = [];
    let waitingForOperation = false;
    

    messageInput.addEventListener('input', function() {
        if (messageInput.value.trim() === '') {
            sendButton.disabled = true;
            sendButton.classList.remove('active');
        } else {
            sendButton.disabled = false;
            sendButton.classList.add('active');
        }
    });
    

    sendButton.addEventListener('click', sendMessage);
    

    messageInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            if (messageInput.value.trim() !== '') {
                sendMessage();
            }
        }
    });
    
    function sendMessage() {
        const messageText = messageInput.value.trim();
        if (messageText === '') return;

        addMessage(messageText, 'user');
        messageInput.value = '';
        sendButton.disabled = true;
        sendButton.classList.remove('active');
        

        showTypingIndicator();
        

        setTimeout(() => {

            removeTypingIndicator();
            

            processUserMessage(messageText);
        }, 1500);
    }
    
    function addMessage(text, sender) {
        const messageElement = document.createElement('div');
        messageElement.classList.add('message', `${sender}-message`);
        
        const contentElement = document.createElement('div');
        contentElement.classList.add('message-content');
        
        if (sender === 'bot') {
            const avatar = document.createElement('img');
            avatar.src = 'assets/bot_avatar.png';
            avatar.classList.add('message-avatar');
            avatar.alt = 'Аватар бота';
            contentElement.appendChild(avatar);
        }
        
        const textElement = document.createElement('div');
        textElement.classList.add('message-text');
        textElement.textContent = text;
        contentElement.appendChild(textElement);
        
        if (sender === 'user') {
            const avatar = document.createElement('img');
            avatar.src = 'assets/user_avatar.png';
            avatar.classList.add('message-avatar');
            avatar.alt = 'Аватар пользователя';
            contentElement.insertBefore(avatar, contentElement.firstChild);
        }
        
        messageElement.appendChild(contentElement);
        
  
        chatMessages.insertBefore(messageElement, chatMessages.firstChild);
        

        messageElement.scrollIntoView({ behavior: 'smooth' });
    }
    
    function showTypingIndicator() {
        const typingElement = document.createElement('div');
        typingElement.classList.add('message', 'bot-message');
        typingElement.id = 'typing-indicator';
        
        const contentElement = document.createElement('div');
        contentElement.classList.add('message-content');
        
        const avatar = document.createElement('img');
        avatar.src = 'assets/bot_avatar.png';
        avatar.classList.add('message-avatar');
        avatar.alt = 'Аватар бота';
        contentElement.appendChild(avatar);
        
        const typingIndicator = document.createElement('div');
        typingIndicator.classList.add('typing-indicator');
        
        for (let i = 0; i < 3; i++) {
            const dot = document.createElement('span');
            typingIndicator.appendChild(dot);
        }
        
        contentElement.appendChild(typingIndicator);
        typingElement.appendChild(contentElement);
        
        chatMessages.insertBefore(typingElement, chatMessages.firstChild);
        typingElement.scrollIntoView({ behavior: 'smooth' });
    }
    
    function removeTypingIndicator() {
        const typingElement = document.getElementById('typing-indicator');
        if (typingElement) {
            typingElement.remove();
        }
    }
    
    function processUserMessage(message) {
        if (waitingForOperation) {
            handleOperation(message);
            return;
        }
        
        if (message.startsWith('/start')) {
            handleStart();
        } else if (message.startsWith('/name:')) {
            handleName(message);
        } else if (message.startsWith('/number:')) {
            handleNumbers(message);
        } else if (message.startsWith('/stop')) {
            handleStop();
        } else if (userName === '') {
            addMessage('Введите команду /start, для начала общения', 'bot');
        } else if (numbersToCalculate.length > 0) {
            addMessage('Пожалуйста, введите операцию (+, -, *, /) для вычисления', 'bot');
            waitingForOperation = true;
        } else {
            addMessage('Я не понимаю, введите другую команду!', 'bot');
        }
    }
    
    function handleStart() {
        userName = '';
        numbersToCalculate = [];
        waitingForOperation = false;
        addMessage('Привет, меня зовут Чат-бот, а как зовут тебя?', 'bot');
    }
    
    function handleName(message) {
        userName = message.replace('/name:', '').trim();
        if (userName) {
            addMessage(`Привет ${userName}, приятно познакомится. Я умею считать, введи числа которые надо посчитать`, 'bot');
        } else {
            addMessage('Пожалуйста, укажи имя после команды /name:', 'bot');
        }
    }
    
    function handleNumbers(message) {
        const numbersStr = message.replace('/number:', '').trim();
        const numbers = numbersStr.split(',').map(num => parseFloat(num.trim()));
        
        if (numbers.length >= 2 && numbers.every(num => !isNaN(num))) {
            numbersToCalculate = numbers;
            addMessage('Пожалуйста, введите операцию (+, -, *, /) для вычисления', 'bot');
            waitingForOperation = true;
        } else {
            addMessage('Пожалуйста, введите как минимум два числа через запятую, например: /number: 5, 3', 'bot');
        }
    }
    
    function handleOperation(operation) {
        if (['+', '-', '*', '/'].includes(operation)) {
            let result;
            const [a, b] = numbersToCalculate;
            
            switch (operation) {
                case '+':
                    result = a + b;
                    break;
                case '-':
                    result = a - b;
                    break;
                case '*':
                    result = a * b;
                    break;
                case '/':
                    result = a / b;
                    break;
            }
            
            addMessage(`Результат: ${a} ${operation} ${b} = ${result}`, 'bot');
            numbersToCalculate = [];
            waitingForOperation = false;
        } else {
            addMessage('Пожалуйста, введите одну из операций: +, -, *, /', 'bot');
        }
    }
    
    function handleStop() {
        addMessage('Всего доброго, если хочешь поговорить пиши /start', 'bot');
        userName = '';
        numbersToCalculate = [];
        waitingForOperation = false;
    }
    
    setTimeout(() => {
        addMessage('Введите команду /start, для начала общения', 'bot');
    }, 500);
});