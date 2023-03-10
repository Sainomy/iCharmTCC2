
export class Agendamento {
    public id : string;
    public hora: string;
    public data: string;
    public servico: string;
    public pro: string;
    public cli: string;
    public title: string;
    public time: string;
    public description: string;
    public nomecli: string;
        

    constructor(obj?: Partial<Agendamento>) {
        if (obj) {
            this.id = obj.id
            this.hora = obj.hora
            this.data = obj.data
            this.servico = obj.servico
            this.pro = obj.pro
            this.cli = obj.cli
            this.title = obj.title
            this.description = obj.description
            this.time = obj.time
            this.nomecli = obj.nomecli
        }
    }

    toString() {
        const Objeto = `{
            "id": "${this.id}",
            "hora": "${this.hora}"
            "data": "${this.data}"
            "servico": "${this.data}"
            "pro": "${this.pro}"
            "cli": "${this.cli}"
            "title": "${this.title}"
            "time": "${this.time}"
            "description": "${this.description}"
            "nomecli": "${this.nomecli}"
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