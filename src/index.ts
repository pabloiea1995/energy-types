export class CurvaCarga {
    constructor(listaDias: any[], nombrePropiedadValores: string, ignore0: boolean, identificador: string) {
        this.dias = listaDias
        this.nombrePropiedadValores = nombrePropiedadValores
        this.ignore0 = ignore0 || true
        this.identificador = identificador
    }

    dias: any[]
    nombrePropiedadValores: string;
    ignore0: boolean;
    identificador: string

    convertoToSerie() {

        let x = [];
        let xMediaDiaria = [];
        let y = [];
        let yMediaDiaria = [];
        let nombrePropiedadValores = this.nombrePropiedadValores

        for (let dia in this.dias) {

            let mediaDiaria;
            let acumuladoDiario = 0

            const currentDia = this.dias[dia]

            let fecha = new Date(currentDia.fecha)

            for (let i = 1; i < 26; i++) {
                //flag para ignorar los valor 0
                if (this.ignore0) {

                    if (currentDia[nombrePropiedadValores][i.toString()] !== 0) {
                        y.push(currentDia[nombrePropiedadValores][i])
                        x.push(`H${i} ${currentDia.fecha}`)
                        acumuladoDiario += currentDia[nombrePropiedadValores][i]
                    }
                }
                else {
                    //si no se ignoran los 0, solo se ignora el 0 en la hora 25
                    if (currentDia[nombrePropiedadValores][i.toString()] === 0 || i === 25) {

                    }
                    else {
                        y.push(currentDia[nombrePropiedadValores][i])
                        x.push(`H${i} ${currentDia.fecha}`)
                        acumuladoDiario += currentDia[nombrePropiedadValores][i]
                    }

                }

            }


            mediaDiaria = acumuladoDiario / 24
            xMediaDiaria.push(`${fecha.getDate() < 10 ? "0" + fecha.getDate() : fecha.getDate()}/${fecha.getMonth() + 1 < 10 ? "0" + (fecha.getMonth() + 1) : fecha.getMonth() + 1}`)
            yMediaDiaria.push(mediaDiaria)


        }



        return { x, y, name: this.identificador, xMediaDiaria, yMediaDiaria };


    }


}