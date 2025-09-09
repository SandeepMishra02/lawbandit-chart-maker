# 📊 LLM-Powered Chart Maker

This project is a small web app that turns plain text (rules, outlines, case timelines) into clean, structured diagrams.  
You paste in text, pick how you want it visualized, hit **Generate**, and instantly get a chart you can copy, download, or drop into your notes.

The goal is to make study materials and workflows clearer — especially for law students — by turning dense text into diagrams that are quick to understand and share.

---

## ✨ Features

- **Multiple chart modes**  
  - Flowchart (good for processes or IRAC outlines)  
  - Timeline (great for case dates, syllabus schedules)  
  - Rules map (main rule → exceptions → outcomes)

- **Layout controls**  
  Choose how your chart is oriented: Top→Bottom, Left→Right, Bottom→Top, or Right→Left.

- **Presets for law students**  
  One-click examples for rules, timelines, and IRAC structures to save typing.

- **Light/Dark mode toggle**  
  Switch themes to suit your reading preference.

- **Responsive preview**  
  Diagrams scale automatically to fit the preview panel.

- **Export options**  
  Copy the diagram as SVG or download it directly to your computer.

- **Bookmarklet integration**  
  Send highlighted text from any web page straight into the app with one click.

---

## 🛠 Tech Stack

- [Next.js](https://nextjs.org/) (App Router) + TypeScript  
- [TailwindCSS](https://tailwindcss.com/) for styling  
- [Mermaid.js](https://mermaid-js.github.io/) for rendering charts  
- [Zod](https://zod.dev/) for schema validation  
- [OpenAI Responses API](https://platform.openai.com/) for structured output

---

## 🔖 Quick Bookmarklet

Drag this link to your bookmarks bar to send highlighted text straight into the app:

```html
<a href="javascript:(function(){
  const sel = window.getSelection().toString();
  if(!sel){ alert('Select some text first.'); return; }
  const u = new URL('https://lawbandit-chart-maker.vercel.app/?q=' + encodeURIComponent(sel));
  window.open(u, '_blank');
})()">Send selection → Chart Maker</a>


## 🚀 Running Locally

Clone the repo and install dependencies:

```bash
git clone https://github.com/SandeepMishra02/lawbandit-chart-maker.git
cd lawbandit-chart-maker
npm install
```

Set up your environment file:

```bash
echo "OPENAI_API_KEY=your_api_key_here" > .env.local
```

Start the dev server:

```bash
npm run dev
```

The app will be running at [http://localhost:3000](http://localhost:3000).

Other commands:

```bash
npm run build   # Build for production
npm start       # Run the production build
```

---

## 📸 Demo

Here’s an example of text turned into a rules diagram:

_(insert screenshot or GIF here)_

---

## 🙏 Acknowledgments

Built with Next.js, TailwindCSS, Mermaid.js, and OpenAI.  
Special thanks to **LawBandit** for the challenge idea.


