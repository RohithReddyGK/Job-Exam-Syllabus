import { fetchExamData } from "./dataHandler.js";

document.addEventListener("DOMContentLoaded", () => {
  // Add click event listeners for exam board buttons in the sidebar
  const examBoardButtons = document.querySelectorAll(".collapsible");
  examBoardButtons.forEach((button) => {
    button.addEventListener("click", async function () {
      // Toggle collapsible display
      this.classList.toggle("active");
      const examList = this.nextElementSibling;
      examList.style.display =
        examList.style.display === "block" ? "none" : "block";

      // Fetch and display exam data for the clicked exam board
      const boardName = this.textContent.trim();
      const examData = await fetchExamData(boardName);
      if (examData) {
        window.currentExamData = examData; // store globally for tab switching
        console.log(examData.exams);
        // displayExamData(examData.exams);
      }
    });
  });
  // Listen for search input to filter topics dynamically
  // const searchInput = document.getElementById("search");
  // searchInput.addEventListener("input", () => {
  //   const query = searchInput.value.toLowerCase();
  //   filterSyllabus(query);
  // });
});




/**
 * Toggles the visibility of exam lists when a board is clicked.
 */
window.toggleExams = async function (board) {
  const examList = document.getElementById(board);
  if (!examList) return;

  // Toggle visibility
  examList.classList.toggle("hidden");

  if (!examList.classList.contains("hidden")) {
    const data = await fetchExamData(board);
    console.log(data);
    if (data) {
      renderExamList(board, data.exams);
      // console.log(board);
    }
  }
};

/**
 * Renders the list of exams under a selected board.
 */
function renderExamList(board, exams) {
  const examList = document.getElementById(board);
  examList.innerHTML = "";

  exams.forEach((exam) => {
    const li = document.createElement("li");
    li.textContent = exam.examName;
    li.addEventListener("click", () => loadSyllabus(board, exam.examName));
    examList.appendChild(li);
  });
}

/**
 * Fetches and displays the syllabus for the selected exam.
 */
async function loadSyllabus(board, examName) {
  const syllabusDisplay = document.getElementById("syllabus-display");
  syllabusDisplay.innerHTML = `<p>Loading syllabus...</p>`;

  const data = await fetchExamData(board);
  if (!data) {
    syllabusDisplay.innerHTML = `<p>Error loading syllabus.</p>`;
    return;
  }

  const exam = data.exams.find((ex) => ex.examName === examName);
  if (!exam) {
    syllabusDisplay.innerHTML = `<p>Syllabus not found.</p>`;
    return;
  }

  syllabusDisplay.innerHTML = `
    <h2>${exam.examName} Syllabus</h2>
    <div class="tabs">
      <button class="tab active" data-section="Prelims">Prelims</button>
      <button class="tab" data-section="Mains">Mains</button>
      <button class="tab" data-section="Interview">Interview</button>
    </div>
    <div id="tabContent"></div>
  `;

  // Display default (Prelims) section
  updateSyllabusSection("Prelims", exam.syllabus);

  // Add event listeners to tabs
  document.querySelectorAll(".tab").forEach((tab) => {
    tab.addEventListener("click", function () {
      document
        .querySelectorAll(".tab")
        .forEach((t) => t.classList.remove("active"));
      this.classList.add("active");
      updateSyllabusSection(this.dataset.section, exam.syllabus);
    });
  });
}

// function filterSyllabus(query) {
//   const tabContent = document.getElementById("tabContent");
//   if (!tabContent) return;

//   tabContent.querySelectorAll("li").forEach((item) => {
//     item.style.display = item.textContent.toLowerCase().includes(query)
//       ? "list-item"
//       : "none";
//   });
// }

/**
 * Updates the syllabus display based on the selected section (Prelims, Mains, Interview).
 */
function updateSyllabusSection(section, syllabus) {
  const tabContent = document.getElementById("tabContent");
  const topics = syllabus[section] || [];

  tabContent.innerHTML = topics.length
    ? `<ul>${topics.map((topic) => `<li>${topic}</li>`).join("")}</ul>`
    : `<p>No syllabus available for ${section}.</p>`;
}
