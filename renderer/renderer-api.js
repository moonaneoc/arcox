function render(source) {
    this.html = this.md.render(source);
    this.el.innerHTML = this.html;
}

function getHtml() {
    return this.html;
}
module.exports = {
    render,
    getHtml
}