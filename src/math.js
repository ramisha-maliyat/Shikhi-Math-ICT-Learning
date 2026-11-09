// Small safe math parser: no JavaScript eval(), Function(), or external runtime.
const DIGITS_BN = '০১২৩৪৫৬৭৮৯';
export const westernDigits = value => String(value ?? '').replace(/[০-৯]/g, c => String(DIGITS_BN.indexOf(c)));
export const normalizeMath = text => westernDigits(text).replace(/[×·]/g,'*').replace(/[÷]/g,'/').replace(/[−–]/g,'-').replace(/[π]/g,'pi').replace(/[²]/g,'^2').replace(/[³]/g,'^3').replace(/\s+/g,' ').trim();
export const fmt = (n, digits=8) => {
  if (typeof n === 'bigint') return n.toString();
  if (!Number.isFinite(n)) return String(n);
  if (Math.abs(n) < 1e-12) return '0';
  const rounded = Number(n.toPrecision(Math.min(digits+3, 14)));
  return String(rounded);
};

const FUNCTION_MAP = { sin:Math.sin, cos:Math.cos, tan:Math.tan, asin:Math.asin, acos:Math.acos, atan:Math.atan, log:Math.log10, ln:Math.log, log10:Math.log10, sqrt:Math.sqrt, abs:Math.abs, exp:Math.exp, floor:Math.floor, ceil:Math.ceil, round:Math.round };
function tokenize(expression) {
  const s = normalizeMath(expression);
  if (!s || s.length > 300) throw Error('Enter an expression up to 300 characters.');
  let pos=0; const tokens=[];
  while (pos < s.length) {
    if (/\s/.test(s[pos])) { pos++; continue; }
    const rest=s.slice(pos);
    const number=rest.match(/^(?:\d+(?:\.\d*)?|\.\d+)(?:e[+-]?\d+)?/i);
    if(number) { tokens.push({type:'number',value:Number(number[0])}); pos+=number[0].length; continue; }
    const ident=rest.match(/^[a-zA-Z]+/);
    if(ident) { const val=ident[0].toLowerCase(); if(!['x','y','pi','e',...Object.keys(FUNCTION_MAP)].includes(val)) throw Error(`Unsupported symbol: ${val}. Use x, y, pi, e, or standard functions.`); tokens.push({type:'name',value:val}); pos+=ident[0].length; continue; }
    if('+-*/^()%'.includes(s[pos])) { tokens.push({type:s[pos], value:s[pos]}); pos++; continue; }
    throw Error(`Unsupported character: ${s[pos]}`);
  }
  const result=[];
  for(let i=0;i<tokens.length;i++) {
    const a=tokens[i], b=tokens[i+1]; result.push(a);
    if (!b) continue;
    const aEnd=a.type==='number'||a.type===')'||a.type==='%'||(a.type==='name' && !FUNCTION_MAP[a.value]);
    const bStart=b.type==='number'||b.type==='('||b.type==='name';
    if(aEnd && bStart) result.push({type:'*',value:'*'});
  }
  result.push({type:'end'}); return result;
}
export function evaluateExpression(expression, variables={}) {
  const tokens=tokenize(expression); let index=0, depth=0;
  const peek=()=>tokens[index];
  const eat=t=> { if(peek().type!==t) throw Error(`Expected '${t}'.`); return tokens[index++]; };
  const priority={'+':1,'-':1,'*':2,'/':2,'^':4};
  function atom() {
    if(++depth>70) throw Error('Expression is too deeply nested.');
    let value; const tok=peek();
    if(tok.type==='+'||tok.type==='-') { index++; value=(tok.type==='-'?-1:1)*expressionParser(3); }
    else if(tok.type==='number') { index++; value=tok.value; }
    else if(tok.type==='(') { index++; value=expressionParser(0); eat(')'); }
    else if(tok.type==='name') {
      index++;
      if(tok.value==='pi') value=Math.PI;
      else if(tok.value==='e') value=Math.E;
      else if(['x','y'].includes(tok.value)) {
        if (!Number.isFinite(variables[tok.value])) throw Error(`Provide a value for ${tok.value}.`);
        value=variables[tok.value];
      } else {
        eat('('); const inner=expressionParser(0); eat(')'); value=FUNCTION_MAP[tok.value](inner);
      }
    } else throw Error(`Unexpected input near '${tok.value || 'end'}'.`);
    while(peek().type==='%') { index++; value/=100; }
    depth--; return value;
  }
  function expressionParser(min) {
    let left=atom();
    while(priority[peek().type] !== undefined && priority[peek().type]>=min) {
      const op=eat(peek().type).type, p=priority[op];
      const right=expressionParser(p + (op==='^'?0:1));
      if(op==='+')left+=right;
      else if(op==='-')left-=right;
      else if(op==='*')left*=right;
      else if(op==='/') { if(right===0) throw Error('Division by zero is undefined.'); left/=right; }
      else left=Math.pow(left,right);
      if(!Number.isFinite(left)) throw Error('The result is not a finite real number. Check the input.');
    }
    return left;
  }
  const value=expressionParser(0);
  if(peek().type!=='end') throw Error(`Unexpected input near '${peek().value || 'end'}'.`);
  if(!Number.isFinite(value)) throw Error('The expression is outside the real-number domain.');
  return value;
}
export const compileExpression = (expression, allowed=['x']) => {
  // Validate once, but evaluate with provided variable values at each iteration.
  const testVars={x:1.234,y:1.234};
  const s=normalizeMath(expression);
  if(!allowed.includes('x') && /\bx\b/i.test(s)) throw Error('This formula must not contain x.');
  if(!allowed.includes('y') && /\by\b/i.test(s)) throw Error('Only x is allowed in this formula.');
  // Avoid rejecting functions that have domain restrictions at test point: syntax only is checked by initial test.
  try { evaluateExpression(s, testVars); } catch(e) { if(!/finite real number|Division by zero/i.test(e.message)) throw e; }
  return vars=>evaluateExpression(s,vars);
};
export function solveEquation(input) {
  const text=normalizeMath(input).replace(/^solve\s*/i,'').replace(/\s*for\s*x\s*$/i,'');
  const parts=text.split('='); if(parts.length>2 || !parts[0]) throw Error('Enter an equation like 2x + 5 = 15.');
  const f=x=>evaluateExpression(parts[0],{x})-evaluateExpression(parts[1] || '0',{x});
  const c=f(0), at1=f(1), atMinus=f(-1);
  const a=(at1+atMinus-2*c)/2, b=(at1-atMinus)/2;
  for(const x of [2,3,-2]) if(Math.abs(f(x)-(a*x*x+b*x+c))>1e-6*Math.max(1,Math.abs(f(x)))) throw Error('The built-in equation solver handles linear and quadratic equations. Use AI Tutor for more complex forms.');
  if(Math.abs(a)<1e-10) {
    if(Math.abs(b)<1e-10) return { answer: Math.abs(c)<1e-10?'Infinitely many solutions':'No solution', steps: [`Simplify: ${fmt(c)} = 0`, Math.abs(c)<1e-10?'This identity is always true.':'This is a contradiction.'] };
    const x=-c/b;
    return { answer:`x = ${fmt(x)}`, steps:[`Rearrange into ax + b = 0: ${fmt(b)}x ${c<0?'-':'+'} ${fmt(Math.abs(c))} = 0`,`Subtract the constant: ${fmt(b)}x = ${fmt(-c)}`,`Divide both sides by ${fmt(b)}: x = ${fmt(x)}`,`Check: left side − right side = ${fmt(f(x))}`] };
  }
  const disc=b*b-4*a*c;
  const base=[`Standard form: ${fmt(a)}x² ${b<0?'-':'+'} ${fmt(Math.abs(b))}x ${c<0?'-':'+'} ${fmt(Math.abs(c))} = 0`,`Discriminant D = b² − 4ac = ${fmt(disc)}`];
  if(disc<0) { const real=-b/(2*a),imag=Math.sqrt(-disc)/Math.abs(2*a);return {answer:`x = ${fmt(real)} ± ${fmt(imag)}i`,steps:[...base,'D < 0, so there are no real roots.',`Complex roots: ${fmt(real)} ± ${fmt(imag)}i`]}; }
  const x1=(-b+Math.sqrt(disc))/(2*a),x2=(-b-Math.sqrt(disc))/(2*a);
  return {answer:`x = ${fmt(x1)}${Math.abs(x1-x2)>1e-10 ? ` or x = ${fmt(x2)}`:''}`,steps:[...base,`Quadratic formula: x = (−b ± √D) / (2a)`,`Substitute a=${fmt(a)}, b=${fmt(b)}, c=${fmt(c)}`,`Roots: ${fmt(x1)} and ${fmt(x2)}`,`Check f(x₁) = ${fmt(f(x1))}; f(x₂) = ${fmt(f(x2))}`]};
}

