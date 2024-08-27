document.addEventListener("DOMContentLoaded", function () {
    const todoValue = document.getElementById("todoText");
    const todoAlert = document.getElementById("Alert");
    const listItems = document.getElementById("list-items");
    const addUpdate = document.getElementById("AddUpdateClick");

    let todo = JSON.parse(localStorage.getItem("todo-list")) || [];
    let updateText = null;

    function CreateToDoItems() {
        if (todoValue.value === "") {
            todoAlert.innerText = "Please enter your todo text!";
            todoValue.focus();
        } else {
            let IsPresent = todo.some(element => element.item === todoValue.value);

            if (IsPresent) {
                setAlertMessage("This item already present in the list!");
                return;
            }

            let li = document.createElement("li");
            const todoItems = `
                <div title="Hit Double Click and Complete" ondblclick="CompletedToDoItems(this)">
                    ${todoValue.value}
                </div>
                <div>
                    <img class="edit todo-controls" onclick="UpdateToDoItems(this)" src="https://cdn.pixabay.com/photo/2016/12/16/12/44/pencil-1911312_960_720.png" />
                    <img class="delete todo-controls" onclick="DeleteToDoItems(this)" src="https://cdn.pixabay.com/photo/2022/02/03/19/12/trash-icon-6991161_960_720.png" />
                </div>`;
            li.innerHTML = todoItems;
            listItems.appendChild(li);

            todo.push({ item: todoValue.value, status: false });
            setLocalStorage();
            todoValue.value = "";
            setAlertMessage("Todo item Created Successfully!");
        }
    }

    function ReadToDoItems() {
        todo.forEach(element => {
            let li = document.createElement("li");
            let style = element.status ? "style='text-decoration: line-through'" : "";
            const todoItems = `
                <div ${style} title="Hit Double Click and Complete" ondblclick="CompletedToDoItems(this)">
                    ${element.item}
                    ${style ? '<img class="todo-controls" src="https://cdn.pixabay.com/photo/2017/01/31/17/55/check-mark-2025986_960_720.png" />' : ""}
                </div>
                <div>
                    ${!style ? '<img class="edit todo-controls" onclick="UpdateToDoItems(this)" src="https://cdn.pixabay.com/photo/2016/12/16/12/44/pencil-1911312_960_720.png" />' : ""}
                    <img class="delete todo-controls" onclick="DeleteToDoItems(this)" src="https://cdn.pixabay.com/photo/2022/02/03/19/12/trash-icon-6991161_960_720.png" />
                </div>`;
            li.innerHTML = todoItems;
            listItems.appendChild(li);
        });
    }

    window.UpdateToDoItems = function UpdateToDoItems(e) {
        if (e.parentElement.parentElement.querySelector("div").style.textDecoration === "") {
            todoValue.value = e.parentElement.parentElement.querySelector("div").innerText;
            updateText = e.parentElement.parentElement.querySelector("div");
            addUpdate.setAttribute("onclick", "UpdateOnSelectionItems()");
            addUpdate.setAttribute("src", "https://cdn.pixabay.com/photo/2016/12/16/12/44/refresh-1911312_960_720.png");
            todoValue.focus();
        }
    };

    window.UpdateOnSelectionItems = function UpdateOnSelectionItems() {
        let IsPresent = todo.some(element => element.item === todoValue.value);

        if (IsPresent) {
            setAlertMessage("This item already present in the list!");
            return;
        }

        todo.forEach(element => {
            if (element.item == updateText.innerText.trim()) {
                element.item = todoValue.value;
            }
        });
        setLocalStorage();

        updateText.innerText = todoValue.value;
        addUpdate.setAttribute("onclick", "CreateToDoItems()");
        addUpdate.setAttribute("src", "https://cdn.pixabay.com/photo/2014/04/02/10/55/plus-304947_960_720.png");
        todoValue.value = "";
        setAlertMessage("Todo item Updated Successfully!");
    };

    window.DeleteToDoItems = function DeleteToDoItems(e) {
        let deleteValue = e.parentElement.parentElement.querySelector("div").innerText;

        if (confirm(`Are you sure. Do you want to delete this ${deleteValue}!`)) {
            e.parentElement.parentElement.setAttribute("class", "deleted-item");
            todoValue.focus();

            todo = todo.filter(element => element.item !== deleteValue.trim());

            setTimeout(() => {
                e.parentElement.parentElement.remove();
            }, 1000);

            setLocalStorage();
        }
    };

    window.CompletedToDoItems = function CompletedToDoItems(e) {
        if (e.parentElement.querySelector("div").style.textDecoration === "") {
            const img = document.createElement("img");
            img.src = "https://cdn.pixabay.com/photo/2017/01/31/17/55/check-mark-2025986_960_720.png";
            img.className = "todo-controls";
            e.parentElement.querySelector("div").style.textDecoration = "line-through";
            e.parentElement.querySelector("div").appendChild(img);
            e.parentElement.querySelector("img.edit").remove();

            todo.forEach(element => {
                if (e.parentElement.querySelector("div").innerText.trim() == element.item) {
                    element.status = true;
                }
            });
            setLocalStorage();
            setAlertMessage("Todo item Completed Successfully!");
        }
    };

    function setLocalStorage() {
        localStorage.setItem("todo-list", JSON.stringify(todo));
    }

    function setAlertMessage(message) {
        todoAlert.removeAttribute("class");
        todoAlert.innerText = message;
        setTimeout(() => {
            todoAlert.classList.add("toggleMe");
        }, 1000);
    }

    addUpdate.addEventListener("click", CreateToDoItems);
    ReadToDoItems();
});
