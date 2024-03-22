function toggleCheckbox(checkboxId) {
    var checkbox = document.getElementById(checkboxId);
    if (checkbox) {
        checkbox.checked = !checkbox.checked;
    }
}