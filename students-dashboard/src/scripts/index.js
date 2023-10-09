// index.js

// Function to fetch and display student data
const BASE_URL = `http://localhost:8080`;
async function fetchStudents(BASE_URL) {
  try {
    const response = await fetch(`${BASE_URL}/masai`);
    const students = await response.json();
    console.log(students);
    displayStudents(students);
  } catch (error) {
    console.log("Error while fetching data !");
  }
}
const container = document.getElementById("container");
fetchStudents(BASE_URL);

function displayStudents(students) {
  container.innerHTML = ""; // Clear existing student cards

  students.forEach((student) => {
    const studentCard = document.createElement("div");
    studentCard.classList.add("student");

    const name = document.createElement("h3");
    name.textContent = student.name;

    const score = document.createElement("p");
    score.classList.add("student_score");
    score.textContent = `${student.score}`;

    const batch = document.createElement("p");
    batch.textContent = `Batch: ${student.batch}`;

    const section = document.createElement("p");
    section.textContent = `${student.section}`;

    const removeButton = document.createElement("button");
    removeButton.classList.add("remove_student");
    removeButton.textContent = "Remove Student";
    removeButton.addEventListener("click", async () => {
      // Remove student from the database
      await fetch(`${BASE_URL}/masai/${student.id}`, {
        method: "DELETE",
      });

      // Refresh the student list
      fetchStudents(BASE_URL);
    });

    const updateButton = document.createElement("button");
    updateButton.classList.add("update_score");
    updateButton.textContent = "Update Score";

    // Create a separate input box for score updates
    const newScoreInput = document.createElement("input");
    newScoreInput.setAttribute("type", "number");
    newScoreInput.setAttribute("id", `new_score_${student.id}`); // Use a unique ID for each input
    newScoreInput.value = student.score;
    newScoreInput.disabled = true; // Initially disabled

    // Add an event listener to the "Update Score" button
    updateButton.addEventListener("click", () => {
      // Enable the input box for this specific student
      newScoreInput.disabled = false;

      // Focus the input box
      newScoreInput.focus();
    });

    // Add an event listener to update the score on 'Enter'
    newScoreInput.addEventListener("keydown", async (e) => {
      if (e.key === "Enter") {
        // Disable the input box
        newScoreInput.disabled = true;
        // Update the student's score in the database
        const newScore = parseInt(newScoreInput.value);

        await fetch(`${BASE_URL}/masai/${student.id}`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ score: newScore }),
        });
        // Update the score on UI
        score.textContent = `${newScore}`;
        // Refresh the student list
        fetchStudents(BASE_URL);
      }
    });
  });

  studentCard.appendChild(name);
  studentCard.appendChild(score);
  studentCard.appendChild(batch);
  studentCard.appendChild(section);
  studentCard.appendChild(removeButton);
  studentCard.appendChild(updateButton);

  container.appendChild(studentCard);
}

// Event listeners for sorting and filtering
document
  .getElementById("sort-low-to-high")
  .addEventListener("click", LowToHigh);

async function LowToHigh() {
  try {
    // Make a GET request with query parameter for sorting low to high
    const fetchData = await fetch(`${BASE_URL}/masai?_sort=score&_order=asc`);
    const filteredData = await fetchData.json();
    displayStudents(filteredData);
  } catch (error) {
    console.log("Sorting from low to high failed");
  }
}

document
  .getElementById("sort-high-to-low")
  .addEventListener("click", HighToLow);

async function HighToLow() {
  try {
    // Make a GET request with query parameter for sorting low to high
    const fetchData = await fetch(`${BASE_URL}/masai?_sort=score&_order=desc`);
    const filteredData = await fetchData.json();
    displayStudents(filteredData);
  } catch (error) {
    console.log("Sorting from high to low failed");
  }
}

document
  .getElementById("greater-than")
  .addEventListener("click", filterScoreGreaterThan);

async function filterScoreGreaterThan() {
  try {
    // Make a GET request with query parameter for filtering score >= 5
    const fetchData = await fetch(`${BASE_URL}/masai?score_gte=5`);
    const filteredData = await fetchData.json();
    displayStudents(filteredData);
  } catch (error) {
    console.log("Filtering score greater than 5 failed");
  }
}
document
  .getElementById("less-than")
  .addEventListener("click", filterScoreLessThan);

async function filterScoreLessThan() {
  try {
    // Make a GET request with query parameter for filtering score <= 5
    const fetchData = await fetch(`${BASE_URL}/masai?score_lte=5`);
    const filteredData = await fetchData.json();
    displayStudents(filteredData);
  } catch (error) {
    console.log("Filtering score less than 5 failed");
  }
}

// Event listener for adding a new student
document.getElementById("add_student").addEventListener("click", AddNewStudent);
async function AddNewStudent() {
  const name = document.getElementById("name").value;
  const batch = document.getElementById("batch").value;
  const section = document.getElementById("section").value;
  const evalScore = parseInt(document.getElementById("eval_score").value);

  // Create a new student object
  const newStudent = {
    name,
    batch,
    section,
    score: Number(evalScore),
    image:
      "https://allworldpm.com/wp-content/uploads/2016/10/230x230-avatar-dummy-profile-pic.jpg",
  };

  // Make a POST request to add the new student
  await fetch(`${BASE_URL}/masai`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(newStudent),
  });

  // Refresh the student list
  fetchStudents(BASE_URL);

  // Clear input fields
  document.getElementById("name").value = "";
  document.getElementById("batch").value = "";
  document.getElementById("section").value = "";
  document.getElementById("eval_score").value = "";
}

// updated code
