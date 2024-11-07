
document.getElementById("ingestForm").addEventListener("submit", async (event) => {
    event.preventDefault();

    const fileInput = document.getElementById("fileInput");
    const formData = new FormData();
    formData.append("file", fileInput.files[0]);

    try {
        const response = await fetch("http://127.0.0.1:8000/ingest/", {
            method: "POST",
            body: formData
        });

        const data = await response.json();
        document.getElementById("ingestMessage").textContent = data.message;
    } catch (error) {
        console.error("Error ingesting document:", error);
    }
});


document.getElementById("queryForm").addEventListener("submit", async (event) => {
    event.preventDefault();

    const queryText = document.getElementById("queryInput").value;

    try {
        const response = await fetch("http://127.0.0.1:8000/query/", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ query_text: queryText })
        });

        const data = await response.json();
        const resultsList = document.getElementById("resultsList");
        resultsList.innerHTML = "";  // Clear previous results

        data.results.forEach(result => {
            const listItem = document.createElement("li");
            listItem.textContent = result.document;
            resultsList.appendChild(listItem);
        });
    } catch (error) {
        console.error("Error querying documents:", error);
    }
});
