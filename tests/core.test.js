import test from 'node:test';
import assert from 'node:assert/strict';
import { topics,groups,searchTopics } from '../src/topics.js';
import {evaluateExpression,solveEquation,solveMathTool,convertBase,primeCheck} from '../src/math.js';
import {solveNumerical,numericalMethods} from '../src/numerical.js';
import {localTutor} from '../src/tutor.js';
import {createQuiz} from '../src/practice.js';
const approx=(value,expected,tolerance=1e-5)=>assert.ok(Math.abs(value-expected)<tolerance,`${value} not close to ${expected}`);

test('92 bilingual topics in six sections',()=>{
 assert.equal(topics.length,92);assert.equal(groups.length,6);
 assert.equal(topics.filter(x=>x.group==='numerical').length,16);
 for(const topic of topics)assert.ok(topic.en&&topic.bn&&topic.formula&&topic.example);
 assert.ok(searchTopics('মৌলিক সংখ্যা').length>0);
});
test('expression parser handles precedence, Bangla numerals, functions and disallows invalid input',()=>{
 assert.equal(evaluateExpression('2+3*4'),14);
 assert.equal(evaluateExpression('১২ + ৮'),20);
 assert.equal(evaluateExpression('-2^2'),-4);
 assert.equal(evaluateExpression('2^3^2'),512);
 assert.equal(evaluateExpression('2x + 5',{x:5}),15);
 approx(evaluateExpression('sin(pi/2)'),1);
 assert.throws(()=>evaluateExpression('process.exit(1)'));
 assert.throws(()=>evaluateExpression('1/0'));
 assert.throws(()=>evaluateExpression('sqrt(-1)'));
});
test('solve linear and quadratic equations',()=>{
 assert.equal(solveEquation('2x+5=15').answer,'x = 5');
 assert.match(solveEquation('x^2-5x+6=0').answer,/x = 3 or x = 2/);
 assert.throws(()=>solveEquation('x^3-2=0'));
});
test('arithmetic, fractions, geometry, statistics, probability and trig',()=>{
 assert.equal(solveMathTool('percentage',{percent:'25',whole:'480'}).answer,'120');
 assert.match(solveMathTool('fraction',{fractionA:'3/4',fractionB:'1/2',operation:'+'}).answer,/5\/4/);
 assert.equal(solveMathTool('ratio',{a:'12',b:'8'}).answer,'3 : 2');
 assert.match(solveMathTool('gcd',{numbers:'12,18,30'}).answer,/HCF = 6.*LCM = 180/);
 assert.match(solveMathTool('statistics',{numbers:'2,4,6'}).answer,/Mean = 4/);
 assert.match(solveMathTool('geometry',{shape:'circle',a:'7'}).answer,/Area = 153\.938/);
 assert.match(solveMathTool('unitary',{count:'5',total:'200',want:'8'}).answer,/320/);
 assert.match(solveMathTool('probability',{favorable:'3',total:'6'}).answer,/50%/);
 assert.match(solveMathTool('trigonometry',{angle:'30',angleUnit:'deg',trigFunc:'sin'}).answer,/0\.5/);
 assert.match(solveMathTool('calculus',{function:'x^2+3x',x0:'2'}).answer,/7/);
 assert.equal(primeCheck(13),true);assert.equal(primeCheck(1),false);
 assert.match(solveMathTool('primes',{n:'48'}).steps[0],/2 × 2 × 2 × 2 × 3/);
});
test('ICT conversions are correct, including negative and fractional values',()=>{
 assert.deepEqual(convertBase('101101',2).conversions,{2:'101101',8:'55',10:'45',16:'2D'});
 assert.equal(convertBase('FF',16).conversions[10],'255');
 assert.equal(convertBase('-15',10).conversions[2],'-1111');
 assert.equal(convertBase('0.5',10).conversions[2],'0.1');
 assert.throws(()=>convertBase('102',2));
});
test('all sixteen numerical methods calculate a result',()=>{
 assert.equal(numericalMethods.length,16);
 for(const method of numericalMethods){const result=solveNumerical(method.id,{});assert.ok(result.answer,method.id);assert.ok(result.rows&&result.headers&&result.steps,method.id);}
});
test('sample numerical calculations match known solutions',()=>{
 for(const m of ['bisection','newton','secant','regula']){const answer=solveNumerical(m,{}).answer;approx(Number(answer.match(/≈ ([\d.]+)/)?.[1]),1.5213797068,2e-5);}
 for(const m of ['forward','backward','lagrange'])assert.match(solveNumerical(m,{}).answer,/3\.25/);
 for(const m of ['gauss','jordan','seidel','jacobi'])assert.match(solveNumerical(m,{}).answer,/x1 (?:=|≈) 1/);
 for(const m of ['simpson13','simpson38'])approx(Number(solveNumerical(m,{}).answer.split('≈')[1]),1/3,1e-6);
 assert.throws(()=>solveNumerical('simpson13',{function:'x^2',a:'0',b:'1',n:'3'}));
 assert.throws(()=>solveNumerical('simpson38',{function:'x^2',a:'0',b:'1',n:'4'}));
});
test('local tutor provides bilingual answers without inventing unrestricted reasoning',()=>{
 assert.match(localTutor('What is 15 percent of 200?','en'),/30/);
 assert.match(localTutor('৪৮০ এর ২৫% কত?','bn'),/120/);
 assert.match(localTutor('2x + 5 = 15','bn'),/x = 5/);
 assert.match(localTutor('Explain Bisection Method','bn'),/দ্বিখণ্ডন/);
 assert.match(localTutor('1\/0','en'),/Division by zero/);
});
test('quiz generator creates five four-choice questions for each subject',()=>{
 for(const group of groups){const questions=createQuiz(group.id,'hard');assert.equal(questions.length,5);for(const q of questions){assert.equal(q.options.length,4);assert.ok(q.options.includes(q.answer));assert.equal(new Set(q.options).size,4);}}
});
