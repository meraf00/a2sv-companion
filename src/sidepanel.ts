// Mock data for coding platforms and questions
import {upload} from './lib/github/index'
async function getPlatforms(): Promise<string[]> {
  populateDropdown("coding-platform", ["loading..."]);
  const rq = await fetch(
    "https://294e5460-8d4f-455f-8a94-41db2a34fb38.mock.pstmn.io/platform",
  );
  let data = await rq.json();
  populateDropdown("coding-platform", data.platforms);
  populateDropdown("available-questions", ["loading..."]);
  const question = await getQuestions(data.platforms[0].toLowerCase());
  return data;
}

getPlatforms();
async function getQuestions(platform: string) {
  populateQuestionDropDown("available-questions", [
    { URL: "loading...", Title: "loading..." },
  ]);
  const rq = await fetch(
    `https://294e5460-8d4f-455f-8a94-41db2a34fb38.mock.pstmn.io/platform/${platform}/question`,
  );
  let data = await rq.json();
  populateQuestionDropDown(
    "available-questions",
    data.questions as QuestionInterface[],
  );
  return data;
}

const availableQuestions: Record<string, string[]> = {
  LeetCode: ["Question 1", "Question 2", "Question 3"],
  HackerRank: ["Problem A", "Problem B", "Problem C"],
  CodeSignal: ["Task X", "Task Y", "Task Z"],
};

// Function to populate dropdown options
function populateDropdown(
  selectId: string,
  options: string[],
  selectedValue = "",
) {
  const selectElement = document.getElementById(selectId) as HTMLSelectElement;
  selectElement.innerHTML = ""; // Clear existing options
  options.forEach((option) => {
    const optionElement = document.createElement("option");
    optionElement.value = option;
    optionElement.text = option;
    selectElement.add(optionElement);
  });
  if (selectedValue) {
    selectElement.value = selectedValue;
  }
}
interface QuestionInterface {
  URL: string;
  Title: string;
}

function populateQuestionDropDown(
  selectId: string,
  options: QuestionInterface[],
) {
  const selectElement = document.getElementById(selectId) as HTMLSelectElement;
  selectElement.innerHTML = ""; // Clear existing options
  options.forEach((option) => {
    const optionElement = document.createElement("option");
    optionElement.value = option.URL;
    optionElement.text = option.Title;
    selectElement.add(optionElement);
  });
}

// Event listener for coding platform change
document
  .getElementById("coding-platform")
  ?.addEventListener("change", async function () {
    const selectedPlatform = (this as HTMLSelectElement).value as string;
    await getQuestions(selectedPlatform.toLowerCase());
  });
function getFormValues(): {
  codingPlatform: string;
  availableQuestions: string;
  code: string;
  timeTaken: number;
  attempts: number;
} {
  const codingPlatform = (
    document.getElementById("coding-platform") as HTMLSelectElement
  ).value;
  const availableQuestions = (
    document.getElementById("available-questions") as HTMLSelectElement
  ).value;
  const code = (
    document.getElementById("code") as HTMLTextAreaElement
  ).value.trim();
  const timeTaken =
    parseInt(
      (document.getElementById("time-taken") as HTMLInputElement).value,
      10,
    ) || 0;
  const attempts =
    parseInt(
      (document.getElementById("attempts") as HTMLInputElement).value,
      10,
    ) || 0;
  return {
    codingPlatform,
    availableQuestions,
    timeTaken,
    code,
    attempts,
  };
}
function checkFields() {
  const { codingPlatform, availableQuestions, code, timeTaken, attempts } =
    getFormValues();
  const submitButton = document.getElementById(
    "submit-btn",
  ) as HTMLButtonElement;
  console.log(submitButton);
  submitButton.disabled = !(
    codingPlatform &&
    availableQuestions &&
    code &&
    timeTaken &&
    attempts
  );
  if (submitButton.disabled) {
    // Change to disabled styles
    submitButton.classList.remove("bg-blue-500", "hover:bg-blue-600");
    submitButton.classList.add(
      "bg-gray-500",
      "text-gray-400",
      "cursor-not-allowed",
    );
  } else {
    // Change to enabled styles
    submitButton.classList.remove(
      "bg-gray-500",
      "text-gray-400",
      "cursor-not-allowed",
    );
    submitButton.classList.add("bg-blue-500", "hover:bg-blue-600");
  }
}
function onSubmit() {
  const formdata = getFormValues();
  console.log(formdata, "from on submit")
  chrome.storage.local
    .get(["selectedRepo", "folderPath", "studentName"])
    .then((storage) => {
      const ext = 'py';
      const questionRef = document.getElementById("available-questions") as HTMLSelectElement;
      let question = questionRef.options[questionRef.selectedIndex].text.replace(/\s+/g, '');
      console.log(question);
      const folderPath =
      storage.folderPath[storage.folderPath.length - 1] == '/'

        ? storage.folderPath
        : `${storage.folderPath}/`;
      const fileRelativePath = `${folderPath}${formdata.codingPlatform}/${question}.${ext}`;
      console.log(fileRelativePath)


      upload(storage.selectedRepo, fileRelativePath, formdata.code, "commit message").then((gitUrl) => {
        console.log(gitUrl)
    });});
}
checkFields();
document.getElementById("submit-btn").addEventListener("click", (e) => {
  console.log("button clicked")
  e.preventDefault();
  onSubmit();
});
// Listen for input events on the fields
document
  .getElementById("coding-platform")
  .addEventListener("input", checkFields);
document
  .getElementById("available-questions")
  .addEventListener("input", checkFields);
document.getElementById("code").addEventListener("input", checkFields);
document.getElementById("time-taken").addEventListener("input", checkFields);
document.getElementById("attempts").addEventListener("input", checkFields);
