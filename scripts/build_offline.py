"""Assemble a dependency-free standalone HTML from the maintained source modules."""
from pathlib import Path
import re
root = Path(__file__).resolve().parent.parent
modules = ['topics.js','math.js','numerical.js','locale.js','tutor.js','practice.js','app.js']
parts=[]
for m in modules:
    text=(root/'src'/m).read_text(encoding='utf-8')
    text=re.sub(r'^import\s+.*?;\s*$', '', text, flags=re.MULTILINE)
    text=re.sub(r'^export\s+', '', text, flags=re.MULTILINE)
    parts.append('// === '+m+' ===\n'+text)
js='\n'.join(parts)
(root/'scripts'/'bundle.js').write_text(js,encoding='utf-8')
css=(root/'styles.css').read_text(encoding='utf-8')
html=f'''<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover"><meta name="theme-color" content="#11223b"><title>Shikhi — Math & ICT Studio (Offline Edition)</title><style>{css}</style></head>
<body><div id="root"><div class="loading-page">Shikhi <span>শিখি</span></div></div><script>{js.replace('</script','<\\/script')}</script></body></html>'''
(root.parent/'Shikhi_Offline.html').write_text(html,encoding='utf-8')
print('Built standalone',root.parent/'Shikhi_Offline.html',len(html),'bytes')
