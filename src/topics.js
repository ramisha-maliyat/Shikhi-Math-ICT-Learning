export const groups = [
  { id:'basics', en:'Number & Arithmetic', bn:'সংখ্যা ও পাটিগণিত', icon:'calculator', color:'mint', tagline:'Start from the foundations', countLabel:'Fundamentals' },
  { id:'algebra', en:'Algebra & Calculations', bn:'বীজগণিত ও হিসাব', icon:'sigma', color:'purple', tagline:'Patterns, equations and formulas', countLabel:'Algebra' },
  { id:'geometry', en:'Geometry', bn:'জ্যামিতি', icon:'shapes', color:'orange', tagline:'Understand shapes and space', countLabel:'Geometry' },
  { id:'higher', en:'Higher Math & Statistics', bn:'উচ্চতর গণিত ও পরিসংখ্যান', icon:'chart', color:'blue', tagline:'Advanced ideas made simple', countLabel:'Advanced' },
  { id:'ict', en:'ICT Number Systems', bn:'আইসিটি সংখ্যা পদ্ধতি', icon:'binary', color:'pink', tagline:'Binary, octal, decimal and hex', countLabel:'ICT' },
  { id:'numerical', en:'Numerical Methods', bn:'সংখ্যাতাত্ত্বিক পদ্ধতি', icon:'flask', color:'teal', tagline:'Algorithms with worked iterations', countLabel:'Methods' },
];

