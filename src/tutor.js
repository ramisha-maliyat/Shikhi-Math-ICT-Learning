import { evaluateExpression, solveEquation, solveMathTool, convertBase, primeCheck, factorial, numberList, stats, fmt, westernDigits, normalizeMath } from './math.js';
import { findTopic, topics } from './topics.js';
import { translateStepBN } from './locale.js';

const isBangla=lang=>lang==='bn';
const reply=(en,bn,lang)=>isBangla(lang)?bn:en;
const clean=n=>fmt(n);
const asSteps=(result,lang,detailed=true)=> {
  const answer=reply('**Answer:** ','**উত্তর:** ',lang)+result.answer;
  if(!detailed)return answer;
  const heading=reply('\n\n**Step-by-step explanation**\n','\n\n**ধাপে ধাপে ব্যাখ্যা**\n',lang);
  return answer+heading+result.steps.map((s,i)=>`${i+1}. ${isBangla(lang)?translateStepBN(s):s}`).join('\n');
};
const localizedTopic=(topic,lang,detailed)=> {
  const bn=isBangla(lang);
  const title=bn?`${topic.bn} (${topic.en})`:`${topic.en} (${topic.bn})`;
  let content=`### ${title}\n\n${bn?topic.descriptionBn:topic.descriptionEn}\n\n**${bn?'মূল নিয়ম / সূত্র':'Key idea / formula'}:** ${topic.formula}\n\n**${bn?'উদাহরণ':'Example'}:** ${topic.example}`;
  if(detailed)content+=bn?'\n\n**সহজে বুঝি:** আগে ধারণাটি বুঝুন, তারপর সূত্রে মান বসিয়ে হিসাব করুন। শেষে উত্তর যাচাই করুন।':'\n\n**Think about it:** Identify what is given, choose the formula, substitute the values and check the result.';
  if(topic.group==='numerical')content+=bn?'\n\nসংখ্যাতাত্ত্বিক ল্যাব থেকে নিজের মান বসিয়ে সব iteration দেখতে পারবেন।':'\n\nOpen the Numerical Lab to enter your own values and see every iteration.';
  return content;
};
const detectBase=txt=>{const s=txt.toLowerCase();if(s.includes('binary')||s.includes('বাইনারি'))return 2;if(s.includes('octal')||s.includes('অক্টাল'))return 8;if(s.includes('hex')||s.includes('হেক্স'))return 16;if(s.includes('decimal')||s.includes('দশমিক'))return 10;return null;};
function expandLast(last,lang) {
  if(!last)return null;
  return isBangla(lang)?`আগের ব্যাখ্যাটি আরও সহজভাবে বলি:\n\n${last}\n\n**মনে রাখবেন:** কোন সংখ্যা দেওয়া আছে, কী বের করতে হবে, কোন সূত্র লাগবে এবং উত্তর সঠিক কি না—এই চারটি ধাপ অনুসরণ করুন।`:`Let me explain the previous answer more simply:\n\n${last}\n\n**Study tip:** Write down the known values, identify what you need to find, choose the formula, and verify the answer.`;
}
export function localTutor(question,lang='en',detailed=true,previousAnswer='') {
  const raw=westernDigits(question).trim();const lower=raw.toLowerCase();
  if(!raw)return reply('Type your question first.','প্রথমে আপনার প্রশ্নটি লিখুন।',lang);
  if(/^(hi|hello|hey|assalam|হাই|হ্যালো|সালাম|ধন্যবাদ|thanks|thank you)[\s!?.]*$/i.test(raw))return reply('Hi there! 👋 I’m Shikhi. Ask me a math or ICT question, or tell me a topic you want to learn. Try **25% of 480**, **2x + 5 = 15**, or **binary 1011 to decimal**.','হ্যালো! 👋 আমি শিখি। গণিত বা আইসিটি নিয়ে যেকোনো প্রশ্ন করুন। যেমন **৪৮০-এর ২৫%**, **2x + 5 = 15**, বা **1011 বাইনারি থেকে দশমিক**।',lang);
  if(/^(explain (it|again)|more details|explain simply|why|বিস্তারিত|আরও বুঝিয়ে|সহজ করে|কেন)[\s?.!]*$/i.test(raw))return expandLast(previousAnswer,lang)||reply('Which topic or answer would you like me to explain?','কোন বিষয় বা উত্তরটি আরও ব্যাখ্যা করব?',lang);
  try {
    const spokenPercent=lower.match(/(-?\d+(?:\.\d+)?)\s*(?:percent|percentage|শতাংশ|শতকরা)\s*(?:of|এর)\s*(-?\d+(?:\.\d+)?)/i);
    if(spokenPercent) return asSteps(solveMathTool('percentage',{percent:spokenPercent[1],whole:spokenPercent[2]}),lang,detailed);
    const pct=lower.match(/(-?\d+(?:\.\d+)?)\s*%\s*(?:of|এর|×|\*|from)\s*(-?\d+(?:\.\d+)?)/i)
        || lower.match(/(-?\d+(?:\.\d+)?)\s*(?:এর|of)\s*(-?\d+(?:\.\d+)?)\s*(?:%|percent|শতাংশ|শতকরা)/i);
    if(pct) {const percent= lower.indexOf('%')>=0&&lower.indexOf('%')<lower.indexOf('of')?pct[1]:/\bof\b/i.test(lower)&&lower.indexOf('%')>=0&&lower.indexOf('%')<lower.indexOf('of')?pct[1]:lower.includes('এর')||lower.includes(' of ')?pct[2]:pct[1];const whole=percent===pct[1]?pct[2]:pct[1];return asSteps(solveMathTool('percentage',{percent,whole}),lang,detailed);}
    if(/(\b(lcm|hcf|gcd)\b|লসাগু|গসাগু)/i.test(lower)) {
      const extracted=lower.match(/-?\d+(?:\.\d+)?/g);if(extracted?.length>=2)return asSteps(solveMathTool('gcd',{numbers:extracted.join(',')}),lang,detailed);
    }
    const prime=lower.match(/(?:is\s+|whether\s+|number\s+)?(\d+)\s*(?:a\s+)?(?:prime|মৌলিক)/i)||lower.match(/(?:prime|মৌলিক)\s*(?:number)?\s*(\d+)/i);
    if(prime) {const n=Number(prime[1]),yes=primeCheck(n);return reply(`**${n} is ${yes?'a prime':'not a prime'} number.**\n\n${yes?'It has exactly two positive divisors: 1 and itself.':'It is either less than 2 or has a divisor besides 1 and itself.'}`,`**${n} ${yes?'একটি মৌলিক সংখ্যা':'মৌলিক সংখ্যা নয়'}।**\n\n${yes?'এর ধনাত্মক গুণনীয়ক কেবল ১ ও নিজে।':'এটি ২-এর ছোট অথবা এর অন্য গুণনীয়ক আছে।'}`,lang);}
    const fac=lower.match(/(?:factorial\s*(?:of)?\s*|ফ্যাক্টোরিয়াল\s*)(\d+)/i)||lower.match(/\b(\d{1,3})\s*!/);
    if(fac) {const n=Number(fac[1]),f=factorial(n);return reply(`**${n}! = ${fmt(f)}**\n\n${n<=1?'By definition, 0! = 1 and 1! = 1.':`Multiply integers 1 through ${n}: ${n} × ${n-1} × … × 1.`}`,`**${n}! = ${fmt(f)}**\n\n${n<=1?'সংজ্ঞা অনুযায়ী 0! = 1 এবং 1! = 1।':`১ থেকে ${n} পর্যন্ত সব পূর্ণসংখ্যা গুণ করতে হয়।`}`,lang);}
    if(/(binary|octal|hexadecimal|hex|decimal|বাইনারি|অক্টাল|হেক্স|দশমিক)/i.test(lower) && /(to|into|থেকে|রূপান্তর|convert)/i.test(lower)) {
      const num=raw.match(/(?:^|\s)([+-]?[0-9A-F]+(?:\.[0-9A-F]+)?)(?=\s|$)/i)?.[1]||raw.match(/([01]{2,})/)?.[1];
      const sourceSegment=lower.split(/\s+(?:to|into|থেকে|রূপান্তর)/i)[0];
      const from=detectBase(sourceSegment)||detectBase(lower)||2;
      if(num){const r=convertBase(num,from);return reply(`**Number conversion (base ${from})**\n\n${Object.entries(r.conversions).map(([b,v])=>`- Base ${b}: **${v}**`).join('\n')}\n\n${detailed?r.explanation.join('\n\n'):''}`,`**সংখ্যা রূপান্তর (${from} ভিত্তি)**\n\n${Object.entries(r.conversions).map(([b,v])=>`- ভিত্তি ${b}: **${v}**`).join('\n')}\n\n${detailed?r.explanation.join('\n\n'):''}`,lang);}
    }
    if(/(?:average|mean|median|mode|গড়|মধ্যক|প্রচুরক)/i.test(lower)) {
      const values=lower.match(/-?\d+(?:\.\d+)?/g);if(values?.length>=2) return asSteps(solveMathTool('statistics',{numbers:values.join(',')}),lang,detailed);
    }
    const ratio=lower.match(/(?:ratio\s+of\s*|অনুপাত\s*)(\d+)\s*(?:and|to|:|ও|,)\s*(\d+)/i);
    if(ratio)return asSteps(solveMathTool('ratio',{a:ratio[1],b:ratio[2]}),lang,detailed);
    const nth=lower.match(/(?:sqrt|square root|বর্গমূল)\s*(?:of)?\s*\(?\s*(\d+(?:\.\d+)?)/i);
    if(nth) {const n=Number(nth[1]),x=Math.sqrt(n);return reply(`**√${n} = ${fmt(x)}**\n\nCheck: ${fmt(x)} × ${fmt(x)} ≈ ${n}.`,`**√${n} = ${fmt(x)}**\n\nযাচাই: ${fmt(x)} × ${fmt(x)} ≈ ${n}।`,lang);}
    const topic=findTopic(lower);
    const equation=lower.match(/(?:[\dx+*/^().\s−-]+=[\dx+*/^().\s−-]+)/i);
    if(equation&&/[x]/i.test(equation[0]))return asSteps(solveEquation(equation[0]),lang,detailed);
    if(/(?:solve|সমাধান|equation|সমীকরণ)/i.test(lower)&&lower.includes('=')&&lower.includes('x')) {
      const eq=raw.replace(/^(?:solve|সমাধান|সমীকরণ)\s*:?(?:\s+for\s+x)?\s*/i,'').trim();return asSteps(solveEquation(eq),lang,detailed);
    }
    // Allow questions like "what is 12 * 7" and direct mathematical expressions.
    const stripped=raw.replace(/^(?:what is|calculate|evaluate|compute|find|কত হবে|হিসাব করো|নির্ণয় করো|মান বের করো|কত|এর মান)\s*:??\s*/i,'').replace(/[?？]$/,'').trim();
    if(/^[0-9০-৯a-zA-Z+*/^().%\s−÷×π²³-]+$/.test(stripped)&& /\d|[০-৯]/.test(stripped)) {
      try { const value=evaluateExpression(stripped);return reply(`**Answer: ${clean(value)}**\n\n${detailed?`1. Write the expression: ${normalizeMath(stripped)}\n2. Follow the order of operations (brackets, exponents, multiplication/division, addition/subtraction).\n3. The result is **${clean(value)}**.`:''}`,`**উত্তর: ${clean(value)}**\n\n${detailed?`১. রাশি: ${normalizeMath(stripped)}\n২. প্রথমে বন্ধনী, তারপর ঘাত, গুণ/ভাগ এবং যোগ/বিয়োগ করুন।\n৩. ফলাফল **${clean(value)}**।`:''}`,lang); }catch(e) {if(/[+*/^%]/.test(stripped))return reply(`**Cannot calculate:** ${e.message}`,`**হিসাব করা যাচ্ছে না:** ${e.message}`,lang);} 
    }
    if(topic)return localizedTopic(topic,lang,detailed);
    // A nonnumeric topic lookup covers exact keyword search rather than fabricating solutions.
    const terms=lower.split(/\s+/).filter(s=>s.length>4);
    const matches=topics.filter(t=>terms.some(term=>t.en.toLowerCase().includes(term) || t.bn.includes(term))).slice(0,3);
    if(matches.length===1)return localizedTopic(matches[0],lang,detailed);
    return reply('I can already explain the full **Math & ICT topic library**, solve expressions and linear/quadratic equations, calculate percentages, statistics, LCM/HCF, and convert number systems. For an unrestricted or lengthy word problem, connect the **AI Tutor** in Settings. You can also send a specific equation like `2x + 5 = 15` or use the **Numerical Lab** for iterative methods.','আমি **গণিত ও আইসিটির সব বিষয়** সহজভাবে বুঝাতে পারি, গাণিতিক রাশি ও সমীকরণ সমাধান, শতকরা, পরিসংখ্যান, লসাগু/গসাগু এবং সংখ্যা পদ্ধতি রূপান্তর করতে পারি। জটিল বা বড় কথার অঙ্কের জন্য Settings থেকে **AI Tutor** সংযুক্ত করুন। যেমন `2x + 5 = 15` লিখুন অথবা iteration দেখার জন্য **Numerical Lab** ব্যবহার করুন।',lang);
  } catch(error) {
    return reply(`Let's adjust that input: **${error.message}**\n\nTry writing the values more clearly, or open the appropriate calculator.`,`ইনপুটটি একটু ঠিক করুন: **${error.message}**\n\nমানগুলো স্পষ্ট করে লিখুন বা উপযুক্ত ক্যালকুলেটর ব্যবহার করুন।`,lang);
  }
}
