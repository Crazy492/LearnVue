let RE = new RegExp(/\{\{\s*\w+\s*\}\}/g);
let flag = false;
class Vue {
    constructor({ el, data }) {
        this._vDom = new Map();
        this.$el = document.querySelector(el);
        this._data = data;
        this.$aInput = Array.from(this.$el.querySelectorAll('input[v-model]'));
        this.init(); //初始化
    }
    ;
    render() {
        this.$aInput.forEach(input => {
            let key = input.getAttribute('v-model');
            input.value = this._data[key];
            if (!flag) {
                input.addEventListener('input', () => {
                    this.$data[key] = input.value;
                });
            }
        });
        flag = true;
        for (let [dom, value] of this._vDom) {
            dom.innerHTML = value.replace(RE, str => {
                let key = str.substring(2, str.length - 2).replace(/\s*/g, '');
                return this._data[key];
            });
        }
    }
    ;
    init() {
        const _this = this;
        Array.from(this.$el.children).forEach(dom => {
            if (dom.innerHTML.match(RE)) {
                this._vDom.set(dom, dom.innerHTML);
            }
        });
        //proxy代理
        this.$data = new Proxy(this._data, {
            set(obj, key, value) {
                obj[key] = value;
                _this.render();
                return true;
            }
        });
        this.render();
    }
    ;
}
//# sourceMappingURL=vue.js.map