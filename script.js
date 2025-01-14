document.getElementById("dns-lookup-form").addEventListener("submit", async function(event) {
    event.preventDefault();

    const domain = document.getElementById("domain").value;
    const recordType = document.getElementById("record-type").value;
    const output = document.getElementById("output");

    output.textContent = "Looking up records...";

    try {
        const response = await fetch(`https://dns.google/resolve?name=${domain}&type=${recordType}`);
        const data = await response.json();

        if (data.Status === 0 && data.Answer) {
            output.textContent = JSON.stringify(data.Answer, null, 2);
        } else {
            output.textContent = "No records found or an error occurred.";
        }
    } catch (error) {
        output.textContent = "Error fetching DNS records.";
    }
});
