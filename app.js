// State Management
let currentDate = new Date();
let posts = [];
let editingId = null;
let firebaseReady = false;

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    if (typeof db !== 'undefined') {
        firebaseReady = true;
        setupFirebaseListener();
    } else {
        console.error('Firebase não foi inicializado');
        loadPostsLocal();
    }
    
    renderCalendar();
    updateStats();
    renderPosts();
    setupEventListeners();
    requestNotificationPermission();
    checkReminders();
});

function setupEventListeners() {
    document.getElementById('addPostBtn').addEventListener('click', openModal);
    document.getElementById('prevMonth').addEventListener('click', () => changeMonth(-1));
    document.getElementById('nextMonth').addEventListener('click', () => changeMonth(1));
    document.getElementById('postForm').addEventListener('submit', handleSubmit);
    
    const modal = document.getElementById('modal');
    document.querySelector('.close-modal').addEventListener('click', closeModal);
    document.querySelector('.cancel-btn').addEventListener('click', closeModal);
    
    modal.addEventListener('click', (e) => {
        if (e.target === modal) closeModal();
    });
}

function setupFirebaseListener() {
    const ref = db.ref('posts');
    ref.on('value', (snapshot) => {
        const data = snapshot.val();
        posts = data ? Object.values(data) : [];
        updateStats();
        renderCalendar();
        renderPosts();
    });
}

function savePost(postData) {
    if (!firebaseReady) {
        savePostLocal(postData);
        return Promise.resolve();
    }
    const ref = db.ref('posts/' + postData.id);
    return ref.set(postData);
}

function deletePostFromFirebase(id) {
    if (!firebaseReady) {
        deletePostLocal(id);
        return Promise.resolve();
    }
    return db.ref('posts/' + id).remove();
}

function loadPostsLocal() {
    const stored = localStorage.getItem('youtubePosts');
    posts = stored ? JSON.parse(stored) : [];
}

function savePostLocal(postData) {
    if (editingId) {
        const index = posts.findIndex(p => p.id === editingId);
        if (index !== -1) posts[index] = postData;
    } else {
        posts.push(postData);
    }
    localStorage.setItem('youtubePosts', JSON.stringify(posts));
    updateStats(); renderCalendar(); renderPosts();
}

function deletePostLocal(id) {
    posts = posts.filter(p => p.id !== id);
    localStorage.setItem('youtubePosts', JSON.stringify(posts));
    updateStats(); renderCalendar(); renderPosts();
}

function renderCalendar() {
    const calendar = document.getElementById('calendar');
    const monthTitle = document.getElementById('currentMonth');
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    
    monthTitle.textContent = currentDate.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' }).replace(/^\w/, c => c.toUpperCase());
    calendar.innerHTML = '';
    
    const days = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
    days.forEach(day => {
        const dayEl = document.createElement('div');
        dayEl.className = 'calendar-day header';
        dayEl.textContent = day;
        calendar.appendChild(dayEl);
    });
    
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const prevMonthDays = new Date(year, month, 0).getDate();
    
    for (let i = firstDay - 1; i >= 0; i--) calendar.appendChild(createDayElement(prevMonthDays - i, true));
    for (let day = 1; day <= daysInMonth; day++) calendar.appendChild(createDayElement(day, false, year, month));
    
    const remainingDays = 42 - (firstDay + daysInMonth);
    for (let day = 1; day <= remainingDays; day++) calendar.appendChild(createDayElement(day, true));
}

function createDayElement(day, isOtherMonth, year, month) {
    const dayEl = document.createElement('div');
    dayEl.className = 'calendar-day';
    
    if (isOtherMonth) {
        dayEl.classList.add('other-month');
    } else {
        const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
        const today = new Date().toISOString().split('T')[0];
        
        if (dateStr === today) dayEl.classList.add('today');
        
        const dayPosts = posts.filter(p => p.date === dateStr);
        if (dayPosts.length > 0) {
            dayEl.classList.add('has-post');
            if (dayPosts.some(p => p.isPosted)) dayEl.classList.add('posted');
            const indicator = document.createElement('div');
            indicator.className = 'post-indicator';
            dayEl.appendChild(indicator);
            dayEl.addEventListener('click', () => editPost(dayPosts[0].id));
        } else {
            dayEl.addEventListener('click', () => openModalForDate(dateStr));
        }
    }
    const dayNumber = document.createElement('div');
    dayNumber.className = 'day-number';
    dayNumber.textContent = day;
    dayEl.appendChild(dayNumber);
    return dayEl;
}

function changeMonth(delta) {
    currentDate.setMonth(currentDate.getMonth() + delta);
    renderCalendar();
}

function openModal() {
    editingId = null;
    document.getElementById('modalTitle').textContent = 'Nova Postagem';
    document.getElementById('postForm').reset();
    document.getElementById('postDate').valueAsDate = new Date();
    document.getElementById('modal').classList.add('active');
}

function openModalForDate(date) {
    openModal();
    document.getElementById('postDate').value = date;
}

function closeModal() {
    document.getElementById('modal').classList.remove('active');
    editingId = null;
}

