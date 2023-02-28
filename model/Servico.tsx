
export class Servico {
    public id : string;
    public nomecat: string;
    public descricao : string;
    public valor: number;
    public tempo: string;
    public pro: string;
    public urlfoto : string;
        

    constructor(obj?: Partial<Servico>) {
        if (obj) {
            this.id = obj.id
            this.nomecat = obj.nomecat
            this.descricao = obj.descricao
            this.valor = obj.valor
            this.tempo = obj.tempo
            this.pro = obj.pro
            this.urlfoto = obj.urlfoto
        }
    }

    toString() {
        const Objeto = `{
            "id": "${this.id}",
            "nomecat": "${this.nomecat}",
            "descricao": "${this.descricao}",
            "valor": "${this.valor},
            "tempo": "${this.tempo},
            "pro": "${this.pro},
            "urlfoto": "${this.urlfoto}"
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