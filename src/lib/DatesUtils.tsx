export function generateAndFillDates(inputData = []) {
  const result = [];
  const currentDate = new Date();
  const inputDates = new Set(inputData.map((item) => item.dayDate));

  // Generate 50 past dates
  for (let i = 50; i > 0; i--) {
    const date = new Date(currentDate);
    date.setDate(date.getDate() - i);
    const dateString = date.toISOString().split("T")[0];
    if (!inputDates.has(dateString)) {
      result.push({
        dayDate: dateString,
      });
    }
  }

  // Add the existing inputData, maintaining its order
  result.push(
    ...inputData.filter((item) => !result.find((r) => r.date === item.dayDate)),
  );

  // Generate 50 future dates
  for (let i = 1; result.length < 100; i++) {
    const date = new Date(currentDate);
    date.setDate(date.getDate() + i);
    const dateString = date.toISOString().split("T")[0];
    if (!inputDates.has(dateString)) {
      result.push({
        dayDate: dateString,
      });
    }
  }

  // Trim the result to 100 elements if necessary
  return result.slice(0, 100);
}

export function prepareNutrients(inputData = []) {
  return inputData.map((item) => ({
    protein:
      item.breakfast.reduce((acc, cur) => acc + cur.size * cur.protein100G, 0) +
      item.lunch.reduce((acc, cur) => acc + cur.size * cur.protein100G, 0) +
      item.dinner.reduce((acc, cur) => acc + cur.size * cur.protein100G, 0) +
      item.firstSnack.reduce(
        (acc, cur) => acc + cur.size * cur.protein100G,
        0,
      ) +
      item.secondSnack.reduce(
        (acc, cur) => acc + cur.size * cur.protein100G,
        0,
      ) +
      item.secondDinner.reduce(
        (acc, cur) => acc + cur.size * cur.protein100G,
        0,
      ),
    fat:
      item.breakfast.reduce((acc, cur) => acc + cur.size * cur.fat100G, 0) +
      item.lunch.reduce((acc, cur) => acc + cur.size * cur.fat100G, 0) +
      item.dinner.reduce((acc, cur) => acc + cur.size * cur.fat100G, 0) +
      item.firstSnack.reduce((acc, cur) => acc + cur.size * cur.fat100G, 0) +
      item.secondSnack.reduce((acc, cur) => acc + cur.size * cur.fat100G, 0) +
      item.secondDinner.reduce((acc, cur) => acc + cur.size * cur.fat100G, 0),
    carbs:
      item.breakfast.reduce(
        (acc, cur) => acc + cur.size * cur.carbohydrates100G,
        0,
      ) +
      item.lunch.reduce(
        (acc, cur) => acc + cur.size * cur.carbohydrates100G,
        0,
      ) +
      item.dinner.reduce(
        (acc, cur) => acc + cur.size * cur.carbohydrates100G,
        0,
      ) +
      item.firstSnack.reduce(
        (acc, cur) => acc + cur.size * cur.carbohydrates100G,
        0,
      ) +
      item.secondSnack.reduce(
        (acc, cur) => acc + cur.size * cur.carbohydrates100G,
        0,
      ) +
      item.secondDinner.reduce(
        (acc, cur) => acc + cur.size * cur.carbohydrates100G,
        0,
      ),
    calories:
      item.breakfast.reduce(
        (acc, cur) => acc + cur.size * cur.calories100G,
        0,
      ) +
      item.lunch.reduce((acc, cur) => acc + cur.size * cur.calories100G, 0) +
      item.dinner.reduce((acc, cur) => acc + cur.size * cur.calories100G, 0) +
      item.firstSnack.reduce(
        (acc, cur) => acc + cur.size * cur.calories100G,
        0,
      ) +
      item.secondSnack.reduce(
        (acc, cur) => acc + cur.size * cur.calories100G,
        0,
      ) +
      item.secondDinner.reduce(
        (acc, cur) => acc + cur.size * cur.calories100G,
        0,
      ),
  }));
}

export function prepareFoods(inputData = []) {}
