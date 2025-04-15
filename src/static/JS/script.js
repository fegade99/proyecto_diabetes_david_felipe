document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("predict-form");

    form.addEventListener("submit", async (event) => {
        event.preventDefault();

        const formData = new FormData(form);
        const data = {};

        formData.forEach((value, key) => {
            data[key] = isNaN(value) ? value : parseFloat(value);
        });

        console.log("Sending data:", data);

        try {
            const response = await fetch("/predict", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(data),
            });

            const result = await response.json();
            const output = document.getElementById("result");

            if (result.error) {
                output.innerHTML = `<div class="alert alert-danger">${result.error}</div>`;
            } else {
                const risk = result.prediction === 1 ? "High Risk" : "Low Risk";
                const probability = (result.probability * 100).toFixed(2);
                output.innerHTML = `
                    <div class="alert alert-success">
                        <strong>${risk} of Diabetes</strong><br>
                        Probability: ${probability}%
                    </div>`;
            }
        } catch (error) {
            console.error("Prediction error:", error);
            document.getElementById("result").innerHTML =
                `<div class="alert alert-danger">Server error. Try again later.</div>`;
        }
    });
});