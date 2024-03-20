// JavaScript Document
console.log("Script: Filter en Sorteer");

const body = document.body;
const element = document.querySelector("#grid1");
const toggle_sorteer = document.querySelector("#toggle_sorteer");
const filters_popup = document.getElementById('popup1');
const filterbutton_highlight = document.querySelector(".filterbutton");
const filters_remove = document.querySelector("#filters");


document.addEventListener('DOMContentLoaded', function () {
  const container = document.getElementById('slide');
  const toggleButton = document.getElementById('toggle_grid');
  const toggleIcon = document.getElementById('toggleIcon');

  toggleButton.addEventListener('click', function () {
    container.classList.toggle('list-view');
    updateButtonIcon();
    element.classList.toggle("grid1");
    element.classList.toggle("list1");
  });

  function updateButtonIcon() {
    const isListView = container.classList.contains('list-view');
    const iconPath = isListView ? './images/iconen/grid.svg' : './images/iconen/list.svg';

    toggleIcon.src = iconPath;
  }
});




toggle_sorteer.addEventListener('click', function () {
  toggle_sorteer.classList.toggle("toggle_icon_arrow_draai");
  element.classList.toggle("toggle_icon_arrow_draai");

});

function toggleFilters() {
  filters_popup.classList.toggle('show-popup');
}


// RANGE SLIDER

function highlight1() {
  filterbutton_highlight.classList.remove('filterbutton');
  filterbutton_highlight.classList.add('highlight1');
}

function getVals() {
  let parent = this.parentNode;
  let slides = parent.getElementsByTagName("input");
  let slide1 = parseFloat(slides[0].value);
  let slide2 = parseFloat(slides[1].value);

  if (slide1 > slide2) {
    let tmp = slide2;
    slide2 = slide1;
    slide1 = tmp;
  }

  let displayElement = document.getElementsByClassName("rangeValues")[0];
  displayElement.textContent = slide1 + " - " + slide2 + " BPM";

  slides[0].addEventListener('input', highlight1);
  slides[1].addEventListener('input', highlight1);
}




window.onload = function () {
  let sliderSections = document.getElementsByClassName("range-slider");
  for (let x = 0; x < sliderSections.length; x++) {
    let sliders = sliderSections[x].getElementsByTagName("input");
    for (let y = 0; y < sliders.length; y++) {
      if (sliders[y].type === "range") {
        sliders[y].oninput = getVals;
        sliders[y].oninput();
      }
    }
  }
}


// CHECKBOXES

function updateCheckboxCount(checkbox) {
  var section = checkbox.closest('.filterSection');
  var checkboxes = section.querySelectorAll('input[type="checkbox"]');
  var checkedCount = 0;
  checkboxes.forEach(function (checkbox) {
    if (checkbox.checked) {
      checkedCount++;
    }
  });
  var totalCount = checkboxes.length;
  section.previousElementSibling.querySelector('.checkboxCount').textContent = checkedCount + '/' + totalCount;

  if (checkedCount > 0) {
    filterbutton_highlight.classList.remove('filterbutton');
    filterbutton_highlight.classList.add('highlight1');
  } else {
    filterbutton_highlight.classList.remove('highlight1');
    filterbutton_highlight.classList.add('filterbutton');
  }
}