export const departmentLabels = {
  'mathematics-computer-science': 'สาขาวิชาคณิตศาสตร์และวิทยาการคอมพิวเตอร์',
  'chemistry': 'สาขาวิชาเคมี',
  'physics': 'สาขาวิชาฟิสิกส์',
  'biology': 'สาขาวิชาชีววิทยา',
  'botany-genetics': 'สาขาวิชาพฤกษศาสตร์',
  'chemical-technology': 'สาขาวิชาเคมีเทคนิค',
  'environmental-science': 'สาขาวิชาวิทยาศาสตร์สิ่งแวดล้อม',
  'materials-science': 'สาขาวิชาวัสดุศาสตร์',
  'biotechnology-international': 'สาขาวิชาเทคโนโลยีชีวภาพ (นานาชาติ)',
  'microbiology': 'สาขาวิชาจุลชีววิทยา',
  'marine-science': 'สาขาวิชาวิทยาศาสตร์ทางทะเล',
  'applied-chemistry': 'สาขาวิชาเคมีประยุกต์',
  'food-technology': 'สาขาวิชาเทคโนโลยีทางอาหาร',
  'geology': 'สาขาวิชาธรณีวิทยา',
  'biochemistry': 'สาขาวิชาชีวเคมี',
  'imaging-printing-technology': 'สาขาวิชาเทคโนโลยีทางภาพและการพิมพ์',
  'industrial-science-technology': 'สาขาวิชาวิทยาศาสตร์และเทคโนโลยีอุตสาหการ'
} as const;

export type DepartmentId = keyof typeof departmentLabels;
export const departmentIds = Object.keys(departmentLabels) as Array<keyof typeof departmentLabels>;

// Lookup from new ID keys to old acronym keys
export const departmentAcronymLookup: Record<DepartmentId, string> = {
  'mathematics-computer-science': 'MathCom',
  'chemistry': 'Chem',
  'physics': 'Physics',
  'biology': 'Bio',
  'botany-genetics': 'BotGen',
  'chemical-technology': 'Chem tech',
  'environmental-science': 'Envi',
  'materials-science': 'MatSci',
  'biotechnology-international': 'BBTech',
  'microbiology': 'Micro',
  'marine-science': 'Marine',
  'applied-chemistry': 'BSAC',
  'food-technology': 'FoodTech',
  'geology': 'Geo',
  'biochemistry': 'Biochem',
  'imaging-printing-technology': 'ImPrint',
  'industrial-science-technology': 'BISTech'
};
