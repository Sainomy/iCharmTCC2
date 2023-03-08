
export class Horarios {
    public id : string;
    public editado: string;
        

    constructor(obj?: Partial<Foto>) {
        if (obj) {
            this.id = obj.id
            this.editado = obj.editado
        }
    }

    toString() {
        const Objeto = `{
            "id": "${this.id}",
            "editado": "${this.editado}"
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