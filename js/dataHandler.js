/**
 * Fetch exam data based on the selected exam board.
**/
export async function fetchExamData(board) {
  try {
    const response = await fetch(`./data/${board}.json`);
    if (!response.ok) {
      throw new Error("Failed to fetch syllabus data.");
    }
    return await response.json();
  } catch (error) {
    console.error("Error fetching data:", error);
    return null;
  }
}
