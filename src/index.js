class Block {
    constructor(value, options) {
        this.value = value;
        this.options = options;
    }
}

class TitleBlock extends Block {
    constructor(value, options) {
        super(value, options);
    }
    toHtml() {
        const style = styles(this);
        return `
        <div class="row" style= "${style}">
            <div class="col-sm">
                <h1>${this.value}</h1>
            </div>
        </div>
        `
    }
}

class TextBlock extends Block {
    constructor(value, options) {
        super(value, options);
    }
    toHtml() {
        const style = styles(this);
        return `
         <div class="row" style= "${style}">
          <div class="col-sm">
            <p>${this.value}</p>
          </div>
         </div>
        `
    }
}

class ColomsBlock extends Block {
    constructor(value, options) {
        super(value, options);
    }
    toHtml() {
        const style = styles(this);
        let html = this.value.map(el => `<div class="col-sm"><p>${el}</p></div>`);
        return `<div class="row" style= "${style}">${html.join("")}</div>`;
    }
}

class ImageBlock extends Block {
    constructor(value, options) {
        super(value, options);
    }
    toHtml() {
        const style = styles(this);
        return `
          <div class="row" style= "${style}">
            <img src="${this.value}" alt="${this.value}" />
          </div>
        `
    }
}

const model = [
    new TitleBlock("Hello world", {
        color: "red",
        "background-color": "blue",
    }),
    new TextBlock("Some text", {
        color: "red",
        "background-color": "blue",
    }),
    new ColomsBlock([
        "1111",
        "2222",
        "3333"
    ], { 
        color: "red",  
        "background-color": "blue" 
    }),
    new ImageBlock("./assets/Chrysanthemum.jpg", {
        width: "50%",
        hight: "50%",
        margin: "20px auto",
    }),
];





// function title(block){
//     const style = styles(block);
//     return `
//     <div class="row" style= "${style}">
//         <div class="col-sm">
//             <h1>${block.value}</h1>
//         </div>
//     </div>
//     `
// }
// function text(block){
//     const style = styles(block);
//     return `
//     <div class="row" style= "${style}">
//       <div class="col-sm">
//         <p>${block.value}</p>
//       </div>
//     </div>
//     `
// }
// function coloms(block){
//     const style = styles(block);
//     let html = block.value.map(el => `<div class="col-sm"><p>${el}</p></div>`);
//     return `<div class="row" style= "${style}">${html.join("")}</div>`;
// }
// function image(block){
//     const style = styles(block);
//     return `
//     <div class="row" style= "${style}">
//       <img src="${block.value}" alt="${block.value}" />
//     </div>
//     `
// }

function styles(block) {
    return Object.keys(block.options || "").map(el => `${el}:${block.options[el]};`).join(" ");
}

function block(type) {
    return `
      <form name="${type}">
        <h5>${type}</h5>
        <div class="form-group">
          <input class="form-control form-control-sm" name="value" placeholder="value">
        </div>
        <div class="form-group">
          <input class="form-control form-control-sm" name="styles" placeholder="styles">
        </div>
        <button class="btn-primary btn btn-sm">Добавить</button>
      </form>
      <hr />
    `
}

class Site {
    constructor(selector){
        this.elDom = document.querySelector(selector)
    }
    render(model){
        this.elDom.innerHTML = "";
        model.forEach(block => {
            this.elDom.insertAdjacentHTML("beforeend", block.toHtml());
        })
    }
}


const site = new Site("#site");
site.render(model);

class Sidebar {
    constructor(selector, updateCallback){
        this.elDom = document.querySelector(selector)
        
        this.update = updateCallback;
        this.init();
    }
    init(){
        this.elDom.insertAdjacentHTML("afterbegin", this.template);
        this.elDom.addEventListener("submit", this.add.bind(this));
    }
    get template(){
        return [
            block("text"),
            block("title"),
            block("image")
        ].join("")
    }
    
    add(event) {
        event.preventDefault();
        const type = event.target.name;
        const value = event.target.value.value;
        const styles = event.target.styles.value;

        let newBlock;
        (type === "text") ? newBlock = new TextBlock(value, styles) : new TitleBlock(value,  styles);
        this.update(newBlock);
        event.target.value.value = "";
        event.target.styles.value = "";
    }
}

new Sidebar("#panel", newBlock => {
    model.push(newBlock);
    site.render(model);
})