export const gcd=(a,b)=>{ a=Math.abs(Math.trunc(a)); b=Math.abs(Math.trunc(b)); while(b){[a,b]=[b,a%b];} return a; };
export const lcm=(a,b)=>a===0||b===0?0:Math.abs(a/gcd(a,b)*b);
export const factorial=n=>{if(!Number.isInteger(n)||n<0||n>170)throw Error('Factorial needs an integer from 0 to 170.');let v=1;for(let i=2;i<=n;i++)v*=i;return v;};
export const primeCheck=n=>{ if(!Number.isSafeInteger(n)||n<2)return false;for(let i=2;i*i<=n;i++)if(n%i===0)return false;return true; };
export const numberList=input=>{const nums=westernDigits(input).split(/[\s,;]+/).filter(Boolean).map(Number);if(!nums.length||nums.length>1000||nums.some(n=>!Number.isFinite(n))) throw Error('Enter numbers separated by commas, for example 4, 6, 8.');return nums;};
export function stats(values) {
  const sorted=[...values].sort((a,b)=>a-b), n=sorted.length;
  const mean=values.reduce((s,n)=>s+n,0)/n;
  const median=n%2?sorted[(n-1)/2]:(sorted[n/2-1]+sorted[n/2])/2;
  const frequency=new Map(); values.forEach(v=>frequency.set(v,(frequency.get(v)||0)+1));
  const highest=Math.max(...frequency.values()); const modes=[...frequency].filter(([,c])=>c===highest).map(([x])=>x);
  const mode=highest===1?'No mode':modes.map(fmt).join(', ');
  const variance=values.reduce((s,x)=>s+(x-mean)**2,0)/n;
  return {mean,median,mode,variance,standardDeviation:Math.sqrt(variance),sorted};
}
function requireNum(val,label) {const n=Number(westernDigits(val));if(String(val??'').trim()===''||!Number.isFinite(n))throw Error(`Enter a valid number for ${label}.`);return n;}
function fractionRead(str) {
  const s=westernDigits(str).trim();const match=s.match(/^([+-]?\d+)\s*\/\s*([+-]?\d+)$/);
  if(!match)throw Error('Use fraction format 3/4 or -2/5.');
  let num=Number(match[1]),den=Number(match[2]);if(!Number.isSafeInteger(num)||!Number.isSafeInteger(den)||den===0)throw Error('Fractions must have safe integer values and a nonzero denominator.');return [num,den];
}
export const mathModes = [
  {id:'expression',en:'Expression',bn:'গাণিতিক রাশি'},
  {id:'equation',en:'Equation',bn:'সমীকরণ'},
  {id:'percentage',en:'Percentage',bn:'শতকরা'},
  {id:'fraction',en:'Fractions',bn:'ভগ্নাংশ'},
  {id:'ratio',en:'Ratio',bn:'অনুপাত'},
  {id:'gcd',en:'LCM & HCF',bn:'লসাগু ও গসাগু'},
  {id:'geometry',en:'Geometry',bn:'জ্যামিতি'},
  {id:'statistics',en:'Statistics',bn:'পরিসংখ্যান'},
  {id:'combinatorics',en:'nPr & nCr',bn:'বিন্যাস ও সমাবেশ'},
  {id:'interest',en:'Simple Interest',bn:'সরল সুদ'},
  {id:'profit',en:'Profit / Loss',bn:'লাভ / ক্ষতি'},
  {id:'unitary',en:'Unitary Method',bn:'ঐকিক নিয়ম'},
  {id:'probability',en:'Probability',bn:'সম্ভাব্যতা'},
  {id:'trigonometry',en:'Trigonometry',bn:'ত্রিকোণমিতি'},
  {id:'calculus',en:'Derivative at a Point',bn:'নির্দিষ্ট বিন্দুতে অন্তরক'},
  {id:'primes',en:'Prime & Factors',bn:'মৌলিক ও গুণনীয়ক'},
];
export function solveMathTool(mode, v) {
  if(mode==='expression') {const x=evaluateExpression(v.expression||'');return {answer:fmt(x),steps:[`Expression: ${normalizeMath(v.expression)}`,`Apply parentheses and exponents, then multiplication/division and addition/subtraction.`,`Result = ${fmt(x)}`]};}
  if(mode==='equation')return solveEquation(v.equation || '');
  if(mode==='percentage') {const part=requireNum(v.percent,'percentage'), whole=requireNum(v.whole,'whole');const result=part*whole/100;return {answer:fmt(result),steps:[`Formula: percentage × whole ÷ 100`,`= ${fmt(part)} × ${fmt(whole)} ÷ 100`,`= ${fmt(result)}`]};}
  if(mode==='fraction') {const [a,b]=fractionRead(v.fractionA),[c,d]=fractionRead(v.fractionB);const op=v.operation||'+';let num,den;if(op==='+'){num=a*d+c*b;den=b*d;}else if(op==='-'){num=a*d-c*b;den=b*d;}else if(op==='*'){num=a*c;den=b*d;}else {if(c===0) throw Error('Cannot divide by zero.');num=a*d;den=b*c;}const divider=gcd(num,den);if(!divider)throw Error('Invalid fraction.');num/=divider;den/=divider;if(den<0){num=-num;den=-den;}return {answer:`${num}/${den} = ${fmt(num/den)}`,steps:[`Calculate (${a}/${b}) ${op==='*'?'×':op==='/'?'÷':op} (${c}/${d})`,`Combine numerators and denominators.`,`Reduce using the greatest common divisor.`,`Simplified result = ${num}/${den}`]};}
  if(mode==='ratio'){const a=requireNum(v.a,'a'),b=requireNum(v.b,'b');if(b===0)throw Error('The second quantity must not be zero.');if(!Number.isInteger(a)||!Number.isInteger(b))return {answer:`${fmt(a)} : ${fmt(b)}`,steps:[`Ratio = ${fmt(a)} / ${fmt(b)} = ${fmt(a/b)}`]};const divider=gcd(a,b);return {answer:`${a/divider} : ${b/divider}`,steps:[`Start with ${a} : ${b}`,`HCF = ${divider}`,`Divide both terms by ${divider}.`,`Simplified ratio = ${a/divider} : ${b/divider}`]};}
  if(mode==='gcd'){const nums=numberList(v.numbers);if(nums.some(n=>!Number.isSafeInteger(n)||n<0))throw Error('Use nonnegative whole numbers for LCM / HCF.');const h=nums.reduce(gcd),l=nums.reduce(lcm);return {answer:`HCF = ${h}    •    LCM = ${l}`,steps:[`Input numbers: ${nums.join(', ')}`,`HCF: greatest integer dividing all numbers = ${h}`,`LCM: smallest nonnegative common multiple = ${l}`]};}
  if(mode==='geometry'){const s=v.shape ||'rectangle',a=requireNum(v.a,'first dimension'),b=Number(v.b||0),c=Number(v.c||0);if(a<=0)throw Error('Dimensions must be positive.');let area,perimeter,formula;if(s==='square'){area=a*a;perimeter=4*a;formula='Area = side²; perimeter = 4×side';}else if(s==='circle'){area=Math.PI*a*a;perimeter=2*Math.PI*a;formula='Area = πr²; circumference = 2πr';}else if(s==='triangle'){if(b<=0)throw Error('Enter positive height.');area=a*b/2;perimeter=null;formula='Area = ½ × base × height';}else if(s==='trapezium'){if(b<=0||c<=0)throw Error('Enter positive second base and height.');area=(a+b)*c/2;perimeter=null;formula='Area = (base1 + base2) × height / 2';}else{if(b<=0)throw Error('Enter positive width.');area=a*b;perimeter=2*(a+b);formula='Area = length × width; perimeter = 2(length + width)';}return {answer:`Area = ${fmt(area)}${perimeter==null?'':`  •  ${s==='circle'?'Circumference':'Perimeter'} = ${fmt(perimeter)}`}`,steps:[`Shape: ${s}`,formula,`Area = ${fmt(area)} square units`,...(perimeter==null?[]:[`Boundary = ${fmt(perimeter)} units`])]};}
  if(mode==='statistics'){const list=numberList(v.numbers);const d=stats(list);return {answer:`Mean = ${fmt(d.mean)} • Median = ${fmt(d.median)} • Mode = ${d.mode}`,steps:[`Sorted data: ${d.sorted.join(', ')}`,`Mean = sum ÷ count = ${fmt(list.reduce((a,b)=>a+b,0))} ÷ ${list.length} = ${fmt(d.mean)}`,`Median = middle value = ${fmt(d.median)}`,`Mode = ${d.mode}`,`Population variance = ${fmt(d.variance)}`,`Population standard deviation = ${fmt(d.standardDeviation)}`]};}
  if(mode==='combinatorics'){const n=requireNum(v.n,'n'),r=requireNum(v.r,'r');if(!Number.isInteger(n)||!Number.isInteger(r)||r>n||n<0||r<0||n>170)throw Error('Use integers with 0 ≤ r ≤ n ≤ 170.');let perm=1;for(let i=0;i<r;i++)perm*=n-i;let comb=1;for(let i=1;i<=r;i++)comb=comb*(n-i+1)/i;return {answer:`${n}P${r} = ${fmt(perm)} • ${n}C${r} = ${fmt(Math.round(comb))}`,steps:[`Permutation: nPr = n!/(n−r)! = ${fmt(perm)}`,`Combination: nCr = n!/[r!(n−r)!] = ${fmt(Math.round(comb))}`,`Permutation counts arrangements; combination counts selections.`]};}
  if(mode==='interest'){const p=requireNum(v.p,'principal'),r=requireNum(v.r,'rate'),t=requireNum(v.t,'time');const i=p*r*t/100;return {answer:`Interest = ${fmt(i)} • Amount = ${fmt(p+i)}`,steps:[`Simple interest = Principal × Rate × Time ÷ 100`,`= ${p} × ${r} × ${t} ÷ 100 = ${fmt(i)}`,`Amount = ${p} + ${fmt(i)} = ${fmt(p+i)}`]};}
  if(mode==='profit'){const cp=requireNum(v.cp,'cost price'),sp=requireNum(v.sp,'selling price');if(cp<=0)throw Error('Cost price must be positive.');const diff=sp-cp,pct=Math.abs(diff/cp*100);return {answer:`${diff>=0?'Profit':'Loss'} = ${fmt(Math.abs(diff))} (${fmt(pct)}%)`,steps:[`Cost price = ${fmt(cp)}; selling price = ${fmt(sp)}`,`Difference = SP − CP = ${fmt(diff)}`,`${diff>=0?'Profit':'Loss'} percentage = |difference| ÷ CP × 100 = ${fmt(pct)}%`]};}
  if(mode==='unitary') {const amount=requireNum(v.total,'total cost'), count=requireNum(v.count,'number of units'),want=requireNum(v.want,'required units');if(count<=0||want<0)throw Error('Unit count must be positive and required units nonnegative.');const each=amount/count, value=each*want;return {answer:`Unit price = ${fmt(each)} • ${fmt(want)} units = ${fmt(value)}`,steps:[`Step 1: Price for one unit = total price ÷ number of units.`,`= ${fmt(amount)} ÷ ${fmt(count)} = ${fmt(each)}`,`Step 2: Multiply by required units = ${fmt(each)} × ${fmt(want)} = ${fmt(value)}`]};}
  if(mode==='probability') {const favorable=requireNum(v.favorable,'favourable outcomes'), total=requireNum(v.total,'total outcomes');if(total<=0||favorable<0||favorable>total)throw Error('Require 0 ≤ favourable outcomes ≤ total outcomes, with total > 0.');const p=favorable/total;return {answer:`P(E) = ${fmt(p)} = ${fmt(p*100)}%`,steps:[`Classical probability = favourable outcomes / equally likely total outcomes.`,`P(E) = ${fmt(favorable)} / ${fmt(total)} = ${fmt(p)}`,`As a percentage = ${fmt(p*100)}%.`,`Assumes each outcome is equally likely.`]};}
  if(mode==='trigonometry') {const angle=requireNum(v.angle,'angle'), unit=v.angleUnit||'deg', func=v.trigFunc||'sin';if(!['sin','cos','tan'].includes(func)||!['deg','rad'].includes(unit))throw Error('Select a supported function and angle unit.');const radians=unit==='deg'?angle*Math.PI/180:angle;if(func==='tan'&&Math.abs(Math.cos(radians))<1e-12)throw Error('Tangent is undefined for this angle.');const result=Math[func](radians);return {answer:`${func}(${fmt(angle)}${unit==='deg'?'°':' rad'}) = ${fmt(result)}`,steps:[`Selected function: ${func}; angle = ${fmt(angle)} ${unit==='deg'?'degrees':'radians'}.`,unit==='deg'?`Convert to radians = ${fmt(angle)} × π/180 = ${fmt(radians)}.`:`Angle already uses radians: ${fmt(radians)}.`,`Evaluate ${func}(${fmt(radians)}) = ${fmt(result)}.`]};}
  if(mode==='calculus') {const f=compileExpression(v.function||'x^2',['x']),x0=requireNum(v.x0,'x coordinate');const h=1e-5*Math.max(1,Math.abs(x0));const fplus=f({x:x0+h}),fminus=f({x:x0-h});const derivative=(fplus-fminus)/(2*h);if(!Number.isFinite(derivative))throw Error('Cannot estimate derivative at this point.');return {answer:`f′(${fmt(x0)}) ≈ ${fmt(derivative)}`,steps:[`Numerical differentiation uses the central-difference formula.`,`f′(x) ≈ [f(x+h) − f(x−h)] / (2h).`,`At x = ${fmt(x0)}, choose h = ${fmt(h)}.`,`f(x+h) = ${fmt(fplus)}; f(x−h) = ${fmt(fminus)}.`,`Estimated derivative = ${fmt(derivative)} (an approximation).`]};}
  if(mode==='primes') {const n=requireNum(v.n,'number');if(!Number.isSafeInteger(n)||n<1||n>1e9)throw Error('Enter a whole number from 1 to 1,000,000,000.');let remain=n;const factors=[];for(let i=2;i*i<=remain;i++)while(remain%i===0){factors.push(i);remain/=i;}if(remain>1)factors.push(remain);const prime=primeCheck(n);return {answer:`${n} is ${n===1?'neither prime nor composite':prime?'prime':'composite'}.`,steps:[n===1?'The number 1 has only one positive divisor, so it is neither prime nor composite.':prime?`The only positive divisors are 1 and ${n}.`:`Prime factorization = ${factors.join(' × ')}.`,...(n===1?[]:[`Number of prime factors (including repeats) = ${factors.length}.`,`Prime numbers have exactly two positive divisors.`])]};}
  throw Error('Choose a valid tool.');
}

