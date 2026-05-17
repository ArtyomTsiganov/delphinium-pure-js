export function headerTemplate() {
    const header = 
    `
    <link rel="stylesheet" href="source/components/header/header.css">
    <div class="header-containter">
        <div class="header-group left">
            <a href="catalog.html" class="header-item">Каталог</a>
            <a href="blog.html" class="header-item">Статьи</a>
        </div>
        <img src="assets/logo.png" alt="logo">
        <div class="header-group right">
            <div class="header-item"> icon </div>
        </div>
    </div>
    `

    return header;
}

