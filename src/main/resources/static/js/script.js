const listClients = document.getElementById("listClients");

async function restartList() {
    const response = await fetch("/clients");

    if (!response.ok) {
        return;
    }

    const json = await response.json();
    listClients.innerHTML = "";
    json.forEach(client => {
        const li = document.createElement("li");
        li.textContent = `${client.name} ${client.email} ${client.phone}`;
        listClients.appendChild(li);
    });
}

window.addEventListener("load", restartList);

const clientForm = document.getElementById("clientForm");

clientForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const client = {
        name: clientForm.clientName.value,
        email: clientForm.clientEmail.value,
        phone: clientForm.clientPhone.value
    };

    console.log(client);

    const response = await fetch("/clients", {
        method: 'POST',
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(client)
    });
    await restartList();
});
