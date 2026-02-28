# 🌳 Tree Structure to Folder Creator (VS Code Extension)

This extension allows you to quickly create folders and files in your project using a tree structure.

Instead of manually creating folders one by one, you can define the structure — and the extension will generate everything automatically.

---

## 📌 What This Extension Does

You provide a tree structure of your project, and the extension will create the same folders and files inside your workspace.

---

## 🚀 Features

- Create complete folder structure instantly  
- Supports nested folders and files  
- Saves time and manual effort  
- Simple and easy to use  

---

## ⚙️ Supported Format (Important)

⚠️ Only **dotted tree structure** is supported.

✅You must use this format:
```
src
├── app.xyz
├── components
│ ├── navbar.xyz
│ └── footer.xyz
├── pages
│ ├── home.xyz
│ └── about.xyz
main.xyz
```
❌ Do NOT use this format:
```
src/
app.js
   components
     navbar.xyz
     footer.xyz
   pages
main.xyz
```


## ▶️ How to Run the Extension (Development Mode)

Since the extension is not published yet, you need to run it locally:

1. Open this project folder in VS Code  
2. Press `F5`  
3. A new VS Code window will open (Extension Development Host)  
4. In that window, press `Ctrl + Shift + P`  
5. Run your extension command  
6. Paste the dotted tree structure  
7. The folders/files will be created  

---
## ⚠️ Note

- Use correct tree symbols: `├──`, `│`, `└──`  
- Invalid format may not work properly  

---

## 🛠 Tech

- VS Code Extension API  
- TypeScript / JavaScript  

---

## © Copyright

© 2026 Aayush Savaliya
