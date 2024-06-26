export function getRandomColor() {
  const letters = "0123456789ABCDEF";
  let color = "#";
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}

export function getColorFromNumber(num: number): string {
  if (num < 0) return getRandomColor();

  // Используем простой хеш-алгоритм для получения индекса в массиве цветов
  const hashCode = (str: string): number => {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = (hash << 5) - hash + str.charCodeAt(i);
      hash |= 0; // Преобразуем в 32-битное целое число
    }
    return hash;
  };

  // Массив фиксированных цветов
  const colors = [
    "#E702D2",
    "#22484C",
    "#89E070",
    "#DCF1C4",
    "#D63CF3",
    "#D88680",
    "#9BA441",
    "#426947",
    "#631961",
    "#1FF1D3",
    "#B6F139",
    "#04AF11",
    "#66CB85",
    "#FC0CCF",
    "#E029B1",
    "#1DF31F",
    "#63DFAB",
    "#883B15",
    "#087A95",
    "#2C1BF6",
    "#6C4CEC",
    "#C00C70",
    "#F9B74C",
    "#0835AE",
    "#0E3AD3",
    "#E28C02",
    "#F1BCBF",
    "#C4C691",
    "#81EE52",
    "#850FCB",
    "#A8733F",
    "#AF8260",
    "#DC7392",
    "#D6647E",
    "#BDBDCC",
    "#2FB6E2",
    "#ED02E7",
    "#87FAE9",
    "#C82954",
    "#881D45",
    "#8C1C69",
    "#1B1136",
    "#31738D",
    "#617BA7",
    "#85A29F",
    "#F45E84",
    "#F8C35D",
    "#1A2FEE",
    "#34B058",
    "#0E92C9",
    "#221C06",
    "#6D29EC",
    "#91550D",
    "#BFF2E5",
    "#E030F9",
    "#31FEA8",
    "#90735E",
    "#720AF6",
    "#2F25EE",
    "#422ACC",
    "#5ACD45",
    "#6EEF40",
    "#CE170E",
    "#A06A35",
    "#74D6C3",
    "#927DA6",
    "#4842A7",
    "#E9F4C0",
    "#769754",
    "#E0F8A1",
    "#D56FA8",
    "#02B304",
    "#BD6495",
    "#50AE40",
    "#B0E2CF",
    "#39B6FC",
    "#703F0A",
    "#58571E",
    "#83D2EA",
    "#51306F",
    "#B4DC49",
    "#8E4030",
    "#BFCAAD",
    "#578CC5",
    "#952704",
    "#DC40DB",
    "#163C4F",
    "#25AF5C",
    "#861FE8",
    "#E5D69B",
    "#64CCE9",
    "#A6E9C8",
    "#269E45",
    "#8D5859",
    "#F49A55",
    "#926559",
    "#E62F61",
    "#8D08F7",
    "#BF7581",
    "#232571",
  ];

  // Получаем индекс цвета из хеш-кода числа
  const colorIndex = Math.abs(hashCode(num.toString())) % colors.length;

  // Возвращаем цвет
  return colors[colorIndex];
}