const data = {
  basics: String.raw`
Addition|যোগ|Combining two or more quantities to find their total.|দুই বা ততোধিক সংখ্যার মোট যোগফল বের করা।|a + b = sum|12 + 8 = 20
Subtraction|বিয়োগ|Finding the difference between two quantities.|একটি সংখ্যা থেকে অন্যটি বাদ দিয়ে পার্থক্য বের করা।|a − b = difference|17 − 9 = 8
Multiplication|গুণ|Repeated addition of the same amount.|একই সংখ্যাকে বারবার যোগ করার সংক্ষিপ্ত পদ্ধতি।|a × b = product|6 × 7 = 42
Division|ভাগ|Splitting a quantity into equal groups.|একটি পরিমাণকে সমান ভাগে ভাগ করা।|a ÷ b = quotient, b ≠ 0|48 ÷ 6 = 8
Number|সংখ্যা|A quantity represented by a symbol or symbols.|গণনা বা পরিমাণ বোঝানোর জন্য ব্যবহৃত মান।|0, 1, 2, 3, …|25 is a number
Digit|অঙ্ক|One of the ten symbols used to write decimal numbers.|দশমিক পদ্ধতিতে সংখ্যা লেখার দশটি চিহ্নের একটি।|0, 1, 2, …, 9|247 has three digits
Even Number|জোড় সংখ্যা|An integer evenly divisible by 2.|যে পূর্ণসংখ্যাকে ২ দিয়ে নিঃশেষে ভাগ করা যায়।|n mod 2 = 0|18 is even; 18 ÷ 2 = 9
Odd Number|বিজোড় সংখ্যা|An integer that leaves remainder 1 when divided by 2.|২ দিয়ে ভাগ করলে ভাগশেষ ১ থাকে এমন পূর্ণসংখ্যা।|n mod 2 ≠ 0|19 is odd
Prime Number|মৌলিক সংখ্যা|An integer greater than 1 with only two positive factors, 1 and itself.|১-এর চেয়ে বড় যে সংখ্যার গুণনীয়ক কেবল ১ এবং সংখ্যাটি নিজে।|Factors = {1, p}|13 is prime; factors 1 and 13
Composite Number|যৌগিক সংখ্যা|An integer greater than 1 having more than two positive factors.|১-এর চেয়ে বড় এবং দুইয়ের বেশি গুণনীয়ক আছে এমন সংখ্যা।|n = a × b, 1 < a,b < n|12 = 3 × 4, so composite
Rational Number|মূলদ সংখ্যা|A number expressible as the ratio of two integers.|দুটি পূর্ণসংখ্যার অনুপাত হিসেবে প্রকাশ করা যায় এমন সংখ্যা।|p/q, q ≠ 0|0.75 = 3/4
Irrational Number|অমূলদ সংখ্যা|A real number that cannot be expressed as a ratio of integers.|পূর্ণসংখ্যার অনুপাত দিয়ে প্রকাশ করা যায় না এমন বাস্তব সংখ্যা।|√2, π, …|√2 ≈ 1.414213…
Integer|পূর্ণসংখ্যা|Whole numbers together with their negatives and zero.|ধনাত্মক, ঋণাত্মক পূর্ণ সংখ্যা এবং শূন্য।|…, −2, −1, 0, 1, 2, …|−5 and 7 are integers
Fraction|ভগ্নাংশ|A part of a whole represented by numerator over denominator.|লব ও হর দিয়ে সম্পূর্ণের একটি অংশ প্রকাশ।|fraction = numerator/denominator|3/4 = three quarters
Decimal|দশমিক|A base-10 representation that may have a fractional part.|দশ ভিত্তিক সংখ্যা যেখানে দশমিকের পরও অঙ্ক থাকে।|3/4 = 0.75|0.25 = 1/4
Numerator|লব|The top number of a fraction.|ভগ্নাংশের উপরের সংখ্যাটি।|numerator / denominator|In 3/5, 3 is numerator
Denominator|হর|The bottom number of a fraction; cannot be zero.|ভগ্নাংশের নিচের সংখ্যা; শূন্য হতে পারে না।|numerator / denominator|In 3/5, 5 is denominator
`,
  algebra: String.raw`
Algebra|বীজগণিত|Using letters to represent unknown values and relationships.|অজানা মান বা সম্পর্ক প্রকাশে চলক ও প্রতীক ব্যবহার।|2x + 3 = 11|2x = 8, so x = 4
Unitary Method|ঐকিক নিয়ম|Find the value of one unit and scale it to many.|প্রথমে একটির মান বের করে তারপর চাহিদামতো সংখ্যার মান নির্ণয়।|unit cost = total ÷ number|5 pens cost 50; 1 pen = 10; 8 pens = 80
Ratio|অনুপাত|Comparison of two quantities by division.|ভাগের মাধ্যমে দুটি পরিমাণের তুলনা।|a : b = a/b|12 : 8 = 3 : 2
Proportion|সমানুপাত|Two ratios are equal.|দুটি অনুপাত সমান হওয়ার সম্পর্ক।|a/b = c/d ⇒ ad = bc|2/3 = 4/6
Percentage|শতকরা / শতকরা হার|A ratio expressed out of one hundred.|প্রতি ১০০-তে কত অংশ বোঝায়।|percent = part/whole × 100|25% of 200 = 50
Average / Mean|গড়|Sum of observations divided by the number of observations.|সব মানের যোগফলকে মোট মানের সংখ্যা দিয়ে ভাগ।|mean = Σx/n|Mean of 4, 6, 8 = 6
Profit / Gain|লাভ|When selling price exceeds cost price.|বিক্রয়মূল্য ক্রয়মূল্যের চেয়ে বেশি হলে লাভ হয়।|profit = SP − CP|CP 100, SP 130 → profit 30
Loss|ক্ষতি / লোকসান|When cost price exceeds selling price.|ক্রয়মূল্য বিক্রয়মূল্যের চেয়ে বেশি হলে ক্ষতি হয়।|loss = CP − SP|CP 100, SP 85 → loss 15
Principal / Capital|আসল / মূলধন|Initial money invested or borrowed before interest.|বিনিয়োগ বা ঋণের প্রাথমিক অর্থ।|amount = principal + interest|P = 1,000, interest = 100, amount = 1,100
Interest|সুদ / মুনাফা|Amount paid for using borrowed or invested capital.|অর্থ ধার বা বিনিয়োগের জন্য অতিরিক্ত অর্থ।|simple interest = P × R × T / 100|1000 at 5% for 2 yr → 100
L.C.M.|লসাগু (লঘিষ্ঠ সাধারণ গুণিতক)|Smallest positive integer divisible by every given number.|প্রদত্ত সংখ্যাগুলোর সবচেয়ে ছোট সাধারণ গুণিতক।|LCM(a,b) × GCD(a,b) = abs(ab)|LCM(6,8) = 24
H.C.F. / G.C.D.|গসাগু (গরিষ্ঠ সাধারণ গুণনীয়ক)|Largest positive integer dividing all given numbers.|যে সবচেয়ে বড় পূর্ণসংখ্যা সব প্রদত্ত সংখ্যাকে নিঃশেষে ভাগ করে।|GCD(a,b) = GCD(b, a mod b)|GCD(18,24) = 6
Square|বর্গ|A number multiplied by itself.|একটি সংখ্যাকে সেই সংখ্যা দিয়েই গুণ করা।|a² = a × a|7² = 49
Square Root|বর্গমূল|A number that produces the original value when squared.|কোনো সংখ্যার বর্গ করলে মূল সংখ্যাটি পাওয়া যায়।|√a × √a = a|√81 = 9
Cube|ঘন|A number multiplied by itself three times.|একটি সংখ্যাকে তিনবার গুণ করা।|a³ = a × a × a|4³ = 64
Cube Root|ঘনমূল|A number whose cube is the original.|যে সংখ্যার ঘন করলে মূল সংখ্যা পাওয়া যায়।|∛a × ∛a × ∛a = a|∛125 = 5
Equation|সমীকরণ|A statement that two mathematical expressions are equal.|দুটি গাণিতিক রাশি সমান বোঝানো উক্তি।|ax + b = c|3x + 2 = 14 ⇒ x = 4
Variable|চলক|A symbol representing a value that may vary.|মান পরিবর্তন করতে পারে এমন প্রতীক।|x, y, z|In y = 2x, x and y are variables
Constant|ধ্রুবক|A fixed value that does not change.|যে মান পরিবর্তন হয় না।|π ≈ 3.14159|In y = 3x + 7, 7 is constant
`,
  geometry: String.raw`
Geometry|জ্যামিতি|Study of points, lines, angles, shapes and space.|বিন্দু, রেখা, কোণ ও আকৃতির অধ্যয়ন।|2D and 3D shapes|Triangles and circles are geometric shapes
Point|বিন্দু|An exact position without size or dimension.|যার শুধু অবস্থান আছে, দৈর্ঘ্য-প্রস্থ নেই।|A(x, y)|Point A(2,3)
Line|রেখা|A straight path extending infinitely in both directions.|উভয় দিকে অসীম পর্যন্ত বিস্তৃত সরল পথ।|y = mx + c|y = 2x + 1
Angle|কোণ|Amount of turn between two rays meeting at a vertex.|একই বিন্দুতে মিলিত দুটি রশ্মির মধ্যকার ঘূর্ণন।|full turn = 360°|A 45° angle
Acute Angle|সূক্ষ্মকোণ|An angle larger than 0° but smaller than 90°.|০° অপেক্ষা বড় ও ৯০° অপেক্ষা ছোট কোণ।|0° < θ < 90°|45° is acute
Right Angle|সমকোণ|An angle exactly equal to 90°.|ঠিক ৯০° কোণ।|θ = 90°|Corner of a square
Obtuse Angle|স্থূলকোণ|An angle larger than 90° but smaller than 180°.|৯০° অপেক্ষা বড় এবং ১৮০° অপেক্ষা ছোট কোণ।|90° < θ < 180°|120° is obtuse
Straight Angle|সরলকোণ|An angle of exactly 180°.|ঠিক ১৮০° কোণ।|θ = 180°|A straight line forms 180°
Triangle|ত্রিভুজ|A polygon with three sides; internal angles sum to 180°.|তিন বাহুর বহুভুজ; অন্তঃকোণের যোগফল ১৮০°।|area = ½ × base × height|Base 8, height 5 → area 20
Quadrilateral|চতুর্ভুজ|A four-sided polygon whose inner angles total 360°.|চার বাহুবিশিষ্ট বহুভুজ; কোণের যোগফল ৩৬০°।|Σ interior angles = 360°|90° × 4 = 360°
Rectangle|আয়তক্ষেত্র|A quadrilateral with four right angles.|চারটি সমকোণবিশিষ্ট চতুর্ভুজ।|area = length × width|6 × 4 = 24 square units
Square (Shape)|বর্গক্ষেত্র|A quadrilateral with four equal sides and right angles.|চারটি সমান বাহু ও চারটি সমকোণবিশিষ্ট চতুর্ভুজ।|area = side²|5² = 25 square units
Parallelogram|সামান্তরিক|A quadrilateral with both pairs of opposite sides parallel.|বিপরীত বাহুদ্বয় পরস্পর সমান্তরাল চতুর্ভুজ।|area = base × height|9 × 3 = 27
Rhombus|রম্বস|A quadrilateral with all four sides equal.|চারটি সমান বাহুবিশিষ্ট চতুর্ভুজ।|area = d₁ × d₂ / 2|Diagonals 8,6 → 24
Trapezium / Trapezoid|ট্রাপিজিয়াম|A quadrilateral with at least one pair of parallel sides.|অন্তত এক জোড়া সমান্তরাল বাহুবিশিষ্ট চতুর্ভুজ।|area = (a+b) × h / 2|Bases 6,10; h 4 → 32
Circle|বৃত্ত|All points of a plane equally distant from a centre.|কেন্দ্র থেকে সমদূরবর্তী বিন্দুগুলোর অবস্থান।|area = πr²|r=3 → area ≈ 28.274
Radius|ব্যাসার্ধ|Distance from the circle centre to its edge.|বৃত্তের কেন্দ্র থেকে পরিধি পর্যন্ত দূরত্ব।|r = d/2|Diameter 10 → radius 5
Diameter|ব্যাস|Distance across a circle through its centre.|কেন্দ্র দিয়ে অতিক্রমকারী প্রান্ত থেকে প্রান্তের দূরত্ব।|d = 2r|Radius 7 → diameter 14
Circumference|পরিধি (বৃত্ত)|Length of the boundary of a circle.|বৃত্তের বাইরের সীমানার দৈর্ঘ্য।|C = 2πr|r=7 → C ≈ 43.982
Chord|জ্যা|A line segment joining two points on a circle.|বৃত্তের পরিধির দুটি বিন্দুর সংযোগ রেখাংশ।|diameter is the longest chord|Diameter passes through centre
Area|ক্ষেত্রফল|Amount of surface enclosed by a 2D shape.|সমতল আকৃতির ভেতরের স্থানের পরিমাণ।|rectangle area = l × w|5 × 3 = 15 square units
Perimeter|পরিসীমা|Total distance around the boundary of a polygon.|একটি আকৃতির চারপাশের মোট দৈর্ঘ্য।|rectangle perimeter = 2(l+w)|2(5+3) = 16 units
`,
  higher: String.raw`
Trigonometry|ত্রিকোণমিতি|Relates angles of triangles to ratios of their sides.|ত্রিভুজের কোণ ও বাহুগুলোর অনুপাতের সম্পর্ক।|sin θ = opposite/hypotenuse|sin 30° = 1/2
Mensuration|পরিমিতি|Calculating length, area, surface area and volume.|দৈর্ঘ্য, ক্ষেত্রফল, তলের ক্ষেত্রফল ও আয়তন নির্ণয়।|cuboid volume = l × w × h|2 × 3 × 4 = 24 cubic units
Calculus|ক্যালকুলাস|Study of continuous change and accumulation.|অবিচ্ছিন্ন পরিবর্তন ও যোগসঞ্চয়ের গণিত।|d(x²)/dx = 2x|At x=3 slope = 6
Statistics|পরিসংখ্যান|Collecting, describing and analysing data.|তথ্য সংগ্রহ, বর্ণনা ও বিশ্লেষণ।|mean = Σx/n|Mean of 3, 6, 9 = 6
Data|উপাত্ত / তথ্য|Recorded observations used to answer questions.|বিশ্লেষণের কাজে ব্যবহৃত পর্যবেক্ষণ বা তথ্য।|data = {x₁, x₂, …}|Scores: 70, 80, 90
Median|মধ্যক|Middle value after arranging observations in order.|মানগুলো ক্রমানুসারে সাজালে মাঝের মান।|odd n → middle; even n → average of middle two|2, 3, 8 → median 3
Mode|প্রচুরক|The most frequent value in a dataset.|যে মানটি সবচেয়ে বেশি বার এসেছে।|mode = most frequent value|2,2,3,4 → mode 2
Permutation|বিন্যাস|Number of arrangements where order matters.|ক্রম গুরুত্বপূর্ণ হলে সাজানোর মোট উপায়।|nPr = n!/(n−r)!|5P2 = 5 × 4 = 20
Combination|সমাবেশ|Number of selections where order does not matter.|ক্রম গুরুত্বপূর্ণ নয় এমন বাছাইয়ের মোট উপায়।|nCr = n!/[r!(n−r)!]|5C2 = 10
Probability|সম্ভাব্যতা|Likelihood of an event, between 0 and 1.|কোনো ঘটনা ঘটার সম্ভাবনা, ০ থেকে ১-এর মধ্যে।|P(E) = favourable outcomes / total outcomes|P(even on dice) = 3/6 = 1/2
`,
  ict: String.raw`
Decimal Number System (Base 10)|দশমিক সংখ্যা পদ্ধতি|Uses digits 0 through 9 with place values in powers of 10.|০ থেকে ৯ অঙ্ক ব্যবহার করা ১০ ভিত্তিক সংখ্যা পদ্ধতি।|347₁₀ = 3×10²+4×10¹+7|347₁₀ = 347
Binary Number System (Base 2)|বাইনারি সংখ্যা পদ্ধতি|Uses only 0 and 1; fundamental to digital computing.|০ ও ১ ব্যবহার করা ডিজিটাল কম্পিউটারের মূল সংখ্যা পদ্ধতি।|1011₂ = 1×2³+0×2²+1×2¹+1|1011₂ = 11₁₀
Octal Number System (Base 8)|অক্টাল সংখ্যা পদ্ধতি|Uses digits 0 through 7 with powers of 8.|০ থেকে ৭ অঙ্কের ৮ ভিত্তিক পদ্ধতি।|17₈ = 1×8+7|17₈ = 15₁₀
Hexadecimal Number System (Base 16)|হেক্সাডেসিম্যাল সংখ্যা পদ্ধতি|Uses 0-9 and A-F, representing values 0 through 15.|০–৯ ও A–F অঙ্ক ব্যবহার করা ১৬ ভিত্তিক পদ্ধতি।|2A₁₆ = 2×16+10|2A₁₆ = 42₁₀
Decimal to Binary / Octal / Hexadecimal Conversion|দশমিক থেকে বাইনারি / অক্টাল / হেক্স|Convert a base-10 number by repeated division or multiplication.|১০ ভিত্তিক সংখ্যা অন্য ভিত্তিতে রূপান্তর।|13₁₀ = 1101₂ = 15₈ = D₁₆|13 ÷ 2 repeatedly gives 1101₂
Binary to Decimal / Octal / Hexadecimal Conversion|বাইনারি থেকে অন্য সংখ্যা পদ্ধতি|Convert base-2 digits using positional weights or groups.|২ ভিত্তিক সংখ্যা ১০, ৮ বা ১৬ ভিত্তিতে রূপান্তর।|1111₂ = 15₁₀ = 17₈ = F₁₆|1111₂ = 8+4+2+1 = 15
Octal to Binary / Decimal / Hexadecimal Conversion|অক্টাল থেকে অন্য সংখ্যা পদ্ধতি|Expand base-8 places or convert octal digits to 3-bit groups.|৮ ভিত্তিক সংখ্যা অন্য ভিত্তিতে রূপান্তর।|27₈ = 23₁₀ = 10111₂ = 17₁₆|2×8+7=23
Hexadecimal to Binary / Octal / Decimal Conversion|হেক্স থেকে অন্য সংখ্যা পদ্ধতি|Convert hexadecimal digits via 4-bit groups or positional weights.|১৬ ভিত্তিক সংখ্যা অন্য ভিত্তিতে রূপান্তর।|1F₁₆ = 31₁₀ = 11111₂ = 37₈|1×16+15=31
`,
  numerical: String.raw`
Bisection Method|দ্বিখণ্ডন পদ্ধতি|Brackets a root where f(a) and f(b) have opposite signs; halves the interval repeatedly.|বিপরীত চিহ্নের দুই প্রান্তের মাঝখান বারবার অর্ধেক করে মূল নির্ণয়।|c = (a+b)/2|For f(x)=x²−4, [1,3] has root 2
Newton-Raphson Method|নিউটন-রাফসন পদ্ধতি|Uses tangent lines to approximate a root from a starting value.|স্পর্শকের ঢাল দিয়ে প্রাথমিক অনুমান থেকে মূল বের করা।|xₙ₊₁ = xₙ − f(xₙ)/f′(xₙ)|For x²−2, x₀=1.5 → x₁≈1.416667
Secant Method|সেক্যান্ট পদ্ধতি|Approximates a root using two recent points without an explicit derivative.|দুটি প্রাথমিক অনুমান ব্যবহার করে অন্তরক ছাড়াই মূল নির্ণয়।|x₂ = x₁ − f(x₁)(x₁−x₀)/(f(x₁)−f(x₀))|For x²−4, start 1 and 3
Regula-Falsi Method (False Position)|রেগুলা-ফলসি পদ্ধতি|Uses a secant line while keeping a sign-changing bracket.|বিপরীত চিহ্নবিশিষ্ট সীমা ধরে রেখা দিয়ে মূলের অনুমান।|c = (a f(b)−b f(a))/(f(b)−f(a))|Start f(x)=x²−4 in [1,3]
Gauss Elimination Method|গাউস অপসারণ পদ্ধতি|Uses row operations to reach upper triangular form followed by back substitution.|সারি রূপান্তরের মাধ্যমে ঊর্ধ্ব ত্রিভুজাকার আকার ও বিপরীত প্রতিস্থাপন।|Ax = b → upper triangular system|2x+y=5; x+y=3 → x=2, y=1
Gauss-Jordan Elimination Method|গাউস-জর্ডান পদ্ধতি|Reduces an augmented matrix to reduced row-echelon form.|বর্ধিত ম্যাট্রিক্সকে সরলীকৃত সারি-সোপান আকারে আনা।|[A|b] → [I|x]|2x+y=5; x+y=3 → [2,1]
Gauss-Seidel Iteration Method|গাউস-সাইডেল পুনরাবৃত্তি|Iteratively updates each variable immediately within a linear system.|প্রতি ধাপে নতুন মান সঙ্গে সঙ্গে ব্যবহার করে সমীকরণ সমাধান।|xᵢ⁽ᵏ⁺¹⁾ = (bᵢ−Σaᵢⱼxⱼ)/aᵢᵢ|Works well on strictly diagonally dominant systems
Jacobi Iteration Method|জ্যাকোবি পুনরাবৃত্তি|Computes each new variable from the previous iteration values.|আগের ধাপের মান দিয়ে সব নতুন চলকের মান একসঙ্গে নির্ণয়।|x⁽ᵏ⁺¹⁾ = D⁻¹(b−(L+U)x⁽ᵏ⁾)|Useful for diagonally dominant systems
Newton’s Forward Interpolation|নিউটনের অগ্রবর্তী আন্তঃপ্রক্ষেপ|Uses forward differences to estimate values near the start of equally spaced data.|সমান ব্যবধানের ডেটার শুরুর দিকের মান অনুমান।|f(x) ≈ y₀ + pΔy₀ + p(p−1)Δ²y₀/2! + …|Points (0,1),(1,2),(2,5) → f(1.5)≈3.25
Newton’s Backward Interpolation|নিউটনের পশ্চাৎবর্তী আন্তঃপ্রক্ষেপ|Uses backward differences for equally spaced data near the end.|সমান ব্যবধানের ডেটার শেষের দিকের মান অনুমান।|f(x) ≈ yₙ + p∇yₙ + p(p+1)∇²yₙ/2! + …|Points (0,1),(1,2),(2,5) → f(1.5)≈3.25
Lagrange’s Interpolation|ল্যাগ্রাঞ্জ আন্তঃপ্রক্ষেপ|Constructs an interpolating polynomial from data at distinct x-values.|পৃথক x-মানের উপাত্ত দিয়ে বহুপদী নির্মাণ করে মধ্যবর্তী মান নির্ণয়।|P(x) = Σ yᵢ ∏[(x−xⱼ)/(xᵢ−xⱼ)]|Points (0,1),(1,2),(2,5) → f(1.5)=3.25
Trapezoidal Rule|ট্রাপিজয়ডাল নিয়ম|Approximates an integral by adding the areas of trapezoids.|ট্রাপিজিয়ামের ক্ষেত্রফল যোগ করে নির্দিষ্ট সমাকলন অনুমান।|I ≈ h/2 [f₀ + 2Σfᵢ + fₙ]|∫₀¹ x² dx with n=2 → 0.375
Simpson's 1/3 Rule|সিম্পসনের ১/৩ নিয়ম|Uses parabolic arcs; requires an even number of subintervals.|পরাবৃত্ত দিয়ে সমাকলন; উপবিভাগ সংখ্যা জোড় হতে হবে।|I ≈ h/3 [f₀+4Σfodd+2Σfeven+fₙ]|∫₀¹ x² dx = 1/3 with n=2
Simpson's 3/8 Rule|সিম্পসনের ৩/৮ নিয়ম|Uses cubic fitting; subinterval count must be divisible by three.|ঘন বহুপদীভিত্তিক অনুমান; উপবিভাগ ৩-এর গুণিতক হতে হবে।|I ≈ 3h/8 [f₀+fₙ+3Σothers+2Σmultiples-of-3]|∫₀³ x² dx = 9 with n=3
Euler's Method|ইউলারের পদ্ধতি|Approximates solutions of dy/dx=f(x,y) using tangent-line steps.|ঢাল ব্যবহার করে ডিফারেনশিয়াল সমীকরণের কাছাকাছি সমাধান।|yₙ₊₁ = yₙ + h f(xₙ,yₙ)|y′=y, y(0)=1, h=.1 → y₁=1.1
Runge-Kutta Methods (RK4)|রুঙ্গে-কুটা ৪র্থ ক্রম|Uses four weighted slope estimates per step for accurate ODE solutions.|প্রতিটি ধাপে চারটি ঢাল মিলিয়ে তুলনামূলক নির্ভুল ODE সমাধান।|yₙ₊₁ = yₙ + (k₁+2k₂+2k₃+k₄)/6|y′=y, y(0)=1, h=.1 → y₁≈1.105171
`
};

