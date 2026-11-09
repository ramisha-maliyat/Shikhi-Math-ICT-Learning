import { compileExpression, fmt, westernDigits } from './math.js';

export const numericalFamilies = [
  {id:'roots',en:'Root Finding',bn:'মূল নির্ণয়',methods:['bisection','newton','secant','regula']},
  {id:'linear',en:'Linear Systems',bn:'রৈখিক সমীকরণ',methods:['gauss','jordan','seidel','jacobi']},
  {id:'interpolation',en:'Interpolation',bn:'আন্তঃপ্রক্ষেপ',methods:['forward','backward','lagrange']},
  {id:'integration',en:'Integration',bn:'সমাকলন',methods:['trapezoid','simpson13','simpson38']},
  {id:'ode',en:'Differential Equations',bn:'অন্তরক সমীকরণ',methods:['euler','rk4']}
];
export const numericalMethods = [
  {id:'bisection',en:'Bisection Method',bn:'দ্বিখণ্ডন পদ্ধতি',family:'roots'},
  {id:'newton',en:'Newton–Raphson',bn:'নিউটন–রাফসন',family:'roots'},
  {id:'secant',en:'Secant Method',bn:'সেক্যান্ট পদ্ধতি',family:'roots'},
  {id:'regula',en:'Regula–Falsi',bn:'রেগুলা–ফলসি',family:'roots'},
  {id:'gauss',en:'Gauss Elimination',bn:'গাউস অপসারণ',family:'linear'},
  {id:'jordan',en:'Gauss–Jordan',bn:'গাউস–জর্ডান',family:'linear'},
  {id:'seidel',en:'Gauss–Seidel',bn:'গাউস–সাইডেল',family:'linear'},
  {id:'jacobi',en:'Jacobi Iteration',bn:'জ্যাকোবি পুনরাবৃত্তি',family:'linear'},
  {id:'forward',en:'Newton Forward Interpolation',bn:'নিউটনের অগ্রবর্তী আন্তঃপ্রক্ষেপ',family:'interpolation'},
  {id:'backward',en:'Newton Backward Interpolation',bn:'নিউটনের পশ্চাৎবর্তী আন্তঃপ্রক্ষেপ',family:'interpolation'},
  {id:'lagrange',en:'Lagrange Interpolation',bn:'ল্যাগ্রাঞ্জ আন্তঃপ্রক্ষেপ',family:'interpolation'},
  {id:'trapezoid',en:'Trapezoidal Rule',bn:'ট্রাপিজয়ডাল নিয়ম',family:'integration'},
  {id:'simpson13',en:"Simpson's 1/3 Rule",bn:'সিম্পসনের ১/৩ নিয়ম',family:'integration'},
  {id:'simpson38',en:"Simpson's 3/8 Rule",bn:'সিম্পসনের ৩/৮ নিয়ম',family:'integration'},
  {id:'euler',en:"Euler's Method",bn:'ইউলারের পদ্ধতি',family:'ode'},
  {id:'rk4',en:'Runge–Kutta RK4',bn:'রুঙ্গে–কুটা ৪র্থ ক্রম',family:'ode'}
];
const num=(raw,label) => { if(raw===undefined||raw===null||westernDigits(raw).trim()==='')throw Error(`Enter ${label}.`); const n=Number(westernDigits(raw));if(!Number.isFinite(n))throw Error(`${label} must be a valid number.`);return n; };
const integer=(raw,label,minimum=1,maximum=150)=>{const n=num(raw,label);if(!Number.isInteger(n)||n<minimum||n>maximum)throw Error(`${label} must be an integer from ${minimum} to ${maximum}.`);return n;};
const fformat=v=>fmt(v,8);
const safeResult=(x,label='Result')=> { if(!Number.isFinite(x))throw Error(`${label} is not finite. Check the function or input interval.`);return x; };
function rootSolve(method,p) {
  const f=compileExpression(p.function || 'x^3-x-2');
  const fn=x=>safeResult(f({x}),'Function value');
  const tol=num(p.tolerance||'0.000001','tolerance');if(tol<=0||tol>=1)throw Error('Tolerance must be between 0 and 1.');
  const max=integer(p.maxIter||'25','max iterations',1,100);
  let a=num(p.a??1,'left endpoint'),b=num(p.b??2,'right endpoint');
  let x0=num(p.x0??1.5,'initial guess'),x1=num(p.x1??2,'second guess');
  const rows=[];let root=NaN,converged=false;
  if(['bisection','regula'].includes(method)) {
    let fa=fn(a),fb=fn(b);
    if(a>=b)throw Error('Left endpoint must be smaller than right endpoint.');
    if(fa*fb>0)throw Error('f(a) and f(b) must have opposite signs to bracket a root.');
    if(fa===0) return {answer:`x = ${fformat(a)}`,headers:['Step','x','f(x)'],rows:[['Endpoint',fformat(a),'0']],steps:['The left endpoint is exactly a root.']};
    if(fb===0) return {answer:`x = ${fformat(b)}`,headers:['Step','x','f(x)'],rows:[['Endpoint',fformat(b),'0']],steps:['The right endpoint is exactly a root.']};
    for(let i=1;i<=max;i++) {
      const c=method==='bisection'?(a+b)/2:(a*fb-b*fa)/(fb-fa);
      const fc=fn(c); root=c;
      rows.push([i,fformat(a),fformat(b),fformat(c),fformat(fc)]);
      if(Math.abs(fc)<tol||Math.abs(b-a)<tol) {converged=true;break;}
      if(fa*fc<0){b=c;fb=fc;} else {a=c;fa=fc;}
    }
    return {answer:`x ≈ ${fformat(root)}`,headers:['Iter','a','b','c (root)','f(c)'],rows,steps:[method==='bisection'?'Midpoint formula: c = (a+b)/2.':'False position: c = (a·f(b) − b·f(a)) / (f(b) − f(a)).','After each step, retain the interval where the function changes sign.',`Stopping tolerance = ${tol}.`,converged?'Converged within tolerance.':'Iteration limit reached; result is an approximation.']};
  }
  if(method==='newton') {
    for(let i=1;i<=max;i++) {
      const fx=fn(x0),h=1e-5*Math.max(1,Math.abs(x0));
      const df=(fn(x0+h)-fn(x0-h))/(2*h);
      if(Math.abs(df)<1e-12)throw Error('Derivative is zero or too small near the current guess. Try another starting value.');
      const next=safeResult(x0-fx/df);root=next;
      rows.push([i,fformat(x0),fformat(fx),fformat(df),fformat(next)]);
      if(Math.abs(next-x0)<tol || Math.abs(fn(next))<tol){converged=true;break;}
      x0=next;
    }
    return {answer:`x ≈ ${fformat(root)}`,headers:['Iter','xₙ','f(xₙ)','f′(xₙ)','xₙ₊₁'],rows,steps:['Newton update: xₙ₊₁ = xₙ − f(xₙ)/f′(xₙ).','The derivative is approximated numerically by a central difference.',converged?'Converged within tolerance.':'Iteration limit reached; solution may not have converged.']};
  }
  if(method==='secant') {
    if(x0===x1)throw Error('Two initial guesses must be different.');
    for(let i=1;i<=max;i++) {
      const f0=fn(x0),f1=fn(x1),d=f1-f0;
      if(Math.abs(d)<1e-14)throw Error('Secant slope is zero; try different starting values.');
      const x2=safeResult(x1-f1*(x1-x0)/d);root=x2;
      rows.push([i,fformat(x0),fformat(x1),fformat(x2),fformat(fn(x2))]);
      if(Math.abs(x2-x1)<tol||Math.abs(fn(x2))<tol){converged=true;break;}
      x0=x1;x1=x2;
    }
    return {answer:`x ≈ ${fformat(root)}`,headers:['Iter','xₙ₋₁','xₙ','xₙ₊₁','f(xₙ₊₁)'],rows,steps:['Secant: xₙ₊₁ = xₙ − f(xₙ)(xₙ−xₙ₋₁) / (f(xₙ)−f(xₙ₋₁)).','It needs two initial points but no derivative.',converged?'Converged within tolerance.':'Iteration limit reached; solution may not have converged.']};
  }
  throw Error('Unrecognized root method.');
}
function readMatrix(input) {
  const lines=westernDigits(String(input||'')).trim().split(/\r?\n/).filter(Boolean);
  if(lines.length<2||lines.length>8)throw Error('Enter 2–8 equations, one row per line (for example: 4,1|6).');
  const n=lines.length;
  return lines.map((line,i)=>{
    const parts=line.split('|');if(parts.length!==2)throw Error(`Row ${i+1} must use a | before its right-hand value.`);
    const cells=parts[0].split(',').map(s=>Number(s.trim()));const rhs=Number(parts[1].trim());
    if(cells.length!==n||[...cells,rhs].some(v=>!Number.isFinite(v)))throw Error(`Row ${i+1} must contain ${n} coefficients and one right-hand value.`);
    return [...cells,rhs];
  });
}
const formatMatrix=m=>m.map(row=>'[ '+row.map(x=>String(fformat(x)).padStart(10,' ')).join('  ')+' ]').join('\n');
function linearSolve(method,p) {
  const mat=readMatrix(p.matrix||'4,1|6\n1,3|7');const n=mat.length;
  const steps=[],rows=[];
  if(['gauss','jordan'].includes(method)) {
    const m=mat.map(row=>[...row]);
    for(let col=0;col<n;col++) {
      let pivot=col;
      for(let r=col+1;r<n;r++)if(Math.abs(m[r][col])>Math.abs(m[pivot][col]))pivot=r;
      if(Math.abs(m[pivot][col])<1e-12)throw Error('Matrix is singular or nearly singular; a unique solution cannot be computed.');
      if(pivot!==col){[m[col],m[pivot]]=[m[pivot],m[col]];steps.push(`Swap R${col+1} and R${pivot+1}.`);rows.push([`Swap ${col+1}/${pivot+1}`,formatMatrix(m)]);}
      if(method==='jordan'){
        const divisor=m[col][col];m[col]=m[col].map(v=>v/divisor);
        steps.push(`Normalize pivot row R${col+1}.`); rows.push([`Normalize R${col+1}`,formatMatrix(m)]);
      }
      for(let row=method==='jordan'?0:col+1;row<n;row++) {
        if(row===col)continue;
        const factor=method==='jordan'?m[row][col]:m[row][col]/m[col][col];
        if(Math.abs(factor)<1e-14)continue;
        for(let k=col;k<=n;k++)m[row][k]-=factor*m[col][k];
        rows.push([`R${row+1} elimination`,formatMatrix(m)]);
      }
    }
    const solution=new Array(n).fill(0);
    if(method==='jordan'){for(let i=0;i<n;i++)solution[i]=m[i][n];}
    else {for(let i=n-1;i>=0;i--){let rhs=m[i][n];for(let j=i+1;j<n;j++)rhs-=m[i][j]*solution[j];solution[i]=rhs/m[i][i];}}
    return {answer:solution.map((x,i)=>`x${i+1} = ${fformat(x)}`).join('  •  '),headers:['Operation','Augmented matrix'],rows,steps:[...steps,method==='gauss'?'Back-substitute from the last row to obtain each variable.':'Reduced row-echelon form gives the variables directly.','Partial pivoting selects the largest available pivot to improve stability.']};
  }
  const tol=num(p.tolerance||'0.000001','tolerance'), max=integer(p.maxIter||'25','max iterations',1,100);
  if(tol<=0||tol>=1)throw Error('Tolerance must be between 0 and 1.');
  for(let i=0;i<n;i++)if(Math.abs(mat[i][i])<1e-12)throw Error(`Diagonal value at row ${i+1} is zero; reorder the equations.`);
  let current=new Array(n).fill(0),converged=false;
  const dominant=mat.every((row,i)=>Math.abs(row[i])>row.slice(0,n).reduce((s,v,j)=>s+(i===j?0:Math.abs(v)),0));
  for(let k=1;k<=max;k++) {
    const next=[...current];
    for(let i=0;i<n;i++) {
      let sum=mat[i][n];
      for(let j=0;j<n;j++) if(i!==j)sum-=mat[i][j]*(method==='seidel'?next[j]:current[j]);
      next[i]=safeResult(sum/mat[i][i]);
    }
    const difference=Math.max(...next.map((x,i)=>Math.abs(x-current[i])));
    rows.push([k,...next.map(fformat),fformat(difference)]);
    current=next;if(difference<tol){converged=true;break;}
  }
  return {answer:current.map((v,i)=>`x${i+1} ≈ ${fformat(v)}`).join('  •  '),headers:['Iter',...current.map((_,i)=>`x${i+1}`),'Max Δ'],rows,steps:[method==='seidel'?'Gauss-Seidel immediately uses new values as they are found.':'Jacobi computes all new values from the previous iteration.',dominant?'The system is strictly diagonally dominant, which guarantees convergence for this iteration.':'Warning: matrix is not strictly diagonally dominant; convergence is not guaranteed.',converged?'Converged within tolerance.':'Iteration limit reached; the result may not be converged.']};
}
function readPoints(raw) {
  const lines=westernDigits(String(raw||'')).trim().split(/\r?\n/).filter(Boolean);
  if(lines.length<2||lines.length>15)throw Error('Enter 2–15 points, one x,y pair per line.');
  const points=lines.map((line,i)=>{const a=line.split(',').map(s=>Number(s.trim()));if(a.length!==2||a.some(v=>!Number.isFinite(v)))throw Error(`Point ${i+1} must be in x,y format.`);return a;}).sort((a,b)=>a[0]-b[0]);
  for(let i=1;i<points.length;i++)if(points[i][0]===points[i-1][0])throw Error('All x-values must be distinct.');
  return points;
}
function interpolate(method,p) {
  const points=readPoints(p.points||'0,1\n1,2\n2,5\n3,10'),x=num(p.queryX??'1.5','target x');
  const n=points.length,rows=[];let value=0;
  if(method==='lagrange') {
    for(let i=0;i<n;i++) {
      let weight=1;
      for(let j=0;j<n;j++)if(i!==j)weight*=(x-points[j][0])/(points[i][0]-points[j][0]);
      const term=points[i][1]*weight;value+=term;
      rows.push([i,fformat(points[i][0]),fformat(points[i][1]),fformat(weight),fformat(term)]);
    }
    return {answer:`f(${fmt(x)}) ≈ ${fformat(value)}`,headers:['i','xᵢ','yᵢ','Lᵢ(x)','yᵢLᵢ(x)'],rows,steps:['Lagrange formula: P(x) = Σ yᵢ × ∏(x−xⱼ)/(xᵢ−xⱼ).','Compute one basis polynomial for each point and add all contributions.','Distinct x-coordinates are required.']};
  }
  const h=points[1][0]-points[0][0];
  if(h===0||points.some((point,i)=>i>0 && Math.abs(point[0]-points[i-1][0]-h)>1e-8*Math.max(1,Math.abs(h))))throw Error('Newton forward/backward interpolation requires equally spaced x-values. Use Lagrange for unequal spacing.');
  const delta=[points.map(pt=>pt[1])];
  for(let k=1;k<n;k++){const last=delta[k-1];delta.push(last.slice(1).map((y,i)=>y-last[i]));}
  const forward=method==='forward',origin=forward?points[0][0]:points[n-1][0],u=(x-origin)/h;
  let multiplier=1;
  for(let k=0;k<n;k++) {
    if(k>0)multiplier*= (u+(forward?k*-1+1:k-1))/k; // Forward: (u-k+1)/k; backward: (u+k-1)/k.
    const deltaY=forward?delta[k][0]:delta[k][delta[k].length-1];
    const term=multiplier*deltaY;value+=term;
    rows.push([k,fformat(deltaY),fformat(multiplier),fformat(term),fformat(value)]);
  }
  return {answer:`f(${fmt(x)}) ≈ ${fformat(value)}`,headers:['Order','Difference','Coefficient','Term','Running total'],rows,steps:[`Equal spacing h = ${fformat(h)}; u = (x − ${fformat(origin)}) / h = ${fformat(u)}.`,forward?'Use the first entry in each forward difference order.':'Use the last entry in each backward difference order.','Sum the difference terms with the appropriate Newton polynomial weights.']};
}
function integrate(method,p) {
  const f=compileExpression(p.function||'x^2');const a=num(p.a??'0','lower bound'),b=num(p.b??'1','upper bound');
  const n=integer(p.n||'6','subinterval count',1,150);
  if(a===b)return {answer:'Integral ≈ 0',headers:['i','x','f(x)','weight'],rows:[],steps:['The integration interval has zero width.']};
  if(method==='simpson13' && n%2!==0)throw Error("Simpson's 1/3 rule needs an even number of subintervals (n = 2, 4, 6, …).");
  if(method==='simpson38' && n%3!==0)throw Error("Simpson's 3/8 rule needs subintervals divisible by 3 (n = 3, 6, 9, …).");
  const h=(b-a)/n;let weightedSum=0;const rows=[];
  for(let i=0;i<=n;i++) {
    const x=a+i*h,y=safeResult(f({x}));
    const weight=(i===0||i===n)?1:method==='trapezoid'?2:method==='simpson13'?(i%2===0?2:4):(i%3===0?2:3);
    rows.push([i,fformat(x),fformat(y),weight]);weightedSum+=weight*y;
  }
  const multiplier=method==='trapezoid'?h/2:method==='simpson13'?h/3:3*h/8;
  return {answer:`∫ f(x) dx ≈ ${fformat(weightedSum*multiplier)}`,headers:['i','x','f(x)','weight'],rows,steps:[`Interval: [${fmt(a)}, ${fmt(b)}]; number of subintervals n = ${n}.`,`Step size h = (b − a) / n = ${fformat(h)}.`,method==='trapezoid'?'Weights: 1, 2, 2, …, 2, 1.':method==='simpson13'?'Weights: 1, 4, 2, 4, …, 4, 1.':'Weights: 1, 3, 3, 2, 3, 3, …, 1.',`Weighted sum = ${fformat(weightedSum)}.`,`Answer = weighted sum × ${fformat(multiplier)} = ${fformat(weightedSum*multiplier)}.`]};
}
function ode(method,p) {
  const f=compileExpression(p.function||'x+y',['x','y']);
  const x0=num(p.x0??'0','initial x'),y0=num(p.y0??'1','initial y'),target=num(p.target??'1','target x');
  const hInput=num(p.h??'0.1','step h');if(hInput===0)throw Error('Step size h must not be zero.');
  const distance=target-x0;
  if(distance*hInput<0)throw Error('Step h must point toward the target x.');
  const count=Math.ceil(Math.abs(distance/hInput)-1e-12);
  if(count>150)throw Error('Too many steps. Increase |h| so the calculation has at most 150 iterations.');
  const rows=[];let x=x0,y=y0;
  for(let i=1;i<=count;i++) {
    const h=Math.abs(target-x)<Math.abs(hInput)?target-x:hInput;
    if(method==='euler'){const slope=safeResult(f({x,y}));const next=safeResult(y+h*slope);rows.push([i,fformat(x),fformat(y),fformat(slope),fformat(next)]);y=next;}
    else{
      const k1=h*safeResult(f({x,y}));
      const k2=h*safeResult(f({x:x+h/2,y:y+k1/2}));
      const k3=h*safeResult(f({x:x+h/2,y:y+k2/2}));
      const k4=h*safeResult(f({x:x+h,y:y+k3}));
      const next=safeResult(y+(k1+2*k2+2*k3+k4)/6);
      rows.push([i,fformat(x),fformat(y),fformat(k1),fformat(k2),fformat(k3),fformat(k4),fformat(next)]);y=next;
    }
    x+=h;
  }
  return {answer:`y(${fformat(target)}) ≈ ${fformat(y)}`,headers:method==='euler'?['Step','xₙ','yₙ','slope','yₙ₊₁']:['Step','xₙ','yₙ','k₁','k₂','k₃','k₄','yₙ₊₁'],rows,steps:[`Initial condition y(${fmt(x0)}) = ${fmt(y0)}; target x = ${fmt(target)}.`,method==='euler'?'Euler update: yₙ₊₁ = yₙ + h f(xₙ,yₙ).':'RK4 uses four slopes: k₁ at start, k₂ and k₃ at midpoint, k₄ at end.',method==='euler'?'Euler is first-order: reducing step size usually improves precision.':'RK4 is fourth-order for smooth problems and usually more accurate at the same step size.',`Final y ≈ ${fformat(y)}.`]};
}
export function solveNumerical(method,p={}) {
  if(['bisection','newton','secant','regula'].includes(method))return rootSolve(method,p);
  if(['gauss','jordan','seidel','jacobi'].includes(method))return linearSolve(method,p);
  if(['forward','backward','lagrange'].includes(method))return interpolate(method,p);
  if(['trapezoid','simpson13','simpson38'].includes(method))return integrate(method,p);
  if(['euler','rk4'].includes(method))return ode(method,p);
  throw Error('Unknown numerical method.');
}
