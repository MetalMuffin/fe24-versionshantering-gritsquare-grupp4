import { db } from './firebase-config.js';  
import { collection, query, orderBy, onSnapshot, addDoc, serverTimestamp } from 'https://www.gstatic.com/firebasejs/9.6.0/firebase-firestore.js';
import { addRemoveButton } from './removeshake.js';

document.addEventListener('DOMContentLoaded', function () {
    const sendButton = document.getElementById('sendButton');
    sendButton.addEventListener('click', sendMessage);

    // Listen to new messages
    const q = query(collection(db, 'publicChat'), orderBy('timestamp'));

    onSnapshot(q, (snapshot) => {
        const messagesDiv = document.getElementById('messages');
        messagesDiv.innerHTML = '';

        snapshot.forEach(doc => {
            const msg = doc.data();
            
            //console.log('Meddelande:', doc.key);  
            console.log('Meddelande:', doc.id);  
            displayMessage(msg, doc.id);
        });
    });
});

function sendMessage() {
    const name = document.getElementById('name').value.trim();
    const message = document.getElementById('message').value.trim();
    const textColor = document.getElementById('textColor').value;

    if (!name || !message) {
        alert('Please enter both name and message');
        return;
    }

    addDoc(collection(db, 'publicChat'), {
        name: name,
        text: message,
        color: textColor,
        timestamp: serverTimestamp()
    })
        .then(() => {
            console.log('Meddelande skickat');
            document.getElementById('message').value = '';
        })
        .catch(error => {
            console.error("Error sending message: ", error);
            alert("Error sending message. Check console for details.");
        });
}

function displayMessage(msg,key) {
    const messagesDiv = document.getElementById('messages');
    const messageDiv = document.createElement('div');
    
    messageDiv.setAttribute("data-id",key)
    messageDiv.className = 'message received';
    messageDiv.innerHTML = `
        <div class="message-header">
            <span class="message-author">${msg.name}</span>
            <span class="message-time">${formatTime(msg.timestamp)}</span>
        </div>
        <div class="message-content" style="color: ${msg.color || '#000'}">${msg.text}</div>
    `;

         console.log(messageDiv);
    
    messagesDiv.appendChild(messageDiv);
    addRemoveButton(messageDiv,key);
    messagesDiv.scrollTop = messagesDiv.scrollHeight;
}

function formatTime(timestamp) {
    const date = timestamp?.toDate() || new Date();
    return `${date.toLocaleDateString()} ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
}


