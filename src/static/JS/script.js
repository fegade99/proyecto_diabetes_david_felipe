document.addEventListener("DOMContentLoaded", () => { // waits until the entire HTML document is fully loaded before running the enclosed code. That way, it doesn’t try to access DOM elements that aren’t rendered yet.
    const form = document.getElementById("predict-form"); // gets a reference to your <form> element by its ID. From here, you attach behavior to it.

    form.addEventListener("submit", async (event) => { // intercepts the form submission so that the page doesn't reload (event.preventDefault()), and handle the submission with JavaScript (AJAX).
        event.preventDefault();

        const formData = new FormData(form); // captures all input values in your form as key-value pairs automatically.
        const data = {};

        formData.forEach((value, key) => { // builds a plain JS object (data) from the form values. It parses values as floats if they are numeric
            
            data[key] = isNaN(value) ? value : parseFloat(value); // ff value is a number-like string, it becomes a float. Otherwise, it’s kept as-is (just in case you have other data types).
        });

        console.log("Sending data:", data);

        try {
            const response = await fetch("/predict", { // sends the data as a JSON POST request to your Flask backend at /predict.
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(data),
            });

            const result = await response.json(); // waits for the server to respond and parses the response body as a JSON object.
            const output = document.getElementById("result");

            if (result.error) {
                output.innerHTML = `<div class="alert alert-danger">${result.error}</div>`;
            } else {
                const probability = (result.probability * 100).toFixed(2);
                let risk = "";

                    if (probability < 50) {
                        risk = "Bajo riesgo";
                    } else if (probability < 80) {
                       risk = "Riesgo moderado";
                    } else {
                       risk = "Riesgo alto";
                    }
                output.innerHTML = `
                    <div class="alert alert-success">
                        <strong>${risk} de diabetes</strong><br>
                        Probabilidad: ${probability}%
                    </div>`;
            }
        } catch (error) {
            console.error("Prediction error:", error);
            document.getElementById("result").innerHTML =
                `<div class="alert alert-danger">Server error. Try again later.</div>`;
        }
    });
});