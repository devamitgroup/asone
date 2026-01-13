document.addEventListener("DOMContentLoaded", function () {
    function setupSearch(inputId, buttonId) {
        const input = document.getElementById(inputId);
        const button = document.getElementById(buttonId);

        if (input && button) {
            button.addEventListener("click", function (event) {
                event.preventDefault();
                const value = input.value.trim();
                if (value !== "") {
                    window.location.href = `/san-pham/ket-qua-tim-kiem?keyword=${encodeURIComponent(value)}`;
                }
            });

            input.addEventListener("keypress", function (event) {
                if (event.key === "Enter") {
                    event.preventDefault();
                    button.click();
                }
            });
        }
    }

    // Setup for desktop and mobile search boxes
    setupSearch("keysearch", "searchhref");
    setupSearch("keysearch-mobile", "searchhref-mobile");
});
