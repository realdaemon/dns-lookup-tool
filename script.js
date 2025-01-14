document.getElementById("dns-lookup-form").addEventListener("submit", async function(event) {
    event.preventDefault();

    const domain = document.getElementById("domain").value;
    const recordType = document.getElementById("record-type").value;
    const output = document.getElementById("output");

    output.innerHTML = "Looking up records...";

    const dnsServers = [
        { name: "Google DNS", url: `https://dns.google/resolve?name=${domain}&type=${recordType}` },
        { name: "Cloudflare DNS", url: `https://cloudflare-dns.com/dns-query?name=${domain}&type=${recordType}`, headers: { "Accept": "application/dns-json" } },
        { name: "OpenDNS", url: `https://doh.opendns.com/dns-query?name=${domain}&type=${recordType}`, headers: { "Accept": "application/dns-json" } }
    ];

    const results = await Promise.all(dnsServers.map(async (server) => {
        try {
            const response = await fetch(server.url, { headers: server.headers || {} });
            const data = await response.json();

            if (data.Status === 0 && data.Answer) {
                return { server: server.name, records: data.Answer };
            } else {
                return { server: server.name, error: "No records found or an error occurred." };
            }
        } catch (error) {
            return { server: server.name, error: "Error fetching DNS records." };
        }
    }));

    output.innerHTML = results.map(result => `
        <div>
            <h3>${result.server}</h3>
            ${result.records 
                ? `<pre>${JSON.stringify(result.records, null, 2)}</pre>` 
                : `<p>${result.error}</p>`}
        </div>
    `).join("");
});
