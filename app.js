(() => {
    const STORAGE_KEY = 'simple_todo-v1';

    //UI refs
    const form = document.getElementById('form');
    const input = document.getElementById('input');
    const list = document.getElementById('list');
    const counter = document.getElementById('counter');
    const clearDoneBtn = document.getElementById('ClearDone');

    //Array { id, text, done, createdAt }
    let tasks = [];

    // local Storage
    function load(){
        try {
            const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
            if (Array.isArray(saved)) tasks = saved;
        } catch {}
    }
    function save (){
        localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
    }

    // helper func
    function updateCounter(){
        const total = tasks.length;
        const done = tasks.filter(task => task.done).length;
        counter.textContent = `${total} tasks | ${done} completed`;
        clearDoneBtn.disabled = done === 0;
    }

    function render() {
        list.innerHTML = '';

        // iteration
        tasks.forEach(item => {
            const li = document.createElement('li');
            li.className = 'item' + (item.done ? ' done' : '');

            // checkbox: toggle done
            const check = document.createElement('input');
            check.type = 'checkbox';
            check.className = 'check';
            check.checked = item.done;
            check.addEventListener('change', () => {
                item.done = check.checked;
                save(); render();
            });

            // task text
            const text = document.createElement('span');
            text.className = 'text';
            text.textContent = item.text;

            // task date time
            const meta = document.createElement('small');
            meta.textContent = new Date(item.createdAt)
                .toLocaleString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });

            // delete button
            const del = document.createElement('button');
            del.className = 'del';
            del.setAttribute('aria-label', 'Delete task');
            del.textContent = '✕';
            del.addEventListener('click', () => {
                tasks = tasks.filter(task => task.id !== item.id);
                save(); render();
            });

            li.append(check, text, meta, del);
            list.appendChild(li); //
        });

        updateCounter();
    }

    //actions
    form.addEventListener('submit', (event) => {
        event.preventDefault();

        const text = input.value.trim();
        if (!text) return;

        const id = (crypto.randomUUID && crypto.randomUUID())
            || (Date.now() + '-' + Math.random().toString(16).slice(2));

        tasks.unshift({ id, text, done: false, createdAt: Date.now() });
        save();
        input.value = '';
        input.focus();
        render();
    });

    clearDoneBtn.addEventListener('click', () => {
        tasks = tasks.filter(t => !t.done);
        save(); render();
    });

    // init
    load();
    render();
})();
