
export class Endereco {
    public id : string;
    public cep: string;
    public rua: string;
    public bairro: string;
    public cidade : string;
    public uf: string;
    public numero: string;
    public complemento: string;
    public lat: string;
    public long: string;
        

    constructor(obj?: Partial<Endereco>) {
        if (obj) {
            this.id = obj.id
            this.cep = obj.cep
            this.rua = obj.rua
            this.bairro = obj.bairro
            this.cidade = obj.cidade
            this.uf = obj.uf
            this.numero = obj.numero
            this.complemento = obj.complemento
            this.lat = obj.lat
            this.long = obj.long
          
        }
    }

    toString() {
        const Objeto = `{
            "id": "${this.id}",
            "cep": "${this.cep}",
            "rua": "${this.rua}",
            "bairro": "${this.bairro}",
            "cidade": "${this.cidade}"
            "uf": "${this.uf}"
            "numero": "${this.numero}"
            "complemento": "${this.complemento}"
            "lat": "${this.lat}"
            "long": "${this.long}"
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