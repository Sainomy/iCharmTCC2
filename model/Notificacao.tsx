
export class Notificacao {
    public id : string;
    public title: string;
        

    constructor(obj?: Partial<Notificacao>) {
        if (obj) {
            this.id = obj.id
            this.title = obj.title
        }
    }

    toString() {
        const Objeto = `{
            "id": "${this.id}",
            "title": "${this.title}"
        }`

        //const fields = Object.values(this).join(', ')
        // const campos = Object.keys(this).join(': ')
        // const valor=Object.values(this).join(', ')
        // return `Usuario {${campos+valor}}`
        
        //let userStr = '{"name":"Sammy","email":"sammy@example.com","plan":"Pro"}';
        // let userObj = JSON.parse(Objeto);
        // console.log(userObj);

        return Objeto
    }

};