export const topics = Object.entries(data).flatMap(([group, text]) => text.trim().split('\n').map((line, i) => {
  const [en, bn, descriptionEn, descriptionBn, formula, example] = line.split('|');
  if (![en,bn,descriptionEn,descriptionBn,formula,example].every(Boolean)) throw Error(`Invalid topic data ${group}:${i+1}`);
  return { id:`${group}-${i}`, group, en, bn, descriptionEn, descriptionBn, formula, example };
}));

export const topicById = Object.fromEntries(topics.map(t => [t.id,t]));
export const groupById = Object.fromEntries(groups.map(g => [g.id,g]));
export function findTopic(query) {
  const q = query.toLowerCase().trim();
  if (!q) return null;
  return topics.find(t => t.en.toLowerCase() === q || t.bn === q) ||
     topics.find(t => t.en.toLowerCase().length > 5 && q.includes(t.en.toLowerCase())) ||
     topics.find(t => t.bn.length > 3 && q.includes(t.bn)) || null;
}
export function searchTopics(query, group = 'all') {
  const q = (query || '').trim().toLowerCase();
  return topics.filter(t => (group === 'all' || t.group === group) && (!q || [t.en,t.bn,t.descriptionEn,t.descriptionBn].some(s => s.toLowerCase().includes(q))));
}
