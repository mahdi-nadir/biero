import { getFromAsync } from './Async.js';

export default class Router {
    constructor() {
        //console.log('Router');
        this._elBiero = document.querySelector('[data-js-biero]');
        this._webservice = 'http://127.0.0.1:8000/webservice/php/biere';

        page.base('/biero-js-vanille');


        // page('/', this.#getBieres /*this.getTemplate*/); // # c'est importer comme privé


        page('/', this.#getMeilleuresBieres, this.getTemplate, this.showTemplate);
        page('/liste', this.#getBieres, this.getTemplate, this.showTemplate);
        page('biere/:id', this.#getBiere, this.getNote, this.getCommentaire, this.getTemplate, this.showTemplate);
        //page('/biere/:id', this.#getBiere, this.getNote, this.getTemplate, this.showTemplate);
        page('/*', this.getTemplate, this.showTemplate);

        page({ window: window }) // page comprend que this c'est routeur, alors qu'on doit faire window
    }

    #getMeilleuresBieres = (ctx, next) => {
        fetch(this._webservice)
            .then((res) => {
                return res.json();
            })
            .then((donnees) => {

                let bieres = donnees.data
                // console.log(donnees.data);
                let meilleuresBieres = [];

                for (let i = 0; i < 5; i++) {
                    if (!bieres[i].image) {
                        bieres[i].image = 'assets/images/no-image.jpeg';
                    }
                    meilleuresBieres.push(bieres[i]);
                }

                ctx.data = meilleuresBieres;
                ctx.template = 'biere';
                next();
            })
    }

    #getBieres = (ctx, next) => {

        fetch(this._webservice)
            .then((res) => {
                return res.json();
            })
            // getFromAsync(this._webservice)
            .then((donnees) => {

                let bieres = donnees.data;
                // console.log(bieres);

                for (let i = 0; i < bieres.length; i++) {
                    bieres[i].note_moyenne = parseFloat(bieres[i].note_moyenne).toFixed(1);
                    if (!bieres[i].image) {
                        bieres[i].image = 'assets/images/no-image.jpeg';
                    }
                }

                ctx.data = bieres;
                // console.log(ctx.data);
                ctx.data.grid = '4';
                ctx.template = 'liste';

                next();

            })
    }

    #getBiere = (ctx, next) => {
        let id = ctx.params.id;
        fetch(`${this._webservice}/${id}`)
            .then((res) => {
                return res.json();
            })
            .then((donnees) => {

                if (donnees.data) {
                    let uneBiere = donnees.data;
                    ctx.data = uneBiere;
                    if (!uneBiere.image) {
                        ctx.data.image = 'assets/images/no-image.jpeg'; // om met ctx.data pour s'assurer que le contexte possede vraiment une image
                    }
                    ctx.template = 'biere';
                } else {
                    ctx.data = {};
                    ctx.template = '404';
                }

                //console.log(ctx.data)

                next();
            })
    }

    getNote = (ctx, next) => {
        let id = ctx.params.id;
        fetch(`${this._webservice}/${id}/note`)
            .then((res) => {
                return res.json();
            })
            .then((donnees) => {

                //console.log(donnees.data);
                ctx.data.note = donnees.data.note;
                ctx.data.nombre = donnees.data.nombre;
                // console.log(ctx.data.nombre);

                next();
            })
    }

    getCommentaire = (ctx, next) => {
        let id = ctx.params.id;
        fetch(`${this._webservice}/${id}/commentaire`)
            .then((res) => {
                return res.json();
            })
            .then((donnees) => {

                //console.log(donnees.data);
                ctx.data.commentaire = donnees.data.commentaire;
                // console.log(ctx.data.nombre);

                next();
            })
    }

    getTemplate = (ctx, next) => {
        fetch(`vues/${ctx.template}.html`)
            .then((res) => {
                return res.text();
            })
            .then((template) => {
                ctx.data.template = template;
                next();  // pour appeler la prochaine fonction mis dans la ligne 10
            })
    }

    showTemplate = (ctx) => {
        let rendered = Mustache.render(ctx.data.template, { data: ctx.data });
        this._elBiero.innerHTML = rendered;
    }
}