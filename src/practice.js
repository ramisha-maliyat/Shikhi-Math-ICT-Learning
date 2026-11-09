import { convertBase, gcd } from './math.js';
const rand=(a,b)=>Math.floor(Math.random()*(b-a+1))+a;
const shuffle=list=>[...list].sort(()=>Math.random()-0.5);
const numericQuestion=(question,correct,explanation,unit='')=>{
  const n=Number(correct),str=String(correct)+unit;
  let choices=new Set([str]);let tries=0;
  while(choices.size<4 && tries++<100){const offset=[-3,-2,-1,1,2,3,4,5,10,-10][rand(0,9)];const val=n+offset;if(val>=0||n<0)choices.add(String(val)+unit);}
  return {question,options:shuffle([...choices].slice(0,4)),answer:str,explanation};
};
const choice=(question,answer,options,explanation)=>({question,answer,options:shuffle([answer,...options]),explanation});
export function createQuiz(category='basics',difficulty='easy') {
  const hard=difficulty==='hard';const questions=[];
  for(let i=0;i<5;i++) {
    const a=rand(hard?11:2,hard?40:15),b=rand(2,hard?25:12);
    let q;
    if(category==='basics') {
      const type=i%5;
      if(type===0)q=numericQuestion(`${a} + ${b} = ?`,a+b,`Add ${a} and ${b} to get ${a+b}.`);
      if(type===1)q=numericQuestion(`${a+b} − ${b} = ?`,a,`Subtract ${b} from ${a+b} to get ${a}.`);
      if(type===2)q=numericQuestion(`${a} × ${b} = ?`,a*b,`Multiplication means repeated addition: ${a} × ${b} = ${a*b}.`);
      if(type===3)q=numericQuestion(`${a*b} ÷ ${a} = ?`,b,`Since ${a} × ${b} = ${a*b}, division gives ${b}.`);
      if(type===4)q=choice(`Is ${a*2} even or odd?`,'Even',['Odd','Prime','Neither'],`${a*2} is divisible by 2, so it is even.`);
    }
    if(category==='algebra') {
      const type=i%5;
      if(type===0)q=numericQuestion(`Solve: ${a}x + ${b} = ${a*3+b}. Find x.`,3,`Subtract ${b}, then divide by ${a}. x = 3.`);
      if(type===1)q=numericQuestion(`What is ${b*5}% of ${a*20}?`,a*b,`${b*5}/100 × ${a*20} = ${a*b}.`);
      if(type===2)q=numericQuestion(`Find the HCF of ${a*2} and ${a*3}.`,a,`HCF(${a*2}, ${a*3}) = ${a}.`);
      if(type===3)q=numericQuestion(`A product costs ${a*10} and sells for ${a*10+b}. Profit?`,b,`Profit = selling price − cost price = ${b}.`);
      if(type===4)q=numericQuestion(`If 4 notebooks cost ${a*4}, what do 7 cost?`,a*7,`One notebook costs ${a}; 7 cost ${a*7}.`);
    }
    if(category==='geometry') {
      const type=i%5;
      if(type===0)q=numericQuestion(`Area of a rectangle with length ${a}, width ${b}?`,a*b,`Area = length × width = ${a*b}.`);
      if(type===1)q=numericQuestion(`Perimeter of a square with side ${a}?`,4*a,`Perimeter = 4 × ${a} = ${4*a}.`);
      if(type===2)q=numericQuestion(`A triangle has base ${a*2} and height ${b}. Area?`,a*b,`Area = ½ × ${a*2} × ${b} = ${a*b}.`);
      if(type===3)q=choice('How many degrees are in a right angle?','90°',['45°','180°','360°'],'A right angle measures exactly 90°.');
      if(type===4)q=numericQuestion(`A circle has radius ${a}. What is its diameter?`,2*a,`Diameter = 2 × radius = ${2*a}.`);
    }
    if(category==='higher') {
      const type=i%5;
      if(type===0)q=numericQuestion(`Find the mean of ${a}, ${a+2}, ${a+4}.`,a+2,`Mean = (${a}+${a+2}+${a+4})/3 = ${a+2}.`);
      if(type===1)q=numericQuestion(`Find the median: ${a}, ${a+6}, ${a+2}.`,a+2,`Sort the numbers: ${a}, ${a+2}, ${a+6}. Middle = ${a+2}.`);
      if(type===2)q=numericQuestion(`How many ways to select 2 from 5? 5C2 = ?`,10,'5C2 = 5! / (2!3!) = 10.');
      if(type===3)q=choice('Probability of rolling an even number with a fair die?','1/2',['1/3','1/6','2/3'],'Even outcomes: 2, 4, 6, so 3/6 = 1/2.');
      if(type===4)q=numericQuestion(`If f(x)=x², what is f′(${b})?`,2*b,`f′(x)=2x, hence f′(${b})=${2*b}.`);
    }
    if(category==='ict') {
      const value=rand(5,hard?255:31);
      const options={
        0: {base:2,label:'binary'},1:{base:8,label:'octal'},2:{base:16,label:'hexadecimal'},3:{base:2,label:'binary'},4:{base:16,label:'hexadecimal'}
      }[i];
      const correct=convertBase(String(value),10).conversions[options.base];
      const wrong=new Set();for(let d=1;d<9;d++){const v=convertBase(String(value+d),10).conversions[options.base];if(v!==correct)wrong.add(v);}
      q=choice(`Convert ${value} (decimal) to ${options.label}.`,correct,[...wrong].slice(0,3),`Convert decimal ${value} by repeated division by ${options.base}. The answer is ${correct}.`);
    }
    if(category==='numerical') {
      const options=[
        ['Which method repeatedly halves a bracket containing a root?','Bisection',['Secant','Euler','Jacobi'],'Bisection always selects the midpoint of a sign-changing bracket.'],
        ["Simpson's 1/3 rule requires the number of subintervals to be…",'Even',['Odd','A multiple of 3','Always 1'],'The 1/3 rule needs n divisible by 2.'],
        ['Which method solves an ODE using four weighted slopes?','RK4',['Euler','Bisection','Gauss–Jordan'],'Fourth-order Runge–Kutta uses k₁, k₂, k₃ and k₄.'],
        ['Which method uses newly updated values immediately?','Gauss–Seidel',['Jacobi','Lagrange','Trapezoidal'],'Gauss–Seidel updates each variable in place.'],
        ['Which interpolation works with unevenly spaced x-values?','Lagrange',['Newton forward','Newton backward','Trapezoidal'],'Lagrange interpolation accepts distinct, unequally spaced x-values.']
      ];q=choice(...options[i]);
    }
    questions.push(q);
  }
  return questions;
}
