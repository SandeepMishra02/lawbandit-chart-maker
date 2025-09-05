# 📊 LLM-Powered Chart Maker

This is a small web app that turns plain text (rules, timelines, outlines) into clean diagrams.  
Paste text, pick a mode, hit **Generate**, and export the result as SVG.

---

## ✨ Features
- **Flowchart** from steps or outlines  
- **Timeline** from dated items  
- **Rules map**: main rule → exceptions → outputs  
- **Layout controls** (Top→Bottom, Left→Right, etc.)  
- **SVG export** for notes and sharing  

---

## 🛠 Tech Stack
- Next.js (App Router) + TypeScript  
- TailwindCSS  
- Mermaid.js  
- Zod  
- OpenAI Responses API  

---

## 🔖 Quick Bookmarklet
You can send highlighted text from anywhere on the web straight into the app.  
Drag this link to your bookmarks bar:

```html
<a href="javascript:(function(){
  const sel = window.getSelection().toString();
  if(!sel){ alert('Select some text first.'); return; }
  const u = new URL('https://lawbandit-chart-maker.vercel.app/?q=' + encodeURIComponent(sel));
  window.open(u, '_blank');
})()">Send selection → Chart Maker</a>



## Run it locally

```bash
git clone https://github.com/SandeepMishra02/lawbandit-chart-maker.git
cd lawbandit-chart-maker
npm install