function editPost(id) {
    const post = posts.find(p => p.id === id);
    if (!post) return;
    
    editingId = id;
    document.getElementById('modalTitle').textContent = 'Editar Postagem';
    document.getElementById('videoTitle').value = post.title;
    document.getElementById('postDate').value = post.date;
    document.getElementById('postTime').value = post.time;
    document.getElementById('videoUrl').value = post.url || '';
    document.getElementById('notes').value = post.notes || '';
    document.getElementById('reminderEnabled').checked = post.reminder;
    document.getElementById('isPosted').checked = post.isPosted;
    
    document.getElementById('modal').classList.add('active');
}

function deletePost(id) {
    if (confirm('Tem certeza que deseja excluir esta postagem?')) {
        deletePostFromFirebase(id).catch(() => alert('Erro ao excluir.'));
    }
}

function togglePosted(id) {
    const post = posts.find(p => p.id === id);
    if (!post) return;
    savePost({...post, isPosted: !post.isPosted}).catch(() => alert('Erro ao atualizar.'));
}

function handleSubmit(e) {
    e.preventDefault();
    const postData = {
        id: editingId || Date.now().toString(),
        title: document.getElementById('videoTitle').value,
        date: document.getElementById('postDate').value,
        time: document.getElementById('postTime').value,
        url: document.getElementById('videoUrl').value,
        notes: document.getElementById('notes').value,
        reminder: document.getElementById('reminderEnabled').checked,
        isPosted: document.getElementById('isPosted').checked,
        createdAt: editingId ? posts.find(p => p.id === editingId).createdAt : new Date().toISOString()
    };

    savePost(postData).then(() => {
        closeModal();
        if (postData.reminder && !postData.isPosted) scheduleReminder(postData);
    }).catch(() => alert('Erro ao salvar.'));
}

function renderPosts() {
    const today = new Date().toISOString().split('T')[0];
    const upcoming = posts.filter(p => !p.isPosted && p.date >= today).sort((a, b) => new Date(a.date) - new Date(b.date));
    const completed = posts.filter(p => p.isPosted).sort((a, b) => new Date(b.date) - new Date(a.date));
    
    renderPostList('upcomingPosts', upcoming);
    renderPostList('completedPosts', completed);
}

// LISTA DE POSTS COM O BOTÃO DE REDIRECIONAMENTO (SETA)
function renderPostList(containerId, postList) {
    const container = document.getElementById(containerId);
    if (postList.length === 0) {
        container.innerHTML = '<div class="empty-state"><p>Nenhuma postagem encontrada</p></div>';
        return;
    }
    
    container.innerHTML = postList.map(post => {
        const formattedDate = new Date(post.date + 'T' + post.time).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' });
        
        return `
            <div class="post-card ${post.isPosted ? 'posted' : ''}">
                <div class="post-info">
                    <div class="post-title">${post.title}</div>
                    <div class="post-meta">
                        <span>📅 ${formattedDate}</span>
                        <span>🕔 ${post.time}</span>
                        ${post.isPosted ? '<span class="badge posted">✓ Publicado</span>' : '<span class="badge upcoming">Pendente</span>'}
                    </div>
                </div>
                <div class="post-actions">
                    ${post.url ? `
                        <button class="icon-btn" onclick="window.open('${post.url}', '_blank')" title="Ir para o vídeo" style="color: #065fd4;">
                            ↗
                        </button>
                    ` : ''}
                    <button class="icon-btn" onclick="togglePosted('${post.id}')" title="Alternar Status">
                        ${post.isPosted ? '↻' : '✓'}
                    </button>
                    <button class="icon-btn" onclick="editPost('${post.id}')" title="Editar">✎</button>
                    <button class="icon-btn delete" onclick="deletePost('${post.id}')" title="Excluir">🗑</button>
                </div>
            </div>
        `;
    }).join('');
}

function updateStats() {
    const total = posts.length;
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    const thisMonth = posts.filter(p => {
        const d = new Date(p.date + 'T00:00:00');
        return d.getMonth() === currentMonth && d.getFullYear() === currentYear;
    }).length;
    
    const today = new Date(); today.setHours(0,0,0,0);
    const nextWeek = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);
    const upcoming = posts.filter(p => {
        const d = new Date(p.date + 'T00:00:00');
        return !p.isPosted && d >= today && d <= nextWeek;
    }).length;
    
    document.getElementById('totalPosts').textContent = total;
    document.getElementById('thisMonth').textContent = thisMonth;
    document.getElementById('upcoming').textContent = upcoming;
}

function requestNotificationPermission() {
    if ('Notification' in window && Notification.permission === 'default') Notification.requestPermission();
}

function scheduleReminder(post) {
    if (!('Notification' in window) || Notification.permission !== 'granted') return;
    const postDate = new Date(post.date + 'T' + post.time);
    const reminderDate = new Date(postDate.getTime() - 24 * 60 * 60 * 1000);
    const now = new Date();
    if (reminderDate > now) {
        setTimeout(() => {
            new Notification('Lembrete: Postagem YouTube', {
                body: `Vídeo "${post.title}" será postado amanhã às ${post.time}`,
                icon: 'icon-192.png'
            });
        }, reminderDate.getTime() - now.getTime());
    }
}

function checkReminders() {
    const tomorrow = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split('T')[0];
    posts.forEach(post => {
        if (post.reminder && !post.isPosted && post.date === tomorrow) scheduleReminder(post);
    });
}

window.editPost = editPost;
window.deletePost = deletePost;
window.togglePosted = togglePosted;
        