const ALPHABET='0123456789ABCDEF';
export function convertBase(input, fromBase) {
  const base=Number(fromBase);
  if(![2,8,10,16].includes(base))throw Error('Choose a base: 2, 8, 10 or 16.');
  const text=westernDigits(input).trim().replace(/\s/g,'').toUpperCase();
  if(!/^[+-]?[0-9A-F]+(?:\.[0-9A-F]+)?$/.test(text) || text.length>120)throw Error('Enter a valid number containing digits appropriate for the selected base.');
  const negative=text.startsWith('-'), body=text.replace(/^[+-]/,'');
  const [whole, fractional='']=body.split('.');
  for(const digit of whole+fractional)if(ALPHABET.indexOf(digit)>=base)throw Error(`Digit '${digit}' is not valid in base ${base}.`);
  let integer=0n, numerator=0n, denominator=1n;
  for(const digit of whole)integer=integer*BigInt(base)+BigInt(ALPHABET.indexOf(digit));
  for(const digit of fractional) { numerator=numerator*BigInt(base)+BigInt(ALPHABET.indexOf(digit));denominator*=BigInt(base); }
  const conversions={};
  for(const target of [2,8,10,16]) {
    let value=integer.toString(target).toUpperCase(), remainder=numerator, digits='';
    for(let i=0;i<18 && remainder!==0n;i++) { remainder*=BigInt(target);const d=remainder/denominator; remainder%=denominator;digits+=ALPHABET[Number(d)]; }
    if(digits)value+='.'+digits+(remainder!==0n?'…':'');
    conversions[target]=(negative && (integer!==0n||numerator!==0n)?'-':'')+value;
  }
  const expansion=[...whole].map((d,i)=>`${ALPHABET.indexOf(d)}×${base}^${whole.length-i-1}`);
  const explanation=[`Input: ${text} (base ${base})`,`Integer positional expansion: ${expansion.length?expansion.join(' + '):'0'}`,`Integer part in decimal: ${integer.toString()}`,fractional?`Fractional part uses negative powers: ${[...fractional].map((d,i)=>`${ALPHABET.indexOf(d)}×${base}^(-${i+1})`).join(' + ')}`:'No fractional digits.',`Integer conversion: repeatedly divide by the target base and read remainders in reverse order.`, `Fractional conversion: repeatedly multiply the fractional part by the target base and collect integer digits.`,`Fractional outputs are limited to 18 digits; an ellipsis indicates a repeating/unfinished expansion.`];
  return { conversions, explanation };
}
